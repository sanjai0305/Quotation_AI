import nodemailer from "nodemailer";

/* ========================================================
   📧 DYNAMIC TRANSPORTER (With Connection Pooling)
======================================================== */
const getTransporter = () => {
  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASS = process.env.EMAIL_PASS;

  if (!EMAIL_USER || !EMAIL_PASS) return null;

  return nodemailer.createTransport({
    service: "gmail",
    // 🔥 Advanced: Connection Pooling for faster multiple email delivery
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS, 
    },
  });
};

/* ========================================================
   ✅ VERIFY MAIL CONNECTION (Startup Check)
======================================================== */
export const verifyMailConnection = async () => {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn("⚠️ Mail service disabled: Missing EMAIL_USER or EMAIL_PASS in .env");
    return false;
  }

  try {
    await transporter.verify();
    console.log("📧 Mail Server: Connected and Ready (Pooling Active)");
    return true;
  } catch (error) {
    console.error("❌ Mail Server Connection Error:", error.message);
    return false;
  }
};

/* ========================================================
   🎨 ADVANCED HTML EMAIL TEMPLATE WRAPPER
======================================================== */
const createEmailTemplate = (title, content) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; }
      .header { background-color: #2563eb; padding: 30px 40px; text-align: center; }
      .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 1px; }
      .header span { color: #93c5fd; }
      .body { padding: 40px; color: #334155; line-height: 1.6; font-size: 16px; }
      .body h2 { color: #0f172a; font-size: 20px; margin-top: 0; }
      .footer { background-color: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 13px; border-top: 1px solid #e2e8f0; }
      .btn { display: inline-block; background-color: #2563eb; color: #ffffff !important; font-weight: bold; text-decoration: none; padding: 14px 28px; border-radius: 8px; margin: 25px 0; box-shadow: 0 4px 6px rgba(37,99,235,0.2); }
      .btn:hover { background-color: #1d4ed8; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Vision<span>X</span></h1>
      </div>
      <div class="body">
        <h2>${title}</h2>
        ${content}
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} VisionX Technologies. All rights reserved.<br>
        <span style="font-size: 11px; margin-top: 5px; display: block;">This is an automated message, please do not reply directly to this email.</span>
      </div>
    </div>
  </body>
  </html>
  `;
};

/* ========================================================
   📤 BASE SEND MAIL FUNCTION
======================================================== */
export const sendMail = async ({ to, subject, html, attachments = [] }) => {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn("⚠️ Email not sent. Credentials missing.");
    return null;
  }

  try {
    const mailOptions = {
      from: `"VisionX System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email successfully delivered to: ${to}`);
    return info;

  } catch (error) {
    console.error("❌ Send Mail Error:", error.message);
    throw new Error("Email sending failed.");
  }
};

/* ========================================================
   🚀 PRE-CONFIGURED EMAIL SERVICES (For Controllers to use)
======================================================== */

/**
 * Send a beautiful Password Reset Link
 */
export const sendPasswordResetEmail = async (userEmail, resetUrl) => {
  const title = "Password Reset Request";
  const content = `
    <p>We received a request to reset the password for your VisionX account.</p>
    <p>If you made this request, please click the button below to securely set a new password. This link will expire in <strong>1 hour</strong>.</p>
    <div style="text-align: center;">
      <a href="${resetUrl}" class="btn">Securely Reset Password</a>
    </div>
    <p style="font-size: 14px; color: #64748b;">If you did not request a password reset, you can safely ignore this email. Your account remains secure.</p>
  `;

  const html = createEmailTemplate(title, content);
  
  return await sendMail({
    to: userEmail,
    subject: "🔐 Reset Your VisionX Password",
    html: html
  });
};

/**
 * Send Quotation PDF directly to Client
 */
export const sendQuotationPDFEmail = async (clientEmail, clientName, pdfBuffer, companyName) => {
  const title = `Your Quotation from ${companyName}`;
  const content = `
    <p>Hello <strong>${clientName || 'Valued Client'}</strong>,</p>
    <p>Thank you for your interest in our services. Please find your detailed professional quotation attached to this email.</p>
    <p>If you have any questions or need further clarification regarding the estimates, feel free to reach out to us.</p>
    <p>We look forward to working with you!</p>
    <p>Best Regards,<br><strong>${companyName}</strong></p>
  `;

  const html = createEmailTemplate(title, content);

  return await sendMail({
    to: clientEmail,
    subject: `📄 Official Quotation from ${companyName}`,
    html: html,
    attachments: [
      {
        filename: `Quotation_${clientName.replace(/\s+/g, '_')}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  });
};