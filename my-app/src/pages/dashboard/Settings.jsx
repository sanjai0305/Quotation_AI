import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

export default function Settings({
  goToDashboard,
  goToCreate,
  goToPreview,
  goToExport,
  goToSettings,
}) {
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    companyName: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    tax: "18",
    currency: "INR (₹)",
    terms: `1. This quotation is valid for 30 days from the date of issue.
2. Payment terms: 50% advance, 50% upon completion.
3. Prices are exclusive of applicable taxes unless otherwise stated.
4. Delivery timelines will be confirmed upon order confirmation.
5. Any changes to the scope of work may result in revised pricing.`,
  });

  // ✅ LOAD SAVED SETTINGS
  useEffect(() => {
    const savedData = localStorage.getItem("quotation_settings");
    if (savedData) {
      setForm(JSON.parse(savedData));
    }
  }, []);

  // ✅ HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // ✅ SAVE SETTINGS
  const handleSave = () => {
    localStorage.setItem("quotation_settings", JSON.stringify(form));
    setSaved(true);

    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-[#f1f5f9] min-h-screen">

      {/* SIDEBAR */}
      <div className="fixed top-0 left-0 h-screen w-[250px] z-20">
        <Sidebar
          active="settings"
          goToDashboard={goToDashboard}
          goToCreate={goToCreate}
          goToPreview={goToPreview}
          goToExport={goToExport}
          goToSettings={goToSettings} // ✅ FIXED
        />
      </div>

      {/* MAIN */}
      <div className="ml-[250px]">

        {/* HEADER */}
        <div className="flex justify-between items-center px-8 py-6 border-b bg-white sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Settings
            </h1>
            <p className="text-sm text-slate-500">
              Configure your default quotation preferences
            </p>
          </div>

          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm"
          >
            💾 Save Changes
          </button>
        </div>

        {/* SAVE SUCCESS */}
        {saved && (
          <div className="px-8 mt-4">
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm">
              ✅ Settings saved successfully!
            </div>
          </div>
        )}

        {/* CONTENT */}
        <div className="p-8 space-y-8">

          {/* COMPANY INFO */}
          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <h2 className="font-semibold text-slate-800 mb-6">
              🏢 Company Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={form.companyName}
                onChange={handleChange}
                className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <input
                type="text"
                name="website"
                placeholder="Website"
                value={form.website}
                onChange={handleChange}
                className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
              />

            </div>

            <textarea
              name="address"
              placeholder="Business Address"
              value={form.address}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 w-full mt-5 focus:ring-2 focus:ring-blue-500 outline-none"
              rows={3}
            />
          </div>

          {/* DEFAULT VALUES */}
          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <h2 className="font-semibold text-slate-800 mb-6">
              📄 Default Values
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="text-sm text-slate-500">
                  Default Tax (%)
                </label>
                <input
                  type="number"
                  name="tax"
                  value={form.tax}
                  onChange={handleChange}
                  className="border rounded-lg px-4 py-2 w-full mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-slate-500">
                  Currency
                </label>
                <select
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                  className="border rounded-lg px-4 py-2 w-full mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option>INR (₹)</option>
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                </select>
              </div>

            </div>

            <div className="mt-6">
              <label className="text-sm text-slate-500">
                Default Terms & Conditions
              </label>

              <textarea
                name="terms"
                value={form.terms}
                onChange={handleChange}
                className="border rounded-lg px-4 py-3 w-full mt-2 focus:ring-2 focus:ring-blue-500 outline-none"
                rows={6}
              />
            </div>
          </div>

          {/* APPEARANCE */}
          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <h2 className="font-semibold text-slate-800 mb-4">
              🎨 Appearance
            </h2>

            <div className="bg-slate-50 border rounded-lg p-4 text-sm text-slate-500">
              Theme customization options will be available in a future update.
              Currently using the default professional light theme.
            </div>
          </div>

          {/* FOOTER */}
          <p className="text-center text-xs text-slate-400">
            Settings are stored locally and do not require an account.
          </p>

        </div>
      </div>
    </div>
  );
}