// ==============================
// 🔐 PRE-LOAD ENV (ES MODULE FIX)
// ==============================
import "dotenv/config"; // This MUST be the very first line!

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// ==============================
// ⚙️ CONFIG
// ==============================
import connectDB from "./config/db.js";
import { verifyMailConnection } from "./config/mail.js";

// ==============================
// 🛣️ ROUTES
// ==============================
import authRoutes from "./routes/authRoutes.js";
import quotationRoutes from "./routes/quotationRoutes.js";
import exportRoutes from "./routes/exportRoutes.js";

// ==============================
// 🛡️ MIDDLEWARE
// ==============================
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// 🔍 DEBUG ENV VARIABLES
console.log("---------------------------------");
console.log("📧 EMAIL_USER:", process.env.EMAIL_USER || "Missing ❌");
console.log("📧 EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded ✅" : "Missing ❌");
console.log("🔑 JWT_SECRET:", process.env.JWT_SECRET ? "Loaded ✅" : "Missing ❌");
console.log("---------------------------------");

// ==============================
// 🚀 INIT APP
// ==============================
const app = express();

// ==============================
// 🔒 SECURITY
// ==============================
app.use(helmet());
app.disable("x-powered-by");

// ==============================
// 🌐 CORS CONFIG
// ==============================
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn("⚠️ CORS BLOCKED:", origin);
      return callback(new Error("CORS blocked ❌"), false);
    },
    credentials: true,
  })
);

// ==============================
// 🧠 BODY PARSER
// ==============================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ==============================
// 📜 LOGGER
// ==============================
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ==============================
// ❤️ HEALTH CHECK
// ==============================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "QuoteGen API is running 🚀",
    env: process.env.NODE_ENV || "development",
    time: new Date().toISOString(),
  });
});

// ==============================
// 🚀 MAIN API ROUTES
// ==============================
app.use("/api/auth", authRoutes);
app.use("/api/quotations", quotationRoutes);
app.use("/api/export", exportRoutes);

// ==============================
// ❌ NOT FOUND HANDLER
// ==============================
app.use(notFound);

// ==============================
// 🔥 GLOBAL ERROR HANDLER
// ==============================
app.use(errorHandler);

// ==============================
// 🚀 START SERVER & SERVICES
// ==============================
const PORT = process.env.PORT || 5000;
let server;

const startServer = async () => {
  try {
    // 1️⃣ Connect to MongoDB
    await connectDB();
    console.log("✅ MongoDB Connected successfully");

    // 2️⃣ Verify Mail Transporter
    if (typeof verifyMailConnection === 'function') {
      await verifyMailConnection();
    }

    // 3️⃣ Start Express Server
    server = app.listen(PORT, () => {
      console.log(`
=================================
🚀 Server running securely
🌐 http://localhost:${PORT}
📦 ENV: ${process.env.NODE_ENV || 'development'}
=================================
      `);
    });
  } catch (error) {
    console.error("❌ Startup Error:", error.message);
    process.exit(1);
  }
};

startServer();

// ==============================
// 🛑 GRACEFUL SHUTDOWN
// ==============================
const shutdown = (signal) => {
  console.log(`\n🛑 ${signal} received... Shutting down gracefully.`);

  if (server) {
    server.close(() => {
      console.log("💤 HTTP server closed.");
      // If you want to close DB connection here, you can do mongoose.connection.close()
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

// Listen for termination signals (Ctrl+C, Docker stop, etc.)
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));