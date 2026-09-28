import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar.jsx";

function DashboardLayout({ role, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#fdf6ec]">
      <Sidebar
        role={role}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-w-0 flex-1">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/70 bg-[#fdf6ec]/90 px-4 py-3 backdrop-blur-xl md:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl bg-[#0b306b] text-white shadow-md"
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>

          <div>
            <p className="text-base font-bold text-[#0b306b]">FoodRescue</p>

            <p className="text-xs text-slate-500">
              {role === "donor"
                ? "Donor"
                : role === "ngo"
                  ? "NGO"
                  : "Volunteer"}
            </p>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
