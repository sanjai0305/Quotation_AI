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
import EditProfile from "./pages/dashboard/EditProfile"; 

// 🔥 SETTINGS & HELP PAGES
import Settings from "./pages/dashboard/Settings";
import HelpSupport from "./pages/dashboard/HelpSupport";

// 🔥 MASTER SUBSCRIPTION PAGE
import Subscription from "./pages/dashboard/Subscription";

export default function App() {
  const [page, setPage] = useState("loading");
  const [quotationId, setQuotationId] = useState(null);
  const [user, setUser] = useState(null); 

  // ==========================================
  // 🔥 URL ROUTING & AUTH CHECK
  // ==========================================
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user"); 
    const path = window.location.pathname;

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data");
        localStorage.removeItem("user");
      }
    }

    // 1. PUBLIC Preview Link Check
    if (path.startsWith("/preview/")) {
      const idFromUrl = path.split("/")[2]; 
      if (idFromUrl && idFromUrl.length === 24) {
        setQuotationId(idFromUrl);
        setPage("preview");
        return; 
      }
    }

    // 2. Standard Auth Check
    if (token) {
      if (path.includes("/subscription")) setPage("subscription");
      else if (path.includes("/edit-profile")) setPage("edit-profile");
      else if (path.includes("/settings")) setPage("settings");
      else if (path.includes("/help")) setPage("help");
      else if (path.includes("/create")) setPage("create");
      else if (path.includes("/preview")) setPage("preview"); 
      else if (path.includes("/export")) setPage("export");
      else setPage("dashboard");
    } else {
      setPage("login");
    }
  }, []);

  // ==========================================
  // 🧭 NAVIGATION HANDLERS
  // ==========================================
  const navProps = {
    goToDashboard: () => {
      window.history.pushState({}, "", "/dashboard"); 
      setPage("dashboard");
    },

    goToCreate: () => {
      const now = new Date();
      const trialDate = user?.trialExpiresAt ? new Date(user.trialExpiresAt) : null;
      const isSubscribed = user?.isSubscribed;
      const isTrialUsedBefore = user?.isTrialUsed; 

      if (isSubscribed) {
        window.history.pushState({}, "", "/create");
        setPage("create");
      } 
      else if (isTrialUsedBefore) {
        alert("Trial limit reached! 🚨 Please subscribe to continue.");
        window.history.pushState({}, "", "/subscription");
        setPage("subscription");
      }
      else if (trialDate && trialDate < now) {
        alert("Trial period expired! ⏳ Please subscribe to continue.");
        window.history.pushState({}, "", "/subscription");
        setPage("subscription");
      } 
      else {
        window.history.pushState({}, "", "/create");
        setPage("create");
      }
    },

    goToPreview: () => {
      window.history.pushState({}, "", "/preview");
      setPage("preview");
    },

    goToExport: () => {
      window.history.pushState({}, "", "/export");
      setPage("export");
    },

    goToSubscription: () => { 
      window.history.pushState({}, "", "/subscription");
      setPage("subscription");
    },

    goToEditProfile: () => { 
      window.history.pushState({}, "", "/edit-profile");
      setPage("edit-profile");
    },

    goToSettings: () => { 
      window.history.pushState({}, "", "/settings");
      setPage("settings");
    },

    goToHelp: () => { 
      window.history.pushState({}, "", "/help");
      setPage("help");
    }
  };

  if (page === "loading") return null; 

  return (
    <>
      {/* 🔐 AUTHENTICATION */}
      {page === "login" && (
        <Login
          goToRegister={() => setPage("register")}
          goToForgot={() => setPage("forgot")}
          goToDashboard={() => {
            const loggedInUser = localStorage.getItem("user");
            if(loggedInUser) setUser(JSON.parse(loggedInUser));
            navProps.goToDashboard();
          }}
        />
      )}

      {page === "register" && <Register goToLogin={() => setPage("login")} />}
      {page === "forgot" && <ForgotPassword goToLogin={() => setPage("login")} />}

      {/* 📊 DASHBOARD ROUTES */}
      {page === "dashboard" && (
        <Dashboard {...navProps} user={user} setQuotationId={setQuotationId} />
      )}

      {page === "create" && (
        <CreateQuotation {...navProps} user={user} goBack={navProps.goToDashboard} setQuotationId={setQuotationId} quotationId={quotationId} />
      )}

      {/* 🔥 UPDATED PREVIEW ROUTE (Removed id prop, using only quotationId) */}
      {page === "preview" && (
        <Preview 
          {...navProps} 
          user={user} 
          goBack={navProps.goToCreate} 
          quotationId={quotationId} 
        />
      )}

      {page === "export" && (
        <Export {...navProps} user={user} goBack={navProps.goToPreview} quotationId={quotationId} />
      )}

      {/* 🔥 SUBSCRIPTION */}
      {page === "subscription" && (
        <Subscription {...navProps} user={user} />
      )}

      {/* 👤 EDIT PROFILE */}
      {page === "edit-profile" && (
        <EditProfile 
          {...navProps} 
          user={user} 
          setUser={setUser} 
          goBack={navProps.goToDashboard} 
        />
      )}

      {/* ⚙️ SETTINGS */}
      {page === "settings" && (
        <Settings {...navProps} user={user} />
      )}

      {/* ❓ HELP & SUPPORT */}
      {page === "help" && (
        <HelpSupport {...navProps} user={user} />
      )}
    </>
  );
}