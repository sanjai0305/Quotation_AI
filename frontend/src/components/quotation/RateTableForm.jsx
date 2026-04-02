import React from "react";
import { TableProperties, Plus, Trash2 } from "lucide-react";

export default function RateTableForm({ formData, handleRateTableChange, addRateRow, deleteRateRow, totalLabour, totalMaterial, totalSqft }) {
  const cardStyle = "bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mb-8";

  return (
    <div className={cardStyle}>
      <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600"><TableProperties size={22}/></div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-none">Material & Labour Rates</h2>
            <p className="text-sm text-slate-500 mt-1.5 font-medium">Breakdown of work specifications and costs</p>
          </div>
        </div>
      </div>

      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-slate-600 font-black tracking-wider text-xs uppercase">
              <th className="py-4 px-6 w-1/2">Material and Work Description</th>
              <th className="py-4 px-6 text-center">Labour (₹)</th>
              <th className="py-4 px-6 text-center">Material (₹)</th>
              <th className="py-4 px-6 text-right">Total / Sqft (₹)</th>
              <th className="w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {formData.rateTable.map((row) => (
              <tr key={row.id} className="group bg-white hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-6">
                  <textarea rows={2} className="w-full bg-transparent outline-none text-slate-800 font-medium resize-none placeholder-slate-300" placeholder="e.g. Surface Preparation, Asian Ext Primer (1 Coat)..." value={row.work} onChange={(e) => handleRateTableChange(row.id, "work", e.target.value)} />
                </td>
                <td className="py-3 px-6">
                  <input type="number" className="w-full text-center bg-slate-50 border border-slate-200 rounded-lg py-2 outline-none text-slate-800 font-bold focus:ring-2 focus:ring-indigo-500/20" value={row.labour} onChange={(e) => handleRateTableChange(row.id, "labour", e.target.value)} />
                </td>
                <td className="py-3 px-6">
                  <input type="number" className="w-full text-center bg-slate-50 border border-slate-200 rounded-lg py-2 outline-none text-slate-800 font-bold focus:ring-2 focus:ring-indigo-500/20" value={row.material} onChange={(e) => handleRateTableChange(row.id, "material", e.target.value)} />
                </td>
                <td className="py-3 px-6 text-right font-black text-indigo-700 text-base">
                  {row.total.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-center">
                  <button onClick={() => deleteRateRow(row.id)} className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
            
            {/* TOTALS SUMMARY ROW */}
            <tr className="bg-slate-800 text-white font-bold border-t-2 border-slate-900">
              <td className="py-5 px-6 uppercase tracking-wider text-xs">Total Estimation / Sqft</td>
              <td className="py-5 px-6 text-center">{totalLabour.toFixed(2)}</td>
              <td className="py-5 px-6 text-center">{totalMaterial.toFixed(2)}</td>
              <td className="py-5 px-6 text-right text-lg text-emerald-400">{totalSqft.toFixed(2)}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        
        <div className="bg-white border-t border-slate-200">
          <button onClick={addRateRow} className="w-full py-4 text-sm font-bold text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-center gap-2 transition-colors">
            <Plus size={18}/> Add New Work Item
          </button>
        </div>
      </div>
    </div>
  );
}