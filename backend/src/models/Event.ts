import { Schema, model, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    coverImage: { type: String },
  },
  { timestamps: true },
);

export const Event = model<IEvent>("Event", eventSchema);
