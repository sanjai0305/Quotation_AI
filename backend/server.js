import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

// ==============================
// 🔐 LOAD ENV (FIXED)
// ==============================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Force load .env from backend folder
dotenv.config({ path: path.join(__dirname, ".env") });

// 🔍 DEBUG (REMOVE LATER)
console.log("📧 EMAIL_USER:", process.env.EMAIL_USER);
console.log(
  "📧 EMAIL_PASS:",
  process.env.EMAIL_PASS ? "Loaded ✅" : "Missing ❌"
);
console.log("🔑 JWT_SECRET:", process.env.JWT_SECRET ? "Loaded ✅" : "Missing ❌");

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
app.use(express.urlencoded({ extended: true }));

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
    message: "API running 🚀",
    env: process.env.NODE_ENV || "development",
    time: new Date().toISOString(),
  });
});

// ==============================
// 🚀 API ROUTES
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
// 🚀 START SERVER
// ==============================
const PORT = process.env.PORT || 5000;
let server;

const startServer = async () => {
  try {
    // 1️⃣ Connect DB
    await connectDB();
    console.log("✅ MongoDB Connected");

    // 2️⃣ Verify Mail
    if (verifyMailConnection) {
      await verifyMailConnection();
      console.log("✅ Mail Server Ready");
    }

    // 3️⃣ Start Server
    server = app.listen(PORT, () => {
      console.log(`
=================================
🚀 Server running
🌐 http://localhost:${PORT}
📦 ENV: ${process.env.NODE_ENV}
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
  console.log(`\n🛑 ${signal} received`);

  if (server) {
    server.close(() => {
      console.log("💤 Server closed");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));