import { useState, useEffect } from "react";

// 🔐 AUTH PAGES
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

// 📊 DASHBOARD PAGES
import Dashboard from "./pages/dashboard/Dashboard";
import CreateQuotation from "./pages/dashboard/CreateQuotation";
import Preview from "./pages/dashboard/Preview";
import Export from "./pages/dashboard/Export";
import Settings from "./pages/dashboard/Settings";

function App() {
  // Global state for routing
  const [page, setPage] = useState("login");
  const [quotationId, setQuotationId] = useState(null);

  // ==========================================
  // 🔥 URL ROUTING LOGIC (Deep Linking)
  // ==========================================
  useEffect(() => {
    const token = localStorage.getItem("token");
    const path = window.location.pathname; // Gets "/preview/69cd..."

    // 1. Check if the user is trying to access a PUBLIC Preview link
    if (path.startsWith("/preview/")) {
      const idFromUrl = path.split("/")[2]; // Extracts the ID from URL
      if (idFromUrl && idFromUrl.length === 24) {
        setQuotationId(idFromUrl);
        setPage("preview");
        return; // Don't proceed to auth checks
      }
    }

    // 2. Standard Auth Check for other pages
    if (token) {
      setPage("dashboard");
    } else {
      setPage("login");
    }
  }, []);

  // Navigation Handlers
  const navProps = {
    goToDashboard: () => {
      window.history.pushState({}, "", "/dashboard"); // Sync URL
      setPage("dashboard");
    },
    goToCreate: () => {
      window.history.pushState({}, "", "/create");
      setPage("create");
    },
    goToPreview: () => setPage("preview"),
    goToExport: () => setPage("export"),
    goToSettings: () => setPage("settings"),
  };

  return (
    <>
      {/* =========================================
          🔐 AUTHENTICATION ROUTES
      ========================================= */}
      
      {page === "login" && (
        <Login
          goToRegister={() => setPage("register")}
          goToForgot={() => setPage("forgot")}
          goToDashboard={navProps.goToDashboard}
        />
      )}

      {page === "register" && (
        <Register goToLogin={() => setPage("login")} />
      )}

      {page === "forgot" && (
        <ForgotPassword goToLogin={() => setPage("login")} />
      )}


      {/* =========================================
          📊 APPLICATION / DASHBOARD ROUTES
      ========================================= */}

      {page === "dashboard" && (
        <Dashboard 
          {...navProps} 
          setQuotationId={setQuotationId} 
        />
      )}

      {page === "create" && (
        <CreateQuotation 
          {...navProps} 
          goBack={navProps.goToDashboard} 
          setQuotationId={setQuotationId} 
          quotationId={quotationId} 
        />
      )}

      {page === "preview" && (
        <Preview 
          {...navProps} 
          goBack={navProps.goToCreate}
          quotationId={quotationId} // ID set from URL will be passed here
        />
      )}

      {page === "export" && (
        <Export 
          {...navProps} 
          goBack={navProps.goToPreview} 
          quotationId={quotationId} 
        />
      )}

      {page === "settings" && (
        <Settings {...navProps} />
      )}
    </>
  );
}

export default App;