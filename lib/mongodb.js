import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please add MONGODB_URI to .env.local");
}

let isConnected = false;

export default async function connectDB() {
  if (isConnected) return;

  const db = await mongoose.connect(MONGODB_URI, {
    dbName: "aitutor",
  });

  isConnected = db.connections[0].readyState;
}
