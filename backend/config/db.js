import mongoose from "mongoose";

let isConnected = false;

/**
 * 🚀 Connect to MongoDB
 */
const connectDB = async (retries = 5) => {
  try {
    /* =========================
       🔐 Validate ENV
    ========================== */
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI not found in .env");
    }

    /* =========================
       🚀 Connect (Modern way)
    ========================== */
    const conn = await mongoose.connect(process.env.MONGO_URI);

    isConnected = conn.connections[0].readyState === 1;

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    /* =========================
       📡 CONNECTION EVENTS
    ========================== */
    mongoose.connection.on("connected", () => {
      console.log("📡 Mongoose connected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ Mongoose error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ Mongoose disconnected");
    });

  } catch (error) {
    console.error("❌ DB CONNECTION FAILED:", error.message);

    /* =========================
       🔁 RETRY LOGIC (SAFE)
    ========================== */
    if (retries > 0) {
      console.log(`🔄 Retrying... (${retries} attempts left)`);
      setTimeout(() => connectDB(retries - 1), 5000);
    } else {
      console.error("❌ All retry attempts failed. Exiting...");
      process.exit(1);
    }
  }
};

/* =========================
   🛑 GRACEFUL SHUTDOWN
========================== */
process.on("SIGINT", async () => {
  if (isConnected) {
    await mongoose.connection.close();
    console.log("🔌 MongoDB disconnected (app terminated)");
  }
  process.exit(0);
});

export default connectDB;