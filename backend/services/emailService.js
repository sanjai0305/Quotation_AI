import { sendMail } from "../config/mail.js";
import PDFDocument from "pdfkit";

/**
 * Helper function to generate PDF as a memory buffer (No file saving needed)
 * This re-uses the logic from your pdfService but returns a Buffer instead of sending to res.
 */
const createPDFBuffer = (quotation) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: "A4" });
      const buffers = [];
      
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      doc.on("error", reject);

      // --- SAME DESIGN AS YOUR pdfService.js ---
      const primaryBlue = "#3b82f6";
      const darkSlate = "#0f172a";
      const lightSlate = "#64748b";
      const borderGray = "#e2e8f0";

      const generateHr = (y) => {
        doc.strokeColor(borderGray).lineWidth(1).moveTo(50, y).lineTo(545, y).stroke();
      };
      const formatCurrency = (num) => `Rs. ${Number(num || 0).toFixed(2)}`;

      // HEADER
      doc.fillColor(darkSlate).fontSize(22).font("Helvetica-Bold").text(quotation.projectDetails?.companyName || "Your Company", 50, 50);
      doc.fillColor(primaryBlue).fontSize(10).font("Helvetica-Bold").text(quotation.projectDetails?.paintBrand?.toUpperCase() || "PAINT QUOTATION", 50, 75);
      doc.fillColor(darkSlate).fontSize(18).font("Helvetica-Bold").text("QUOTATION", 50, 50, { align: "right" });
      
      const quoteDate = quotation.projectDetails?.date ? new Date(quotation.projectDetails.date).toLocaleDateString("en-GB") : new Date().toLocaleDateString("en-GB");
      doc.fillColor(lightSlate).fontSize(10).font("Helvetica").text(`Date: ${quoteDate}`, 50, 72, { align: "right" });
      doc.text(`Ref No: ${quotation.projectDetails?.referenceNo || "N/A"}`, 50, 87, { align: "right" });

      generateHr(115);

      // CLIENT INFO
      doc.fillColor(lightSlate).fontSize(9).font("Helvetica-Bold").text("BILL TO:", 50, 135);
      doc.fillColor(darkSlate).fontSize(12).font("Helvetica-Bold").text(quotation.projectDetails?.clientName || "Client Name", 50, 148);
      doc.fillColor(lightSlate).fontSize(9).font("Helvetica-Bold").text("PROJECT:", 50, 175);
      doc.fillColor(darkSlate).fontSize(12).font("Helvetica").text(quotation.projectDetails?.projectName || "Project Name", 50, 188);

      // SUBJECT
      doc.fillColor(darkSlate).fontSize(11).font("Helvetica-Bold").text(`Subject: ${quotation.coverLetter?.subject || "Quotation"}`, 50, 230);

      let currentY = doc.y + 30;

      // TABLE HEADER
      generateHr(currentY);
      doc.fillColor(primaryBlue).fontSize(9).font("Helvetica-Bold");
      doc.text("DESCRIPTION OF WORK", 50, currentY + 10);
      doc.text("TOTAL/SQFT", 460, currentY + 10, { width: 85, align: "right" });
      
      currentY += 30;
      generateHr(currentY);
      currentY += 15;

      // TABLE ITEMS
      doc.font("Helvetica").fillColor(darkSlate).fontSize(10);
      if (quotation.rateTable && quotation.rateTable.length > 0) {
        quotation.rateTable.forEach((item) => {
          const textHeight = doc.heightOfString(item.work || "-", { width: 350 });
          if (currentY + textHeight > 720) { doc.addPage(); currentY = 50; generateHr(currentY); currentY += 15; }
          
          doc.text(item.work || "-", 50, currentY, { width: 350 });
          doc.font("Helvetica-Bold").text(Number(item.total || 0).toFixed(2), 460, currentY, { width: 85, align: "right" });
          doc.font("Helvetica");
          currentY += textHeight + 15;
        });
      }

      generateHr(currentY);
      currentY += 20;

      // TOTALS
      const subtotal = quotation.pricing?.subtotal || 0;
      const discount = quotation.pricing?.discount || 0;
      const grandTotal = quotation.pricing?.grandTotal || 0;

      doc.fillColor(lightSlate).fontSize(10).text("Subtotal:", 350, currentY, { width: 100, align: "right" });
      doc.fillColor(darkSlate).font("Helvetica-Bold").text(formatCurrency(subtotal), 460, currentY, { width: 85, align: "right" });
      currentY += 20;

      if (discount > 0) {
        doc.fillColor("#10b981").font("Helvetica").text(`Discount (${discount}%):`, 350, currentY, { width: 100, align: "right" });
        doc.font("Helvetica-Bold").text(`-${formatCurrency((subtotal * discount) / 100)}`, 460, currentY, { width: 85, align: "right" });
        currentY += 20;
      }

      doc.rect(340, currentY, 205, 30).fill(primaryBlue); 
      doc.fillColor("#ffffff").fontSize(12).font("Helvetica-Bold").text("Grand Total", 350, currentY + 9);
      doc.text(formatCurrency(grandTotal), 440, currentY + 9, { width: 95, align: "right" });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 📧 Send Quotation Email with PDF Attachment
 * @param {string} toEmail - Client Email
 * @param {Object} quotation - Quotation Document
 */
export const sendQuotationEmail = async (toEmail, quotation) => {
  try {
    const refNo = quotation.projectDetails?.referenceNo || "Draft";
    const companyName = quotation.projectDetails?.companyName || "Our Company";
    const clientName = quotation.projectDetails?.clientName || "Valued Client";
    const grandTotal = quotation.pricing?.grandTotal || 0;

    // 1. Generate PDF Buffer
    const pdfBuffer = await createPDFBuffer(quotation);

    // 2. Email HTML Template (Clean & Professional)
    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #3b82f6; padding: 24px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Your Quotation is Ready</h2>
        </div>
        
        <div style="padding: 32px; background-color: #ffffff; color: #334155;">
          <p style="font-size: 16px; margin-top: 0;">Dear <strong>${clientName}</strong>,</p>
          <p style="font-size: 15px; line-height: 1.6; color: #475569;">
            Thank you for giving us the opportunity to quote for your project. Please find the detailed quotation attached to this email.
          </p>

          <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0;">
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b;">Quotation Reference:</p>
            <p style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #0f172a;">${refNo}</p>
            
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b;">Total Value:</p>
            <p style="margin: 0; font-size: 18px; font-weight: 700; color: #10b981;">Rs. ${Number(grandTotal).toFixed(2)}</p>
          </div>

          <p style="font-size: 15px; line-height: 1.6; color: #475569;">
            If you have any questions or require further clarification regarding this quote, please feel free to reply to this email.
          </p>
          
          <p style="font-size: 15px; margin-bottom: 0; margin-top: 32px;">Best regards,</p>
          <p style="font-size: 16px; font-weight: 600; margin-top: 4px; color: #0f172a;">${companyName}</p>
        </div>
        
        <div style="background-color: #f1f5f9; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">This email was generated automatically by QuoteGen Pro.</p>
        </div>
      </div>
    `;

    // 3. Mail Options with Attachment
    const mailOptions = {
      from: `"${companyName}" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `Quotation from ${companyName} (Ref: ${refNo})`,
      html: html,
      attachments: [
        {
          filename: `Quotation_${refNo}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf"
        }
      ]
    };

    // 4. Send Email via configured transporter
    await sendMail(mailOptions);
    console.log(`✅ Email with PDF sent successfully to ${toEmail}`);

  } catch (error) {
    console.error("❌ Email Service Error:", error.message);
    throw new Error("Failed to send email with quotation attachment.");
  }
};