import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from 'cors';


dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// MongoDB connection
const client = new MongoClient(process.env.MONGO_URI);
let db;
let isConnected = false;

async function connectDB() {
  try {
    await client.connect();
    db = client.db(); // default database from URI
    isConnected = true;
    console.log(" Connected to MongoDB");
    console.log("Database name:", db.databaseName);
    
    // Test the connection by listing collections
    const collections = await db.listCollections().toArray();
    console.log("Available collections:", collections.map(c => c.name));
  } catch (err) {
    console.error(" MongoDB connection error:", err);
    isConnected = false;
  }
}
connectDB();

// Middleware to check DB connection
const checkDBConnection = (req, res, next) => {
  if (!isConnected || !db) {
    return res.status(503).json({ 
      success: false, 
      error: "Database not connected" 
    });
  }
  next();
};

// ====== Endpoints ======

// Insert a single trial
app.post("/api/trials", checkDBConnection, async (req, res) => {
  try {
    const trial = req.body;
    console.log("Received trial data:", JSON.stringify(trial, null, 2));
    
    const result = await db.collection("trial_by_trial_performance").insertOne(trial);
    console.log(" Trial inserted with ID:", result.insertedId);
    
    res.json({ success: true, insertedId: result.insertedId });
  } catch (err) {
    console.error(" Error inserting trial:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Insert session summary
app.post("/api/gameplay_summaries", checkDBConnection, async (req, res) => {
  try {
    const summary = req.body;
    console.log("Received summary data:", JSON.stringify(summary, null, 2));
    
    const result = await db.collection("session_performance").insertOne(summary);
    console.log(" Summary inserted with ID:", result.insertedId);
    
    res.json({ success: true, insertedId: result.insertedId });
  } catch (err) {
    console.error(" Error inserting summary:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    dbConnected: isConnected,
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));