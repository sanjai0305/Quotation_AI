import { useState } from "react";

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
  // Global state for simple routing
  const [page, setPage] = useState("login");
  
  // 🔥 THE MAGIC STATE: Stores the ID of the saved quotation
  const [quotationId, setQuotationId] = useState(null);

  // Navigation Handlers (Passed to Sidebar & Buttons)
  const navProps = {
    goToDashboard: () => setPage("dashboard"),
    goToCreate: () => {
      setQuotationId(null); // Reset ID when creating a new quote
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
          setQuotationId={setQuotationId} // Useful if you click a saved quote from the table
        />
      )}

      {page === "create" && (
        <CreateQuotation 
          {...navProps} 
          goBack={navProps.goToDashboard} 
          setQuotationId={setQuotationId} // 🔥 Extracts the ID after clicking "Save"
        />
      )}

      {page === "preview" && (
        <Preview 
          {...navProps} 
          goBack={navProps.goToCreate}
          quotationId={quotationId} // Passes ID so preview knows if it's saved or a draft
        />
      )}

      {page === "export" && (
        <Export 
          {...navProps} 
          goBack={navProps.goToPreview} 
          quotationId={quotationId} // 🔥 Enables the PDF and Email buttons!
        />
      )}

      {page === "settings" && (
        <Settings {...navProps} />
      )}
    </>
  );
}

export default App;