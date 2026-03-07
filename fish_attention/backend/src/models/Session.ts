import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
  {
    participantId: { type: String, required: true },
    timezone: { type: String, default: "WITA" },
    game: { name: String, version: String },
    startedAt: { type: Date, default: () => new Date() },
    endedAt: { type: Date },
  },
  { timestamps: true }
);

export const Session = mongoose.model("Session", SessionSchema);
