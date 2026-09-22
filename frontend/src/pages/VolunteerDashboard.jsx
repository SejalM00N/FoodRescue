import {
  LayoutDashboard,
  Search,
  Truck,
  Map,
  Settings,
  LogOut,
  Bike,
  Clock,
  CheckCircle,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function VolunteerDashboard() {
  const navigate = useNavigate();

  const pickups = [
    {
      food: "Vegetable Biryani",
      quantity: "20 servings",
      donor: "Green Kitchen",
      ngo: "Helping Hands NGO",
      distance: "3.2 km",
      status: "Available",
    },
    {
      food: "Fresh Bread",
      quantity: "15 packets",
      donor: "City Bakery",
      ngo: "Hope Foundation",
      distance: "4.5 km",
      status: "Available",
    },
    {
      food: "Fruit Boxes",
      quantity: "25 boxes",
      donor: "Community Events",
      ngo: "Care Community",
      distance: "6.1 km",
      status: "Accepted",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#fdf6ec]">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col bg-[#0b306b] p-6 text-white md:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#16796f]">
            <Bike size={19} />
          </div>

          <span className="text-xl font-bold">FoodRescue</span>
        </div>

        <nav className="mt-12 space-y-2">
          <button className="flex w-full items-center gap-3 rounded-2xl bg-white/15 px-4 py-3 text-left font-medium">
            <LayoutDashboard size={19} />
            Dashboard
          </button>

          <button className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-blue-100 transition hover:bg-white/10">
            <Search size={19} />
            Find Pickups
          </button>

          <button className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-blue-100 transition hover:bg-white/10">
            <Truck size={19} />
            My Deliveries
          </button>

          <button className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-blue-100 transition hover:bg-white/10">
            <Map size={19} />
            Map
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
            <p className="text-sm font-medium text-[#16796f]">
              Volunteer Dashboard
            </p>

            <h1 className="mt-1 text-3xl font-bold text-[#0b306b]">
              Ready to rescue some food? 👋
            </h1>

            <p className="mt-2 text-slate-500">
              Find nearby pickups and help deliver food to NGOs.
            </p>
          </div>

          <button className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#0b306b] px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-[#16796f]">
            <Search size={19} />
            Find Pickup
          </button>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-sm backdrop-blur-xl">
            <p className="text-sm text-slate-500">Available Pickups</p>

            <p className="mt-2 text-3xl font-bold text-[#0b306b]">8</p>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-sm backdrop-blur-xl">
            <p className="text-sm text-slate-500">Active Delivery</p>

            <p className="mt-2 text-3xl font-bold text-[#4f81b7]">1</p>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-sm backdrop-blur-xl">
            <p className="text-sm text-slate-500">Meals Delivered</p>

            <p className="mt-2 text-3xl font-bold text-[#16796f]">156</p>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-sm backdrop-blur-xl">
            <p className="text-sm text-slate-500">Completed</p>

            <p className="mt-2 text-3xl font-bold text-[#0b306b]">42</p>
          </div>
        </div>

        {/* Content */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Pickups */}
          <section className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-sm backdrop-blur-xl lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#0b306b]">
                  Nearby Pickups
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Food pickups available near you.
                </p>
              </div>

              <button className="flex cursor-pointer items-center gap-1 text-sm font-semibold text-[#16796f]">
                View all
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {pickups.map((pickup) => (
                <div key={pickup.food} className="rounded-2xl bg-[#fdf6ec] p-4">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fdd8a5] text-[#0b306b]">
                        <Truck size={20} />
                      </div>

                      <div>
                        <h3 className="font-semibold text-[#0b306b]">
                          {pickup.food}
                        </h3>

                        <p className="text-sm text-slate-500">
                          {pickup.quantity}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {pickup.donor} → {pickup.ngo}
                        </p>

                        <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                          <MapPin size={13} />
                          {pickup.distance}
                        </div>
                      </div>
                    </div>

                    {pickup.status === "Available" ? (
                      <button className="cursor-pointer rounded-xl bg-[#16796f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0b306b]">
                        Accept Pickup
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 text-sm font-semibold text-[#4f81b7]">
                        <Clock size={16} />
                        Accepted
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Impact card */}
          <section className="rounded-3xl bg-[#0b306b] p-7 text-white shadow-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fdd8a5] text-[#0b306b]">
              <CheckCircle size={23} />
            </div>

            <h2 className="mt-7 text-2xl font-bold">Your impact matters.</h2>

            <p className="mt-3 text-sm leading-6 text-blue-100">
              Every pickup you complete helps good food reach people who need
              it.
            </p>

            <div className="mt-7 rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-blue-100">Meals delivered</p>

              <p className="mt-1 text-3xl font-bold">156</p>
            </div>

            <button className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#fdd8a5] px-5 py-3 font-semibold text-[#0b306b] transition hover:bg-white">
              View My Impact
              <ArrowRight size={17} />
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}

export default VolunteerDashboard;
