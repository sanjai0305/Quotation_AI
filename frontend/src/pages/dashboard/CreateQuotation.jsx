import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import { Save, Eye, RotateCcw, CheckCircle2, XCircle, Loader2 } from "lucide-react";

// 🔥 IMPORT OUR NEW MODULAR COMPONENTS
import ProjectDetailsForm from "../../components/quotation/ProjectDetailsForm";
import RateTableForm from "../../components/quotation/RateTableForm";
import TermsPaymentForm from "../../components/quotation/TermsPaymentForm";

const BASE_URL = "http://localhost:5000/api/quotations";

export const createQuotation = async (data) => {
  const token = localStorage.getItem("token"); 
  const res = await fetch(BASE_URL, { 
    method: "POST", 
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, 
    body: JSON.stringify(data) 
  });
  return { ok: res.ok, data: await res.json() };
};

export const updateQuotationAPI = async (id, data) => {
  const token = localStorage.getItem("token"); 
  const res = await fetch(`${BASE_URL}/${id}`, { 
    method: "PUT", 
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, 
    body: JSON.stringify(data) 
  });
  return { ok: res.ok, data: await res.json() };
};

export default function CreateQuotation({ 
  user, 
  goBack, 
  goToPreview, 
  goToExport, 
  goToDashboard, 
  goToSubscription, 
  goToSettings,
  goToHelp, // 🔥 NEW: Added Help Prop
  goToEditProfile, 
  setQuotationId, 
  quotationId 
}) {
  const fileInputRef = useRef(null);

  const getInitialData = () => {
    const savedDraft = localStorage.getItem("previewDraft");
    if (savedDraft) {
      try { return JSON.parse(savedDraft); } catch (error) { console.error(error); }
    }
    return {
      projectDetails: { companyLogo: "", companyName: "", clientName: "", projectName: "", referenceNo: "", date: new Date().toISOString().split('T')[0], paintBrand: "Nippon Paint" },
      areaDetails: { interiorArea: "", exteriorArea: "" },
      coverLetter: { subject: "Paint Quote For", body: "Thank you for your purchase enquiry for the above mentioned site. Please find below our quotation for Material & Labour for this site." },
      rateTable: [
        { id: 1, work: "Surface Preparation, Wall Putty (3 Coats)", labour: 5, material: 3, total: 8 },
        { id: 2, work: "Primer (1 Coat)", labour: 1, material: 1, total: 2 },
      ],
      pricing: { discount: "", warranty: "3" },
      timeline: { startDate: "", endDate: "" },
      textAreas: { scopeOfWork: "", exclusions: "", termsConditions: "" },
      paymentTerms: { step1: "Advance", step2: "Mid Work", step3: "Completion" },
      paymentPercents: { p1: "50", p2: "30", p3: "20" },
      validity: "The price quoted here will be valid for 30 days from the date of issue.",
      bankDetails: { bankName: "", accountHolder: "", accountNumber: "", ifscCode: "", branch: "" },
      signature: { name: "", designation: "", phone: "", email: "" }
    };
  };

  const [formData, setFormData] = useState(getInitialData);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => localStorage.setItem("previewDraft", JSON.stringify(formData)), [formData]);

  const totalLabour = formData.rateTable.reduce((acc, row) => acc + (Number(row.labour) || 0), 0);
  const totalMaterial = formData.rateTable.reduce((acc, row) => acc + (Number(row.material) || 0), 0);
  const totalSqft = formData.rateTable.reduce((acc, row) => acc + (Number(row.total) || 0), 0);

  const handleNestedChange = (section, field, value) => setFormData((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return showToast("Image size must be less than 2MB!", "error");
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => handleNestedChange("projectDetails", "companyLogo", reader.result);
  };

  const removeLogo = () => { handleNestedChange("projectDetails", "companyLogo", ""); if(fileInputRef.current) fileInputRef.current.value = ""; };

  const handleRateTableChange = (id, field, value) => {
    setFormData((prev) => {
      const newTable = prev.rateTable.map((row) => {
        if (row.id === id) {
          const updatedRow = { ...row, [field]: value };
          if (field === "labour" || field === "material") updatedRow.total = (Number(updatedRow.labour) || 0) + (Number(updatedRow.material) || 0);
          return updatedRow;
        }
        return row;
      });
      return { ...prev, rateTable: newTable };
    });
  };

  const addRateRow = () => setFormData((prev) => ({ ...prev, rateTable: [...prev.rateTable, { id: Date.now(), work: "", labour: 0, material: 0, total: 0 }] }));
  const deleteRateRow = (id) => setFormData((prev) => ({ ...prev, rateTable: prev.rateTable.filter(row => row.id !== id) }));

  const showToast = (msg, type) => { setToast({ show: true, message: msg, type }); setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000); };

  const handleSave = async () => {
    if (!formData.projectDetails.clientName.trim()) return showToast("Client Name is required!", "error");
    setIsSaving(true);
    try {
      const response = quotationId ? await updateQuotationAPI(quotationId, formData) : await createQuotation(formData);
      if (response.ok) {
        showToast(quotationId ? "Quotation updated successfully!" : "Quotation saved successfully!", "success");
        const newId = response.data?._id || response.data?.data?._id;
        if (setQuotationId && newId) setQuotationId(newId);
      } else {
        showToast(response.data?.message || "Failed to save quotation.", "error");
      }
    } catch (error) {
      showToast("Server error! Saved to Drafts.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-slate-50 to-slate-100 min-h-screen font-sans selection:bg-blue-200">
      
      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div className={`fixed top-24 right-8 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in border ${toast.type === 'success' ? 'bg-white border-emerald-100 text-emerald-700' : 'bg-white border-red-100 text-red-700'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
          <span className="font-bold text-sm">{toast.message}</span>
        </div>
      )}

      {/* SIDEBAR */}
      <div className="fixed top-0 left-0 h-screen w-[250px] z-30 shadow-[4px_0_24px_rgba(0,0,0,0.04)]">
        <Sidebar 
          active="create" 
          user={user} 
          goToDashboard={goToDashboard} 
          goToCreate={() => {}} 
          goToPreview={goToPreview} 
          goToExport={goToExport} 
          goToSubscription={goToSubscription}
          goToSettings={goToSettings} 
          goToHelp={goToHelp} // 🔥 PERFECTLY PASSED TO SIDEBAR
          goToEditProfile={goToEditProfile} 
        />
      </div>

      <div className="ml-[250px] h-screen flex flex-col relative">
        
        {/* PREMIUM HEADER */}
        <div className="flex justify-between items-center px-10 py-6 bg-white/70 backdrop-blur-xl sticky top-0 z-20 border-b border-slate-200/60 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              {quotationId ? "Edit Quotation" : "Create Quotation"}
              {quotationId && <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-1 rounded-md uppercase tracking-wider font-bold">Editing Mode</span>}
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Build a professional quotation with ease</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { if(window.confirm("Clear all data?")) { localStorage.removeItem("previewDraft"); window.location.reload(); } }} 
              className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-red-500 px-4 py-2.5 rounded-xl transition-colors group"
            >
              <RotateCcw size={16} className="group-hover:-rotate-180 transition-transform duration-500" /> Reset
            </button>
            
            <button 
              onClick={goToPreview} 
              className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-white border border-slate-200/80 px-6 py-2.5 rounded-xl hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all hover:-translate-y-0.5"
            >
              <Eye size={16} className="text-slate-400" /> Preview
            </button>
            
            <button 
              onClick={handleSave} 
              disabled={isSaving} 
              className={`flex items-center gap-2 text-sm font-bold text-white px-8 py-2.5 rounded-xl shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0
                ${isSaving ? 'bg-indigo-400 cursor-wait' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/30'}`}
            >
              {isSaving ? (
                <> <Loader2 size={18} className="animate-spin"/> Saving... </>
              ) : (
                <> <Save size={18}/> {quotationId ? "Update Quote" : "Save Quote"} </>
              )}
            </button>
          </div>
        </div>

        {/* MAIN FORM AREA */}
        <div className="flex-1 overflow-y-auto p-10 max-w-5xl mx-auto w-full pb-32">
          
          <div className="space-y-8 animate-fade-in-up">
            <ProjectDetailsForm 
              formData={formData} 
              handleNestedChange={handleNestedChange} 
              handleLogoUpload={handleLogoUpload} 
              removeLogo={removeLogo} 
              fileInputRef={fileInputRef} 
            />
            
            <RateTableForm 
              formData={formData} 
              handleRateTableChange={handleRateTableChange} 
              addRateRow={addRateRow} 
              deleteRateRow={deleteRateRow} 
              totalLabour={totalLabour} 
              totalMaterial={totalMaterial} 
              totalSqft={totalSqft} 
            />
            
            <TermsPaymentForm 
              formData={formData} 
              handleNestedChange={handleNestedChange} 
              setFormData={setFormData} 
            />
          </div>

        </div>
      </div>
    </div>
  );
}