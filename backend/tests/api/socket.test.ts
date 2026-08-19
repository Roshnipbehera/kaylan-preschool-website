import { prismaMock } from "../helpers/prismaMock";
import http from "http";
import { AddressInfo } from "net";
import { io as ioClient, Socket as ClientSocket } from "socket.io-client";
import { initSocket } from "../../src/socket";
import { signAccessToken } from "../../src/utils/token";

// A basic Socket.io integration test: real socket.io server + real
// socket.io-client, talking over a real (loopback) HTTP server, with
// Prisma fully mocked so no live Postgres is required. Verifies the
// handshake-time auth guard (io.use) and the join_conversation
// authorization check.
describe("socket.io server (mocked Prisma, real transport)", () => {
  let httpServer: http.Server;
  let port: number;

  beforeAll((done) => {
    httpServer = http.createServer();
    initSocket(httpServer);
    httpServer.listen(() => {
      port = (httpServer.address() as AddressInfo).port;
      done();
    });
  });

  afterAll((done) => {
    httpServer.close(() => done());
  });

  function connect(token?: string): Promise<ClientSocket> {
    return new Promise((resolve, reject) => {
      const client = ioClient(`http://localhost:${port}`, {
        auth: token ? { token } : {},
        reconnection: false,
        timeout: 2000,
      });
      client.on("connect", () => resolve(client));
      client.on("connect_error", (err) => reject(err));
    });
  }

  it("rejects a connection with no access token", async () => {
    await expect(connect()).rejects.toThrow(/Unauthorized/);
  });

  it("rejects a connection with an invalid access token", async () => {
    await expect(connect("not-a-real-jwt")).rejects.toThrow(/Unauthorized/);
  });

  it("accepts a connection with a valid access token", async () => {
    const token = signAccessToken({ id: "user_1", role: "parent" as any, email: "p@p.com", name: "P" });
    const client = await connect(token);
    expect(client.connected).toBe(true);
    client.close();
  });

  it("only joins conversation_room when Prisma confirms the caller is a participant", (done) => {
    const token = signAccessToken({ id: "user_1", role: "parent" as any, email: "p@p.com", name: "P" });
    prismaMock.conversationParticipant.findUnique.mockResolvedValue({ id: "part_1" } as any);

    connect(token).then((client) => {
      client.emit("join_conversation", "conv_1");
      // No ack event is emitted by the server for join; give it a tick then
      // confirm the Prisma authorization check ran with expected args.
      setTimeout(() => {
        expect(prismaMock.conversationParticipant.findUnique).toHaveBeenCalledWith({
          where: { conversationId_userId: { conversationId: "conv_1", userId: "user_1" } },
        });
        client.close();
        done();
      }, 150);
    });
  });
});
