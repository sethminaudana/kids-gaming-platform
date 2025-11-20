const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors()); // Enable CORS
app.use(express.json()); // Body parser

// Logger to see requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// --- Database Connection ---
mongoose
  .connect(process.env.MONGO_URI) // Removed deprecated options (useNewUrlParser/useUnifiedTopology are default in new Mongoose)
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.error("MongoDB connection error:", err));

// --- Mongoose User Schema (Replaces data.json) ---
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // In production, you should hash this!
  age: { type: Number },
  score: { type: Number, default: 0 },
  // Memory Game Specific Stats
  memoryright: { type: Number, default: 0 },
  memorywrong: { type: Number, default: 0 },
  memorytime: { type: Number, default: 0 },
});

const User = mongoose.model("User", userSchema);

// 2. GameSession Schema (For ML Data Storage)
// This stores the raw event logs separate from the user profile
const gameSessionSchema = new mongoose.Schema({
  username: { type: String, required: true }, // Links to the user
  gameType: { type: String, default: "memory_game" },
  playedAt: { type: Date, default: Date.now },
  score: Number,
  duration: Number,
  events: [], // <--- This stores the big array of click events for ML
});

const GameSession = mongoose.model("GameSession", gameSessionSchema);

// --- Global State for "Session" (Matches your old logic) ---
// Note: Ideally use tokens (JWT) for this, but keeping it simple as requested.
let username_logged = "";

// --- Helper Middleware ---
function isAuthenticated(req, res, next) {
  if (username_logged !== "") {
    next();
  } else {
    res.status(401).json({ success: false, message: "Unauthorized: Please login first." });
  }
}

// --- API Routes ---

// 1. Test Route
app.get("/", (req, res) => {
  res.json({ message: "Memory Game Backend Running!" });
});

// 2. Register
app.post("/register", async (req, res) => {
  const { username, password, age } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Username Already Exists" });
    }

    const newUser = new User({ username, password, age });
    await newUser.save();

    res.json({ success: true, message: "User Registered Successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// 3. Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid Username" });
    }
    if (user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid Password" });
    }

    username_logged = username; // Set global session
    res.json({ success: true, message: "Authentication Successful!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// 4. Logout
app.get("/logout", (req, res) => {
    if (username_logged !== '') {
         res.json({success: true,  message: "Still Logged In."})
    } else {
         res.json({ success: false, message: "Logout Successful!" });
    }
});

app.post("/logout", (req, res) => {
  username_logged = "";
  res.json({ success: true, message: "Logout Successful!" });
});

// 5. Get Profile
app.get("/profile", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ username: username_logged });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({
      message: "Why fit in when you were born to stand out!",
      username: user.username,
      age: user.age,
      score: user.score,
      memoryright: user.memoryright,
      memorywrong: user.memorywrong,
      memorytime: user.memorytime,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// 6. Save Memory Game Data (The route your frontend calls)
// We changed the route to /api/memorygame to match the vite config fix
// 6. Save Memory Game Data (Updated for ML)
app.post("/api/memorygame", isAuthenticated, async (req, res) => {
  // Extract events from the request
  const { rightMatches, wrongMatches, timetaken, events } = req.body;

  try {
    // A. Update User Profile (Summary Stats)
    const user = await User.findOneAndUpdate(
      { username: username_logged },
      {
        memoryright: rightMatches,
        memorywrong: wrongMatches,
        memorytime: timetaken,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // B. Save Raw Game Session (Detailed Logs for ML)
    if (events && events.length > 0) {
        const newSession = new GameSession({
            username: username_logged,
            score: rightMatches, // Assuming score is based on matches
            duration: timetaken,
            events: events // <--- The crucial array for your ADHD analysis
        });
        await newSession.save();
        console.log(`Detailed session saved for ${username_logged} with ${events.length} events.`);
    }

    console.log(`User profile updated for ${username_logged}`);
    res.status(200).send({ score: user.score }); 
  } catch (err) {
    console.error("Error saving game data:", err);
    res.status(500).send({ error: "Internal server error" });
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});