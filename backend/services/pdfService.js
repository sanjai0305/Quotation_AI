import PDFDocument from "pdfkit";

/**
 * Generate Professional Quotation PDF matching the Advanced Enterprise UI
 * @param {Object} quotation - Full MongoDB Document
 * @param {Object} res - Express Response Stream
 */
export const generateQuotationPDF = async (quotation, res) => {
  try {
    // Initialize Document with proper margins
    const doc = new PDFDocument({ margin: 50, size: "A4" });

    // Pipe PDF generation directly to the response
    doc.pipe(res);

    // ==============================
    // 🛠️ HELPER FUNCTIONS & COLORS
    // ==============================
    const formatCurrency = (num) => Number(num || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    const formatDate = (dateString) => {
      if (!dateString) return "-";
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/\//g, ' ');
    };

    // Advanced UI Colors
    const darkSlate = "#0f172a";
    const lightSlate = "#64748b";
    const primaryIndigo = "#4f46e5";
    const lightIndigoBg = "#eef2ff";
    const borderIndigo = "#c7d2fe";
    const bgLight = "#f8fafc";
    const borderGray = "#e2e8f0";
    const emeraldGreen = "#10b981";

    // Calculate Totals safely
    const subtotal = quotation.pricing?.subtotal || 0;
    const discount = quotation.pricing?.discount || 0;
    const discountAmount = (subtotal * discount) / 100;
    const grandTotal = quotation.pricing?.grandTotal || (subtotal - discountAmount);

    let currentY = 50;

    // ==============================
    // 1. TOP HEADER (Branding & Document Meta)
    // ==============================
    
    // Right Side: QUOTATION TITLE & META
    doc.fontSize(28).font("Helvetica-Bold").fillColor(darkSlate)
       .text("QUOTATION", 50, currentY, { align: "right", width: 495, characterSpacing: 2 });
    
    doc.fontSize(10).font("Helvetica-Bold").fillColor(lightSlate)
       .text(`Date: `, 350, currentY + 35, { width: 90, align: "right" });
    doc.fillColor(darkSlate).text(formatDate(quotation.projectDetails?.date), 440, currentY + 35, { width: 105, align: "right" });
    
    doc.fillColor(lightSlate).text(`Ref No: `, 350, currentY + 50, { width: 90, align: "right" });
    doc.fillColor(darkSlate).text(`#${quotation.projectDetails?.referenceNo || "001"}`, 440, currentY + 50, { width: 105, align: "right" });

    // Left Side: LOGO or COMPANY NAME
    let logoBottomY = currentY;
    if (quotation.projectDetails?.companyLogo && quotation.projectDetails.companyLogo.includes("base64,")) {
      try {
        const base64Data = quotation.projectDetails.companyLogo.split("base64,")[1];
        const imageBuffer = Buffer.from(base64Data, "base64");
        doc.image(imageBuffer, 50, currentY, { fit: [180, 50], align: 'left' });
        logoBottomY = currentY + 55;
      } catch (err) {
        doc.fontSize(20).font("Helvetica-Bold").fillColor(darkSlate).text((quotation.projectDetails?.companyName || "YOUR COMPANY").toUpperCase(), 50, currentY);
        logoBottomY = currentY + 30;
      }
    } else {
      doc.fontSize(20).font("Helvetica-Bold").fillColor(darkSlate).text((quotation.projectDetails?.companyName || "YOUR COMPANY").toUpperCase(), 50, currentY);
      logoBottomY = currentY + 30;
    }

    // Paint Brand Badge (Indigo Box)
    const brandText = (quotation.projectDetails?.paintBrand || "PREMIUM COATING").toUpperCase();
    doc.fontSize(8).font("Helvetica-Bold");
    const brandWidth = doc.widthOfString(brandText) + 16;
    doc.rect(50, logoBottomY, brandWidth, 18).fillAndStroke(primaryIndigo, primaryIndigo);
    doc.fillColor("#ffffff").text(brandText, 58, logoBottomY + 5);

    currentY = Math.max(logoBottomY + 40, currentY + 85);

    // Thick Bottom Border for Header
    doc.rect(50, currentY, 495, 2).fill(darkSlate);
    currentY += 20;

    // ==============================
    // 2. INFO GRID: Bill To & Project Details
    // ==============================
    // Left: Billing
    doc.fontSize(8).font("Helvetica-Bold").fillColor(lightSlate).text("BILLING DETAILS", 50, currentY, { characterSpacing: 1 });
    doc.rect(50, currentY + 12, 100, 1).fill(borderGray);
    doc.fontSize(12).font("Helvetica-Bold").fillColor(darkSlate).text(quotation.projectDetails?.clientName || "Client Name", 50, currentY + 20);

    // Right: Project
    doc.fontSize(8).font("Helvetica-Bold").fillColor(lightSlate).text("PROJECT SITE", 300, currentY, { characterSpacing: 1 });
    doc.rect(300, currentY + 12, 100, 1).fill(borderGray);
    doc.fontSize(12).font("Helvetica-Bold").fillColor(darkSlate).text(quotation.projectDetails?.projectName || "Unnamed Project", 300, currentY + 20);
    
    currentY += 55;

    // ==============================
    // 3. COVER LETTER (Stylized Box with Indigo Left Border)
    // ==============================
    const clientPhone = quotation.signature?.phone || quotation.projectDetails?.referenceNo || ""; 
    const formattedSubject = `Paint Quote for ${quotation.projectDetails?.clientName || "Client Name"} ${
      quotation.projectDetails?.projectName ? `, ${quotation.projectDetails.projectName}` : ""
    } ${clientPhone ? `( ${clientPhone} )` : ""}`;
    const subjectText = quotation.coverLetter?.subject || formattedSubject;
    const bodyText = quotation.coverLetter?.body || "Thank you for your purchase enquiry for the above mentioned site. Please find below our quotation for Material & Labour for this site.";

    doc.font("Helvetica-Bold").fontSize(10);
    const subjectHeight = doc.heightOfString(`Subject: ${subjectText}`, { width: 450 });
    doc.font("Helvetica").fontSize(10);
    const bodyHeight = doc.heightOfString(`"${bodyText}"`, { width: 450 });
    const boxHeight = subjectHeight + bodyHeight + 30; // padding

    // Draw Box
    doc.rect(50, currentY, 495, boxHeight).fill(bgLight);
    doc.rect(50, currentY, 4, boxHeight).fill(primaryIndigo); // Left accent border

    // Draw Text inside Box
    doc.fillColor(darkSlate).font("Helvetica-Bold").fontSize(10)
       .text(`Subject: ${subjectText}`, 70, currentY + 10, { width: 450, underline: true });
    
    doc.fillColor(lightSlate).font("Helvetica-Oblique").fontSize(10)
       .text(`"${bodyText}"`, 70, currentY + 10 + subjectHeight + 10, { width: 450, lineGap: 3 });

    currentY += boxHeight + 30;

    // ==============================
    // 4. 4-COLUMN RATE TABLE (Dark Header)
    // ==============================
    const checkPageBreak = (neededHeight) => {
      if (doc.y + neededHeight > 780) { doc.addPage(); return true; }
      return false;
    };

    const col1 = 50, w1 = 210; // Description
    const col2 = 260, w2 = 80; // Labour
    const col3 = 340, w3 = 80; // Material
    const col4 = 420, w4 = 125; // Total/Sqft

    doc.fontSize(8).font("Helvetica-Bold").fillColor(lightSlate).text("MATERIAL & LABOUR BREAKDOWN", 50, currentY, { characterSpacing: 1 });
    currentY += 12;

    checkPageBreak(40);
    // Draw Dark Table Header
    doc.rect(col1, currentY, 495, 25).fill(darkSlate);

    doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(8);
    doc.text("DETAILED DESCRIPTION OF WORK", col1 + 10, currentY + 8, { width: w1 - 15, align: "left" });
    doc.text("LABOUR (Rs)", col2, currentY + 8, { width: w2, align: "center" });
    doc.text("MATERIAL (Rs)", col3, currentY + 8, { width: w3, align: "center" });
    doc.text("UNIT RATE (Rs)", col4, currentY + 8, { width: w4 - 10, align: "right" });

    currentY += 25;

    // Table Rows
    doc.font("Helvetica-Bold").fontSize(9);
    if (quotation.rateTable && quotation.rateTable.length > 0) {
      quotation.rateTable.forEach((item, idx) => {
        const textOptions = { width: w1 - 15, align: "left", lineGap: 4 };
        const textHeight = doc.heightOfString(item.work || "-", textOptions);
        const rowHeight = Math.max(textHeight + 20, 30); 

        if (checkPageBreak(rowHeight)) currentY = 50;

        // Draw Row Background & Bottom Border
        if (idx % 2 === 0) doc.rect(col1, currentY, 495, rowHeight).fill(bgLight);
        doc.rect(col1, currentY + rowHeight, 495, 1).fill(borderGray);

        const yOffset = currentY + 10;
        doc.fillColor(darkSlate).text(item.work || "-", col1 + 10, yOffset, textOptions);
        
        doc.fillColor(lightSlate).text(formatCurrency(item.labour), col2, yOffset, { width: w2, align: "center" });
        doc.text(formatCurrency(item.material), col3, yOffset, { width: w3, align: "center" });
        
        doc.fillColor(primaryIndigo).text(formatCurrency(item.total), col4, yOffset, { width: w4 - 10, align: "right" });

        currentY += rowHeight;
      });
    } else {
      doc.rect(col1, currentY, 495, 30).stroke(borderGray);
      doc.fillColor(lightSlate).text("No work items added.", col1, currentY + 10, { width: 495, align: "center" });
      currentY += 30;
    }

    doc.y = currentY + 20;

    // ==============================
    // 5. DARK BILLING SUMMARY BOX
    // ==============================
    checkPageBreak(100);
    currentY = doc.y;

    const summaryW = 220;
    const summaryX = 545 - summaryW; // Right aligned

    // Draw Dark Box
    doc.rect(summaryX, currentY, summaryW, discount > 0 ? 100 : 80).fill(darkSlate);

    doc.fillColor(lightSlate).fontSize(8).font("Helvetica-Bold").text("BILLING SUMMARY", summaryX + 15, currentY + 15, { characterSpacing: 1 });
    doc.rect(summaryX + 15, currentY + 28, summaryW - 30, 1).fill(lightSlate); // line

    let sY = currentY + 35;
    doc.fillColor("#ffffff").fontSize(10).font("Helvetica");
    doc.text("Project Subtotal", summaryX + 15, sY);
    doc.font("Helvetica-Bold").text(formatCurrency(subtotal), summaryX + 15, sY, { width: summaryW - 30, align: "right" });
    
    if (discount > 0) {
      sY += 18;
      doc.fillColor("#fca5a5").font("Helvetica-Oblique").text(`Discount (${discount}%)`, summaryX + 15, sY);
      doc.text(`-${formatCurrency(discountAmount)}`, summaryX + 15, sY, { width: summaryW - 30, align: "right" });
    }

    sY += 22;
    doc.fillColor("#ffffff").fontSize(12).font("Helvetica-Bold").text("GRAND TOTAL", summaryX + 15, sY);
    doc.fillColor(emeraldGreen).fontSize(16).text(formatCurrency(grandTotal), summaryX + 15, sY - 2, { width: summaryW - 30, align: "right" });

    currentY += (discount > 0 ? 120 : 100);
    doc.y = currentY;

    // ==============================
    // 6. TERMS & BANK DETAILS (Grid Layout)
    // ==============================
    checkPageBreak(150);
    currentY = doc.y;

    // LEFT: Terms & Conditions
    doc.fontSize(9).font("Helvetica-Bold").fillColor(darkSlate).text("CONTRACT TERMS", 50, currentY, { characterSpacing: 1 });
    doc.rect(50, currentY + 12, 220, 2).fill(darkSlate);
    
    doc.fontSize(9).font("Helvetica").fillColor(lightSlate);
    let termsY = currentY + 22;
    
    if (quotation.textAreas?.termsConditions) {
      doc.text(quotation.textAreas.termsConditions, 50, termsY, { width: 220, lineGap: 3 });
    } else {
      doc.text("1. Scaffolding must be provided by the client wherever rope scaffolding is not possible.\n2. If rework is required after texture completion, additional charges will apply.\n3. Rates are given as per existing square feet area.", 50, termsY, { width: 220, lineGap: 3 });
    }

    const tHeight = doc.heightOfString(quotation.textAreas?.termsConditions || "1.\n2.\n3.", { width: 220, lineGap: 3 });
    doc.font("Helvetica-BoldOblique").fontSize(8).text(`Validity: ${quotation.validity || "30 days from issue."}`, 50, termsY + tHeight + 10, { width: 220 });

    // RIGHT: Bank Details (Light Indigo Box)
    doc.rect(300, currentY, 245, 95).fillAndStroke(lightIndigoBg, borderIndigo);
    
    doc.fontSize(9).font("Helvetica-Bold").fillColor(primaryIndigo).text("PAYMENT INFORMATION", 315, currentY + 12, { characterSpacing: 1 });
    
    doc.fontSize(9).font("Helvetica-Bold").fillColor(darkSlate);
    let bY = currentY + 32;
    doc.text("Bank:", 315, bY); doc.font("Helvetica").text(quotation.bankDetails?.bankName || "-", 380, bY);
    bY += 14;
    doc.font("Helvetica-Bold").text("A/C Holder:", 315, bY); doc.font("Helvetica").text(quotation.bankDetails?.accountHolder || "-", 380, bY);
    bY += 14;
    doc.font("Helvetica-Bold").text("Account #:", 315, bY); doc.font("Helvetica").text(quotation.bankDetails?.accountNumber || "-", 380, bY);
    bY += 14;
    doc.font("Helvetica-Bold").text("IFSC Code:", 315, bY); doc.font("Helvetica-Bold").fillColor(primaryIndigo).text(quotation.bankDetails?.ifscCode || "-", 380, bY);

    currentY = Math.max(termsY + tHeight + 30, currentY + 120);

    // ==============================
    // 7. PROFESSIONAL SIGNATURE AREA
    // ==============================
    checkPageBreak(80);
    currentY = doc.y + 20;

    // Left: Customer Approval
    doc.rect(50, currentY, 150, 1).fill(borderGray);
    doc.fontSize(8).font("Helvetica-Bold").fillColor(lightSlate).text("CUSTOMER APPROVAL", 50, currentY + 8, { width: 150, align: "center", characterSpacing: 1 });

    // Right: Authorized Signatory
    doc.fontSize(14).font("Helvetica-BoldOblique").fillColor(primaryIndigo)
       .text(quotation.signature?.name || quotation.projectDetails?.companyName || "Company", 395, currentY - 20, { width: 150, align: "center" });
    
    doc.rect(395, currentY, 150, 2).fill(darkSlate);
    doc.fontSize(8).font("Helvetica-Bold").fillColor(darkSlate).text("AUTHORIZED SIGNATORY", 395, currentY + 8, { width: 150, align: "center", characterSpacing: 1 });

    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error("🔥 PDFKit Generation Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Failed to generate PDF" });
    }
  }
};