import React from "react";

export default function GroupedTemplate({ data }) {
  // 🛑 Fallback Data (Updated to include multiple sections for testing)
  const quote = data || {
    companyName: "VisionX Builders",
    companyEmail: "hello@visionx.tech",
    companyPhone: "+91 98765 43210",
    clientName: "Mr. Arjun Kumar",
    clientAddress: "123, Tech Park, Chennai",
    quotationNo: "QTN-2026-001",
    date: "03-04-2026",
    sections: [
      {
        title: "Exterior Works",
        items: [
          { desc: "Wall Surface (Premium)", labour: "15000.00", material: "25000.00", total: "40000.00" }
        ],
        sectionTotal: "40000.00"
      },
      {
        title: "Interior Works",
        items: [
          { desc: "Kitchen & Hall (Premium)", labour: "8000.00", material: "12000.00", total: "20000.00" },
          { desc: "Main Gate & Windows (Enamel)", labour: "3000.00", material: "4500.00", total: "7500.00" }
        ],
        sectionTotal: "27500.00"
      }
    ],
    subtotal: "67500.00",
    discount: "0.00",
    tax: "0.00",
    grandTotal: "67500.00",
    terms: [
      "3 terms of payment - 60% Advance, 30% Mid of the work, 10% After Successfully completion.",
      "A storage space at site for storing materials, supply of water & electricity must be provided by the client."
    ],
    bankDetails: { bankName: "HDFC Bank", accNo: "50100234567890", ifsc: "HDFC0001234", accHolder: "VisionX Builders" }
  };

  const safeFormat = (val) => {
    const num = Number(val);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  // Safe check if sections exist
  const sectionsToRender = quote.sections && quote.sections.length > 0 
    ? quote.sections 
    : [{ title: "Project Breakdown", items: quote.items || [], sectionTotal: quote.subtotal }];

  return (
    <div className="bg-white p-12 min-h-[297mm] text-gray-900 font-serif border border-gray-100 shadow-sm relative">
      
      {/* 🏢 TOP HEADER */}
      <div className="text-center border-b-2 border-gray-800 pb-6 mb-8 print-avoid-break">
        {quote.companyLogo && (
          <img src={quote.companyLogo} alt="Logo" className="h-16 mx-auto mb-3 object-contain" />
        )}
        <h1 className="text-3xl font-black uppercase tracking-wider text-gray-900">{quote.companyName}</h1>
        <p className="text-sm font-sans text-gray-600 mt-1">{quote.companyPhone} | {quote.companyEmail}</p>
      </div>

      {/* ✉️ LETTER HEAD FORMAT */}
      <div className="mb-8 font-sans print-avoid-break">
        <div className="flex justify-between items-center mb-6">
          <p className="font-bold">Date: {quote.date}</p>
          <p className="font-bold text-gray-500">Ref: {quote.quotationNo}</p>
        </div>
        
        <p className="mb-3">Dear Sir/Madam,</p>
        <p className="font-bold underline underline-offset-4 mb-4 leading-relaxed">
          Subject: Paint & Work Quote for {quote.clientName}, {quote.clientAddress}
        </p>
        <p className="text-sm text-gray-700">
          Thank you for your purchase enquiry for the above-mentioned site. Please find below our quotation for Material & Labour for this site.
        </p>
      </div>

      {/* 📋 SECTIONS (Mani Sir Style Logic adapted for multiple categories) */}
      <div className="space-y-12 mb-10">
        {sectionsToRender.map((section, secIdx) => (
          <div key={secIdx}>
            
            {/* Section Category Title */}
            <h2 className="text-lg font-black uppercase text-gray-900 border-b-2 border-gray-800 pb-2 mb-6 print-avoid-break">
              {section.title}
            </h2>

            <div className="space-y-8">
              {section.items && section.items.map((item, index) => (
                <div key={index} className="print-avoid-break">
                  
                  {/* Item Description as Sub-heading */}
                  <h3 className="text-sm font-bold text-gray-900 mb-2 border-l-4 border-gray-800 pl-3 bg-gray-50 py-1.5 whitespace-pre-wrap">
                    {item.desc}
                  </h3>
                  
                  {/* Minimalist Table for Labour/Material Split */}
                  <table className="w-full border border-gray-300 font-sans text-sm">
                    <thead>
                      <tr className="bg-gray-100/50 border-b border-gray-300">
                        <th className="p-3 text-left font-bold text-gray-700 w-2/3">Work & Material Breakdown</th>
                        <th className="p-3 text-right font-bold text-gray-700 w-1/3">Amount (Rs)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="p-3 text-gray-600 align-top">
                          <p className="mb-1"><span className="font-semibold text-gray-800">Labour Cost:</span> Surface preparation, crack filling, and application.</p>
                        </td>
                        <td className="p-3 text-right text-gray-800 font-medium align-top">
                          {safeFormat(item.labour)}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-3 text-gray-600 align-top">
                          <p><span className="font-semibold text-gray-800">Material Cost:</span> Primers, Emulsions, and related accessories.</p>
                        </td>
                        <td className="p-3 text-right text-gray-800 font-medium align-top">
                          {safeFormat(item.material)}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="p-3 text-right font-bold text-gray-800 italic">
                          Total Estimated Cost for this item =
                        </td>
                        <td className="p-3 text-right font-bold text-gray-900">
                          {safeFormat(item.total)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
            </div>

            {/* Category Subtotal */}
            <div className="mt-4 text-right print-avoid-break">
              <p className="text-sm font-bold text-gray-700 uppercase tracking-widest">
                {section.title} Total: <span className="text-gray-900 ml-4">Rs. {safeFormat(section.sectionTotal)}</span>
              </p>
            </div>
            
          </div>
        ))}
      </div>

      {/* 💰 GRAND TOTAL (Prominent Text) */}
      <div className="mb-10 text-right print-avoid-break">
        {Number(quote.discount) > 0 && (
          <p className="text-sm text-green-700 font-bold mb-1">Discount: - Rs. {safeFormat(quote.discount)}</p>
        )}
        {Number(quote.tax) > 0 && (
          <p className="text-sm text-gray-600 mb-1">Tax: Rs. {safeFormat(quote.tax)}</p>
        )}
        <h2 className="text-xl font-bold text-gray-900 border-y-2 border-gray-800 py-3 inline-block pl-8 pr-4 bg-gray-50">
          Total Working Cost = Rs. {safeFormat(quote.grandTotal)}
        </h2>
      </div>

      {/* 📜 TERMS & CONDITIONS */}
      <div className="mb-10 font-sans print-avoid-break">
        <h4 className="text-sm font-bold text-gray-900 mb-3 underline underline-offset-4">Terms and Conditions</h4>
        <ul className="text-sm text-gray-700 space-y-2">
          {quote.terms && quote.terms.map((term, i) => (
             <li key={i} className="flex items-start gap-2">
               <span className="font-bold text-gray-900">{i + 1}.</span> {term}
             </li>
          ))}
        </ul>
      </div>

      {/* 🏦 BANK DETAILS & SIGNATURE (Side by Side) */}
      <div className="flex flex-col md:flex-row justify-between items-end mt-12 pt-8 border-t border-gray-200 font-sans print-avoid-break">
        
        <div className="w-full md:w-1/2 mb-8 md:mb-0">
           <h4 className="text-sm font-bold text-gray-900 mb-2">Bank Account Details:</h4>
           <div className="text-sm text-gray-700 space-y-1">
             <p><span className="font-semibold text-gray-800 w-24 inline-block">Bank Name:</span> {quote.bankDetails?.bankName || "-"}</p>
             <p><span className="font-semibold text-gray-800 w-24 inline-block">A/c No:</span> {quote.bankDetails?.accNo || "-"}</p>
             <p><span className="font-semibold text-gray-800 w-24 inline-block">IFSC Code:</span> {quote.bankDetails?.ifsc || "-"}</p>
             {quote.bankDetails?.accHolder && (
               <p><span className="font-semibold text-gray-800 w-24 inline-block">Name:</span> {quote.bankDetails.accHolder}</p>
             )}
           </div>
        </div>

        <div className="w-full md:w-1/2 text-right">
           <p className="text-sm text-gray-600 italic mb-12">With Regards,</p>
           <h4 className="text-lg font-bold text-gray-900">{quote.companyName}</h4>
           <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Authorized Signatory</p>
        </div>
      </div>

    </div>
  );
}