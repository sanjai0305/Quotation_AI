import React from "react";
import { ShieldCheck, Building2 } from "lucide-react";

export default function ClassicTemplate({ data }) {
  // 🛑 Fallback Data (Ensures the template renders even if props are missing during testing)
  const quote = data || {
    companyName: "VisionX Builders",
    companyEmail: "hello@visionx.tech",
    companyPhone: "+91 98765 43210",
    clientName: "Arjun Kumar",
    clientAddress: "123, Tech Park, Chennai",
    quotationNo: "QTN-2026-001",
    date: "03-04-2026",
    items: [
      { desc: "Surface Preparation, Wall Putty (3 Coats)", labour: "5.00", material: "3.00", total: "8.00" },
      { desc: "Primer (1 Coat)", labour: "1.00", material: "1.00", total: "2.00" },
    ],
    subtotal: "10.00",
    tax: "0.00",
    grandTotal: "10.00",
    terms: ["Scaffolding must be provided by the client wherever rope scaffolding is not possible.", "Payment should be made 50% in advance."],
    bankDetails: { bankName: "HDFC Bank", accNo: "50100234567890", ifsc: "HDFC0001234" }
  };

  return (
    <div className="bg-white p-12 min-h-[297mm] text-gray-800 font-sans">
      
      {/* 🏢 HEADER SECTION */}
      <div className="flex justify-between items-start mb-10">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 border border-slate-200 shrink-0">
             <Building2 size={32} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
              {quote.companyName}
            </h1>
            <div className="mt-1 text-sm text-slate-500 font-medium">
              <p>{quote.companyPhone}</p>
              <p>{quote.companyEmail}</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-widest">Quotation</h2>
          <div className="mt-4 flex flex-col items-end gap-1 text-sm">
            <div className="flex gap-4">
              <span className="font-bold text-slate-400 uppercase tracking-wider">Date:</span>
              <span className="font-semibold text-slate-800">{quote.date}</span>
            </div>
            <div className="flex gap-4">
              <span className="font-bold text-slate-400 uppercase tracking-wider">Ref No:</span>
              <span className="font-semibold text-slate-800">{quote.quotationNo}</span>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-slate-200 mb-8" />

      {/* 👤 CLIENT DETAILS */}
      <div className="mb-10">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Quotation For:</p>
        <h3 className="text-lg font-bold text-slate-900">{quote.clientName}</h3>
        <p className="text-sm text-slate-500 mt-1">{quote.clientAddress}</p>
      </div>

      {/* 📊 ITEMS TABLE (Standard 4-Column Layout) */}
      <div className="mb-8 border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600 font-bold uppercase tracking-wider">
              <th className="py-4 px-6">Description of Work</th>
              <th className="py-4 px-6 text-center">Labour</th>
              <th className="py-4 px-6 text-center">Material</th>
              <th className="py-4 px-6 text-right">Total/Sqft</th>
            </tr>
          </thead>
          <tbody>
            {quote.items.map((item, index) => (
              <tr key={index} className="border-b border-slate-100 last:border-0">
                <td className="py-4 px-6 text-sm font-semibold text-slate-800">{item.desc}</td>
                <td className="py-4 px-6 text-sm text-slate-600 text-center">{item.labour}</td>
                <td className="py-4 px-6 text-sm text-slate-600 text-center">{item.material}</td>
                <td className="py-4 px-6 text-sm font-bold text-slate-900 text-right">Rs. {item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 💰 BILLING SUMMARY */}
      <div className="flex justify-end mb-12">
        <div className="w-full md:w-80 border border-slate-200 rounded-xl p-5 bg-slate-50">
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-500 text-sm font-medium">Subtotal</span>
            <span className="font-semibold text-slate-800">Rs. {quote.subtotal}</span>
          </div>
          {quote.tax !== "0.00" && (
            <div className="flex justify-between items-center mb-3">
              <span className="text-slate-500 text-sm font-medium">Tax</span>
              <span className="font-semibold text-slate-800">Rs. {quote.tax}</span>
            </div>
          )}
          <div className="border-t border-slate-200 mt-3 pt-3 flex justify-between items-center">
            <span className="text-sm font-black text-slate-800 uppercase tracking-widest">Grand Total</span>
            <span className="text-2xl font-black text-slate-900">Rs. {quote.grandTotal}</span>
          </div>
        </div>
      </div>

      {/* 📜 BOTTOM SPLIT: TERMS & BANK DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-slate-200 pt-8">
        
        {/* Left: Terms */}
        <div>
          <h4 className="text-xs font-bold text-blue-600 flex items-center gap-2 uppercase tracking-widest mb-3">
             <ShieldCheck size={16} /> Terms & Conditions
          </h4>
          <ul className="text-sm text-slate-500 space-y-2 leading-relaxed">
            {quote.terms.map((term, i) => (
               <li key={i}>{i + 1}. {term}</li>
            ))}
          </ul>
        </div>

        {/* Right: Bank Details */}
        <div>
           <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                 Bank Details
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Bank Name</span>
                  <span className="font-bold text-slate-800">{quote.bankDetails.bankName}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Account No</span>
                  <span className="font-bold text-slate-800">{quote.bankDetails.accNo}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">IFSC Code</span>
                  <span className="font-bold text-slate-800">{quote.bankDetails.ifsc}</span>
                </div>
              </div>
           </div>
        </div>

      </div>

    </div>
  );
}