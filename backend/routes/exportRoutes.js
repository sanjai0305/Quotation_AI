import express from "express";
import { downloadPDF, sendEmail } from "../controllers/exportController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * =======================================
 * 📄 DOWNLOAD QUOTATION AS PDF
 * GET /api/export/pdf/:id
 * =======================================
 * Note: Frontend uses window.open(url?token=...) for this.
 * The 'protect' middleware handles extracting the token from the query string.
 */
router.get("/pdf/:id", protect, downloadPDF);

/**
 * =======================================
 * 📧 SEND QUOTATION VIA EMAIL
 * POST /api/export/email
 * =======================================
 * Note: Frontend uses Axios POST.
 * The 'protect' middleware extracts the token from the Bearer header.
 */
router.post("/email", protect, sendEmail);

export default router;