import mongoose from "mongoose";
import Quotation from "../models/Quotation.js";
import { generateQuotationId } from "../utils/generateQuotationId.js";

// ==============================
// 🔥 HELPER: CALCULATE TOTALS
// ==============================
const calculatePricing = (data) => {
  let subtotal = 0;

  // 1. Calculate Row Totals & Subtotal
  if (data.rateTable && data.rateTable.length > 0) {
    data.rateTable = data.rateTable.map((row) => {
      const labour = Number(row.labour || 0);
      const material = Number(row.material || 0);
      const total = labour + material;

      subtotal += total;

      return {
        ...row,
        labour,
        material,
        total,
      };
    });
  }

  // 2. Calculate Discount & Grand Total
  const discountPercent = Number(data.pricing?.discount || 0);
  const discountAmount = (subtotal * discountPercent) / 100;

  data.pricing = {
    ...data.pricing,
    subtotal,
    grandTotal: Math.max(subtotal - discountAmount, 0),
  };

  return data;
};

// ==============================
// ➕ CREATE QUOTATION
// ==============================
export const createQuotation = async (req, res) => {
  try {
    let data = req.body;

    // Ensure projectDetails exists
    if (!data.projectDetails) data.projectDetails = {};

    // 🔥 Generate Reference Number (e.g., QTN-2026-001)
    if (!data.projectDetails.referenceNo) {
      data.projectDetails.referenceNo = generateQuotationId();
    }

    // 🔥 Calculate accurate totals before saving
    data = calculatePricing(data);

    // Default status to Draft if not provided
    data.status = data.status || "Draft";

    const quotation = await Quotation.create(data);

    return res.status(201).json({
      success: true,
      message: "Quotation created successfully",
      // CRITICAL: We return the entire quotation object so frontend gets the _id
      data: quotation,
      _id: quotation._id // explicitly sending _id for easier frontend access
    });

  } catch (error) {
    console.error("CREATE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create quotation",
      error: error.message,
    });
  }
};

// ==============================
// 📄 GET ALL QUOTATIONS (Mapped for Table)
// ==============================
export const getAllQuotations = async (req, res) => {
  try {
    // Pagination & Search query from request
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 50;
    const search = req.query.search || "";

    let query = {};

    // 🔥 Search Logic (Case-insensitive Regex)
    if (search) {
      query = {
        $or: [
          { "projectDetails.clientName": { $regex: search, $options: "i" } },
          { "projectDetails.projectName": { $regex: search, $options: "i" } },
          { "projectDetails.referenceNo": { $regex: search, $options: "i" } },
        ],
      };
    }

    // 🔥 Fixed Query Execution Chain
    const quotations = await Quotation.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Map data so frontend table reads it easily
    const formattedQuotations = quotations.map((q) => ({
      _id: q._id, // Raw Mongo ID
      id: q.projectDetails?.referenceNo || q._id.toString().substring(0, 8), // Clean ID for display
      client: q.projectDetails?.clientName || "Unknown Client",
      project: q.projectDetails?.projectName || "Unnamed Project",
      date: q.projectDetails?.date 
        ? new Date(q.projectDetails.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) 
        : new Date(q.createdAt).toLocaleDateString('en-GB'),
      value: q.pricing?.grandTotal || 0,
      status: q.status || "Draft",
      raw: q // Keeping raw data just in case frontend needs nested fields
    }));

    // Send formatted array directly (as expected by standard table components)
    return res.status(200).json(formattedQuotations);

  } catch (error) {
    console.error("GET ALL ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch quotations",
      error: error.message,
    });
  }
};

// ==============================
// 🔍 GET SINGLE QUOTATION (For Preview/Edit)
// ==============================
export const getQuotationById = async (req, res) => {
  try {
    const { id } = req.params;

    const quotation = await Quotation.findById(id);

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found",
      });
    }

    // Return the full raw document for the Preview screen
    return res.status(200).json(quotation);

  } catch (error) {
    console.error("GET ONE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching quotation",
      error: error.message,
    });
  }
};

// ==============================
// ✏️ UPDATE QUOTATION
// ==============================
export const updateQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    let data = req.body;

    // 🔥 Recalculate totals in case rates/discounts were changed
    data = calculatePricing(data);

    const updated = await Quotation.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Quotation updated successfully",
      data: updated
    });

  } catch (error) {
    console.error("UPDATE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Update failed",
      error: error.message,
    });
  }
};

// ==============================
// ❌ DELETE QUOTATION
// ==============================
export const deleteQuotation = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Quotation.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Quotation deleted successfully",
    });

  } catch (error) {
    console.error("DELETE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Delete failed",
      error: error.message,
    });
  }
};

// ==============================
// 📊 DASHBOARD STATS
// ==============================
export const getDashboardStats = async (req, res) => {
  try {
    const total = await Quotation.countDocuments();

    // Sum all grandTotals
    const totalValueAgg = await Quotation.aggregate([
      {
        $group: {
          _id: null,
          value: { $sum: "$pricing.grandTotal" },
        },
      },
    ]);

    const value = totalValueAgg[0]?.value || 0;

    // Find the most recent quotation date
    const lastQuotation = await Quotation.findOne().sort({ createdAt: -1 });
    
    // Format "Today, 10:30 AM" or raw date
    const lastCreated = lastQuotation
      ? new Date(lastQuotation.createdAt).toLocaleString('en-IN', { 
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
        })
      : "None";

    return res.status(200).json({
      total,
      value,
      lastCreated
    });

  } catch (error) {
    console.error("STATS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
      error: error.message,
    });
  }
};