// backend/src/db.ts
import mongoose from "mongoose";

export async function connectDb() {
  const uri = process.env.MONGO_URI;
console.error("MONGO_URI:", uri);
  if (!uri) {
    throw new Error("MONGO_URI is missing. Set it in environment variables.");
  }

  // Debug: Check connection string format
  console.log("🔍 MONGO_URI length:", uri.length);
  console.log("🔍 MONGO_URI starts with:", uri.substring(0, 20));
  if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
    console.error("❌ Invalid connection string format!");
    console.error("❌ First 50 chars:", uri.substring(0, 50));
    throw new Error(`Invalid MONGO_URI format. Must start with "mongodb://" or "mongodb+srv://". Got: ${uri.substring(0, 30)}...`);
  }

  mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB connected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected");
  });

  // Recommended options
  await mongoose.connect(uri, {
    autoIndex: true,          // turn off in prod for large scale if needed
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 20,
  });

  return mongoose.connection;
}

export async function disconnectDb() {
  await mongoose.disconnect();
}
