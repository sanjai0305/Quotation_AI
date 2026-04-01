import Sidebar from "./Sidebar";
import {
  FileText,
  Download,
  Printer,
  Share2,
  Mail,
  MessageCircle,
} from "lucide-react";

export default function Export({
  goBack,
  goToDashboard,
  goToCreate,
  goToPreview,
  goToExport,
  goToSettings,
}) {
  return (
    <div className="bg-[#f8fafc]">

      {/* SIDEBAR */}
      <div className="fixed top-0 left-0 h-screen w-[250px] bg-[#0f172a] z-20">
        <Sidebar
          active="export"
          goToDashboard={goToDashboard}
          goToCreate={goToCreate}       // ✅ FIXED
          goToPreview={goToPreview}     // ✅ FIXED
          goToExport={goToExport}       // ✅ FIXED
          goToSettings={goToSettings}   // ✅ NEW
        />
      </div>

      {/* MAIN */}
      <div className="ml-[250px] min-h-screen flex flex-col">

        {/* HEADER */}
        <div className="flex justify-between items-center px-8 py-6 border-b bg-white sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Export Quotation
            </h1>
            <p className="text-sm text-slate-500">
              Download, print, or share your quotation
            </p>
          </div>

          <button
            onClick={goBack}
            className="border px-4 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            ← Back to Preview
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-8 space-y-6 max-w-4xl">

          {/* FILE CARD */}
          <div className="bg-white border rounded-xl p-5 flex justify-between items-center shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="text-blue-600" />
              </div>

              <div>
                <h2 className="font-semibold text-lg">
                  Untitled Quotation
                </h2>
                <p className="text-sm text-gray-500">
                  For: No client specified
                </p>
                <p className="text-sm text-gray-500">
                  From: Your Company
                </p>
              </div>
            </div>

            {/* ✅ FIXED */}
            <button
              onClick={goToPreview}
              className="text-blue-600 font-medium hover:underline"
            >
              View
            </button>
          </div>

          {/* EXPORT OPTIONS */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 mb-3">
              EXPORT OPTIONS
            </h2>

            <div className="space-y-4">

              <ActionCard
                icon={<Download />}
                title="Download as PDF"
                desc="Professional PDF file — ready to send"
                onClick={() => window.print()}
              />

              <ActionCard
                icon={<Printer />}
                title="Print Quotation"
                desc="Send directly to your printer"
                onClick={() => window.print()}
              />

              <ActionCard
                icon={<Share2 />}
                title="Share with PDF"
                desc="Share via apps"
                onClick={() => alert("Coming soon 🚀")}
              />

              <ActionCard
                icon={<MessageCircle />}
                title="Share via WhatsApp"
                desc="Send quotation on WhatsApp"
                onClick={() => {
                  const msg = encodeURIComponent(
                    "Hello, here is your quotation."
                  );
                  window.open(`https://wa.me/?text=${msg}`, "_blank");
                }}
              />

              <ActionCard
                icon={<Mail />}
                title="Share via Email"
                desc="Send quotation via email"
                onClick={() => {
                  const subject = encodeURIComponent("Quotation");
                  const body = encodeURIComponent(
                    "Please find attached quotation."
                  );
                  window.location.href = `mailto:?subject=${subject}&body=${body}`;
                }}
              />

            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-between items-center pt-6">
            <p className="text-sm text-gray-500">
              Need to make changes?
            </p>

            <button
              onClick={goBack}
              className="border px-4 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              Edit Quotation
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

/* CARD */
function ActionCard({ icon, title, desc, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white border rounded-xl p-5 flex items-center gap-4 cursor-pointer hover:shadow-md transition"
    >
      <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
        {icon}
      </div>

      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
    </div>
  );
}