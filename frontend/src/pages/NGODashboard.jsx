import { useEffect, useState } from "react";
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
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api";

function NGODashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [deliveries, setDeliveries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [donationsResponse, requestsResponse, deliveriesResponse] =
        await Promise.all([
          api.get("/donations/available"),
          api.get("/donation-requests/my"),
          api.get("/deliveries/ngo"),
        ]);

      console.log("NGO AVAILABLE DONATIONS:", donationsResponse.data);

      console.log("NGO REQUESTS:", requestsResponse.data);

      console.log("NGO DELIVERIES:", deliveriesResponse.data);

      setDonations(
        Array.isArray(donationsResponse.data?.donations)
          ? donationsResponse.data.donations
          : [],
      );

      setRequests(
        Array.isArray(requestsResponse.data?.requests)
          ? requestsResponse.data.requests
          : [],
      );

      setDeliveries(
        Array.isArray(deliveriesResponse.data?.deliveries)
          ? deliveriesResponse.data.deliveries
          : [],
      );
    } catch (error) {
      console.error("NGO DASHBOARD ERROR:", error);

      setError(
        error.response?.data?.message || "Could not load your dashboard data.",
      );
    } finally {
      setLoading(false);
    }
  };

  const activeRequests = requests.filter(
    (request) => request.status === "pending" || request.status === "accepted",
  );

  const completedDeliveries = deliveries.filter(
    (delivery) => delivery.deliveryStatus === "verified",
  );

  const formatCategory = (category) => {
    if (!category) return "";

    return category
      .replace("-", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex min-h-screen bg-[#fdf6ec]">
      {/* SIDEBAR */}
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

          <button
            onClick={() => navigate("/find-food")}
            className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-blue-100 transition hover:bg-white/10"
          >
            <Search size={19} />
            Find Food
          </button>

          <button
            onClick={() => navigate("/ngo-requests")}
            className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-blue-100 transition hover:bg-white/10"
          >
            <Package size={19} />
            My Requests
          </button>

          <button
            onClick={() => navigate("/delivery-tracking")}
            className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-blue-100 transition hover:bg-white/10"
          >
            <ClipboardList size={19} />
            Deliveries
          </button>

          <button
            onClick={() => navigate("/settings")}
            className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-blue-100 transition hover:bg-white/10"
          >
            <Settings size={19} />
            Settings
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-blue-100 transition hover:bg-white/10"
        >
          <LogOut size={19} />
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 px-6 py-8 md:px-10">
        {/* HEADER */}
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

          <button
            onClick={() => navigate("/find-food")}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#0b306b] px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-[#16796f]"
          >
            <Search size={19} />
            Find Food
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* STATS */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-sm backdrop-blur-xl">
            <p className="text-sm text-slate-500">Available Food</p>

            <p className="mt-2 text-3xl font-bold text-[#0b306b]">
              {loading ? "—" : donations.length}
            </p>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-sm backdrop-blur-xl">
            <p className="text-sm text-slate-500">Active Requests</p>

            <p className="mt-2 text-3xl font-bold text-[#4f81b7]">
              {loading ? "—" : activeRequests.length}
            </p>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-sm backdrop-blur-xl">
            <p className="text-sm text-slate-500">Total Requests</p>

            <p className="mt-2 text-3xl font-bold text-[#16796f]">
              {loading ? "—" : requests.length}
            </p>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-sm backdrop-blur-xl">
            <p className="text-sm text-slate-500">Completed Deliveries</p>

            <p className="mt-2 text-3xl font-bold text-[#0b306b]">
              {loading ? "—" : completedDeliveries.length}
            </p>
          </div>
        </div>

        {/* MAIN DASHBOARD CONTENT */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* AVAILABLE FOOD */}
          <section className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-sm backdrop-blur-xl lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#0b306b]">
                  Available Food
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Latest donations currently available.
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

            {/* LOADING */}
            {loading && (
              <div className="py-12 text-center text-sm text-slate-500">
                Loading available food...
              </div>
            )}

            {/* EMPTY */}
            {!loading && !error && donations.length === 0 && (
              <div className="mt-6 rounded-2xl bg-[#fdf6ec] px-5 py-10 text-center">
                <Package size={38} className="mx-auto text-[#4f81b7]" />

                <h3 className="mt-4 font-semibold text-[#0b306b]">
                  No food available right now
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Check again later for new food donations.
                </p>
              </div>
            )}

            {/* REAL DONATIONS */}
            {!loading && donations.length > 0 && (
              <div className="mt-6 space-y-4">
                {donations.slice(0, 3).map((donation) => (
                  <div
                    key={donation._id}
                    className="flex flex-col justify-between gap-4 rounded-2xl bg-[#fdf6ec] p-4 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fdd8a5] text-[#0b306b]">
                        <Package size={20} />
                      </div>

                      <div>
                        <h3 className="font-semibold text-[#0b306b]">
                          {donation.foodName}
                        </h3>

                        <p className="text-sm text-slate-500">
                          {donation.quantity} {donation.unit}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {formatCategory(donation.category)}
                        </p>

                        {donation.location?.address && (
                          <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                            <MapPin size={13} />

                            <span className="line-clamp-1">
                              {donation.location.address}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-xs font-semibold text-[#16796f]">
                        <Clock size={14} />
                        Until {formatTime(donation.pickupDeadline)}
                      </span>

                      <button
                        onClick={() => navigate("/find-food")}
                        className="cursor-pointer rounded-xl bg-[#16796f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0b306b]"
                      >
                        Request
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* COMMUNITY CARD */}
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

            <button
              onClick={() => navigate("/settings")}
              className="mt-7 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#fdd8a5] px-5 py-3 font-semibold text-[#0b306b] transition hover:bg-white"
            >
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
