# Messaging Architecture

Real-time 1:1 messaging between Parent↔Teacher, Parent↔Admin, and Admin↔Teacher, backed by Postgres (persistence, history, search) and Socket.io (live delivery, typing, presence).

## Server setup
`backend/src/socket/index.ts`'s `initSocket(server)` attaches a Socket.io server directly to the same Node HTTP server the Express app listens on (see `backend/src/server.ts`) — one process, one port, no separate WS service.

- **Handshake auth**: `io.use(...)` middleware extracts the access token (either `socket.handshake.auth.token` or the `kaylan_session`-equivalent access-token cookie), verifies it with the same `verifyAccessToken` used by REST `requireAuth`, and rejects the connection outright if missing/invalid — so an unauthenticated socket can never fully connect.
- **Presence**: an in-memory `Map<userId, Set<socketId>>` tracks online users (per-process). Connecting emits `user_online` broadcast when the user's first socket connects; disconnecting the last socket emits the offline equivalent. Documented future scaling path: move this map to Redis if the backend ever runs multiple Node processes.
- **Rooms**: every user auto-joins `user:{userId}` (for direct notification delivery) on connect. Conversation-specific events use `conversation:{conversationId}` rooms, joined explicitly via `join_conversation`.

## Event map
| Event | Direction | Payload | Purpose |
|---|---|---|---|
| `join_conversation` | client→server | `conversationId` | Join a conversation room (server verifies the caller is actually a `ConversationParticipant` first — silently ignored otherwise). |
| `leave_conversation` | client→server | `conversationId` | Leave the room. |
| `typing_start` / `typing_stop` | client→server→room | `conversationId` | Relayed to everyone else in the room with the sender's `userId`. |
| `message_delivered` | client→server→room | `{conversationId, messageId}` | Delivery acknowledgement, relayed to the room. |
| `user_online` / (offline equivalent) | server→broadcast | `{userId}` | Presence changes. |
| new-message push | server→room | full message payload | Emitted by `messageController.sendMessage` after persisting to Postgres, so all room members get the message instantly without polling. |

## REST vs sockets — division of labor
- **REST** (`/api/v1/conversations`, `/api/v1/messages`) handles everything that needs pagination, search, or must survive a page reload: initial conversation list, paginated message history (`GET /conversations/:id/messages`), search, attachment upload, edit/delete/pin/react (all of which also broadcast the resulting change over the socket so other open tabs/devices update live).
- **Sockets** handle everything ephemeral or needing sub-second latency: new-message push, typing indicators, presence, delivery acks.
- A message send is REST-first: `POST /api/v1/messages` persists to Postgres, then the controller emits the new message over the conversation's socket room — REST is the durable write path, sockets are the fan-out/broadcast path.

## Zustand store (`lib/messaging/store.ts`)
Client-side state container for the messaging UI: current conversation list, active conversation's messages, typing/presence state received from socket events, and optimistic-update bookkeeping (e.g. showing a sent message immediately before the server ack). REST calls populate the store on load/pagination; socket event handlers (`lib/socket/client.ts`) push live updates into the same store, so the UI reads from one source of truth regardless of whether data arrived via REST or socket.

## Access rule enforcement
1:1 conversations are restricted to Parent↔Teacher, Parent↔Admin, and Admin↔Teacher pairs (no Parent↔Parent or Teacher↔Teacher messaging). This is enforced in `conversationController.createConversation` at conversation-creation time by checking the two participants' roles; the messaging UI's contact picker also only surfaces eligible counterparts per the current user's role.
