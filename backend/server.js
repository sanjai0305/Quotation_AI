// ==============================
// 🔐 PRE-LOAD ENV (ES MODULE FIX)
// ==============================
import "dotenv/config"; 

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import fs from "fs"; 
import { fileURLToPath } from "url";

// ==============================
// ⚙️ CONFIG & ROUTES
// ==============================
import connectDB from "./config/db.js";
import { verifyMailConnection } from "./config/mail.js";
import authRoutes from "./routes/authRoutes.js";
import quotationRoutes from "./routes/quotationRoutes.js";
import exportRoutes from "./routes/exportRoutes.js";
import userRoutes from "./routes/userRoutes.js";                 // 👈 NEW
import subscriptionRoutes from "./routes/subscriptionRoutes.js"; // 👈 NEW
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// ==============================
// 🚀 INIT APP & PATHS
// ==============================
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 Auto-create uploads folder so Multer doesn't crash
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Created 'uploads' directory");
}

// ==============================
// 🔒 SECURITY & CORS
// ==============================
app.use(helmet({
  crossOriginResourcePolicy: false, // ✅ Critical: Allows frontend to display uploaded images
}));

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Postman / Local requests testing support
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS blocked ❌"), false);
  },
  credentials: true,
}));

// ==============================
// 🧠 MIDDLEWARES (Updated limits for Logo Base64)
// ==============================
// 🔥 Increased limit to 50mb because Base64 Image strings (Logos) can be very large
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// 📂 SERVE STATIC FILES
// This makes http://localhost:5000/uploads/image.jpg accessible
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ==============================
// 🚀 MAIN API ROUTES
// ==============================
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "QuoteGen API is running 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/quotations", quotationRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/users", userRoutes);               // 👈 NEW: For getting user profile
app.use("/api/subscription", subscriptionRoutes); // 👈 NEW: For handling Pro upgrades

// ==============================
// ❌ ERROR HANDLERS
// ==============================
app.use(notFound);
app.use(errorHandler);

// ==============================
// 🚀 START SERVER
// ==============================
const PORT = process.env.PORT || 5000;
let server;

const startServer = async () => {
  try {
    await connectDB();
    if (typeof verifyMailConnection === 'function') {
      await verifyMailConnection();
    }

    server = app.listen(PORT, () => {
      console.log(`
=================================
🚀 Server: http://localhost:${PORT}
📦 Mode: ${process.env.NODE_ENV || 'development'}
=================================`);
    });
  } catch (error) {
    console.error("❌ Startup Error:", error.message);
    process.exit(1);
  }
};

startServer();

// 🛑 GRACEFUL SHUTDOWN
const shutdown = (signal) => {
  console.log(`\n🛑 ${signal} received. Shutting down...`);
  if (server) {
    server.close(() => process.exit(0));
  } else {
    process.exit(0);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));