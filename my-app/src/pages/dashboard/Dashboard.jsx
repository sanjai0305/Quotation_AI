import Sidebar from "./Sidebar";

export default function Dashboard({
  goToCreate,
  goToDashboard,
  goToPreview,
  goToExport,
}) {
  return (
    <div className="bg-[#f1f5f9] min-h-screen">

      {/* SIDEBAR */}
      <div className="fixed top-0 left-0 h-screen w-[250px] z-20">
        <Sidebar
          active="dashboard"
          goToCreate={goToCreate}
          goToDashboard={goToDashboard}
          goToPreview={goToPreview}
          goToExport={goToExport}
        />
      </div>

      {/* MAIN */}
      <div className="ml-[250px]">

        {/* HEADER */}
        <div className="flex justify-between items-center px-8 py-6 border-b bg-white sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Dashboard
            </h1>
            <p className="text-sm text-slate-500">
              Manage your quotations and track performance
            </p>
          </div>

          <button
            onClick={goToCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm"
          >
            + New Quotation
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-8 space-y-8">

          {/* HERO / WELCOME */}
          <div className="bg-white border rounded-2xl p-6 flex justify-between items-center shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-1">
                Welcome to QuotationAI 🚀
              </h2>
              <p className="text-sm text-slate-500 mb-4">
                Create, manage, and export professional quotations effortlessly
              </p>

              <div className="flex gap-3">
                <button
                  onClick={goToCreate}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  ⚡ Start Creating
                </button>

                <button
                  onClick={goToPreview || (() => {})}
                  className="bg-white border px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  Preview →
                </button>

                <button
                  onClick={goToExport || (() => {})}
                  className="bg-white border px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  Export →
                </button>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* TOTAL QUOTATIONS */}
            <div className="bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition">
              <p className="text-xs text-slate-500 uppercase tracking-wide">
                Total Quotations
              </p>
              <h2 className="text-3xl font-bold mt-2 text-slate-800">
                0
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                All quotations created
              </p>
            </div>

            {/* TOTAL VALUE */}
            <div className="bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition">
              <p className="text-xs text-slate-500 uppercase tracking-wide">
                Total Value
              </p>
              <h2 className="text-3xl font-bold mt-2 text-slate-800">
                ₹0.00
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Combined quotation value
              </p>
            </div>

            {/* LAST CREATED */}
            <div className="bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition">
              <p className="text-xs text-slate-500 uppercase tracking-wide">
                Last Created
              </p>
              <h2 className="text-lg font-semibold mt-2 text-slate-800">
                None
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Create your first quotation
              </p>
            </div>

          </div>

          {/* RECENT QUOTATIONS */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">

            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-slate-800">
                Recent Quotations
              </h2>

              <button
                onClick={goToCreate}
                className="text-sm text-blue-600 hover:underline"
              >
                + New
              </button>
            </div>

            <div className="border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center">

              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4 text-xl">
                📄
              </div>

              <h3 className="font-semibold text-slate-700 mb-1">
                No quotations yet
              </h3>

              <p className="text-sm text-slate-500 mb-4 max-w-sm">
                Start by creating your first quotation. It will appear here for quick access.
              </p>

              <button
                onClick={goToCreate}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
              >
                Create Quotation
              </button>

            </div>

          </div>

          {/* QUICK TIP / INFO CARD */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-sm text-blue-700">
            💡 Tip: Configure your company details in <span className="font-medium">Settings</span> to auto-fill quotations and save time.
          </div>

        </div>
      </div>
    </div>
  );
}