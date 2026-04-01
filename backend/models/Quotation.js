import mongoose from "mongoose";

// ==============================
// 🔹 RATE ITEM SCHEMA
// ==============================
const rateItemSchema = new mongoose.Schema(
  {
    work: {
      type: String,
      // 🔥 FIXED: Removed required: true because frontend creates new rows with "" (empty string)
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

      clientName: {
        type: String,
        required: true,
        trim: true,
      },

      projectName: { type: String, trim: true },

      referenceNo: {
        type: String,
        trim: true,
        default: null,
      },

      date: {
        type: Date,
        default: Date.now,
      },

      paintBrand: {
        type: String,
        enum: ["Nippon Paint", "Asian Paints", "Berger Paints", "Dulux"],
        default: "Nippon Paint",
      },
    },

    // 📐 AREA DETAILS
    areaDetails: {
      // 🔥 FIXED: Changed to String. If React sends "", Number type will throw a CastError.
      interiorArea: { type: String, default: "" },
      exteriorArea: { type: String, default: "" },
    },

    // 📝 COVER LETTER
    coverLetter: {
      subject: { type: String, trim: true },
      body: { type: String, trim: true },
    },

    // 📊 RATE TABLE
    rateTable: {
      type: [rateItemSchema],
      default: [],
    },

    // 💰 PRICING
    pricing: {
      subtotal: { type: Number, default: 0, min: 0 },

      // 🔥 IMPORTANT: discount is % (matches frontend)
      discount: { type: Number, default: 0, min: 0, max: 100 },

      grandTotal: { type: Number, default: 0, min: 0 },

      warranty: { type: Number, default: 0 },
    },

    // 📅 TIMELINE
    timeline: {
      startDate: String,
      endDate: String,
    },

    // 📄 TEXT AREAS
    textAreas: {
      scopeOfWork: String,
      exclusions: String,
      termsConditions: String,
    },

    // 💳 PAYMENT TERMS
    paymentTerms: {
      step1: String,
      step2: String,
      step3: String,
    },

    // ⏳ VALIDITY
    validity: {
      type: String,
      default: "30 Days from the date of issue",
    },

    // 🏦 BANK DETAILS
    bankDetails: {
      bankName: String,
      accountHolder: String,
      accountNumber: String,
      ifscCode: String,
      branch: String,
    },

    // ✍️ SIGNATURE
    signature: {
      name: String,
      designation: String,
      phone: String,
      email: String,
    },

    // 🔥 STATUS
    status: {
      type: String,
      enum: ["Draft", "Sent", "Approved", "Rejected"],
      default: "Draft",
    },
  },
  {
    timestamps: true,
  }
);

// ==============================
// 🔥 AUTO CALCULATIONS
// ==============================
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
// 🔹 BEFORE UPDATE (FIXED)
// ==============================
quotationSchema.pre("findOneAndUpdate", function (next) {
  let update = this.getUpdate();

  if (!update) return next();

  // 🔥 FIXED: Properly target the $set object so we don't mix MongoDB operators
  let target = update.$set ? update.$set : update;

  if (!target.rateTable) return next();

  let subtotal = 0;

  const updatedRateTable = target.rateTable.map((item) => {
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

  const discountPercent = Number(target.pricing?.discount || 0);
  const discountAmount = (subtotal * discountPercent) / 100;

  target.rateTable = updatedRateTable;
  target.pricing = {
    ...target.pricing,
    subtotal,
    grandTotal: Math.max(subtotal - discountAmount, 0),
  };

  // Set the clean update object back
  if (update.$set) {
    this.setUpdate({ $set: target });
  } else {
    this.setUpdate(target);
  }

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