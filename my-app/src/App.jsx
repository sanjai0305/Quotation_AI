import { useState } from "react";

// 🔐 AUTH
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

// 📊 PAGES
import Dashboard from "./pages/dashboard/Dashboard";
import CreateQuotation from "./pages/dashboard/CreateQuotation";
import Preview from "./pages/dashboard/Preview";
import Export from "./pages/dashboard/Export";
import Settings from "./pages/dashboard/Settings";

function App() {
  const [page, setPage] = useState("login");

  return (
    <>
      {/* 🔐 LOGIN */}
      {page === "login" && (
        <Login
          goToRegister={() => setPage("register")}
          goToForgot={() => setPage("forgot")}
          goToDashboard={() => setPage("dashboard")}
        />
      )}

      {/* 📝 REGISTER */}
      {page === "register" && (
        <Register goToLogin={() => setPage("login")} />
      )}

      {/* 🔑 FORGOT */}
      {page === "forgot" && (
        <ForgotPassword goToLogin={() => setPage("login")} />
      )}

      {/* 📊 DASHBOARD */}
      {page === "dashboard" && (
        <Dashboard
          goToDashboard={() => setPage("dashboard")}
          goToCreate={() => setPage("create")}
          goToPreview={() => setPage("preview")}
          goToExport={() => setPage("export")}
          goToSettings={() => setPage("settings")} // ✅ ADD
        />
      )}

      {/* 🧾 CREATE */}
      {page === "create" && (
        <CreateQuotation
          goBack={() => setPage("dashboard")}
          goToPreview={() => setPage("preview")}
          goToExport={() => setPage("export")}
          goToDashboard={() => setPage("dashboard")}
          goToSettings={() => setPage("settings")} // ✅ ADD
        />
      )}

      {/* 👀 PREVIEW */}
      {page === "preview" && (
        <Preview
          goBack={() => setPage("create")}
          goToExport={() => setPage("export")}
          goToDashboard={() => setPage("dashboard")} // ✅ ADD
          goToCreate={() => setPage("create")}       // ✅ ADD
          goToPreview={() => setPage("preview")}     // ✅ ADD
          goToSettings={() => setPage("settings")}   // ✅ ADD
        />
      )}

      {/* 📤 EXPORT */}
      {page === "export" && (
        <Export
          goBack={() => setPage("preview")}
          goToDashboard={() => setPage("dashboard")}
          goToCreate={() => setPage("create")}       // ✅ ADD
          goToPreview={() => setPage("preview")}     // ✅ ADD
          goToExport={() => setPage("export")}       // ✅ ADD
          goToSettings={() => setPage("settings")}   // ✅ ADD
        />
      )}

      {/* ⚙️ SETTINGS */}
      {page === "settings" && (
        <Settings
          goToDashboard={() => setPage("dashboard")}
          goToCreate={() => setPage("create")}
          goToPreview={() => setPage("preview")}
          goToExport={() => setPage("export")}
          goToSettings={() => setPage("settings")} // ✅ ADD
        />
      )}
    </>
  );
}

export default App;