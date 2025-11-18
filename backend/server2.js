// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const GameSession = require("./models/GameSession");

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---

// 1. Enable CORS for all routes and all origins
// This will automatically handle simple GET/POST requests
app.use(cors());

// 2. Explicitly handle preflight 'OPTIONS' requests
// This is crucial for complex requests (like POST with JSON)
app.options("/api/sessions", cors());

// 3. Body parser
app.use(express.json());

// 4. Logger middleware - to see ALL incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// --- Database Connection ---
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.error("MongoDB connection error:", err));

// --- API Routes ---
app.post("/api/sessions", async (req, res) => {
  console.log("--- /api/sessions POST route hit ---");
  console.log("Request Body:", req.body); // Log the incoming data

  try {
    const { playerId, events } = req.body;

    if (!playerId || !events || events.length === 0) {
      console.log("Validation Error: Missing playerId or events.");
      return res.status(400).json({ msg: "Missing playerId or events data." });
    }

    const startGameEvent = events.find((e) => e.eventType === "game_start");
    const gameOverEvent = events.find((e) => e.eventType === "game_over");

    if (!startGameEvent || !gameOverEvent) {
      console.log(
        "Validation Error: Incomplete session data (no start or gameover event)."
      );
      return res.status(400).json({ msg: "Incomplete session data." });
    }

    const newSession = new GameSession({
      playerId: playerId,
      startTime: startGameEvent.timestamp,
      endTime: gameOverEvent.timestamp,
      finalScore: gameOverEvent.finalScore || 0,
      totalMistakes: gameOverEvent.totalMistakes || 0,
      events: events,
    });

    const savedSession = await newSession.save();

    console.log("SUCCESS: Session saved:", savedSession._id);
    res.status(201).json(savedSession);
  } catch (err) {
    console.error("SERVER ERROR: Error saving session:", err.message);
    res.status(500).send("Server Error");
  }
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
