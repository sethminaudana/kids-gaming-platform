const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 5000;
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "my_super_secret_development_key"; // Put this in your .env later!

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
// let username_logged = "TestKid";

// --- Helper Middleware ---
function isAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1]; // Extract the token
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
      }
      req.user = decoded; // Attach the decoded user data (like username) to the request!
      next();
    });
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
app.post("/api/register", async (req, res) => {
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
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid Username" });
    }
    if (user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid Password" });
    }

    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    // username_logged = username; // Set global session
    res.json({ success: true, message: "Authentication Successful!", token: token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// 4. Logout
// With JWT, logout is handled by the frontend deleting the token.
// We keep this route just to send a friendly confirmation back to React.
app.post("/logout", (req, res) => {
  res.json({ success: true, message: "Logged out successfully!" });
});

// 5. Get Profile
app.get("/profile", isAuthenticated, async (req, res) => {
  try {
   const user = await User.findOne({ username: req.user.username });
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
  const { rightMatches, wrongMatches, timetaken, events, level } = req.body;

  try {
    // A. Update User Profile (Summary Stats)
    const user = await User.findOneAndUpdate(
      { username: req.user.username },
      {
        $inc: { 
          memoryright: rightMatches,
          memorywrong: wrongMatches,
          memorytime: timetaken,
          score: rightMatches * 10 // Give them 10 points per right match!
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // B. Save Raw Game Session (Detailed Logs for ML)
    if (events && events.length > 0) {
        const newSession = new GameSession({
            username: req.user.username,
            gameType: `memory_game_level_${level || 'unknown'}`,
            score: rightMatches, // Assuming score is based on matches
            duration: timetaken,
            events: events // <--- The crucial array for your ADHD analysis
        });
        await newSession.save();
        console.log(`Detailed session saved for ${req.user.username} with ${events.length} events.`);
   // --- NEW: TRIGGER PYTHON SCRIPT ---
        
        // spawn('python', ['filename', 'argument'])
        // Note: Use 'python3' instead of 'python' if you are on Mac/Linux
        const pythonProcess = spawn('python', ['../adhd_ml_project/predict.py', req.user.username]);

        let reportData = "";

        // Collect data from script output
        pythonProcess.stdout.on('data', (data) => {
            reportData += data.toString();
        });

        // Handle errors
        pythonProcess.stderr.on('data', (data) => {
            console.error(`Python Error: ${data}`);
        });

        // When script finishes, send response to React
        pythonProcess.on('close', (code) => {
            console.log(`Analysis complete with code ${code}`);
            
            // Send back the score AND the Python report
            res.status(200).send({ 
                score: user.score, 
                report: reportData 
            }); 
        });
      }else {
        // Fallback if no events (shouldn't happen in real game)
        res.status(200).send({ score: user.score, report: "No events to analyze." }); 
    }

    console.log(`User profile updated for ${req.user.username}`);
    // res.status(200).send({ score: user.score }); 
  } catch (err) {
    console.error("Error saving game data:", err);
    res.status(500).send({ error: "Internal server error" });
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});