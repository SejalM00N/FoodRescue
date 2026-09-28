import {
  LayoutDashboard,
  PlusCircle,
  Package,
  ClipboardList,
  Settings,
  LogOut,
  Utensils,
  HeartHandshake,
  Bike,
  MapPin,
  Truck,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Sidebar({ role, isOpen, onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navigation = {
    donor: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/donor-dashboard",
      },
      {
        label: "Create Donation",
        icon: PlusCircle,
        path: "/create-donation",
      },
      {
        label: "My Donations",
        icon: Package,
        path: "/my-donations",
      },
      {
        label: "Requests",
        icon: ClipboardList,
        path: "/donation-requests",
      },
      {
        label: "Settings",
        icon: Settings,
        path: "/settings",
      },
    ],

    ngo: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/ngo-dashboard",
      },
      {
        label: "Find Food",
        icon: Package,
        path: "/find-food",
      },
      {
        label: "My Requests",
        icon: ClipboardList,
        path: "/ngo-requests",
      },
      {
        label: "Deliveries",
        icon: Truck,
        path: "/ngo-deliveries",
      },
      {
        label: "Settings",
        icon: Settings,
        path: "/settings",
      },
    ],

    volunteer: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/volunteer-dashboard",
      },
      {
        label: "Available Pickups",
        icon: Package,
        path: "/available-pickups",
      },
      {
        label: "Let's Deliver",
        icon: MapPin,
        path: "/lets-deliver",
      },
      {
        label: "My Deliveries",
        icon: Bike,
        path: "/my-deliveries",
      },
      {
        label: "Settings",
        icon: Settings,
        path: "/settings",
      },
    ],
  };

  const roleDetails = {
    donor: {
      label: "Donor",
      icon: Utensils,
    },
    ngo: {
      label: "NGO",
      icon: HeartHandshake,
    },
    volunteer: {
      label: "Volunteer",
      icon: Bike,
    },
  };

  const currentNavigation = navigation[role] || [];
  const details = roleDetails[role] || roleDetails.donor;
  const RoleIcon = details.icon;

  const handleNavigation = (path) => {
    navigate(path);
    onClose?.();
  };

  const handleLogout = () => {
    logout();
    onClose?.();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#0b306b] p-6 text-white
          shadow-2xl transition-transform duration-300 ease-in-out
          md:static md:z-auto md:w-64 md:translate-x-0 md:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo / Mobile close */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() =>
              handleNavigation(
                role === "donor"
                  ? "/donor-dashboard"
                  : role === "ngo"
                    ? "/ngo-dashboard"
                    : "/volunteer-dashboard",
              )
            }
            className="flex cursor-pointer items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#16796f]">
              <RoleIcon size={19} />
            </div>

            <span className="text-xl font-bold">FoodRescue</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-blue-100 transition hover:bg-white/10 md:hidden"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Role label */}
        <div className="mt-8 rounded-2xl bg-white/10 px-4 py-3">
          <p className="text-xs uppercase tracking-wider text-blue-200">
            Current role
          </p>

          <p className="mt-1 font-semibold">{details.label}</p>
        </div>

        {/* Navigation */}
        <nav className="mt-8 space-y-2">
          {currentNavigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNavigation(item.path)}
                className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-blue-100 transition hover:bg-white/10 hover:text-white"
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="mt-auto flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-blue-100 transition hover:bg-white/10 hover:text-white"
        >
          <LogOut size={19} />
          Logout
        </button>
      </aside>
    </>
  );
}

export default Sidebar;
