import {
  LayoutDashboard,
  Search,
  Package,
  ClipboardList,
  Settings,
  LogOut,
  HeartHandshake,
  Clock,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function NGODashboard() {
  const navigate = useNavigate();

  const donations = [
    {
      food: "Vegetable Biryani",
      quantity: "20 servings",
      distance: "1.5 km away",
      status: "Available",
    },
    {
      food: "Fresh Bread",
      quantity: "15 packets",
      distance: "2.8 km away",
      status: "Available",
    },
    {
      food: "Mixed Vegetables",
      quantity: "10 kg",
      distance: "4.2 km away",
      status: "Requested",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#fdf6ec]">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col bg-[#0b306b] p-6 text-white md:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#16796f]">
            <HeartHandshake size={19} />
          </div>

          <span className="text-xl font-bold">FoodRescue</span>
        </div>

        <nav className="mt-12 space-y-2">
          <button className="flex w-full items-center gap-3 rounded-2xl bg-white/15 px-4 py-3 text-left font-medium">
            <LayoutDashboard size={19} />
            Dashboard
          </button>

          {/* Find Food */}
          <button
            onClick={() => navigate("/find-food")}
            className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-blue-100 transition hover:bg-white/10"
          >
            <Search size={19} />
            Find Food
          </button>

          {/* My Requests */}
          <button
            onClick={() => navigate("/ngo-requests")}
            className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-blue-100 transition hover:bg-white/10"
          >
            <Package size={19} />
            My Requests
          </button>

          {/* Deliveries */}
          <button
            onClick={() => navigate("/delivery-tracking")}
            className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-blue-100 transition hover:bg-white/10"
          >
            <ClipboardList size={19} />
            Deliveries
          </button>

          {/* Settings */}
          <button
            onClick={() => navigate("/settings")}
            className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-blue-100 transition hover:bg-white/10"
          >
            <Settings size={19} />
            Settings
          </button>
        </nav>

        <button className="mt-auto flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-blue-100 transition hover:bg-white/10">
          <LogOut size={19} />
          Logout
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 px-6 py-8 md:px-10">
        {/* Header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-[#16796f]">NGO Dashboard</p>

            <h1 className="mt-1 text-3xl font-bold text-[#0b306b]">
              Welcome back 👋
            </h1>

            <p className="mt-2 text-slate-500">
              Find food donations that match your community's needs.
            </p>
          </div>

          {/* Header Find Food */}
          <button
            onClick={() => navigate("/find-food")}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#0b306b] px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-[#16796f]"
          >
            <Search size={19} />
            Find Food
          </button>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-sm backdrop-blur-xl">
            <p className="text-sm text-slate-500">Available Food</p>

            <p className="mt-2 text-3xl font-bold text-[#0b306b]">12</p>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-sm backdrop-blur-xl">
            <p className="text-sm text-slate-500">Active Requests</p>

            <p className="mt-2 text-3xl font-bold text-[#4f81b7]">4</p>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-sm backdrop-blur-xl">
            <p className="text-sm text-slate-500">Meals Received</p>

            <p className="mt-2 text-3xl font-bold text-[#16796f]">320</p>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-sm backdrop-blur-xl">
            <p className="text-sm text-slate-500">Completed</p>

            <p className="mt-2 text-3xl font-bold text-[#0b306b]">18</p>
          </div>
        </div>

        {/* Content */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Available donations */}
          <section className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-sm backdrop-blur-xl lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#0b306b]">
                  Available Food
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Donations near your organization.
                </p>
              </div>

              <button
                onClick={() => navigate("/find-food")}
                className="flex cursor-pointer items-center gap-1 text-sm font-semibold text-[#16796f]"
              >
                View all
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {donations.map((donation) => (
                <div
                  key={donation.food}
                  className="flex flex-col justify-between gap-4 rounded-2xl bg-[#fdf6ec] p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fdd8a5] text-[#0b306b]">
                      <Package size={20} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-[#0b306b]">
                        {donation.food}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {donation.quantity}
                      </p>

                      <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                        <MapPin size={13} />
                        {donation.distance}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {donation.status === "Requested" ? (
                      <span className="flex items-center gap-1 text-sm font-semibold text-[#4f81b7]">
                        <Clock size={16} />
                        Requested
                      </span>
                    ) : (
                      <button
                        onClick={() => navigate("/find-food")}
                        className="cursor-pointer rounded-xl bg-[#16796f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0b306b]"
                      >
                        Request
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Need card */}
          <section className="rounded-3xl bg-[#0b306b] p-7 text-white shadow-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fdd8a5] text-[#0b306b]">
              <HeartHandshake size={23} />
            </div>

            <h2 className="mt-7 text-2xl font-bold">
              Your community needs matter.
            </h2>

            <p className="mt-3 text-sm leading-6 text-blue-100">
              Keep your food needs and capacity updated so FoodRescue can
              connect you with suitable donations.
            </p>

            <button className="mt-7 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#fdd8a5] px-5 py-3 font-semibold text-[#0b306b] transition hover:bg-white">
              Update Needs
              <ArrowRight size={17} />
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}

export default NGODashboard;
