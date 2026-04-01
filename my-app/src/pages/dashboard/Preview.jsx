import Sidebar from "./Sidebar";

export default function Preview({ goBack, goToExport }) {
  return (
    <div className="bg-[#f8fafc]">
      {/* SIDEBAR */}
      <div className="fixed top-0 left-0 h-screen w-[250px] bg-[#0f172a] z-20">
        <Sidebar
          active="preview"
          goToDashboard={goBack}
          goToCreate={() => {}}
          goToPreview={() => {}}
          goToExport={goToExport} // ✅ Added export navigation
        />
      </div>

      {/* MAIN */}
      <div className="ml-[250px] h-screen flex flex-col">
        {/* HEADER */}
        <div className="flex justify-between items-center px-8 py-6 border-b bg-white sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Preview Quotation
            </h1>
            <p className="text-sm text-slate-500">
              Review your quotation before exporting
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={goBack}
              className="border px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Edit
            </button>

            <button
              onClick={() => window.print()}
              className="border px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Print
            </button>

            {/* ✅ Wired up Export Button */}
            <button
              onClick={goToExport}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Export
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 flex justify-center">
          <div className="bg-white w-[900px] p-8 rounded-xl shadow space-y-8">
            {/* TOP */}
            <div className="flex justify-between">
              <div>
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs">
                  Nippon Paint
                </span>

                <h1 className="text-2xl font-bold mt-3">Your Company Name</h1>
              </div>

              <div className="text-right">
                <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold">
                  QUOTATION
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Date: 31 March 2026
                </p>
              </div>
            </div>

            <hr />

            {/* CLIENT */}
            <div className="flex justify-between">
              <div className="bg-gray-50 p-4 rounded-lg w-[60%]">
                <p className="text-xs text-gray-400">BILL TO</p>
                <p className="font-semibold">Client Name</p>

                <p className="text-xs text-gray-400 mt-3">PROJECT</p>
                <p className="font-semibold">Project Name</p>
              </div>

              <div className="text-right text-sm space-y-3">
                <p>
                  <span className="text-gray-400">REFERENCE NO.</span>
                  <br />
                  QT-MNF0JDZ1-HT41
                </p>
                <p>
                  <span className="text-gray-400">INTERIOR AREA</span>
                  <br />—
                </p>
                <p>
                  <span className="text-gray-400">EXTERIOR AREA</span>
                  <br />—
                </p>
              </div>
            </div>

            {/* SUBJECT */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold">Subject: Paint Quote For</p>
              <p className="mt-2 text-sm text-gray-600">
                Dear Sir,
                <br />
                <br />
                Thank you for your purchase enquiry for the above mentioned
                site. Please find below our quotation for Material & Labour for
                this site.
              </p>
            </div>

            {/* ===== SECTION TABLE FUNCTION STYLE ===== */}
            {[
              {
                title: "INTERIOR - PREMIUM FINISH (PUTTY + PRIMER + EMULSION)",
                rows: [
                  ["Surface Preparation, Wall Putty (3 Coats)", 5, 3, 8],
                  ["Primer (1 Coat)", 1, 1, 2],
                  ["Premium Emulsion (2 Coats)", 3, 5, 8],
                  ["Accessories", 0, 1, 1],
                ],
              },
              {
                title: "INTERIOR - SATIN ENAMEL FINISH",
                rows: [
                  ["Surface Preparation, Wall Putty (3 Coats)", 5, 3, 8],
                  ["Solvent Primer (1 Coat)", 2, 3, 5],
                  ["Satin Enamel Matt Finish (2 Coats)", 4, 5, 9],
                  ["Accessories", 0, 1, 1],
                ],
              },
              {
                title: "EXTERIOR - WEATHERPROOF COATING",
                rows: [
                  ["Surface Preparation, Primer (1 Coat)", 2.5, 1, 3.5],
                  ["Weatherproof Exterior Emulsion (2 Coats)", 5, 7.5, 12.5],
                ],
              },
            ].map((section, i) => (
              <div key={i}>
                <h2 className="font-semibold mb-2">{section.title}</h2>

                <table className="w-full text-sm border-t">
                  <thead className="text-blue-600">
                    <tr>
                      <th className="text-left py-2">Work</th>
                      <th>Labour (₹)</th>
                      <th>Material (₹)</th>
                      <th>Total / Sqft</th>
                    </tr>
                  </thead>

                  <tbody>
                    {section.rows.map((row, idx) => (
                      <tr key={idx} className="border-t text-center">
                        <td className="text-left py-2">{row[0]}</td>
                        <td>{row[1].toFixed(2)}</td>
                        <td>{row[2].toFixed(2)}</td>
                        <td className="font-semibold">
                          {row[3].toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-end mt-2 font-semibold">
                  Total: ₹0.00
                </div>
              </div>
            ))}

            {/* GRAND TOTAL */}
            <div>
              <h2 className="font-semibold mb-2">GRAND TOTAL SUMMARY</h2>

              <div className="flex justify-between text-sm">
                <p>Subtotal (All Sections)</p>
                <p>₹0.00</p>
              </div>

              <div className="bg-blue-600 text-white p-4 rounded-lg flex justify-between mt-3">
                <p className="font-semibold">Grand Total</p>
                <p className="font-bold">₹0.00</p>
              </div>
            </div>

            {/* WARRANTY */}
            <div>
              <h2 className="font-semibold mb-2">WARRANTY</h2>
              <p className="text-sm text-gray-600">
                This quotation includes a 3-year warranty on all paint work
                carried out. Warranty covers peeling, flaking, and
                discoloration under normal conditions.
              </p>
            </div>

            {/* SCOPE */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="font-semibold mb-2">SCOPE OF WORK</h2>
              <ul className="list-decimal ml-5 text-sm space-y-1">
                <li>Surface preparation including cleaning, scraping, sanding</li>
                <li>Application of wall putty</li>
                <li>Primer coat</li>
                <li>Finish coats</li>
                <li>Touch-ups</li>
                <li>Final cleaning</li>
              </ul>
            </div>

            {/* EXCLUSIONS */}
            <div className="bg-red-50 p-4 rounded-lg">
              <h2 className="font-semibold mb-2">EXCLUSIONS</h2>
              <ul className="list-decimal ml-5 text-sm space-y-1">
                <li>Structural repairs</li>
                <li>Waterproofing</li>
                <li>Texture finishes</li>
                <li>Furniture painting</li>
                <li>Electrical work</li>
                <li>Wood polishing</li>
              </ul>
            </div>

            {/* TERMS */}
            <div>
              <h2 className="font-semibold mb-2">TERMS & CONDITIONS</h2>
              <ul className="list-decimal ml-5 text-sm space-y-1">
                <li>Scaffolding by client</li>
                <li>Rework charges apply</li>
                <li>Rates based on sqft</li>
                <li>Work order required</li>
                <li>Scope changes affect pricing</li>
              </ul>
            </div>

            {/* PAYMENT */}
            <div>
              <h2 className="font-semibold mb-2">PAYMENT TERMS</h2>

              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2">#</th>
                    <th className="text-left py-2">Stage</th>
                    <th>%</th>
                    <th>Amount</th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="text-center border-b">
                    <td className="py-2">1</td>
                    <td className="text-left">Advance</td>
                    <td>50%</td>
                    <td>₹0.00</td>
                  </tr>
                  <tr className="text-center border-b">
                    <td className="py-2">2</td>
                    <td className="text-left">Mid Work</td>
                    <td>30%</td>
                    <td>₹0.00</td>
                  </tr>
                  <tr className="text-center">
                    <td className="py-2">3</td>
                    <td className="text-left">Completion</td>
                    <td>20%</td>
                    <td>₹0.00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* VALIDITY */}
            <div>
              <h2 className="font-semibold mb-2">VALIDITY</h2>
              <p className="text-sm text-gray-600">
                This quotation is valid for 30 days from the date of issue.
              </p>
            </div>

            {/* SIGNATURE */}
            <div className="flex justify-between mt-10">
              <div className="text-center">
                <div className="w-40 border-t border-gray-400 mb-2"></div>
                <p className="text-sm">Customer Signature</p>
              </div>

              <div className="text-center">
                <div className="w-40 border-t border-gray-400 mb-2"></div>
                <p className="text-sm font-semibold">Authorized Signatory</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}