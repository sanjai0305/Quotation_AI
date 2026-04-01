import PDFDocument from "pdfkit";

/**
 * Generate Professional Quotation PDF
 * @param {Object} quotation - Full MongoDB Document
 * @param {Object} res - Express Response Stream
 */
export const generateQuotationPDF = (quotation, res) => {
  try {
    // Initialize Document with proper margins
    const doc = new PDFDocument({ margin: 50, size: "A4" });

    // ✅ Set response headers for direct download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Quotation-${quotation.projectDetails?.referenceNo || "Draft"}.pdf`
    );

    // Pipe PDF generation directly to the response
    doc.pipe(res);

    // Color Palette matching your UI
    const primaryBlue = "#3b82f6";
    const darkSlate = "#0f172a";
    const lightSlate = "#64748b";
    const borderGray = "#e2e8f0";

    // Helper: Draw Horizontal Line
    const generateHr = (y) => {
      doc.strokeColor(borderGray).lineWidth(1).moveTo(50, y).lineTo(545, y).stroke();
    };

    // Helper: Currency Formatter
    const formatCurrency = (num) => `Rs. ${Number(num || 0).toFixed(2)}`;

    /* =========================
       1. HEADER SECTION
    ========================== */
    doc
      .fillColor(darkSlate)
      .fontSize(22)
      .font("Helvetica-Bold")
      .text(quotation.projectDetails?.companyName || "Your Company", 50, 50);
      
    // Paint Brand Badge simulation
    doc
      .fillColor(primaryBlue)
      .fontSize(10)
      .font("Helvetica-Bold")
      .text(quotation.projectDetails?.paintBrand?.toUpperCase() || "PAINT QUOTATION", 50, 75);

    // Right Side Text
    doc
      .fillColor(darkSlate)
      .fontSize(18)
      .font("Helvetica-Bold")
      .text("QUOTATION", 50, 50, { align: "right" });
      
    const quoteDate = quotation.projectDetails?.date 
      ? new Date(quotation.projectDetails.date).toLocaleDateString("en-GB") 
      : new Date().toLocaleDateString("en-GB");
      
    doc
      .fillColor(lightSlate)
      .fontSize(10)
      .font("Helvetica")
      .text(`Date: ${quoteDate}`, 50, 72, { align: "right" });
      
    doc
      .text(`Ref No: ${quotation.projectDetails?.referenceNo || "N/A"}`, 50, 87, { align: "right" });

    generateHr(115);

    /* =========================
       2. CLIENT & PROJECT INFO
    ========================== */
    doc.fillColor(lightSlate).fontSize(9).font("Helvetica-Bold").text("BILL TO:", 50, 135);
    doc.fillColor(darkSlate).fontSize(12).font("Helvetica-Bold").text(quotation.projectDetails?.clientName || "Client Name", 50, 148);
    
    doc.fillColor(lightSlate).fontSize(9).font("Helvetica-Bold").text("PROJECT:", 50, 175);
    doc.fillColor(darkSlate).fontSize(12).font("Helvetica").text(quotation.projectDetails?.projectName || "Project Name", 50, 188);

    /* =========================
       3. COVER LETTER
    ========================== */
    doc.fillColor(darkSlate).fontSize(11).font("Helvetica-Bold").text(`Subject: ${quotation.coverLetter?.subject || "Quotation"}`, 50, 230);
    doc.fillColor(lightSlate).fontSize(10).font("Helvetica").text(quotation.coverLetter?.body || "", 50, 250, { width: 495, lineGap: 4 });

    let currentY = doc.y + 30;

    /* =========================
       4. RATE TABLE HEADER
    ========================== */
    generateHr(currentY);
    doc.fillColor(primaryBlue).fontSize(9).font("Helvetica-Bold");
    doc.text("DESCRIPTION OF WORK", 50, currentY + 10);
    doc.text("LABOUR", 300, currentY + 10, { width: 70, align: "right" });
    doc.text("MATERIAL", 380, currentY + 10, { width: 70, align: "right" });
    doc.text("TOTAL/SQFT", 460, currentY + 10, { width: 85, align: "right" });
    
    currentY += 30;
    generateHr(currentY);
    currentY += 15;

    /* =========================
       5. RATE TABLE ITEMS
    ========================== */
    doc.font("Helvetica").fillColor(darkSlate).fontSize(10);
    
    if (quotation.rateTable && quotation.rateTable.length > 0) {
      quotation.rateTable.forEach((item) => {
        const textHeight = doc.heightOfString(item.work || "-", { width: 240 });
        
        // Page Break Logic (If items exceed page height)
        if (currentY + textHeight > 720) {
          doc.addPage();
          currentY = 50;
          generateHr(currentY);
          currentY += 15;
        }

        doc.text(item.work || "-", 50, currentY, { width: 240 });
        doc.text(Number(item.labour || 0).toFixed(2), 300, currentY, { width: 70, align: "right" });
        doc.text(Number(item.material || 0).toFixed(2), 380, currentY, { width: 70, align: "right" });
        doc.font("Helvetica-Bold").text(Number(item.total || 0).toFixed(2), 460, currentY, { width: 85, align: "right" });
        doc.font("Helvetica"); // Reset font

        currentY += textHeight + 15;
      });
    } else {
      doc.text("No work items added.", 50, currentY);
      currentY += 30;
    }

    generateHr(currentY);
    currentY += 20;

    /* =========================
       6. TOTALS & PRICING
    ========================== */
    const subtotal = quotation.pricing?.subtotal || 0;
    const discount = quotation.pricing?.discount || 0;
    const grandTotal = quotation.pricing?.grandTotal || 0;

    doc.fillColor(lightSlate).fontSize(10).text("Subtotal:", 350, currentY, { width: 100, align: "right" });
    doc.fillColor(darkSlate).font("Helvetica-Bold").text(formatCurrency(subtotal), 460, currentY, { width: 85, align: "right" });
    currentY += 20;

    if (discount > 0) {
      doc.fillColor("#10b981").font("Helvetica").text(`Discount (${discount}%):`, 350, currentY, { width: 100, align: "right" });
      const discountAmount = (subtotal * discount) / 100;
      doc.font("Helvetica-Bold").text(`-${formatCurrency(discountAmount)}`, 460, currentY, { width: 85, align: "right" });
      currentY += 20;
    }

    // Grand Total Highlight Box
    doc.rect(340, currentY, 205, 30).fill(primaryBlue); 
    doc.fillColor("#ffffff").fontSize(12).font("Helvetica-Bold").text("Grand Total", 350, currentY + 9);
    doc.text(formatCurrency(grandTotal), 440, currentY + 9, { width: 95, align: "right" });
    
    currentY += 60;

    /* =========================
       7. TERMS & BANK DETAILS (Two Columns)
    ========================== */
    // Add a new page if we are too close to the bottom
    if (currentY > 600) {
        doc.addPage();
        currentY = 50;
    }

    // Left Column: Terms
    doc.fillColor(darkSlate).fontSize(11).font("Helvetica-Bold").text("Terms & Conditions", 50, currentY);
    doc.fillColor(lightSlate).fontSize(9).font("Helvetica").text(quotation.textAreas?.termsConditions || "As per company standard terms.", 50, currentY + 15, { width: 240, lineGap: 3 });

    // Right Column: Bank Details
    doc.fillColor(darkSlate).fontSize(11).font("Helvetica-Bold").text("Bank Details", 310, currentY);
    const bankInfo = `Bank Name: ${quotation.bankDetails?.bankName || "-"}\nA/C Holder: ${quotation.bankDetails?.accountHolder || "-"}\nA/C Number: ${quotation.bankDetails?.accountNumber || "-"}\nIFSC Code: ${quotation.bankDetails?.ifscCode || "-"}`;
    doc.fillColor(lightSlate).fontSize(9).font("Helvetica").text(bankInfo, 310, currentY + 15, { width: 235, lineGap: 3 });

    currentY = doc.y + 60;

    /* =========================
       8. SIGNATURES
    ========================== */
    if (currentY > 730) {
        doc.addPage();
        currentY = 50;
    }

    // Signature lines
    doc.rect(50, currentY, 150, 1).fill(borderGray); 
    doc.rect(395, currentY, 150, 1).fill(darkSlate); 

    // Signature Text
    doc.fillColor(lightSlate).fontSize(9).font("Helvetica-Bold").text("Customer Signature", 50, currentY + 10, { width: 150, align: "center" });
    
    doc.fillColor(darkSlate).fontSize(10).font("Helvetica-Bold").text("Authorized Signatory", 395, currentY + 10, { width: 150, align: "center" });
    doc.fillColor(lightSlate).fontSize(8).font("Helvetica").text(quotation.signature?.name || quotation.projectDetails?.companyName || "Company", 395, currentY + 25, { width: 150, align: "center" });

    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error("🔥 PDFKit Generation Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Failed to generate PDF" });
    }
  }
};