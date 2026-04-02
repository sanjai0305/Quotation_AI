import mongoose from "mongoose";

// ==============================
// 🔹 RATE ITEM SCHEMA
// ==============================
const rateItemSchema = new mongoose.Schema(
  {
    work: {
      type: String,
      trim: true,
      default: "", 
    },
    labour: {
      type: Number,
      default: 0,
      min: 0,
    },
    material: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false }
);

// ==============================
// 🔹 MAIN SCHEMA
// ==============================
const quotationSchema = new mongoose.Schema(
  {
    // 🏢 PROJECT DETAILS
    projectDetails: {
      companyName: { type: String, trim: true, default: "" },
      clientName: { type: String, required: true, trim: true },
      projectName: { type: String, trim: true, default: "" },
      referenceNo: { type: String, trim: true, default: null },
      date: { type: Date, default: Date.now },
      paintBrand: {
        type: String,
        enum: ["Nippon Paint", "Asian Paints", "Berger Paints", "Dulux"],
        default: "Nippon Paint",
      },
    },

    // 📐 AREA DETAILS
    areaDetails: {
      // Changed to String because frontend might send "" which crashes Number types
      interiorArea: { type: String, default: "" },
      exteriorArea: { type: String, default: "" },
    },

    // 📝 COVER LETTER
    coverLetter: {
      subject: { type: String, trim: true, default: "" },
      body: { type: String, trim: true, default: "" },
    },

    // 📊 RATE TABLE
    rateTable: {
      type: [rateItemSchema],
      default: [],
    },

    // 💰 PRICING
    pricing: {
      subtotal: { type: Number, default: 0, min: 0 },
      discount: { type: Number, default: 0, min: 0, max: 100 }, // % discount
      grandTotal: { type: Number, default: 0, min: 0 },
      warranty: { type: String, default: "" }, // Changed to string to support "3" or "3 Years"
    },

    // 📅 TIMELINE
    timeline: {
      startDate: { type: String, default: "" },
      endDate: { type: String, default: "" },
    },

    // 📄 TEXT AREAS
    textAreas: {
      scopeOfWork: { type: String, default: "" },
      exclusions: { type: String, default: "" },
      termsConditions: { type: String, default: "" },
    },

    // 💳 PAYMENT TERMS
    paymentTerms: {
      step1: { type: String, default: "" },
      step2: { type: String, default: "" },
      step3: { type: String, default: "" },
    },

    // 🔢 PAYMENT PERCENTS (🔥 Added to sync with frontend)
    paymentPercents: {
      p1: { type: String, default: "" },
      p2: { type: String, default: "" },
      p3: { type: String, default: "" },
    },

    // ⏳ VALIDITY
    validity: {
      type: String,
      default: "30 Days from the date of issue",
    },

    // 🏦 BANK DETAILS
    bankDetails: {
      bankName: { type: String, default: "" },
      accountHolder: { type: String, default: "" },
      accountNumber: { type: String, default: "" },
      ifscCode: { type: String, default: "" },
      branch: { type: String, default: "" },
    },

    // ✍️ SIGNATURE
    signature: {
      name: { type: String, default: "" },
      designation: { type: String, default: "" },
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
    },

    // 🔥 STATUS (Added "Saved" for dashboard functionality)
    status: {
      type: String,
      enum: ["Draft", "Saved", "Sent", "Approved", "Rejected"],
      default: "Draft",
    },
  },
  {
    timestamps: true,
  }
);

// ==============================
// 🔥 AUTO CALCULATIONS (Safety Net)
// ==============================
// Note: We already calculate this in the controller, but this ensures DB integrity
const calculateTotals = (doc) => {
  if (!doc.rateTable?.length) return;

  let subtotal = 0;

  doc.rateTable = doc.rateTable.map((item) => {
    const labour = Number(item.labour || 0);
    const material = Number(item.material || 0);
    const total = labour + material;

    subtotal += total;

    return {
      ...item,
      labour,
      material,
      total,
    };
  });

  const discountPercent = Number(doc.pricing?.discount || 0);
  const discountAmount = (subtotal * discountPercent) / 100;

  if (!doc.pricing) doc.pricing = {};
  doc.pricing.subtotal = subtotal;
  doc.pricing.grandTotal = Math.max(subtotal - discountAmount, 0);
};

// ==============================
// 🔹 BEFORE SAVE
// ==============================
quotationSchema.pre("save", function (next) {
  calculateTotals(this);
  next();
});

// ==============================
// 🔍 INDEXES
// ==============================

// 🔎 Text search
quotationSchema.index({
  "projectDetails.clientName": "text",
  "projectDetails.projectName": "text",
});

// ⚡ Fast sorting
quotationSchema.index({ createdAt: -1 });

// 🛡 Prevent duplicate null issue
quotationSchema.index(
  { "projectDetails.referenceNo": 1 },
  { sparse: true }
);

// ==============================
// 🚀 EXPORT
// ==============================
const Quotation = mongoose.model("Quotation", quotationSchema);

export default Quotation;