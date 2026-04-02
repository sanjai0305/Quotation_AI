import express from "express";
import { downloadPDF, sendEmail } from "../controllers/exportController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * =======================================
 * 📄 VIEW & DOWNLOAD QUOTATION PDF (Protected)
 * GET /api/export/pdf/:id
 * =======================================
 * Intha route-ah namma Dashboard-la "View & Download" click panna use aagum.
 * Frontend sends token in query: window.open(url?token=...)
 */
router.get("/pdf/:id", protect, downloadPDF);

/**
 * =======================================
 * 🌐 PUBLIC VIEW PDF (Optional for Shared Links)
 * GET /api/export/pdf/public/:id
 * =======================================
 * Intha route-ah client shared link click panni preview paarkumbothu 
 * PDF-ah open panna use pannalam (No 'protect' middleware needed here).
 */
router.get("/pdf/public/:id", downloadPDF);

/**
 * =======================================
 * 📧 SEND QUOTATION VIA EMAIL
 * POST /api/export/email
 * =======================================
 * Intha route Axios moolama protected ah email anuppum.
 */
router.post("/email", protect, sendEmail);

export default router;