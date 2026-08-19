import { Schema, model, Document, Types } from "mongoose";

export interface IRsvp extends Document {
  eventId: Types.ObjectId;
  name: string;
  email: string;
  guests: number;
  submittedAt: Date;
}

const rsvpSchema = new Schema<IRsvp>({
  eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  guests: { type: Number, required: true, min: 0, max: 20 },
  submittedAt: { type: Date, default: Date.now },
});

export const Rsvp = model<IRsvp>("Rsvp", rsvpSchema);
