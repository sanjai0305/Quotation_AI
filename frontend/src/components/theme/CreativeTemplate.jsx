import React from "react";
import { Palette, Sparkles, MapPin, Phone, Mail } from "lucide-react";

export default function CreativeTemplate({ data }) {
  // 🛑 Fallback Data (Updated for multi-section UI testing)
  const quote = data || {
    companyName: "VisionX Studio",
    companyEmail: "hello@visionx.tech",
    companyPhone: "+91 98765 43210",
    clientName: "Arjun Kumar",
    clientAddress: "123, Tech Park, Chennai",
    quotationNo: "QTN-2026-001",
    date: "03-04-2026",
    sections: [
      {
        title: "Phase 1: Design Concept",
        items: [
          { desc: "Creative UI/UX Design (Website)", labour: "15.00", material: "0.00", total: "15.00" },
          { desc: "Brand Identity & Logo Design", labour: "10.00", material: "0.00", total: "10.00" },
        ],
        sectionTotal: "25.00"
      },
      {
        title: "Phase 2: Marketing Assets",
        items: [
          { desc: "Social Media Assets (10 Posts)", labour: "5.00", material: "2.00", total: "7.00" }
        ],
        sectionTotal: "7.00"
      }
    ],
    subtotal: "32.00",
    tax: "0.00",
    discount: "0.00",
    grandTotal: "32.00",
    terms: ["50% advance payment required to initiate the project.", "3 revisions included per design deliverable."],
    bankDetails: { bankName: "HDFC Bank", accNo: "50100234567890", ifsc: "HDFC0001234", accHolder: "VisionX Studio" }
  };

  // Safe check if sections exist
  const sectionsToRender = quote.sections && quote.sections.length > 0 
    ? quote.sections 
    : [{ title: "Deliverables", items: quote.items || [], sectionTotal: quote.subtotal }];

  const safeFormat = (val) => {
    const num = Number(val);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  return (
    <div className="bg-white min-h-[297mm] text-gray-800 font-sans relative overflow-hidden">
      
      {/* 🎨 BACKGROUND DECORATIVE ELEMENTS (Creative Touch) */}
      <div className="absolute top-[-150px] right-[-150px] w-[500px] h-[500px] bg-gradient-to-br from-purple-400 to-fuchsia-400 rounded-full opacity-10 blur-[80px] pointer-events-none print:hidden"></div>
      <div className="absolute bottom-[-100px] left-[-100px] w-[300px] h-[300px] bg-gradient-to-tr from-blue-400 to-emerald-400 rounded-full opacity-10 blur-[60px] pointer-events-none print:hidden"></div>

      {/* 🔮 TOP HEADER (Split Style) */}
      <div className="flex flex-col md:flex-row min-h-[220px] print-avoid-break">
        
        {/* Left: Branding Block */}
        <div className="bg-gray-900 text-white p-10 flex-1 rounded-br-[80px] relative overflow-hidden shadow-xl z-10 print:!bg-gray-900 print:!text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
          
          <div className="flex items-center gap-4 mb-6">
            {quote.companyLogo ? (
              <img src={quote.companyLogo} alt="Logo" className="w-14 h-14 object-contain rounded-2xl bg-white p-1 shadow-lg" />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-2xl flex items-center justify-center text-white shadow-lg print:border print:border-gray-700">
                 <Palette size={24} />
              </div>
            )}
            <h1 className="text-3xl font-black tracking-tight">{quote.companyName}</h1>
          </div>

          <div className="space-y-1.5 text-gray-300 text-sm font-medium">
            <p className="flex items-center gap-2"><Phone size={14} className="text-purple-400"/> {quote.companyPhone}</p>
            <p className="flex items-center gap-2"><Mail size={14} className="text-fuchsia-400"/> {quote.companyEmail}</p>
          </div>
        </div>

        {/* Right: Quote Meta */}
        <div className="p-10 flex-1 flex flex-col justify-center items-end text-right z-10">
          <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-fuchsia-600 tracking-tighter uppercase mb-4 print:text-purple-700">
            Estimate
          </h2>
          <div className="space-y-1">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Quote No.</p>
            <p className="text-lg font-black text-gray-800">{quote.quotationNo}</p>
          </div>
          <div className="space-y-1 mt-4">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Date</p>
            <p className="text-sm font-bold text-gray-800">{quote.date}</p>
          </div>
        </div>
      </div>

      <div className="px-10 pb-10 pt-4 relative z-10">
        
        {/* 👤 CLIENT DETAILS (Floating Card) */}
        <div className="bg-white/60 backdrop-blur-sm border border-gray-100 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-10 inline-block min-w-[300px] print-avoid-break">
          <p className="text-xs font-black text-purple-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Sparkles size={14}/> Prepared For
          </p>
          <h3 className="text-2xl font-black text-gray-900 mb-2">{quote.clientName}</h3>
          <p className="text-sm text-gray-500 font-medium flex items-start gap-1.5 max-w-sm">
             <MapPin size={16} className="shrink-0 mt-0.5 text-gray-400"/> {quote.clientAddress}
          </p>
        </div>

        {/* 📊 ITEMS TABLE (Multiple Sections mapped) */}
        <div className="mb-10 space-y-10">
          {sectionsToRender.map((section, secIdx) => (
            <div key={secIdx} className="print-avoid-break">
              
              {/* Creative Section Title */}
              <div className="flex items-center gap-4 mb-4">
                <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest px-4 py-2 bg-purple-50 text-purple-700 rounded-xl inline-block">
                  {section.title}
                </h4>
                <div className="flex-1 border-b border-gray-100 border-dashed"></div>
              </div>

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="py-4 px-2 border-b-2 border-gray-900 text-xs font-black text-gray-900 uppercase tracking-widest">Description</th>
                    <th className="py-4 px-2 border-b-2 border-gray-900 text-xs font-black text-gray-900 uppercase tracking-widest text-center w-24">Labour</th>
                    <th className="py-4 px-2 border-b-2 border-gray-900 text-xs font-black text-gray-900 uppercase tracking-widest text-center w-24">Material</th>
                    <th className="py-4 px-2 border-b-2 border-gray-900 text-xs font-black text-gray-900 uppercase tracking-widest text-right w-32">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {section.items && section.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 border-dashed hover:bg-gray-50/50 transition-colors">
                      <td className="py-5 px-2 text-sm font-bold text-gray-800 whitespace-pre-wrap">{item.desc}</td>
                      <td className="py-5 px-2 text-sm text-gray-500 text-center font-medium">{safeFormat(item.labour)}</td>
                      <td className="py-5 px-2 text-sm text-gray-500 text-center font-medium">{safeFormat(item.material)}</td>
                      <td className="py-5 px-2 text-base font-black text-gray-900 text-right">Rs. {safeFormat(item.total)}</td>
                    </tr>
                  ))}
                  
                  {/* Category Subtotal (Soft UI) */}
                  <tr className="bg-gray-50/50">
                    <td colSpan="3" className="py-4 px-2 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Category Total
                    </td>
                    <td className="py-4 px-2 text-right text-base font-bold text-purple-600">
                      Rs. {safeFormat(section.sectionTotal)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {/* 💰 BILLING TOTAL (Gradient Impact) */}
        <div className="flex justify-end mb-12 print-avoid-break">
          <div className="w-full md:w-96">
            <div className="flex justify-between items-center mb-3 px-2">
              <span className="text-gray-500 text-sm font-bold uppercase tracking-wider">Subtotal</span>
              <span className="font-bold text-gray-800">Rs. {safeFormat(quote.subtotal)}</span>
            </div>
            
            {Number(quote.discount) > 0 && (
              <div className="flex justify-between items-center mb-3 px-2">
                <span className="text-gray-500 text-sm font-bold uppercase tracking-wider">Discount</span>
                <span className="font-bold text-emerald-500">- Rs. {safeFormat(quote.discount)}</span>
              </div>
            )}

            {Number(quote.tax) > 0 && (
              <div className="flex justify-between items-center mb-4 px-2">
                <span className="text-gray-500 text-sm font-bold uppercase tracking-wider">Tax</span>
                <span className="font-bold text-gray-800">Rs. {safeFormat(quote.tax)}</span>
              </div>
            )}
            
            {/* Dark background added for print mode visibility since gradients often fail in PDF generation */}
            <div className="mt-4 p-6 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-3xl text-white shadow-xl shadow-purple-500/20 flex justify-between items-center transform transition-transform hover:scale-[1.02] print:bg-purple-700 print:shadow-none">
              <span className="text-sm font-black uppercase tracking-widest opacity-90">Total Payable</span>
              <span className="text-3xl font-black">Rs. {safeFormat(quote.grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* 📜 BOTTOM INFO (Grid Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 print-avoid-break">
          
          {/* Payment Terms */}
          <div>
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span> Terms & Conditions
            </h4>
            <ul className="text-sm text-gray-500 space-y-2.5 font-medium leading-relaxed">
              {quote.terms && quote.terms.map((term, i) => (
                 <li key={i} className="flex gap-2">
                   <span className="text-purple-400 font-black shrink-0">{i+1}.</span> 
                   <span>{term}</span>
                 </li>
              ))}
            </ul>
          </div>

          {/* Bank Details */}
          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-fuchsia-500"></span> Transfer Details
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200 border-dashed">
                <span className="text-gray-500 font-medium">Bank</span>
                <span className="font-bold text-gray-900">{quote.bankDetails?.bankName || "-"}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-200 border-dashed">
                <span className="text-gray-500 font-medium">Account No.</span>
                <span className="font-bold text-gray-900 tracking-wider">{quote.bankDetails?.accNo || "-"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">IFSC</span>
                <span className="font-bold text-gray-900 tracking-wider">{quote.bankDetails?.ifsc || "-"}</span>
              </div>
              {quote.bankDetails?.accHolder && (
                <div className="flex justify-between items-center pt-2 border-t border-gray-200 border-dashed mt-1">
                  <span className="text-gray-500 font-medium">Name</span>
                  <span className="font-bold text-gray-900">{quote.bankDetails.accHolder}</span>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}