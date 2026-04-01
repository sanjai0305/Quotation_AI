import React, { useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import {
  FileText,
  Download,
  Printer,
  Share2,
  Mail,
  MessageCircle,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function Export({
  goBack,
  goToDashboard,
  goToCreate,
  goToPreview,
  goToExport,
  goToSettings,
  quotationId, // ✅ Passed from App.jsx after saving
}) {
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [isSending, setIsSending] = useState(false);

  // Get token from LocalStorage
  const token = localStorage.getItem("token");

  // ==============================
  // 🔔 SHOW TOAST HELPER
  // ==============================
  const showToast = (msg, type) => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  // ==============================
  // 📄 DOWNLOAD PDF
  // ==============================
  const handleDownloadPDF = () => {
    if (!quotationId) {
      return showToast("Please Save the quotation first to generate a PDF.", "error");
    }

    // Passes token in URL query so authMiddleware can verify it for file downloads
    window.open(
      `http://localhost:5000/api/export/pdf/${quotationId}?token=${token}`, 
      "_blank"
    );
  };

  // ==============================
  // 📧 SEND EMAIL
  // ==============================
  const handleSendEmail = async () => {
    if (!quotationId) {
      return showToast("Please Save the quotation first before sending an email.", "error");
    }

    const email = window.prompt("Enter the client's email address:");
    if (!email) return;

    setIsSending(true);
    showToast("Sending email... Please wait.", "success"); 

    try {
      const res = await axios.post(
        "http://localhost:5000/api/export/email",
        {
          quotationId,
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Safely passing the token via Header
          },
        }
      );

      if (res.data.success) {
        showToast("✅ Email sent successfully!", "success");
      } else {
        showToast(res.data.message || "❌ Failed to send email", "error");
      }
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || "❌ Error sending email";
      showToast(errMsg, "error");
    } finally {
      setIsSending(false);
    }
  };

  // ==============================
  // 📲 WHATSAPP SHARE
  // ==============================
  const handleWhatsApp = () => {
    const text = quotationId 
      ? `Hello! Please find the Quotation (Ref: ${quotationId}) attached for your review. Let us know if you need any clarifications.`
      : `Hello! Please find the quotation attached for your review. Let us know if you need any clarifications.`;
      
    const msg = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans selection:bg-blue-100 text-gray-800">
      
      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div className={`fixed top-24 right-8 z-50 px-5 py-3.5 rounded-xl shadow-2xl border flex items-center gap-3 transform animate-fade-in transition-all ${toast.type === 'success' ? 'bg-white border-green-100 text-green-700' : 'bg-white border-red-100 text-red-700'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
          <span className="font-semibold text-sm">{toast.message}</span>
        </div>
      )}

      {/* SIDEBAR */}
      <div className="fixed top-0 left-0 h-screen w-[250px] bg-[#0f172a] z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <Sidebar
          active="export"
          goToDashboard={goToDashboard}
          goToCreate={goToCreate}
          goToPreview={goToPreview}
          goToExport={goToExport}
          goToSettings={goToSettings}
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="ml-[250px] min-h-screen flex flex-col relative">
        
        {/* HEADER */}
        <div className="flex justify-between items-center px-10 py-5 bg-white/70 backdrop-blur-xl sticky top-0 z-20 border-b border-gray-200/50 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Export Quotation</h1>
            <p className="text-sm text-gray-500 font-medium mt-1">Download, print, or share your quotation directly.</p>
          </div>

          <button
            onClick={goBack}
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Preview
          </button>
        </div>

        {/* BODY */}
        <div className="p-10 space-y-8 max-w-4xl mx-auto w-full">
          
          {/* FILE STATUS CARD */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 flex justify-between items-center shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-50"></div>
            
            <div className="flex items-center gap-5 relative z-10">
              <div className="bg-blue-50 p-4 rounded-xl shadow-inner border border-blue-100">
                <FileText className="text-blue-600 w-8 h-8" />
              </div>

              <div>
                <h2 className="font-bold text-xl text-gray-900">
                  {quotationId ? `Quotation Saved (ID: ${quotationId})` : "Unsaved Draft Quotation"}
                </h2>
                <p className={`text-sm font-medium mt-1 ${quotationId ? "text-emerald-600" : "text-amber-500"}`}>
                  {quotationId ? "Ready to export and share securely." : "⚠️ Please save your quote first to unlock PDF & Email features."}
                </p>
              </div>
            </div>

            <button
              onClick={goToPreview}
              className="text-blue-600 font-bold hover:text-blue-800 hover:underline transition-colors relative z-10"
            >
              View Document
            </button>
          </div>

          {/* EXPORT OPTIONS */}
          <div>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 pl-2">
              Export Options
            </h2>

            <div className="space-y-4">
              {/* PDF DOWNLOAD */}
              <ActionCard
                icon={<Download className="w-6 h-6" />}
                title="Download as PDF"
                desc="Generate a professional PDF file — ready to send"
                onClick={handleDownloadPDF}
                disabled={!quotationId}
              />

              {/* PRINT */}
              <ActionCard
                icon={<Printer className="w-6 h-6" />}
                title="Print Quotation"
                desc="Send directly to your local printer"
                onClick={() => window.print()}
              />

              {/* SHARE (future) */}
              <ActionCard
                icon={<Share2 className="w-6 h-6" />}
                title="Share with PDF Link"
                desc="Generate a secure link to share via apps"
                onClick={() => showToast("Feature coming soon! 🚀", "success")}
              />

              {/* WHATSAPP */}
              <ActionCard
                icon={<MessageCircle className="w-6 h-6" />}
                title="Share via WhatsApp"
                desc="Send a quick text format to WhatsApp"
                onClick={handleWhatsApp}
              />

              {/* EMAIL */}
              <ActionCard
                icon={<Mail className="w-6 h-6" />}
                title={isSending ? "Sending Email..." : "Share via Email"}
                desc="Send the PDF directly to your client's inbox"
                onClick={handleSendEmail}
                disabled={!quotationId || isSending}
                isSending={isSending}
              />
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-200/60">
            <p className="text-sm font-medium text-gray-500">
              Need to make changes to this document?
            </p>

            <button
              onClick={goBack}
              className="border border-gray-200 text-gray-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
            >
              Edit Quotation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==============================
   REUSABLE ACTION CARD
============================== */
function ActionCard({ icon, title, desc, onClick, disabled, isSending }) {
  return (
    <div
      onClick={disabled ? null : onClick}
      className={`bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-5 transition-all duration-200 
        ${disabled 
          ? "opacity-50 cursor-not-allowed bg-gray-50" 
          : "cursor-pointer hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:border-blue-100"
        }
      `}
    >
      <div className={`p-3.5 rounded-xl flex items-center justify-center transition-colors 
        ${disabled ? "bg-gray-200 text-gray-400" : "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"}`}
      >
        {isSending ? (
           <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
           </svg>
        ) : icon}
      </div>

      <div>
        <h3 className={`font-bold text-lg ${disabled ? "text-gray-500" : "text-gray-900"}`}>{title}</h3>
        <p className="text-sm text-gray-500 font-medium">{desc}</p>
      </div>
    </div>
  );
}