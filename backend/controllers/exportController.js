import Quotation from "../models/Quotation.js";
import { generateQuotationPDF } from "../services/pdfService.js";
import { sendQuotationEmail } from "../services/emailService.js";

/**
 * =======================================
 * 📄 VIEW & DOWNLOAD PDF
 * GET /api/export/pdf/:id
 * =======================================
 */
export const downloadPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id; // 🔥 Data Isolation Security

    // 1. Find the quotation in the database (Only if it belongs to the logged-in user)
    const quotation = await Quotation.findOne({ _id: id, user: userId });

    if (!quotation) {
      return res.status(404).json({ 
        success: false, 
        message: "Quotation not found or you don't have permission to view it ❌" 
      });
    }

    // 🔥 SET HEADERS FOR INLINE VIEWING
    // 'inline' னு கொடுத்தா Browser-லயே PDF ஓபன் ஆகும். (Download ஆகணும்னா 'attachment' னு மாத்திக்கலாம்)
    const fileName = quotation.projectDetails?.referenceNo 
      ? `Quotation_${quotation.projectDetails.referenceNo.replace(/\s+/g, '_')}.pdf` 
      : 'Quotation_Draft.pdf';

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);

    // 2. Generate PDF and send directly as response stream
    // Note: generateQuotationPDF handles the res.send() internally
    await generateQuotationPDF(quotation, res);

  } catch (error) {
    console.error("🔥 View PDF Error:", error.message);
    // If headers already sent, don't try to send JSON
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to generate PDF ❌",
        error: error.message 
      });
    }
  }
};

/**
 * =======================================
 * 📧 SEND QUOTATION VIA EMAIL (AS ATTACHMENT)
 * POST /api/export/email
 * =======================================
 */
export const sendEmail = async (req, res) => {
  try {
    const { quotationId, email } = req.body;
    const userId = req.user._id || req.user.id; // 🔥 Data Isolation Security

    // 1. Validate inputs
    if (!quotationId || !email) {
      return res.status(400).json({ 
        success: false, 
        message: "Both Quotation ID and Email address are required ❌" 
      });
    }

    // 2. Fetch the quotation from DB (Only if it belongs to the logged-in user)
    const quotation = await Quotation.findOne({ _id: quotationId, user: userId });

    if (!quotation) {
      return res.status(404).json({ 
        success: false, 
        message: "Quotation not found in database or unauthorized ❌" 
      });
    }

    // 3. Trigger Email Service (Which will generate the PDF buffer and send it)
    await sendQuotationEmail(email, quotation);

    // 4. Send success response to frontend
    return res.status(200).json({
      success: true,
      message: `✅ Quotation successfully sent to ${email}`,
    });

  } catch (error) {
    console.error("🔥 Send Email Error:", error.message);
    
    return res.status(500).json({ 
      success: false, 
      message: "Failed to send email. Please check server configuration.",
      error: error.message 
    });
  }
};