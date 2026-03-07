import mongoose from "mongoose";

const GameEventSchema = new mongoose.Schema(
  {
    sessionId: { type: mongoose.Types.ObjectId, required: true, index: true },
    type: { type: String, required: true, index: true },
    ts: { type: Number, required: true, index: true },
    payload: { type: Object, required: true },
  },
  { timestamps: true }
);

GameEventSchema.index({ sessionId: 1, ts: 1 });

export const GameEvent = mongoose.model("GameEvent", GameEventSchema);
