import nodemailer from "nodemailer";

/* =========================
   📧 Dynamic Transporter (THE FIX)
========================== */
// We use a function here so it reads process.env AFTER dotenv.config() has run in server.js
const getTransporter = () => {
  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASS = process.env.EMAIL_PASS;

  if (!EMAIL_USER || !EMAIL_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS, // 🔐 App password from Google
    },
  });
};

/* =========================
   ✅ Verify Mail Connection
========================== */
export const verifyMailConnection = async () => {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn("⚠️ Mail transporter not initialized (Missing EMAIL_USER / EMAIL_PASS in .env)");
    return false;
  }

  try {
    await transporter.verify();
    console.log("📧 Mail server is ready and connected");
    return true;
  } catch (error) {
    console.error("❌ Mail server connection error:", error.message);
    return false;
  }
};

/* =========================
   📤 Safe Send Mail Function
========================== */
export const sendMail = async (options) => {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn("⚠️ Email not sent. Mail service is disabled due to missing credentials.");
    return null;
  }

  try {
    // Merge default sender with user options
    const mailOptions = {
      from: `"QuoteGen Pro" <${process.env.EMAIL_USER}>`,
      ...options,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${options.to}`);
    return info;

  } catch (error) {
    console.error("❌ Send Mail Error:", error.message);
    throw new Error("Email sending failed. Please check your credentials.");
  }
};