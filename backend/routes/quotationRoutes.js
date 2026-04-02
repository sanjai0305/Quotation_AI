import express from "express";
import {
  createQuotation,
  getAllQuotations,
  getQuotationById,
  updateQuotation,
  deleteQuotation,
  getDashboardStats,
} from "../controllers/quotationController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// ==============================
// 🔥 MIDDLEWARE: VALIDATE OBJECT ID
// ==============================
const validateObjectId = (req, res, next, id) => {
  const isValid = /^[0-9a-fA-F]{24}$/.test(id);
  if (!isValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid quotation ID format ❌",
    });
  }
  next();
};

// Bind validation to "id" parameter
router.param("id", validateObjectId);

// ==============================
// 🌐 PUBLIC ROUTE (For Clients)
// ==============================
// 🚨 No 'protect' here! This allows clients to view the quote via link.
router.get("/public/:id", getQuotationById);

// ==============================
// 📊 DASHBOARD ROUTE (Protected)
// ==============================
router.get("/stats", protect, getDashboardStats);

// ==============================
// ➕ CREATE QUOTATION (Protected)
// ==============================
router.post("/", protect, createQuotation);

// ==============================
// 📄 GET ALL QUOTATIONS (Protected)
// ==============================
router.get("/", protect, getAllQuotations);

// ==============================
// 🔍 GET SINGLE QUOTATION (Protected - Internal Use)
// ==============================
router.get("/:id", protect, getQuotationById);

// ==============================
// ✏️ UPDATE QUOTATION (Protected)
// ==============================
router.put("/:id", protect, updateQuotation);

// ==============================
// ❌ DELETE QUOTATION (Protected)
// ==============================
router.delete("/:id", protect, deleteQuotation);

export default router;