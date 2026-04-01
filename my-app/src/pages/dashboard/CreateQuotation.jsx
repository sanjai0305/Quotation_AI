import Sidebar from "./Sidebar";

export default function CreateQuotation({
  goBack,
  goToPreview,
  goToExport,
  goToDashboard, // ✅ Added from your updated code
}) {
  return (
    <div className="bg-[#f8fafc]">
      {/* SIDEBAR */}
      <div className="fixed top-0 left-0 h-screen w-[250px] z-20">
        <Sidebar
          active="create"
          goToDashboard={goToDashboard} // ✅ FIXED to use the prop
          goToCreate={() => {}}
          goToPreview={goToPreview}
          goToExport={goToExport}
        />
      </div>

      {/* MAIN */}
      <div className="ml-[250px] h-screen flex flex-col">
        {/* HEADER */}
        <div className="flex justify-between items-center px-8 py-6 border-b bg-white sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Create Quotation
            </h1>
            <p className="text-sm text-slate-500">
              Build a professional quotation with AI-powered suggestions
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="text-gray-600 hover:text-gray-900"
            >
              Reset
            </button>

            <button
              onClick={goToPreview}
              className="border px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Preview
            </button>

            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Save
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* PROJECT DETAILS */}
          <div className="bg-white rounded-xl p-6 shadow border">
            <h2 className="font-semibold mb-4">Project Details</h2>

            <div className="grid grid-cols-2 gap-4">
              <input className="border p-2 rounded" placeholder="Company Name" />
              <input className="border p-2 rounded" placeholder="Client Name" />
              <input className="border p-2 rounded" placeholder="Project Name" />
              <input className="border p-2 rounded" placeholder="Reference No" />
              <input type="date" className="border p-2 rounded" />
              <select className="border p-2 rounded">
                <option>Nippon Paint</option>
              </select>
            </div>
          </div>

          {/* AREA */}
          <div className="bg-white rounded-xl p-6 shadow border">
            <h2 className="font-semibold mb-4">Area Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                className="border p-2 rounded"
                placeholder="Interior Area (Sqft)"
              />
              <input
                className="border p-2 rounded"
                placeholder="Exterior Area (Sqft)"
              />
            </div>
          </div>

          {/* COVER LETTER */}
          <div className="bg-white rounded-xl p-6 shadow border">
            <h2 className="font-semibold mb-4">Cover Letter</h2>
            <input
              className="border p-2 rounded w-full mb-3"
              defaultValue="Paint Quote For"
            />
            <textarea
              rows={4}
              className="border p-2 rounded w-full"
              defaultValue="Thank you for your purchase enquiry..."
            />
          </div>

          {/* RATE TABLE */}
          <div className="bg-white rounded-xl p-6 shadow border">
            <h2 className="font-semibold mb-4">
              Rate Table (Labour + Material)
            </h2>

            <table className="w-full text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="text-left py-2">Work</th>
                  <th>Labour</th>
                  <th>Material</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                <tr className="text-center border-t">
                  <td className="text-left py-2">Wall Putty</td>
                  <td>5</td>
                  <td>3</td>
                  <td>8</td>
                </tr>
                <tr className="text-center border-t">
                  <td className="text-left py-2">Primer</td>
                  <td>1</td>
                  <td>1</td>
                  <td>2</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* PRICING */}
          <div className="bg-white rounded-xl p-6 shadow border">
            <h2 className="font-semibold mb-4">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <input className="border p-2 rounded" placeholder="Discount %" />
              <input
                className="border p-2 rounded"
                placeholder="Warranty (Years)"
              />
            </div>
          </div>

          {/* TIMELINE */}
          <div className="bg-white rounded-xl p-6 shadow border">
            <h2 className="font-semibold mb-4">Project Timeline</h2>
            <div className="grid grid-cols-2 gap-4">
              <input type="date" className="border p-2 rounded" />
              <input type="date" className="border p-2 rounded" />
            </div>
          </div>

          {/* TEXT AREAS */}
          {[
            "Scope of Work",
            "Exclusions",
            "Terms & Conditions",
          ].map((title, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow border">
              <h2 className="font-semibold mb-4">{title}</h2>
              <textarea rows={5} className="border p-2 rounded w-full" />
            </div>
          ))}

          {/* PAYMENT */}
          <div className="bg-white rounded-xl p-6 shadow border">
            <h2 className="font-semibold mb-4">Payment Terms</h2>
            <div className="space-y-3">
              <input
                className="border p-2 rounded w-full"
                defaultValue="Advance (50%)"
              />
              <input
                className="border p-2 rounded w-full"
                defaultValue="Mid Work (30%)"
              />
              <input
                className="border p-2 rounded w-full"
                defaultValue="Completion (20%)"
              />
            </div>
          </div>

          {/* VALIDITY */}
          <div className="bg-white rounded-xl p-6 shadow border">
            <h2 className="font-semibold mb-4">Validity</h2>
            <textarea rows={3} className="border p-2 rounded w-full" />
          </div>

          {/* BANK */}
          <div className="bg-white rounded-xl p-6 shadow border">
            <h2 className="font-semibold mb-4">Bank Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <input className="border p-2 rounded" placeholder="Bank Name" />
              <input
                className="border p-2 rounded"
                placeholder="Account Holder"
              />
              <input
                className="border p-2 rounded"
                placeholder="Account Number"
              />
              <input className="border p-2 rounded" placeholder="IFSC Code" />
              <input
                className="border p-2 rounded col-span-2"
                placeholder="Branch"
              />
            </div>
          </div>

          {/* SIGNATURE */}
          <div className="bg-white rounded-xl p-6 shadow border">
            <h2 className="font-semibold mb-4">Signature & Contact</h2>
            <div className="grid grid-cols-2 gap-4">
              <input className="border p-2 rounded" placeholder="Name" />
              <input className="border p-2 rounded" placeholder="Designation" />
              <input className="border p-2 rounded" placeholder="Phone" />
              <input className="border p-2 rounded" placeholder="Email" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}