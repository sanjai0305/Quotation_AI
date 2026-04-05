import React, { useState, useMemo } from "react";
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
  AlertCircle,
  FileCheck,
  XCircle
} from "lucide-react";

// 🔥 IMPORT ALL TEMPLATES TO RENDER FOR PDF
import ClassicTemplate from "../../components/theme/ClassicTemplate";
import ModernTemplate from "../../components/theme/ModernTemplate";
import CorporateTemplate from "../../components/theme/CorporateTemplate";
import CompactTemplate from "../../components/theme/CompactTemplate";
import CreativeTemplate from "../../components/theme/CreativeTemplate";
import GroupedTemplate from "../../components/theme/GroupedTemplate";

export default function Export({
  user, goBack, goToDashboard, goToCreate, goToPreview, goToExport,
  goToSubscription, goToSettings, goToHelp, goToEditProfile, quotationId,
}) {
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [isSending, setIsSending] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false); 

  const token = localStorage.getItem("token");
  const selectedTemplate = localStorage.getItem("selectedTemplate") || "classic";
  
  const quotationData = useMemo(() => {
    const draft = localStorage.getItem("previewDraft");
    return draft ? JSON.parse(draft) : null;
  }, []);

  const mappedData = useMemo(() => {
    if (!quotationData) return null;

    const totals = {
      subtotal: quotationData.rateSections?.reduce((acc, sec) => 
        acc + sec.rows.reduce((rAcc, r) => rAcc + (Number(r.total) || 0), 0), 0) || 0,
    };

    const formattedSections = quotationData.rateSections?.map(section => ({
      title: section.title || "Material & Labour Rates",
      items: section.rows?.map(item => ({
        desc: item.work || item.workDescription || item.description || "-",
        labour: Number(item.labour || 0).toFixed(2),
        material: Number(item.material || 0).toFixed(2),
        total: Number(item.total || 0).toFixed(2)
      })) || [],
      sectionTotal: Number(section.rows?.reduce((acc, r) => acc + (Number(r.total) || 0), 0) || 0).toFixed(2)
    })) || [];

    const discountPercent = Number(quotationData.pricing?.discount) || 0;
    const discountAmount = (totals.subtotal * discountPercent) / 100;
    const tax = Number(quotationData.pricing?.tax) || 0;

    return {
      companyLogo: quotationData.projectDetails?.companyLogo || "",
      companyName: quotationData.projectDetails?.companyName || "Your Company",
      companyPhone: quotationData.projectDetails?.companyPhone || "",
      companyEmail: quotationData.projectDetails?.companyEmail || "",
      clientName: quotationData.projectDetails?.clientName || "Client Name",
      clientAddress: quotationData.projectDetails?.clientAddress || "",
      quotationNo: quotationData.projectDetails?.referenceNo || "001",
      date: quotationData.projectDetails?.date,
      sections: formattedSections,
      subtotal: totals.subtotal.toFixed(2),
      discount: discountAmount.toFixed(2),
      tax: tax.toFixed(2),
      grandTotal: (totals.subtotal - discountAmount + tax).toFixed(2),
      terms: quotationData.textAreas?.termsConditions 
        ? quotationData.textAreas.termsConditions.split('\n').filter(t => t.trim() !== '') 
        : ["Payment should be made 50% in advance."],
      bankDetails: {
        bankName: quotationData.bankDetails?.bankName,
        accNo: quotationData.bankDetails?.accountNumber,
        ifsc: quotationData.bankDetails?.ifscCode,
        accHolder: quotationData.bankDetails?.accountHolder
      }
    };
  }, [quotationData]);

  // 🔔 TOAST HELPER
  const showToast = (msg, type) => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
  };

  // 📄 PRINT LOGIC (Browser Print)
  const handlePrint = () => {
    window.print(); 
  };

  // 📄 DIRECT DOWNLOAD LOGIC
  const handleDownloadPDF = async () => {
    if (!quotationId) {
       showToast("Using local print mode for unsaved draft... 📄", "success");
       setTimeout(() => window.print(), 100);
       return;
    }

    setIsDownloading(true);
    showToast("Generating PDF... Please wait ⏳", "success");

    try {
      const response = await axios.get(
        `http://localhost:5000/api/export/pdf/${quotationId}?template=${selectedTemplate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'arraybuffer', 
          timeout: 60000 
        }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Quotation_${mappedData?.clientName?.replace(/\s+/g, '_') || 'File'}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        link.remove();
      }, 100);
      
      showToast("✅ Downloaded Successfully!", "success");
    } catch (error) {
      console.error("Download Error:", error);
      showToast("❌ Failed to download PDF. Server might be busy.", "error");
    } finally {
      setIsDownloading(false);
    }
  };

  // 📧 SEND EMAIL
  const handleSendEmail = async () => {
    if (!quotationId) return showToast("Please Save the quotation first! ❌", "error");
    const email = window.prompt("Enter the client's email address:");
    if (!email) return;
    setIsSending(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/export/email", 
        { quotationId, email, template: selectedTemplate }, 
        { headers: { Authorization: `Bearer ${token}` }, timeout: 60000 }
      );
      if (res.data.success) showToast("✅ Email sent successfully!", "success");
      else showToast(res.data.message || "❌ Failed to send email", "error");
    } catch (error) { 
      showToast("❌ Error connecting to server. Try again.", "error"); 
    } finally { 
      setIsSending(false); 
    }
  };

  const copyShareLink = () => {
    if (!quotationId) return showToast("Save first! ❌", "error");
    const link = `${window.location.origin}/preview/${quotationId}`;
    navigator.clipboard.writeText(link);
    showToast("🔗 Professional Link Copied!", "success");
  };

  // 💬 SHARE PDF VIA WHATSAPP (FIXED: User Gesture Error Bypass)
  const handleShareActualPDF = async () => {
    if (!quotationId) return showToast("Please save your quotation first! ❌", "error");

    const clientName = mappedData?.clientName || "Valued Client";
    const companyName = mappedData?.companyName || "Our Team";
    const fileName = `Quotation_${clientName.replace(/\s+/g, '_')}.pdf`;
    const shareText = `Hello ${clientName}! 👋\n\nPlease find your requested quotation attached.\n\nBest Regards,\n${companyName}`;

    // 1. 🔥 உடனே WhatsApp-ஐ திறந்துவிட வேண்டும் (User Gesture-ஐ இழக்காமல் இருக்க)
    const isMobile = /Mobile|Android|iPhone/i.test(navigator.userAgent);
    const whatsappUrl = isMobile 
      ? `https://wa.me/?text=${encodeURIComponent(shareText)}` 
      : `https://web.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    
    // பட்டனை கிளிக் செய்த உடனே திறக்கும்!
    const waWindow = window.open(whatsappUrl, "_blank");

    setIsDownloading(true);
    showToast("Downloading PDF... Attach it in WhatsApp ⏳", "success");

    try {
      // 2. பின்னணியில் PDF-ஐ டவுன்லோட் செய்தல்
      const response = await axios.get(
        `http://localhost:5000/api/export/pdf/${quotationId}?template=${selectedTemplate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'arraybuffer', 
          timeout: 60000 
        }
      );

      // 3. யூசரின் டிவைஸில் சேவ் செய்தல்
      const pdfFile = new File([response.data], fileName, { type: 'application/pdf' });
      const url = window.URL.createObjectURL(pdfFile);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      showToast("✅ Downloaded! Please attach it in WhatsApp.", "success");
      
    } catch (error) {
      console.error("Share File Error:", error);
      showToast("❌ Failed to fetch PDF from server.", "error");
      if (waWindow) waWindow.close(); // எரர் வந்தால் திறந்த WhatsApp-ஐ மூடிவிடலாம்
    } finally {
      setIsDownloading(false);
    }
  };

  const RenderSelectedTemplate = () => {
    if (!mappedData) return null;
    const props = { data: mappedData };
    return (
      <div className="w-full max-w-[210mm] mx-auto bg-white">
        {selectedTemplate === "modern" && <ModernTemplate {...props} />}
        {selectedTemplate === "corporate" && <CorporateTemplate {...props} />}
        {selectedTemplate === "compact" && <CompactTemplate {...props} />}
        {selectedTemplate === "creative" && <CreativeTemplate {...props} />}
        {selectedTemplate === "grouped" && <GroupedTemplate {...props} />}
        {selectedTemplate === "classic" && <ClassicTemplate {...props} />}
      </div>
    );
  };

  return (
    <>
      <div className="hidden print:block w-full bg-white absolute top-0 left-0 z-[9999]">
         <RenderSelectedTemplate />
      </div>

      <div className="print:hidden bg-[#f8fafc] min-h-screen font-sans selection:bg-blue-100 text-gray-800 flex">
        <style>
          {`
            @media print {
              @page { margin: 15mm; }
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; }
              .print-avoid-break { break-inside: avoid; page-break-inside: avoid; }
              ::-webkit-scrollbar { display: none; }
            }
          `}
        </style>

        {toast.show && (
          <div className={`fixed top-24 right-8 z-50 px-5 py-3.5 rounded-xl shadow-2xl border flex items-center gap-3 transform animate-fade-in transition-all ${toast.type === 'success' ? 'bg-white border-emerald-100 text-emerald-700' : 'bg-white border-red-100 text-red-700'}`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
            <span className="font-semibold text-sm">{toast.message}</span>
          </div>
        )}

        <div className="fixed top-0 left-0 h-screen w-[250px] z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          <Sidebar active="export" user={user} goToDashboard={goToDashboard} goToCreate={goToCreate} goToPreview={goToPreview} goToExport={goToExport} goToSubscription={goToSubscription} goToSettings={goToSettings} goToHelp={goToHelp} goToEditProfile={goToEditProfile} />
        </div>

        <div className="ml-[250px] w-full flex flex-col relative">
          
          <div className="flex justify-between items-center px-10 py-5 bg-white/70 backdrop-blur-xl sticky top-0 z-20 border-b border-gray-200/50 shadow-sm">
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Export Quotation</h1>
              <p className="text-sm text-gray-500 font-medium mt-1">Download, print, or share your quotation directly.</p>
            </div>
            <button onClick={goBack} className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-all shadow-sm">
              <ArrowLeft className="w-4 h-4" /> Back to Preview
            </button>
          </div>

          <div className="p-10 space-y-8 max-w-4xl mx-auto w-full pb-20">
            
            <div className={`p-8 rounded-3xl border flex items-center justify-between transition-all shadow-sm relative overflow-hidden ${quotationId ? 'bg-emerald-50/50 border-emerald-100' : 'bg-amber-50/50 border-amber-100'}`}>
              <div className="flex items-center gap-5 relative z-10">
                <div className={`p-4 rounded-xl shadow-inner border ${quotationId ? 'bg-emerald-100 border-emerald-200 text-emerald-600' : 'bg-amber-100 border-amber-200 text-amber-600'}`}>
                  {quotationId ? <FileCheck className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                </div>
                <div>
                  <h2 className="font-bold text-xl text-gray-900">{quotationId ? "Quotation is Ready!" : "Unsaved Draft Quotation"}</h2>
                  <p className={`text-sm font-medium mt-1 ${quotationId ? "text-emerald-600" : "text-amber-600"}`}>
                    {quotationId ? "Your quote is saved and ready to share with the client." : "⚠️ Please save your quote first to unlock export features."}
                  </p>
                </div>
              </div>
              <button onClick={goToPreview} className="text-blue-600 font-bold hover:text-blue-800 hover:underline transition-colors relative z-10">View Document</button>
            </div>

            <div>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 pl-2">Export Options</h2>
              <div className="space-y-4">
                <ActionCard 
                  icon={<Download className="w-6 h-6" />} 
                  title={isDownloading ? "Generating File..." : "Download as PDF"} 
                  desc="Directly download the PDF to your device" 
                  onClick={handleDownloadPDF} 
                  disabled={isDownloading} 
                  isSending={isDownloading} 
                />
                <ActionCard icon={<Printer className="w-6 h-6" />} title="Print Quotation" desc="Send directly to your local printer" onClick={handlePrint} disabled={false} />
                <ActionCard icon={<Share2 className="w-6 h-6" />} title="Share with Link" desc="Copy a direct link for client review" onClick={copyShareLink} disabled={!quotationId} />
                
                <ActionCard 
                  icon={<MessageCircle className="w-6 h-6" />} 
                  title={isDownloading ? "Preparing PDF..." : "Share PDF on WhatsApp"} 
                  desc="Send the actual PDF file directly via WhatsApp" 
                  onClick={handleShareActualPDF} 
                  disabled={!quotationId || isDownloading} 
                  isSending={isDownloading}
                />
                
                <ActionCard icon={<Mail className="w-6 h-6" />} title={isSending ? "Sending Email..." : "Share via Email"} desc="Send the PDF directly to client's inbox" onClick={handleSendEmail} disabled={!quotationId || isSending} isSending={isSending} />
              </div>
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-gray-200/60 mt-10">
              <p className="text-sm font-medium text-gray-500">Need to make changes to this document?</p>
              <button onClick={() => { goBack(); setTimeout(goToCreate, 100); }} className="border border-gray-200 text-gray-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-gray-50 transition-all shadow-sm">Edit Quotation</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ActionCard({ icon, title, desc, onClick, disabled, isSending }) {
  return (
    <div onClick={disabled ? null : onClick} className={`bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between transition-all duration-200 group ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : "cursor-pointer hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:border-blue-200"}`}>
      <div className="flex items-center gap-5">
        <div className={`p-3.5 rounded-xl flex items-center justify-center transition-colors ${disabled ? "bg-gray-200 text-gray-400" : "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"}`}>
          {isSending ? <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : icon}
        </div>
        <div>
          <h3 className={`font-bold text-lg ${disabled ? "text-gray-500" : "text-gray-900"}`}>{title}</h3>
          <p className="text-sm text-gray-500 font-medium">{desc}</p>
        </div>
      </div>
      <ArrowLeft className={`rotate-180 transition-colors ${disabled ? "text-gray-200" : "text-gray-300 group-hover:text-blue-500"}`} size={20}/>
    </div>
  );
}