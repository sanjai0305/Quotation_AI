import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import { Edit, Printer, Download } from "lucide-react";

// ==============================
// 🔥 API SETUP (Axios)
// ==============================
const API = axios.create({
  baseURL: "http://localhost:5000/api/quotations",
});

// Function to fetch quotation from backend
export const getQuotationById = (id) => API.get(`/${id}`);

export default function Preview({ goBack, goToExport, goToDashboard }) {
  const { id } = useParams(); // Retrieves ID if you are using React Router (/preview/:id)

  const [quotation, setQuotation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ==============================
  // 📥 DEFAULT FALLBACK DATA SKELETON
  // ==============================
  const getDefaultData = () => ({
    projectDetails: {
      companyName: "Your Company Name",
      clientName: "Client Name",
      projectName: "Project Name",
      referenceNo: "QT-MNFX83L2-19Z4",
      date: new Date().toISOString(),
      paintBrand: "Nippon Paint",
    },
    areaDetails: { interiorArea: "", exteriorArea: "" },
    coverLetter: {
      subject: "Paint Quote For",
      body: "Dear Sir,\n\nThank you for your purchase enquiry for the above mentioned site. Please find below our quotation for Material & Labour for this site.",
    },
    rateTable: [],
    pricing: { grandTotal: 0, discount: 0, warranty: 3 },
    textAreas: {
      scopeOfWork: "Surface preparation including cleaning, scraping, sanding. Application of primer coat and finish coats.",
      exclusions: "Structural repairs, Waterproofing, Texture finishes, Electrical work.",
      termsConditions: "Scaffolding by client. Rework charges apply. Rates based on sqft. Work order required."
    },
    paymentTerms: { step1: "Advance (50%)", step2: "Mid Work (30%)", step3: "Completion (20%)" },
    validity: "This quotation is valid for 30 days from the date of issue.",
    bankDetails: { bankName: "HDFC Bank", accountHolder: "Company Name", accountNumber: "5020000000000", ifscCode: "HDFC0001234" },
    signature: { name: "", designation: "" }
  });

  // ==============================
  // 🔄 FETCH DATA FROM DB OR DRAFT
  // ==============================
  useEffect(() => {
    const loadQuotationData = async () => {
      setIsLoading(true);

      if (id) {
        // 🟢 SCENARIO 1: Viewing a saved quotation from Dashboard
        try {
          const res = await getQuotationById(id);
          setQuotation(res.data);
        } catch (error) {
          console.error("Backend Fetch Error:", error);
          alert("Failed to load quotation from database. Showing default template.");
          setQuotation(getDefaultData());
        }
      } else {
        // 🟡 SCENARIO 2: Live Preview from Create Quotation page
        const draft = localStorage.getItem("previewDraft");
        if (draft) {
          setQuotation(JSON.parse(draft));
        } else {
          setQuotation(getDefaultData());
        }
      }
      
      setIsLoading(false);
    };

    loadQuotationData();
  }, [id]);

  // ==============================
  // 🛠️ FORMAT HELPERS
  // ==============================
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const formatNum = (num) => {
    return Number(num || 0).toFixed(2);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  // ==============================
  // ⏳ LOADING STATE
  // ==============================
  if (isLoading || !quotation) {
    return (
      <div className="bg-[#f8fafc] min-h-screen flex ml-[250px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading Quotation Data...</p>
        </div>
      </div>
    );
  }

  // ==============================
  // 🧮 CALCULATE TOTALS DYNAMICALLY
  // ==============================
  const totalLabour = quotation.rateTable?.reduce((acc, row) => acc + (Number(row.labour) || 0), 0) || 0;
  const totalMaterial = quotation.rateTable?.reduce((acc, row) => acc + (Number(row.material) || 0), 0) || 0;
  const subtotal = quotation.rateTable?.reduce((acc, row) => acc + (Number(row.total) || 0), 0) || 0;
  
  const discountPercent = Number(quotation.pricing?.discount) || 0;
  const discountAmount = (subtotal * discountPercent) / 100;
  
  // If viewing from DB, use the saved grandTotal. If live previewing, calculate it on the fly.
  const finalAmount = id && quotation.pricing?.grandTotal 
    ? quotation.pricing.grandTotal 
    : (subtotal - discountAmount);

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans text-gray-800 selection:bg-blue-100">
      
      {/* SIDEBAR */}
      <div className="fixed top-0 left-0 h-screen w-[250px] z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)] border-r border-gray-100">
        <Sidebar
          active="preview"
          goToDashboard={goToDashboard}
          goToCreate={goBack}
          goToPreview={() => {}}
          goToExport={goToExport}
        />
      </div>

      {/* MAIN */}
      <div className="ml-[250px] h-screen flex flex-col relative">
        
        {/* TOP APP HEADER (Non-Printable) */}
        <div className="print:hidden flex justify-between items-center px-10 py-5 bg-white sticky top-0 z-20 border-b border-gray-200/60">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Preview Quotation</h1>
            <p className="text-sm text-slate-500 mt-1">Review your quotation before exporting</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Show Edit button only if we are in draft mode (no ID) */}
            {!id && (
              <button
                onClick={goBack}
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-all"
              >
                <Edit className="w-4 h-4" /> Edit Draft
              </button>
            )}

            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-all"
            >
              <Printer className="w-4 h-4" /> Print
            </button>

            <button
              onClick={goToExport}
              className="flex items-center gap-2 text-sm font-semibold bg-blue-500 text-white px-6 py-2.5 rounded-lg hover:bg-blue-600 transition-all"
            >
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        {/* DOCUMENT PREVIEW AREA */}
        <div className="flex-1 overflow-y-auto p-10 flex justify-center print:p-0 print:overflow-visible">
          
          {/* A4 Paper Document Container */}
          <div className="bg-white w-full max-w-[900px] p-12 sm:p-14 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.05)] border border-gray-100 print:shadow-none print:w-full print:max-w-none print:rounded-none print:border-none">
            
            {/* DOCUMENT HEADER */}
            <div className="flex justify-between items-start mb-10">
              <div>
                <span className="inline-flex items-center bg-blue-50 text-blue-500 px-3 py-1 rounded-full text-xs font-semibold tracking-wide mb-4">
                  {quotation.projectDetails?.paintBrand || "Nippon Paint"}
                </span>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                  {quotation.projectDetails?.companyName || "Your Company Name"}
                </h1>
              </div>

              <div className="text-right">
                <div className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg font-bold tracking-wider text-sm mb-2 shadow-sm">
                  QUOTATION
                </div>
                <p className="text-sm font-medium text-gray-500">
                  Date: {formatDate(quotation.projectDetails?.date)}
                </p>
              </div>
            </div>

            <hr className="border-gray-200 mb-8" />

            {/* CLIENT & PROJECT INFO */}
            <div className="flex justify-between items-start mb-10">
              {/* Left Side: Gray Box */}
              <div className="bg-[#f8fafc] border border-gray-100 p-6 rounded-xl w-[55%]">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Bill To</p>
                <p className="font-bold text-gray-900 text-base mb-5">{quotation.projectDetails?.clientName || "Client Name"}</p>

                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Project</p>
                <p className="font-bold text-gray-900 text-base">{quotation.projectDetails?.projectName || "Project Name"}</p>
              </div>

              {/* Right Side: Text Right */}
              <div className="text-right text-sm space-y-5 pt-2">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reference No.</p>
                  <p className="font-bold text-gray-900 mt-1">{quotation.projectDetails?.referenceNo || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Interior Area</p>
                  <p className="font-bold text-gray-900 mt-1">{quotation.areaDetails?.interiorArea ? `${quotation.areaDetails.interiorArea} Sqft` : "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Exterior Area</p>
                  <p className="font-bold text-gray-900 mt-1">{quotation.areaDetails?.exteriorArea ? `${quotation.areaDetails.exteriorArea} Sqft` : "—"}</p>
                </div>
              </div>
            </div>

            {/* SUBJECT & LETTER */}
            <div className="bg-[#f8fafc] border border-gray-100 p-6 rounded-xl mb-12">
              <p className="font-bold text-gray-900 mb-4">
                Subject: {quotation.coverLetter?.subject || "Paint Quote"}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                {quotation.coverLetter?.body || "Dear Sir,\n\nPlease find attached the quotation."}
              </p>
            </div>

            {/* RATE TABLE */}
            <div className="mb-12">
              <h2 className="font-bold text-gray-900 mb-4 uppercase text-sm tracking-wide">
                Work Details & Pricing
              </h2>
              
              <table className="w-full text-sm mb-4">
                <thead>
                  <tr className="border-y border-blue-100 text-blue-500">
                    <th className="text-left py-3 px-2 font-bold text-xs uppercase tracking-wider">Work</th>
                    <th className="py-3 px-2 font-bold text-xs uppercase tracking-wider text-center leading-tight">
                      Labour<br/><span className="text-[10px]">(₹)</span>
                    </th>
                    <th className="py-3 px-2 font-bold text-xs uppercase tracking-wider text-center leading-tight">
                      Material<br/><span className="text-[10px]">(₹)</span>
                    </th>
                    <th className="py-3 px-2 font-bold text-xs uppercase tracking-wider text-right">
                      Total / Sqft
                    </th>
                  </tr>
                </thead>
                
                <tbody className="divide-y divide-gray-100">
                  {quotation.rateTable?.length > 0 ? (
                    quotation.rateTable.map((item, idx) => (
                      <tr key={idx} className="text-gray-800">
                        <td className="text-left py-4 px-2">{item.work || "—"}</td>
                        <td className="py-4 px-2 text-center">{formatNum(item.labour)}</td>
                        <td className="py-4 px-2 text-center">{formatNum(item.material)}</td>
                        <td className="py-4 px-2 text-right font-bold text-gray-900">{formatNum(item.total)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4" className="py-4 text-center text-gray-400">No items added to the table.</td></tr>
                  )}
                </tbody>
                
                {/* Table Footer Totals */}
                <tfoot>
                  <tr className="border-y-2 border-gray-100 font-bold text-gray-900 bg-gray-50/50">
                    <td className="py-4 px-2 text-left">Total</td>
                    <td className="py-4 px-2 text-center">{formatNum(totalLabour)}</td>
                    <td className="py-4 px-2 text-center">{formatNum(totalMaterial)}</td>
                    <td className="py-4 px-2 text-right">{formatNum(subtotal)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* GRAND TOTAL */}
            <div className="flex flex-col items-end mb-12">
              <div className="w-full max-w-sm">
                <h3 className="font-bold text-gray-900 mb-3 uppercase text-xs tracking-wider border-b border-gray-200 pb-2">Grand Total Summary</h3>
                <div className="flex justify-between text-sm py-2 px-2 text-gray-600">
                  <p>Subtotal (All Sections)</p>
                  <p className="font-semibold">{formatCurrency(subtotal)}</p>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-sm py-2 px-2 text-emerald-600 mb-2">
                    <p>Discount ({discountPercent}%)</p>
                    <p className="font-semibold">-{formatCurrency(discountAmount)}</p>
                  </div>
                )}
                <div className="bg-blue-500 text-white p-4 rounded-lg flex justify-between items-center mt-2 shadow-md">
                  <p className="font-bold">Grand Total</p>
                  <p className="font-bold text-xl tracking-tight">
                    {formatCurrency(finalAmount)}
                  </p>
                </div>
              </div>
            </div>

            {/* DETAILS SECTIONS */}
            <div className="space-y-8 mb-12 text-sm text-gray-700">
              
              {/* Warranty */}
              <div>
                <h4 className="font-bold text-gray-900 uppercase text-xs tracking-wider mb-2">Warranty</h4>
                <p className="leading-relaxed">
                  This quotation includes a <span className="font-bold">{quotation.pricing?.warranty || 0}-year warranty</span> on all paint work carried out. Warranty covers peeling, flaking, and discoloration under normal conditions.
                </p>
              </div>

              {/* Scope & Exclusions */}
              <div className="grid grid-cols-2 gap-8">
                <div className="bg-[#f8fafc] border border-gray-100 p-5 rounded-xl">
                  <h4 className="font-bold text-gray-900 uppercase text-xs tracking-wider mb-3">Scope of Work</h4>
                  <p className="whitespace-pre-wrap leading-relaxed text-gray-600">{quotation.textAreas?.scopeOfWork || "—"}</p>
                </div>
                <div className="bg-red-50/50 border border-red-100 p-5 rounded-xl">
                  <h4 className="font-bold text-gray-900 uppercase text-xs tracking-wider mb-3">Exclusions</h4>
                  <p className="whitespace-pre-wrap leading-relaxed text-gray-600">{quotation.textAreas?.exclusions || "—"}</p>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div>
                <h4 className="font-bold text-gray-900 uppercase text-xs tracking-wider mb-2">Terms & Conditions</h4>
                <p className="whitespace-pre-wrap leading-relaxed text-gray-600">{quotation.textAreas?.termsConditions || "—"}</p>
              </div>

            </div>

            {/* PAYMENT TERMS & BANK */}
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div>
                <h4 className="font-bold text-gray-900 uppercase text-xs tracking-wider mb-3">Payment Terms</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500">
                      <th className="py-2 text-left font-semibold">Stage</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {quotation.paymentTerms?.step1 && <tr className="border-b border-gray-100"><td className="py-2.5">{quotation.paymentTerms.step1}</td></tr>}
                    {quotation.paymentTerms?.step2 && <tr className="border-b border-gray-100"><td className="py-2.5">{quotation.paymentTerms.step2}</td></tr>}
                    {quotation.paymentTerms?.step3 && <tr><td className="py-2.5">{quotation.paymentTerms.step3}</td></tr>}
                  </tbody>
                </table>
              </div>

              <div className="bg-gray-50 border border-gray-100 p-5 rounded-xl text-sm">
                <h4 className="font-bold text-gray-900 uppercase text-xs tracking-wider mb-3">Bank Details</h4>
                <div className="space-y-2 text-gray-600">
                  <p><span className="font-semibold text-gray-800">Bank Name:</span> {quotation.bankDetails?.bankName || "-"}</p>
                  <p><span className="font-semibold text-gray-800">A/C Name:</span> {quotation.bankDetails?.accountHolder || "-"}</p>
                  <p><span className="font-semibold text-gray-800">A/C Number:</span> {quotation.bankDetails?.accountNumber || "-"}</p>
                  <p><span className="font-semibold text-gray-800">IFSC Code:</span> {quotation.bankDetails?.ifscCode || "-"}</p>
                </div>
              </div>
            </div>

            {/* VALIDITY */}
            <div className="text-center mb-16 text-sm">
              <p className="font-bold text-gray-900 uppercase text-xs tracking-wider mb-1">Validity</p>
              <p className="text-gray-600">{quotation.validity || "This quotation is valid for 30 days from the date of issue."}</p>
            </div>

            {/* SIGNATURES */}
            <div className="flex justify-between items-end pt-8 px-4">
              <div className="text-center w-56">
                <div className="border-b border-gray-400 mb-3"></div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Customer Signature</p>
              </div>

              <div className="text-center w-56">
                <div className="h-12 flex items-end justify-center mb-2 text-blue-600 italic font-serif text-2xl">
                  {quotation.signature?.name || quotation.projectDetails?.companyName?.substring(0, 10)}
                </div>
                <div className="border-b border-gray-800 mb-2"></div>
                <p className="text-sm font-bold text-gray-900 uppercase tracking-wider">Authorized Signatory</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                  {quotation.signature?.designation ? `${quotation.signature.designation} - ` : ""}
                  {quotation.projectDetails?.companyName || "Company"}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}