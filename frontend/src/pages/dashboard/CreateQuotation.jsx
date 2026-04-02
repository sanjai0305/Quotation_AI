import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import { 
  Building2, Ruler, CalendarClock, FileText, TableProperties, 
  Tag, CreditCard, Landmark, PenTool, Save, Eye, RotateCcw, 
  Plus, Trash2, CheckCircle2, AlertCircle, Image as ImageIcon,
  XCircle, X
} from "lucide-react";

// ==========================================
// 🔥 API FUNCTIONS
// ==========================================
const BASE_URL = "http://localhost:5000/api/quotations";

export const createQuotation = async (data) => {
  const token = localStorage.getItem("token"); 
  
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    },
    body: JSON.stringify(data),
  });
  const responseData = await res.json();
  return { ok: res.ok, data: responseData };
};

// 🔥 Function to Update existing quotation
export const updateQuotationAPI = async (id, data) => {
  const token = localStorage.getItem("token"); 
  
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    },
    body: JSON.stringify(data),
  });
  const responseData = await res.json();
  return { ok: res.ok, data: responseData };
};

// ==========================================
// 🔥 MAIN COMPONENT
// ==========================================
export default function CreateQuotation({
  goBack,
  goToPreview,
  goToExport,
  goToDashboard,
  setQuotationId,
  quotationId // 🚨 Passed from App.jsx to know if we're editing
}) {
  
  // 🔥 Reference for hidden file input
  const fileInputRef = useRef(null);

  const getInitialData = () => {
    const savedDraft = localStorage.getItem("previewDraft");
    if (savedDraft) {
      try {
        return JSON.parse(savedDraft);
      } catch (error) {
        console.error("Failed to parse saved draft:", error);
      }
    }
    return {
      projectDetails: { companyLogo: "", companyName: "", clientName: "", projectName: "", referenceNo: "", date: new Date().toISOString().split('T')[0], paintBrand: "Nippon Paint" },
      areaDetails: { interiorArea: "", exteriorArea: "" },
      coverLetter: { subject: "Paint Quote For", body: "Thank you for your purchase enquiry for the above mentioned site. Please find below our quotation for Material & Labour for this site." },
      rateTable: [
        { id: 1, work: "Surface Preparation, Wall Putty (3 Coats)", labour: 5, material: 3, total: 8 },
        { id: 2, work: "Primer (1 Coat)", labour: 1, material: 1, total: 2 },
        { id: 3, work: "Premium Emulsion (2 Coats)", labour: 3, material: 5, total: 8 },
        { id: 4, work: "Accessories", labour: 0, material: 1, total: 1 }
      ],
      pricing: { discount: "", warranty: "3" },
      timeline: { startDate: "", endDate: "" },
      textAreas: { 
        scopeOfWork: "1. Surface preparation including cleaning, scraping, and sanding\n2. Application of wall putty (as per specification)\n3. Application of primer coat\n4. Application of finish coats (as per specification)\n5. All necessary touch-ups and corrections", 
        exclusions: "1. Structural repairs or civil work\n2. Waterproofing treatment\n3. Texture finishes (unless specified)\n4. Furniture or fixture painting", 
        termsConditions: "1. Scaffolding must be provided by the client wherever rope scaffolding is not possible.\n2. If rework is required after texture completion, additional charges will apply.\n3. Rates are given as per existing square feet area. Final measurement taken after completion.\n4. The work order should be raised in the name of the applicator or authorized vendor." 
      },
      paymentTerms: { step1: "Advance (before mobilization)", step2: "Mid of the work", step3: "After successful completion" },
      paymentPercents: { p1: "50", p2: "30", p3: "20" },
      validity: "The price quoted here will be valid for 30 days from the date of issue or till further price increase in material, whichever is earlier.",
      bankDetails: { bankName: "", accountHolder: "", accountNumber: "", ifscCode: "", branch: "" },
      signature: { name: "", designation: "", phone: "", email: "" }
    };
  };

  const [formData, setFormData] = useState(getInitialData);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    localStorage.setItem("previewDraft", JSON.stringify(formData));
  }, [formData]);

  const totalLabour = formData.rateTable.reduce((acc, row) => acc + (Number(row.labour) || 0), 0);
  const totalMaterial = formData.rateTable.reduce((acc, row) => acc + (Number(row.material) || 0), 0);
  const totalSqft = formData.rateTable.reduce((acc, row) => acc + (Number(row.total) || 0), 0);

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  // 🔥 LOGO UPLOAD HANDLER
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setToast({ show: true, message: "Image size must be less than 2MB!", type: "error" });
      setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      handleNestedChange("projectDetails", "companyLogo", reader.result);
    };
  };

  // 🔥 REMOVE LOGO HANDLER
  const removeLogo = () => {
    handleNestedChange("projectDetails", "companyLogo", "");
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRateTableChange = (id, field, value) => {
    setFormData((prev) => {
      const newTable = prev.rateTable.map((row) => {
        if (row.id === id) {
          const updatedRow = { ...row, [field]: value };
          if (field === "labour" || field === "material") {
            updatedRow.total = (Number(updatedRow.labour) || 0) + (Number(updatedRow.material) || 0);
          }
          return updatedRow;
        }
        return row;
      });
      return { ...prev, rateTable: newTable };
    });
  };

  const addRateRow = () => {
    setFormData((prev) => ({
      ...prev,
      rateTable: [...prev.rateTable, { id: Date.now(), work: "", labour: 0, material: 0, total: 0 }]
    }));
  };

  const deleteRateRow = (id) => {
    setFormData((prev) => ({
      ...prev,
      rateTable: prev.rateTable.filter(row => row.id !== id)
    }));
  };

  // 🔥 UPDATED: Smooth Reset Logic (No Reload)
  const handleReset = () => {
    if(window.confirm("Are you sure you want to clear all data?")) {
       localStorage.removeItem("previewDraft"); 
       if (setQuotationId) setQuotationId(null); // Clear active ID
       
       // Manually reset state instead of reloading page
       setFormData({
         projectDetails: { companyLogo: "", companyName: "", clientName: "", projectName: "", referenceNo: "", date: new Date().toISOString().split('T')[0], paintBrand: "Nippon Paint" },
         areaDetails: { interiorArea: "", exteriorArea: "" },
         coverLetter: { subject: "Paint Quote For", body: "Thank you for your purchase enquiry for the above mentioned site. Please find below our quotation for Material & Labour for this site." },
         rateTable: [
           { id: 1, work: "Surface Preparation, Wall Putty (3 Coats)", labour: 5, material: 3, total: 8 },
           { id: 2, work: "Primer (1 Coat)", labour: 1, material: 1, total: 2 },
           { id: 3, work: "Premium Emulsion (2 Coats)", labour: 3, material: 5, total: 8 },
           { id: 4, work: "Accessories", labour: 0, material: 1, total: 1 }
         ],
         pricing: { discount: "", warranty: "3" },
         timeline: { startDate: "", endDate: "" },
         textAreas: { 
           scopeOfWork: "1. Surface preparation including cleaning, scraping, and sanding\n2. Application of wall putty (as per specification)\n3. Application of primer coat\n4. Application of finish coats (as per specification)\n5. All necessary touch-ups and corrections", 
           exclusions: "1. Structural repairs or civil work\n2. Waterproofing treatment\n3. Texture finishes (unless specified)\n4. Furniture or fixture painting", 
           termsConditions: "1. Scaffolding must be provided by the client wherever rope scaffolding is not possible.\n2. If rework is required after texture completion, additional charges will apply.\n3. Rates are given as per existing square feet area. Final measurement taken after completion.\n4. The work order should be raised in the name of the applicator or authorized vendor." 
         },
         paymentTerms: { step1: "Advance (before mobilization)", step2: "Mid of the work", step3: "After successful completion" },
         paymentPercents: { p1: "50", p2: "30", p3: "20" },
         validity: "The price quoted here will be valid for 30 days from the date of issue or till further price increase in material, whichever is earlier.",
         bankDetails: { bankName: "", accountHolder: "", accountNumber: "", ifscCode: "", branch: "" },
         signature: { name: "", designation: "", phone: "", email: "" }
       });

       setToast({ show: true, message: "Form cleared successfully!", type: "success" });
       setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    }
  };

  // 🔥 Save Logic (Create vs Update)
  const handleSave = async () => {
    if (!formData.projectDetails.clientName.trim()) {
      setToast({ show: true, message: "Client Name is required!", type: "error" });
      setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
      return;
    }

    setIsSaving(true);
    try {
      let response;
      
      // Check if we are updating an existing quote or creating a new one
      if (quotationId) {
        response = await updateQuotationAPI(quotationId, formData);
      } else {
        response = await createQuotation(formData);
      }
      
      if (response.ok) {
        setToast({ 
          show: true, 
          message: quotationId ? "Quotation updated successfully!" : "Quotation saved successfully!", 
          type: "success" 
        });
        
        const newId = response.data?._id || response.data?.data?._id;
        if (setQuotationId && newId) {
          setQuotationId(newId);
        }
      } else {
        setToast({ show: true, message: response.data?.message || "Failed to save quotation.", type: "error" });
      }
    } catch (error) {
      console.error(error);
      setToast({ show: true, message: "Server error! Saved to Drafts.", type: "error" });
    } finally {
      setIsSaving(false);
      setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    }
  };

  const inputStyle = "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";
  const labelStyle = "block text-xs font-bold text-gray-700 mb-1.5";
  const cardStyle = "bg-white rounded-2xl p-7 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 mb-6";
  const sectionHeaderStyle = "flex items-start gap-3 mb-6 pb-4 border-b border-gray-50";

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans selection:bg-blue-100">
      
      {toast.show && (
        <div className={`fixed top-20 right-8 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          <span className="font-semibold text-sm">{toast.message}</span>
        </div>
      )}

      <div className="fixed top-0 left-0 h-screen w-[250px] z-30 shadow-md">
        <Sidebar active="create" goToDashboard={goToDashboard} goToCreate={() => {}} goToPreview={goToPreview} goToExport={goToExport} />
      </div>

      <div className="ml-[250px] h-screen flex flex-col">
        
        <div className="flex justify-between items-center px-8 py-5 bg-white sticky top-0 z-20 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {quotationId ? "Edit Quotation" : "Create Quotation"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">Build a professional quotation with AI-powered suggestions</p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handleReset} className="flex items-center gap-2 text-sm font-semibold text-gray-600 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"><RotateCcw size={16}/> Reset</button>
            <button onClick={goToPreview} className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 px-5 py-2 rounded-lg hover:bg-gray-50 shadow-sm transition-colors"><Eye size={16}/> Preview</button>
            <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 text-sm font-bold bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow-sm transition-colors disabled:opacity-70">
              {isSaving ? "Saving..." : (
                <><Save size={16}/> {quotationId ? "Update Quote" : "Save Quote"}</>
              )}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 max-w-5xl mx-auto w-full pb-24">
          
          {/* PROJECT DETAILS CARD */}
          <div className={cardStyle}>
            <div className={sectionHeaderStyle}>
              <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><Building2 size={20}/></div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 leading-none">Project Details</h2>
                <p className="text-sm text-gray-500 mt-1.5">Company, client and project info</p>
              </div>
            </div>

            {/* 🔥 INTERACTIVE LOGO UPLOAD SECTION */}
            <div className="mb-6">
              <label className={labelStyle}>Company Logo</label>
              
              <input 
                type="file" 
                accept="image/png, image/jpeg, image/jpg" 
                ref={fileInputRef}
                className="hidden" 
                onChange={handleLogoUpload} 
              />

              {formData.projectDetails.companyLogo ? (
                <div className="relative w-48 h-24 border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center group">
                  <img src={formData.projectDetails.companyLogo} alt="Logo" className="w-full h-full object-contain p-2" />
                  <button 
                    onClick={removeLogo}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove Logo"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="w-80 border-2 border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-center gap-3 bg-gray-50 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 cursor-pointer transition-all"
                >
                  <ImageIcon size={20} className="text-gray-400 group-hover:text-blue-500"/>
                  <span className="text-sm text-gray-500 font-medium">Upload Logo (PNG, JPG — max 2MB)</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div><label className={labelStyle}>Company Name</label><input className={inputStyle} placeholder="Enter your company name" value={formData.projectDetails.companyName} onChange={(e) => handleNestedChange("projectDetails", "companyName", e.target.value)} /></div>
              <div><label className={labelStyle}>Client Name</label><input className={inputStyle} placeholder="Enter client name" value={formData.projectDetails.clientName} onChange={(e) => handleNestedChange("projectDetails", "clientName", e.target.value)} /></div>
              <div><label className={labelStyle}>Project Name</label><input className={inputStyle} placeholder="Enter project name" value={formData.projectDetails.projectName} onChange={(e) => handleNestedChange("projectDetails", "projectName", e.target.value)} /></div>
              <div><label className={labelStyle}>Reference No.</label><input className={inputStyle} placeholder="e.g., PW-2025-001" value={formData.projectDetails.referenceNo} onChange={(e) => handleNestedChange("projectDetails", "referenceNo", e.target.value)} /></div>
              <div><label className={labelStyle}>Date</label><input type="date" className={inputStyle} value={formData.projectDetails.date} onChange={(e) => handleNestedChange("projectDetails", "date", e.target.value)} /></div>
              <div>
                <label className={labelStyle}>Brand Specification</label>
                <select className={inputStyle} value={formData.projectDetails.paintBrand} onChange={(e) => handleNestedChange("projectDetails", "paintBrand", e.target.value)}>
                  <option value="Nippon Paint">Nippon Paint</option>
                  <option value="Asian Paints">Asian Paints</option>
                  <option value="Berger Paints">Berger Paints</option>
                  <option value="Dulux">Dulux</option>
                </select>
              </div>
            </div>
          </div>

          {/* AREA DETAILS & COVER LETTER */}
          <div className="space-y-6 mb-6">
            <div className={cardStyle + " mb-0"}>
              <div className={sectionHeaderStyle}>
                <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><Ruler size={20}/></div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 leading-none">Area Details</h2>
                  <p className="text-sm text-gray-500 mt-1.5">Total interior & exterior sqft</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div><label className={labelStyle}>Total Interior Area (Sqft)</label><input type="number" className={inputStyle} placeholder="0" value={formData.areaDetails.interiorArea} onChange={(e) => handleNestedChange("areaDetails", "interiorArea", e.target.value)} /></div>
                <div><label className={labelStyle}>Total Exterior Area (Sqft)</label><input type="number" className={inputStyle} placeholder="0" value={formData.areaDetails.exteriorArea} onChange={(e) => handleNestedChange("areaDetails", "exteriorArea", e.target.value)} /></div>
              </div>
            </div>

            <div className={cardStyle + " mb-0"}>
               <div className={sectionHeaderStyle}>
                <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><FileText size={20}/></div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 leading-none">Cover Letter</h2>
                  <p className="text-sm text-gray-500 mt-1.5">Subject and introductory message</p>
                </div>
              </div>
              <div className="space-y-4">
                <div><label className={labelStyle}>Subject</label><input className={inputStyle} value={formData.coverLetter.subject} onChange={(e) => handleNestedChange("coverLetter", "subject", e.target.value)} /></div>
                <div><label className={labelStyle}>Body</label><textarea rows={2} className={`${inputStyle} resize-y`} value={formData.coverLetter.body} onChange={(e) => handleNestedChange("coverLetter", "body", e.target.value)} /></div>
              </div>
            </div>
          </div>

          {/* RATE TABLE */}
          <div className={cardStyle}>
            <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><TableProperties size={20}/></div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 leading-none">Rate Table (Labour + Material)</h2>
                  <p className="text-sm text-gray-500 mt-1.5">Detailed breakdown per sqft for each section</p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-gray-700 font-bold">
                    <th className="py-4 px-5">Work</th>
                    <th className="py-4 px-5 text-center">Labour (₹)</th>
                    <th className="py-4 px-5 text-center">Material (₹)</th>
                    <th className="py-4 px-5 text-right">Total/Sqft (₹)</th>
                    <th className="w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {formData.rateTable.map((row) => (
                    <tr key={row.id} className="group bg-white hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-5"><input className="w-full bg-transparent outline-none text-gray-800" value={row.work} onChange={(e) => handleRateTableChange(row.id, "work", e.target.value)} /></td>
                      <td className="py-3 px-5"><input type="number" className="w-full text-center bg-transparent outline-none text-gray-800" value={row.labour} onChange={(e) => handleRateTableChange(row.id, "labour", e.target.value)} /></td>
                      <td className="py-3 px-5"><input type="number" className="w-full text-center bg-transparent outline-none text-gray-800" value={row.material} onChange={(e) => handleRateTableChange(row.id, "material", e.target.value)} /></td>
                      <td className="py-3 px-5 text-right font-bold text-gray-900">{row.total.toFixed(2)}</td>
                      <td className="py-3 px-4"><button onClick={() => deleteRateRow(row.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button></td>
                    </tr>
                  ))}
                  {/* TOTALS ROW */}
                  <tr className="bg-gray-50/50 font-bold text-gray-900 border-t-2 border-gray-100">
                    <td className="py-4 px-5">Total</td>
                    <td className="py-4 px-5 text-center">{totalLabour.toFixed(2)}</td>
                    <td className="py-4 px-5 text-center">{totalMaterial.toFixed(2)}</td>
                    <td className="py-4 px-5 text-right">{totalSqft.toFixed(2)}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
              <div className="bg-white border-t border-gray-200">
                <button onClick={addRateRow} className="w-full py-4 text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center px-5 gap-2 transition-colors">
                  <Plus size={16}/> Add Work Item
                </button>
              </div>
            </div>
          </div>

          {/* PRICING & TIMELINE */}
          <div className="space-y-6 mb-6">
            <div className={cardStyle + " mb-0"}>
              <div className={sectionHeaderStyle}>
                <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><Tag size={20}/></div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 leading-none">Pricing</h2>
                  <p className="text-sm text-gray-500 mt-1.5">Discount and warranty details</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div><label className={labelStyle}>Discount (%)</label><input type="number" className={inputStyle} value={formData.pricing.discount} onChange={(e) => handleNestedChange("pricing", "discount", e.target.value)} /></div>
                <div><label className={labelStyle}>Warranty (Years)</label><input type="text" className={inputStyle} value={formData.pricing.warranty} onChange={(e) => handleNestedChange("pricing", "warranty", e.target.value)} /></div>
              </div>
            </div>
            
            <div className={cardStyle + " mb-0"}>
              <div className={sectionHeaderStyle}>
                <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><CalendarClock size={20}/></div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 leading-none">Project Timeline</h2>
                  <p className="text-sm text-gray-500 mt-1.5">Start and completion dates</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div><label className={labelStyle}>Start Date</label><input type="date" className={inputStyle} value={formData.timeline.startDate} onChange={(e) => handleNestedChange("timeline", "startDate", e.target.value)} /></div>
                <div><label className={labelStyle}>Completion Date</label><input type="date" className={inputStyle} value={formData.timeline.endDate} onChange={(e) => handleNestedChange("timeline", "endDate", e.target.value)} /></div>
              </div>
            </div>
          </div>

          {/* TEXT AREAS */}
          <div className="space-y-6 mb-6">
            {[
              { id: "scopeOfWork", title: "Scope of Work", icon: <FileText size={20}/> },
              { id: "exclusions", title: "Exclusions", icon: <XCircle size={20}/> },
              { id: "termsConditions", title: "Terms & Conditions", icon: <PenTool size={20}/> },
            ].map((item) => (
              <div key={item.id} className={cardStyle + " mb-0"}>
                <div className={sectionHeaderStyle}>
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-500">{item.icon}</div>
                  <h2 className="text-lg font-bold text-gray-900 leading-none mt-1">{item.title}</h2>
                </div>
                <textarea rows={5} className={`${inputStyle} resize-y text-gray-600`} value={formData.textAreas[item.id]} onChange={(e) => handleNestedChange("textAreas", item.id, e.target.value)} />
              </div>
            ))}
          </div>

          {/* PAYMENT TERMS */}
          <div className={cardStyle}>
            <div className={sectionHeaderStyle}>
              <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><CreditCard size={20}/></div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 leading-none">Payment Terms</h2>
                <p className="text-sm text-gray-500 mt-1.5">Stage-wise payment breakup</p>
              </div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 items-center">
                  <input className={inputStyle} value={formData.paymentTerms[`step${i}`]} onChange={(e) => handleNestedChange("paymentTerms", `step${i}`, e.target.value)} />
                  <div className="relative w-32 shrink-0">
                    <input type="number" className={inputStyle + " pr-8 text-center"} value={formData.paymentPercents[`p${i}`]} onChange={(e) => handleNestedChange("paymentPercents", `p${i}`, e.target.value)} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">%</span>
                  </div>
                  <button className="text-gray-400 hover:text-red-500 p-2"><Trash2 size={18}/></button>
                </div>
              ))}
              <button className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 mt-2">
                <Plus size={16}/> Add Stage
              </button>
            </div>
          </div>

          {/* VALIDITY CLAUSE */}
          <div className={cardStyle}>
            <div className={sectionHeaderStyle}>
              <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><CalendarClock size={20}/></div>
              <h2 className="text-lg font-bold text-gray-900 leading-none mt-1">Validity Clause</h2>
            </div>
            <textarea rows={2} className={`${inputStyle} resize-none text-gray-600`} value={formData.validity} onChange={(e) => setFormData(prev => ({ ...prev, validity: e.target.value }))} />
          </div>

          {/* BANK DETAILS & SIGNATURE */}
          <div className="space-y-6">
            <div className={cardStyle + " mb-0"}>
              <div className={sectionHeaderStyle}>
                <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><Landmark size={20}/></div>
                <h2 className="text-lg font-bold text-gray-900 leading-none mt-1">Bank Details</h2>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                <div><label className={labelStyle}>Bank Name</label><input className={inputStyle} placeholder="Bank Name" value={formData.bankDetails.bankName} onChange={(e) => handleNestedChange("bankDetails", "bankName", e.target.value)} /></div>
                <div><label className={labelStyle}>A/C Holder Name</label><input className={inputStyle} placeholder="Account Holder" value={formData.bankDetails.accountHolder} onChange={(e) => handleNestedChange("bankDetails", "accountHolder", e.target.value)} /></div>
                <div><label className={labelStyle}>Account Number</label><input className={inputStyle} placeholder="Account Number" value={formData.bankDetails.accountNumber} onChange={(e) => handleNestedChange("bankDetails", "accountNumber", e.target.value)} /></div>
                <div><label className={labelStyle}>IFSC Code</label><input className={inputStyle} placeholder="IFSC Code" value={formData.bankDetails.ifscCode} onChange={(e) => handleNestedChange("bankDetails", "ifscCode", e.target.value)} /></div>
              </div>
            </div>

            <div className={cardStyle + " mb-0"}>
              <div className={sectionHeaderStyle}>
                <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><PenTool size={20}/></div>
                <h2 className="text-lg font-bold text-gray-900 leading-none mt-1">Signature & Contact</h2>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                <div><label className={labelStyle}>Signatory Name</label><input className={inputStyle} placeholder="Name" value={formData.signature.name} onChange={(e) => handleNestedChange("signature", "name", e.target.value)} /></div>
                <div><label className={labelStyle}>Designation</label><input className={inputStyle} placeholder="Designation" value={formData.signature.designation} onChange={(e) => handleNestedChange("signature", "designation", e.target.value)} /></div>
                <div><label className={labelStyle}>Phone</label><input className={inputStyle} placeholder="Phone number" value={formData.signature.phone} onChange={(e) => handleNestedChange("signature", "phone", e.target.value)} /></div>
                <div><label className={labelStyle}>Email</label><input className={inputStyle} placeholder="Email address" value={formData.signature.email} onChange={(e) => handleNestedChange("signature", "email", e.target.value)} /></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}