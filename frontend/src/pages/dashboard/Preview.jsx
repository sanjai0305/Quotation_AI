import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import { Edit, Printer, Download } from "lucide-react";

// 🔥 Import Modular Components
import PreviewHeader from "../../components/preview/PreviewHeader";
import PreviewRateTable from "../../components/preview/PreviewRateTable";
import PreviewTerms from "../../components/preview/PreviewTerms";

const API = axios.create({
  baseURL: "http://localhost:5000/api/quotations",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const getQuotationById = (id) => API.get(`/${id}`);

export default function Preview({ 
  user, 
  goBack, 
  goToExport, 
  goToDashboard, 
  goToSubscription,
  goToSettings, // 🔥 NEW: Added for Sidebar
  goToHelp,     // 🔥 NEW: Added for Sidebar
  goToEditProfile, 
  goToCreate 
}) {
  const { id } = useParams(); 

  const getDefaultData = () => ({
    projectDetails: { companyName: "Your Company", clientName: "Client Name", date: new Date().toISOString() },
    areaDetails: {}, coverLetter: {}, rateTable: [], pricing: { grandTotal: 0 }, textAreas: {}, paymentTerms: {}, paymentPercents: {}, bankDetails: {}, signature: {}
  });

  const [quotation, setQuotation] = useState(() => {
    if (!id) {
      const draft = localStorage.getItem("previewDraft");
      return draft ? JSON.parse(draft) : getDefaultData();
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(!!id);

  useEffect(() => {
    if (id) {
      const fetchFromDB = async () => {
        setIsLoading(true);
        try {
          const res = await getQuotationById(id);
          setQuotation(res.data);
        } catch (error) {
          alert("Failed to load quotation from database. Showing default template.");
          setQuotation(getDefaultData());
        } finally {
          setIsLoading(false);
        }
      };
      fetchFromDB();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatNum = (num) => Number(num || 0).toFixed(2);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount || 0);
  };

  const totals = useMemo(() => {
    if (!quotation) return { totalLabour: 0, totalMaterial: 0, subtotal: 0, discountAmount: 0, finalAmount: 0 };
    const totalLabour = quotation.rateTable?.reduce((acc, row) => acc + (Number(row.labour) || 0), 0) || 0;
    const totalMaterial = quotation.rateTable?.reduce((acc, row) => acc + (Number(row.material) || 0), 0) || 0;
    const subtotal = quotation.rateTable?.reduce((acc, row) => acc + (Number(row.total) || 0), 0) || 0;
    const discountPercent = Number(quotation.pricing?.discount) || 0;
    const discountAmount = (subtotal * discountPercent) / 100;
    const finalAmount = id && quotation.pricing?.grandTotal ? quotation.pricing.grandTotal : (subtotal - discountAmount);
    return { totalLabour, totalMaterial, subtotal, discountPercent, discountAmount, finalAmount };
  }, [quotation, id]);

  if (isLoading || !quotation) {
    return (
      <div className="bg-[#f8fafc] min-h-screen flex ml-[250px] items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen font-sans text-gray-900 selection:bg-blue-200">
      
      {/* SIDEBAR (Hidden on Print) */}
      <div className="print:hidden fixed top-0 left-0 h-screen w-[250px] z-30 shadow-lg">
        <Sidebar 
          active="preview" 
          user={user} 
          goToDashboard={goToDashboard} 
          goToCreate={goToCreate || goBack} 
          goToPreview={() => {}} 
          goToExport={goToExport} 
          goToSubscription={goToSubscription}
          goToSettings={goToSettings} // 🔥 NOW PASSED CORRECTLY
          goToHelp={goToHelp}         // 🔥 NOW PASSED CORRECTLY
          goToEditProfile={goToEditProfile} 
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="ml-[250px] print:ml-0 h-screen flex flex-col relative print:bg-white print:h-auto">
        
        {/* ACTION BAR (Hidden on Print) */}
        <div className="print:hidden flex justify-between items-center px-10 py-5 bg-white sticky top-0 z-20 border-b border-gray-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Document Preview</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Review your document formatting before export</p>
          </div>
          <div className="flex items-center gap-3">
            {!id && (
              <button onClick={goBack} className="flex items-center gap-2 text-sm font-bold text-gray-700 bg-white border border-gray-300 px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-all shadow-sm">
                <Edit size={16} /> Edit Details
              </button>
            )}
            <button onClick={() => window.print()} className="flex items-center gap-2 text-sm font-bold text-gray-700 bg-white border border-gray-300 px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-all shadow-sm">
              <Printer size={16} /> Print Document
            </button>
            <button onClick={goToExport} className="flex items-center gap-2 text-sm font-bold bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-md">
              <Download size={16} /> Export / Share
            </button>
          </div>
        </div>

        {/* A4 DOCUMENT CANVAS */}
        <div className="flex-1 overflow-y-auto py-12 flex justify-center bg-slate-200 print:bg-white print:py-0 print:overflow-visible">
          
          {/* Actual A4 Page Container */}
          <div className="bg-white w-full max-w-[850px] min-h-[1122px] mx-auto p-16 sm:p-20 shadow-[0_10px_40px_rgba(0,0,0,0.08)] print:shadow-none print:w-full print:max-w-none print:p-0 print:m-0">
            
            {/* Header Component (Logo, Date, Subject, Letter) */}
            <PreviewHeader quotation={quotation} formatDate={formatDate} />
            
            {/* Rate Table Component (The strong 2-column table) */}
            <PreviewRateTable rateTable={quotation.rateTable} totals={totals} formatNum={formatNum} />
            
            {/* Terms, Total & Signatures Component */}
            <PreviewTerms quotation={quotation} totals={totals} formatCurrency={formatCurrency} />

          </div>
        </div>
        
      </div>
    </div>
  );
}