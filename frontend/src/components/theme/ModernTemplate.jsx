import React from "react";

export default function ModernTemplate({ data }) {
  // 🛑 Fallback Data (If real data is not passed yet, it shows this beautiful preview)
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
    <div className="bg-white p-12 min-h-[297mm] text-gray-800 font-sans relative">
      
      {/* 🟦 TOP ACCENT BAR */}
      <div className="absolute top-0 left-0 w-full h-3 bg-blue-600"></div>

      {/* 🏢 HEADER SECTION */}
      <div className="flex justify-between items-start border-b-2 border-gray-100 pb-8 mb-8 mt-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">
            {quote.companyName}
          </h1>
          <div className="mt-2 text-sm text-gray-500 space-y-0.5">
            <p>{quote.companyPhone}</p>
            <p>{quote.companyEmail}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-4xl font-black text-blue-600/10 tracking-widest uppercase">Quotation</h2>
          <div className="mt-2">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Quote No.</p>
            <p className="text-lg font-bold text-gray-900">{quote.quotationNo}</p>
          </div>
          <div className="mt-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date</p>
            <p className="text-sm font-semibold text-gray-800">{quote.date}</p>
          </div>
        </div>
      </div>

      {/* 👤 CLIENT DETAILS (Modern Badge Style) */}
      <div className="mb-10 bg-gray-50 p-6 rounded-2xl border border-gray-100 flex justify-between items-center">
        <div>
          <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">Quote For</p>
          <h3 className="text-xl font-bold text-gray-900">{quote.clientName}</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-xs">{quote.clientAddress}</p>
        </div>
        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center border border-gray-200">
           <span className="text-blue-600 font-black text-xl">{quote.clientName.charAt(0)}</span>
        </div>
      </div>

      {/* 📊 ITEMS TABLE */}
      <div className="mb-10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white text-xs uppercase tracking-widest">
              <th className="py-4 px-5 rounded-tl-xl font-bold">Description of Work</th>
              <th className="py-4 px-5 font-bold text-center">Labour</th>
              <th className="py-4 px-5 font-bold text-center">Material</th>
              <th className="py-4 px-5 rounded-tr-xl font-bold text-right">Total/Sqft</th>
            </tr>
          </thead>
          <tbody>
            {quote.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-5 text-sm font-semibold text-gray-800">{item.desc}</td>
                <td className="py-4 px-5 text-sm text-gray-600 text-center">{item.labour}</td>
                <td className="py-4 px-5 text-sm text-gray-600 text-center">{item.material}</td>
                <td className="py-4 px-5 text-sm font-bold text-gray-900 text-right">Rs. {item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 💰 BOTTOM SPLIT: BANK DETAILS & TOTAL */}
      <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
        
        {/* Left: Bank Details */}
        <div className="flex-1 w-full bg-blue-50 border border-blue-100 p-6 rounded-2xl">
          <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Payment Details
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-blue-200/50 pb-2">
              <span className="text-blue-800 font-medium">Bank Name</span>
              <span className="font-bold text-gray-900">{quote.bankDetails.bankName}</span>
            </div>
            <div className="flex justify-between border-b border-blue-200/50 pb-2">
              <span className="text-blue-800 font-medium">Account No</span>
              <span className="font-bold text-gray-900">{quote.bankDetails.accNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-800 font-medium">IFSC Code</span>
              <span className="font-bold text-gray-900">{quote.bankDetails.ifsc}</span>
            </div>
          </div>
        </div>

        {/* Right: Billing Summary */}
        <div className="w-full md:w-80 bg-gray-900 text-white p-6 rounded-3xl shadow-xl">
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Billing Summary</h4>
          
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-300 text-sm">Subtotal</span>
            <span className="font-semibold">Rs. {quote.subtotal}</span>
          </div>
          
          {quote.tax !== "0.00" && (
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-300 text-sm">Tax</span>
              <span className="font-semibold">Rs. {quote.tax}</span>
            </div>
          )}

          <div className="border-t border-gray-700 mt-2 pt-4 flex justify-between items-end">
            <span className="text-sm font-bold text-gray-300 uppercase tracking-wider">Grand Total</span>
            <span className="text-3xl font-black text-emerald-400">Rs. {quote.grandTotal}</span>
          </div>
        </div>

      </div>

      {/* 📜 TERMS AND CONDITIONS */}
      <div className="mt-8">
        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Terms & Conditions</h4>
        <ul className="list-decimal list-inside text-sm text-gray-500 space-y-1.5 leading-relaxed">
          {quote.terms.map((term, i) => (
             <li key={i}>{term}</li>
          ))}
        </ul>
      </div>

      {/* 🟦 BOTTOM ACCENT BAR */}
      <div className="absolute bottom-0 right-0 w-1/3 h-2 bg-blue-600 rounded-tl-full"></div>

    </div>
  );
}