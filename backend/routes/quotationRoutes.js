import express from "express";
import {
  createQuotation,
  getAllQuotations,
  getQuotationById,
  updateQuotation,
  deleteQuotation,
  getDashboardStats,
} from "../controllers/quotationController.js";

const router = express.Router();

// ==============================
// 🔥 MIDDLEWARE: VALIDATE OBJECT ID
// ==============================
// Prevents app crash if someone passes an invalid MongoDB ID in the URL
const validateObjectId = (req, res, next, id) => {
  const isValid = /^[0-9a-fA-F]{24}$/.test(id);

  if (!isValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid quotation ID format",
    });
  }

  next();
};

// Bind the validation middleware to the "id" parameter
router.param("id", validateObjectId);

// ==============================
// 📊 DASHBOARD ROUTE
// ==============================
// ⚠️ IMPORTANT: Must be placed before "/:id" routes so "stats" isn't treated as an ID
router.get("/stats", getDashboardStats);

// ==============================
// ➕ CREATE QUOTATION
// ==============================
router.post("/", createQuotation);

// ==============================
// 📄 GET ALL QUOTATIONS
// ==============================
// Supports query params handled in controller: ?skip=0&limit=50&search=clientName
router.get("/", getAllQuotations);

// ==============================
// 🔍 GET SINGLE QUOTATION
// ==============================
router.get("/:id", getQuotationById);

// ==============================
// ✏️ UPDATE QUOTATION
// ==============================
router.put("/:id", updateQuotation);

// ==============================
// ❌ DELETE QUOTATION
// ==============================
router.delete("/:id", deleteQuotation);

// ==============================
// 🚫 FALLBACK (OPTIONAL DEBUG)
// ==============================
router.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Invalid quotation route",
  });
});

export default router;