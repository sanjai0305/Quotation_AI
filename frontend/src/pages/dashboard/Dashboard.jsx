import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { 
  Plus, ArrowRight, FileText, IndianRupee, Clock, 
  TrendingUp, Sparkles, FileSearch, MoreVertical, 
  Download, Eye, Lightbulb, CheckCircle2 // <-- THIS IS THE FIX
} from "lucide-react";

// ==============================
// 🔥 API SETUP (Axios)
// ==============================
const API = axios.create({
  baseURL: "http://localhost:5000/api/quotations",
});

export const getDashboardStats = () => API.get("/stats");
export const getAllQuotations = () => API.get("/");
export const getQuotationById = (id) => API.get(`/${id}`);
export const createQuotation = (data) => API.post("/", data);
export const updateQuotation = (id, data) => API.put(`/${id}`, data);
export const deleteQuotation = (id) => API.delete(`/${id}`);

// ==============================
// 📊 DASHBOARD COMPONENT
// ==============================
export default function Dashboard({
  goToCreate,
  goToDashboard,
  goToPreview,
  goToExport,
}) {
  const [stats, setStats] = useState({ total: 0, value: 0, lastCreated: "None" });
  const [recentQuotes, setRecentQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Data on Component Mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Parallel API calls (if your backend has these endpoints)
        const [statsRes, quotesRes] = await Promise.all([
          getDashboardStats().catch(() => null),
          getAllQuotations().catch(() => null)
        ]);

        if (statsRes && quotesRes) {
          setStats(statsRes.data);
          setRecentQuotes(quotesRes.data.slice(0, 5)); // Show top 5
          setIsLoading(false);
        } else {
          throw new Error("Backend not connected yet");
        }
      } catch (error) {
        console.warn("Using dummy data for UI testing...");
        // Fallback Dummy Data for UI preview
        setTimeout(() => {
          setStats({
            total: 24,
            value: 1250000,
            lastCreated: "Today, 10:30 AM"
          });
          setRecentQuotes([
            { id: "QTN-001", client: "Acme Corp", project: "Office Interior", date: "Apr 01, 2026", value: 450000, status: "Sent" },
            { id: "QTN-002", client: "John Doe", project: "Villa Painting", date: "Mar 28, 2026", value: 120000, status: "Draft" },
            { id: "QTN-003", client: "TechFlow Ltd", project: "Exterior Refresh", date: "Mar 25, 2026", value: 680000, status: "Approved" },
          ]);
          setIsLoading(false);
        }, 800);
      }
    };

    fetchDashboardData();
  }, []);

  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* SIDEBAR */}
      <div className="fixed top-0 left-0 h-screen w-[250px] z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)] border-r border-gray-100">
        <Sidebar
          active="dashboard"
          goToCreate={goToCreate}
          goToDashboard={goToDashboard}
          goToPreview={goToPreview}
          goToExport={goToExport}
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="ml-[250px] h-screen flex flex-col relative">
        
        {/* GLASSMORPHISM HEADER */}
        <div className="flex justify-between items-center px-10 py-5 bg-white/70 backdrop-blur-xl sticky top-0 z-20 border-b border-gray-200/50 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Dashboard</h1>
            <p className="text-sm text-gray-500 font-medium mt-1">Manage your quotations and track business performance.</p>
          </div>

          <button
            onClick={goToCreate}
            className="flex items-center gap-2 text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all duration-200"
          >
            <Plus className="w-4 h-4" /> New Quotation
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 max-w-7xl mx-auto w-full pb-24">

          {/* HERO / WELCOME CARD */}
          <div className="relative bg-white rounded-3xl p-8 shadow-sm border border-gray-100 overflow-hidden group">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full blur-3xl -mr-20 -mt-20 opacity-70 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-blue-100 p-1.5 rounded-lg"><Sparkles className="w-4 h-4 text-blue-600" /></div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Welcome back to QuoteGen Pro</h2>
                </div>
                <p className="text-base text-gray-500 max-w-lg mb-6 leading-relaxed">
                  Your automated quoting engine is ready. You have generated <span className="font-bold text-gray-700">{stats.total}</span> quotes so far. Let's close some deals today!
                </p>

                <div className="flex flex-wrap gap-3">
                  <button onClick={goToCreate} className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-md">
                    ⚡ Start Creating
                  </button>
                  <button onClick={goToExport} className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all">
                    Export Data <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Optional Illustration Area */}
              <div className="hidden lg:block w-48 h-40 bg-[url('https://illustrations.popsy.co/blue/startup.svg')] bg-contain bg-center bg-no-repeat drop-shadow-xl transform group-hover:scale-105 transition-transform duration-500"></div>
            </div>
          </div>

          {/* STATS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 relative overflow-hidden group hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Quotations</p>
                  <h3 className="text-3xl font-black text-gray-800 mt-2">
                    {isLoading ? <div className="h-9 w-16 bg-gray-200 animate-pulse rounded-lg mt-1"></div> : stats.total}
                  </h3>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-md">
                <TrendingUp className="w-3.5 h-3.5" /> +12% this month
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 relative overflow-hidden group hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Value</p>
                  <h3 className="text-3xl font-black text-gray-800 mt-2">
                    {isLoading ? <div className="h-9 w-32 bg-gray-200 animate-pulse rounded-lg mt-1"></div> : formatCurrency(stats.value)}
                  </h3>
                </div>
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <IndianRupee className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-gray-500">
                Combined pipeline value
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 relative overflow-hidden group hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Last Activity</p>
                  <h3 className="text-xl font-bold text-gray-800 mt-3 truncate max-w-[150px]">
                    {isLoading ? <div className="h-7 w-24 bg-gray-200 animate-pulse rounded-lg mt-1"></div> : stats.lastCreated}
                  </h3>
                </div>
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-gray-500">
                Time of last quote creation
              </div>
            </div>
          </div>

          {/* RECENT QUOTATIONS TABLE / EMPTY STATE */}
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
            
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Recent Quotations</h2>
              <button onClick={goToDashboard} className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                View All
              </button>
            </div>

            {isLoading ? (
              // Loading Skeleton
              <div className="p-6 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 w-full bg-gray-50 animate-pulse rounded-xl"></div>
                ))}
              </div>
            ) : recentQuotes.length > 0 ? (
              // Data Table
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-6 py-4 rounded-tl-lg">Quote ID</th>
                      <th className="px-6 py-4">Client & Project</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Value</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentQuotes.map((quote) => (
                      <tr key={quote.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-6 py-4 font-bold text-gray-900">{quote.id}</td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-800">{quote.client}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{quote.project}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-600 font-medium">{quote.date}</td>
                        <td className="px-6 py-4 font-bold text-gray-800">{formatCurrency(quote.value)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5
                            ${quote.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                              quote.status === 'Sent' ? 'bg-blue-100 text-blue-700' : 
                              'bg-gray-100 text-gray-600'}`}>
                            {quote.status === 'Approved' && <CheckCircle2 className="w-3 h-3" />}
                            {quote.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={goToPreview} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button onClick={goToExport} className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Download">
                              <Download className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              // Empty State
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-5 border-8 border-white shadow-sm">
                  <FileSearch className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No quotations yet</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-sm">
                  You haven't generated any quotes. Start by creating your first professional quotation.
                </p>
                <button
                  onClick={goToCreate}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  + Create First Quotation
                </button>
              </div>
            )}
          </div>

          {/* QUICK TIP ALERT */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50 rounded-2xl p-5 flex items-start gap-4">
            <div className="bg-white p-2 rounded-xl shadow-sm">
              <Lightbulb className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Pro Tip for Faster Quoting</h4>
              <p className="text-sm text-gray-600 mt-1">
                Configure your company details, logo, and bank information in <span className="font-bold text-indigo-600 cursor-pointer hover:underline">Settings</span> to auto-fill future quotations automatically.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}