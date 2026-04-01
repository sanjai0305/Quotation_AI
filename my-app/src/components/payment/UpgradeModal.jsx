import { useState } from "react";

export default function UpgradeModal({ onClose, onSuccess }) {
  const [method, setMethod] = useState("card");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">

      <div className="bg-white w-[400px] rounded-2xl shadow-2xl p-6">

        <h2 className="text-xl font-semibold text-center mb-2">
          Upgrade to Pro Plan
        </h2>

        <p className="text-center text-gray-500 mb-4">
          ₹499 / month
        </p>

        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button
            onClick={() => setMethod("card")}
            className={`flex-1 py-2 ${
              method === "card" ? "border-b-2 border-blue-500" : ""
            }`}
          >
            Card
          </button>

          <button
            onClick={() => setMethod("upi")}
            className={`flex-1 py-2 ${
              method === "upi" ? "border-b-2 border-blue-500" : ""
            }`}
          >
            UPI
          </button>
        </div>

        {/* Form */}
        {method === "card" ? (
          <>
            <input
              placeholder="1234 5678 9012 3456"
              className="w-full border p-2 rounded mb-2"
            />
            <div className="flex gap-2">
              <input className="w-1/2 border p-2 rounded" placeholder="MM/YY" />
              <input className="w-1/2 border p-2 rounded" placeholder="CVV" />
            </div>
          </>
        ) : (
          <input
            placeholder="example@upi"
            className="w-full border p-2 rounded"
          />
        )}

        {/* Buttons */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 border py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={onSuccess}
            className="flex-1 bg-blue-600 text-white py-2 rounded"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}