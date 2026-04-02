import twilio from "twilio";
import { generateQuotationPDF } from "./pdfService.js";
import { PassThrough } from "stream";

// Twilio Credentials (இதை .env ஃபைல்ல வெச்சுக்கோங்க)
const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER; // e.g., 'whatsapp:+14155238886'

const client = twilio(accountSid, authToken);

/**
 * Helper function to generate PDF Buffer (Reused from Email Service)
 */
const createPDFBuffer = async (quotation) => {
  return new Promise(async (resolve, reject) => {
    try {
      const stream = new PassThrough();
      const buffers = [];
      
      stream.on("data", (chunk) => buffers.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(buffers)));
      stream.on("error", reject);

      const mockRes = stream;
      mockRes.setHeader = () => {}; 
      mockRes.headersSent = false;
      mockRes.status = () => mockRes;
      mockRes.json = (errData) => reject(new Error(errData.message || "PDF Generation failed"));
      
      await generateQuotationPDF(quotation, mockRes);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 📲 Send Quotation via WhatsApp Message
 * @param {string} toClientNumber - Client's WhatsApp Number (e.g., 'whatsapp:+919876543210')
 * @param {Object} quotation - Quotation Document
 */
export const sendQuotationWhatsApp = async (toClientNumber, quotation) => {
  try {
    const refNo = quotation.projectDetails?.referenceNo || "Draft";
    const companyName = quotation.projectDetails?.companyName || "Our Company";
    
    // PDF Link (Twilio requires a public URL for attachments, not raw buffers)
    // IMPORTANT: For WhatsApp PDF attachments, you need a public URL where the PDF is hosted.
    // If you don't have public URL storage (like AWS S3), you can send the Frontend Preview Link instead.
    const documentLink = `${process.env.FRONTEND_URL}/preview/${quotation._id}`;

    const messageBody = `Hello from *${companyName}*! 👋\n\nYour quotation (Ref: #${refNo}) is ready.\n\nGrand Total: *Rs. ${Number(quotation.pricing?.grandTotal || 0).toLocaleString('en-IN')}*\n\nYou can view and download your professional PDF document here:\n🔗 ${documentLink}\n\nLet us know if you have any questions!`;

    // Send Message via Twilio
    const message = await client.messages.create({
      body: messageBody,
      from: twilioWhatsAppNumber,
      to: toClientNumber // format must be 'whatsapp:+<country_code><number>'
    });

    console.log(`✅ WhatsApp message sent successfully. SID: ${message.sid}`);
    return { success: true, sid: message.sid };

  } catch (error) {
    console.error("❌ WhatsApp Service Error:", error.message);
    throw new Error("Failed to send WhatsApp message.");
  }
};