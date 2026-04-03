import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";

// 🔥 IMPORT TEMPLATE SELECTOR & ALL TEMPLATES
import TemplateSelector from "../../components/theme/TemplateSelector";
import ClassicTemplate from "../../components/theme/ClassicTemplate";
import ModernTemplate from "../../components/theme/ModernTemplate";
import CorporateTemplate from "../../components/theme/CorporateTemplate";
import CompactTemplate from "../../components/theme/CompactTemplate";
import CreativeTemplate from "../../components/theme/CreativeTemplate";

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
  goToSettings,
  goToHelp,
  goToEditProfile, 
  goToCreate 
}) {
  const { id } = useParams(); 

  // UI States
  const [selectedTemplate, setSelectedTemplate] = useState("classic"); // Default Template
  const [isLoading, setIsLoading] = useState(!!id);

  // Default Data Structure
  const getDefaultData = () => ({
    projectDetails: { companyName: "Your Company", clientName: "Client Name", date: new Date().toISOString() },
    areaDetails: {}, coverLetter: {}, rateTable: [], pricing: { grandTotal: 0, discount: 0 }, textAreas: {}, paymentTerms: {}, paymentPercents: {}, bankDetails: {}, signature: {}
  });

  const [quotation, setQuotation] = useState(() => {
    if (!id) {
      const draft = localStorage.getItem("previewDraft");
      return draft ? JSON.parse(draft) : getDefaultData();
    }
    return null;
  });

  // Fetch from DB if ID exists
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

  // Utility Functions
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatNum = (num) => Number(num || 0).toFixed(2);

  // Totals Calculation
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

  // 🔥 MAP DB DATA TO TEMPLATE FORMAT
  // This ensures all our new templates get the data in the exact format they expect
  const mappedData = useMemo(() => {
    if (!quotation) return null;
    return {
      companyName: quotation.projectDetails?.companyName || "Your Company",
      companyPhone: quotation.projectDetails?.companyPhone || "+91 XXXXX XXXXX",
      companyEmail: quotation.projectDetails?.companyEmail || "email@company.com",
      clientName: quotation.projectDetails?.clientName || "Client Name",
      clientAddress: quotation.projectDetails?.clientAddress || "Client Address",
      quotationNo: quotation.projectDetails?.referenceNo || `QTN-${Math.floor(Math.random() * 10000)}`,
      date: formatDate(quotation.projectDetails?.date),
      items: quotation.rateTable?.map(item => ({
        desc: item.workDescription || item.description,
        labour: formatNum(item.labour),
        material: formatNum(item.material),
        total: formatNum(item.total)
      })) || [],
      subtotal: formatNum(totals.subtotal),
      tax: "0.00", // Update this if you have tax logic
      grandTotal: formatNum(totals.finalAmount),
      terms: quotation.textAreas?.termsAndConditions 
        ? quotation.textAreas.termsAndConditions.split('\n').filter(t => t.trim() !== '') 
        : ["Payment should be made 50% in advance.", "Work will commence upon receiving the advance."],
      bankDetails: {
        bankName: quotation.bankDetails?.bankName || "Bank Name",
        accNo: quotation.bankDetails?.accountNumber || "XXXX XXXX XXXX",
        ifsc: quotation.bankDetails?.ifscCode || "XXXX0000000"
      }
    };
  }, [quotation, totals]);

  // 🔥 DYNAMIC TEMPLATE RENDERER
  const renderTemplate = () => {
    if (!mappedData) return null;
    const props = { data: mappedData };

    switch (selectedTemplate) {
      case "modern": return <ModernTemplate {...props} />;
      case "corporate": return <CorporateTemplate {...props} />;
      case "compact": return <CompactTemplate {...props} />;
      case "creative": return <CreativeTemplate {...props} />;
      case "classic":
      default: return <ClassicTemplate {...props} />;
    }
  };

  // Loading State
  if (isLoading || !quotation) {
    return (
      <div className="bg-[#f8fafc] min-h-screen flex ml-[250px] items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen font-sans text-gray-900 selection:bg-blue-200 flex">
      
      {/* 🧭 SIDEBAR (Hidden on Print) */}
      <div className="print:hidden w-[250px] shrink-0 z-30 shadow-lg border-r border-slate-800/60 bg-[#0B1120]">
        <Sidebar 
          active="preview" 
          user={user} 
          goToDashboard={goToDashboard} 
          goToCreate={goToCreate || goBack} 
          goToPreview={() => {}} 
          goToExport={goToExport} 
          goToSubscription={goToSubscription}
          goToSettings={goToSettings} 
          goToHelp={goToHelp}         
          goToEditProfile={goToEditProfile} 
        />
      </div>

      {/* 💻 MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative print:h-auto print:overflow-visible">
        
        {/* 🔥 NEW: TEMPLATE SELECTOR (Replaces Action Bar) */}
        <TemplateSelector 
          selected={selectedTemplate} 
          onSelect={setSelectedTemplate} 
          onPrint={() => window.print()}
          onExport={goToExport}
          onEdit={goBack}
        />

        {/* 📄 A4 DOCUMENT CANVAS */}
        <div className="flex-1 overflow-y-auto py-12 flex justify-center bg-slate-200 print:bg-white print:py-0 print:overflow-visible no-scrollbar">
          
          {/* Shadow wrapper for the template */}
          <div className="w-full max-w-[210mm] mx-auto shadow-2xl print:shadow-none print:w-full print:max-w-none transition-all duration-500">
            {renderTemplate()}
          </div>
          
        </div>
        
      </div>
    </div>
  );
}