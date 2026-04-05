import Quotation from "../models/Quotation.js";
import { generateQuotationPDF } from "../services/pdfService.js";
import { sendQuotationPDFEmail } from "../config/mail.js";
import { Writable } from "stream";

/**
 * Valid template slugs (keep in sync with pdfService.js + TemplateSelector.jsx)
 */
const VALID_TEMPLATES = new Set([
  "classic", "modern", "corporate", "compact", "creative", "grouped",
  "obsidian", "sovereign", "aurora",
]);

const resolveTemplate = (raw) =>
  raw && VALID_TEMPLATES.has(raw.toLowerCase()) ? raw.toLowerCase() : "classic";

/**
 * =======================================
 * 📄 VIEW & DOWNLOAD PDF (Frontend Stream)
 * GET /api/export/pdf/:id?template=obsidian
 * =======================================
 */
export const downloadPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const template = resolveTemplate(req.query.template);
    const userId = req.user._id || req.user.id;

    // 1. Fetch quotation (scoped to the authenticated user)
    const quotation = await Quotation.findOne({ _id: id, user: userId });

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found or you don't have permission to view it ❌",
      });
    }

    // 2. Build a descriptive filename
    const safeName = (quotation.projectDetails?.clientName || "Document")
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_\-]/g, "");

    const fileName = `Quotation_${safeName}.pdf`;

    // 3. Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");

    // 4. Stream PDF directly to the browser
    await generateQuotationPDF(quotation, res, template);
  } catch (error) {
    console.error("🔥 Download PDF Error:", error.message);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Failed to generate PDF ❌",
        error: error.message,
      });
    }
  }
};

/**
 * =======================================
 * 📧 SEND QUOTATION VIA EMAIL (AS ATTACHMENT)
 * POST /api/export/email
 * Body: { quotationId, email, template }
 * =======================================
 */
export const sendEmail = async (req, res) => {
  try {
    const { quotationId, email, template: rawTemplate } = req.body;
    const template = resolveTemplate(rawTemplate);
    const userId = req.user._id || req.user.id;

    // 1. Validate inputs
    if (!quotationId || !email) {
      return res.status(400).json({
        success: false,
        message: "Both Quotation ID and Email address are required ❌",
      });
    }

    // 2. Fetch quotation securely
    const quotation = await Quotation.findOne({ _id: quotationId, user: userId });

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found or unauthorized ❌",
      });
    }

    // 3. Generate PDF into a memory buffer (not streamed to HTTP)
    const chunks = [];
    const bufferStream = new Writable({
      write(chunk, _encoding, next) {
        chunks.push(chunk);
        next();
      },
    });

    const pdfBuffer = await new Promise((resolve, reject) => {
      bufferStream.on("finish", () => resolve(Buffer.concat(chunks)));
      bufferStream.on("error", reject);
      generateQuotationPDF(quotation, bufferStream, template).catch(reject);
    });

    // 4. Extract display names for the email body
    const clientName  = quotation.projectDetails?.clientName  || "Valued Client";
    const companyName = quotation.projectDetails?.companyName || "Our Company";

    // 5. Send via the advanced mail service
    await sendQuotationPDFEmail(email, clientName, pdfBuffer, companyName);

    // 6. Success response
    return res.status(200).json({
      success: true,
      message: `✅ Quotation successfully sent to ${email}`,
    });
  } catch (error) {
    console.error("🔥 Send Email Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to send email. Please check server configuration.",
      error: error.message,
    });
  }
};