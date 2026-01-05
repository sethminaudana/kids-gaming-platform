import { Router } from "express";
import { z } from "zod";
import { Session } from "../models/Session";
import { GazeSample } from "../models/GazeSample";
import { GameEvent } from "../models/GameEvent";
import mongoose from "mongoose";

export const sessionsRouter = Router();

sessionsRouter.post("/", async (req, res) => {
  const schema = z.object({
    participantId: z.string().min(1),
    timezone: z.string().optional(),
    game: z.object({ name: z.string(), version: z.string() }).optional(),
  });

  const body = schema.parse(req.body);
  const session = await Session.create(body);
  return res.json({ sessionId: session._id.toString() });
});

sessionsRouter.post("/:sessionId/ingest", async (req, res) => {
  const { sessionId } = req.params;
  if (!mongoose.isValidObjectId(sessionId)) {
    return res.status(400).json({ error: "Invalid sessionId" });
  }

  const schema = z.object({
    gazeSamples: z.array(z.any()).default([]),
    gameEvents: z.array(z.any()).default([]),
  });

  const body = schema.parse(req.body);

  // Insert gaze in bulk (map to model shape)
  if (body.gazeSamples.length) {
    await GazeSample.insertMany(
      body.gazeSamples.map((g: any) => ({
        sessionId,
        ts: g.ts,
        facePresent: !!g.facePresent,
        gazeX: g.gazeX,
        gazeY: g.gazeY,
        landmarks: Array.isArray(g.landmarks) ? g.landmarks : undefined,
      })),
      { ordered: false }
    );
  }

  if (body.gameEvents.length) {
    await GameEvent.insertMany(
      body.gameEvents.map((e: any) => ({
        sessionId,
        type: e.type,
        ts: e.ts,
        payload: { ...e },
      })),
      { ordered: false }
    );
  }

  return res.json({ ok: true });
});
