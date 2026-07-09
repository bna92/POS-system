import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "./layout/Sidebar";
import { Topbar } from "./layout/Topbar";

export default function Layout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName") || "Administrador";
  const userRole = localStorage.getItem("userRole") || "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar mobileOpen={mobileNavOpen} onNavigate={() => setMobileNavOpen(false)} />

      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          userName={userName}
          userRole={userRole}
          onLogout={handleLogout}
          onMenuClick={() => setMobileNavOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
