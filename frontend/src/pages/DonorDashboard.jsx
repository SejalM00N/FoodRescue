import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  ClipboardList,
  Settings,
  LogOut,
  Utensils,
  Clock,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api";

function DonorDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await api.get("/donations/my");

      console.log("DONOR DASHBOARD DONATIONS:", response.data);

      const data = response.data;

      if (Array.isArray(data)) {
        setDonations(data);
      } else if (Array.isArray(data.donations)) {
        setDonations(data.donations);
      } else if (Array.isArray(data.data)) {
        setDonations(data.data);
      } else {
        setDonations([]);
      }
    } catch (error) {
      console.error("DONOR DASHBOARD ERROR:", error);
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  const totalDonations = donations.length;

  const activeDonations = donations.filter(
    (donation) =>
      donation.status === "available" ||
      donation.status === "requested" ||
      donation.status === "accepted" ||
      donation.status === "in_transit",
  ).length;

  const completedDonations = donations.filter(
    (donation) => donation.status === "completed",
  ).length;

  const mealsRescued = donations
    .filter((donation) => donation.unit === "servings")
    .reduce((total, donation) => total + Number(donation.quantity || 0), 0);

  const formatStatus = (status) => {
    if (!status) return "Available";

    return status
      .replace("_", " ")
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

  const recentDonations = [...donations]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 3);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#fdf6ec]">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col bg-[#0b306b] p-6 text-white md:flex">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#16796f]">
            <Utensils size={19} />
          </div>

          <span className="text-xl font-bold">FoodRescue</span>
        </div>

        {/* Navigation */}
        <nav className="mt-12 space-y-2">
          <button
            onClick={() => navigate("/donor-dashboard")}
            className="flex w-full cursor-pointer items-center gap-3 rounded-2xl bg-white/15 px-4 py-3 text-left font-medium"
          >
            <LayoutDashboard size={19} />
            Dashboard
          </button>

          <button
            onClick={() => navigate("/create-donation")}
            className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-blue-100 transition hover:bg-white/10"
          >
            <PlusCircle size={19} />
            Create Donation
          </button>

          <button
            onClick={() => navigate("/my-donations")}
            className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-blue-100 transition hover:bg-white/10"
          >
            <Package size={19} />
            My Donations
          </button>

          <button
            onClick={() => navigate("/donation-requests")}
            className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-blue-100 transition hover:bg-white/10"
          >
            <ClipboardList size={19} />
            Requests
          </button>

          <button
            onClick={() => navigate("/settings")}
            className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-blue-100 transition hover:bg-white/10"
          >
            <Settings size={19} />
            Settings
          </button>
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-auto flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-blue-100 transition hover:bg-white/10"
        >
          <LogOut size={19} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8 md:px-10">
        {/* Header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-[#16796f]">
              Donor Dashboard
            </p>

            <h1 className="mt-1 text-3xl font-bold text-[#0b306b]">
              Welcome back, {user?.name || "Donor"} 👋
            </h1>

            <p className="mt-2 text-slate-500">
              Here's what's happening with your food donations.
            </p>
          </div>

          <button
            onClick={() => navigate("/create-donation")}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#0b306b] px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-[#16796f]"
          >
            <PlusCircle size={19} />
            New Donation
          </button>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-sm backdrop-blur-xl">
            <p className="text-sm text-slate-500">Total Donations</p>

            <p className="mt-2 text-3xl font-bold text-[#0b306b]">
              {loading ? "..." : totalDonations}
            </p>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-sm backdrop-blur-xl">
            <p className="text-sm text-slate-500">Meals Rescued</p>

            <p className="mt-2 text-3xl font-bold text-[#16796f]">
              {loading ? "..." : mealsRescued}
            </p>

            {!loading && (
              <p className="mt-1 text-xs text-slate-400">Servings donated</p>
            )}
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-sm backdrop-blur-xl">
            <p className="text-sm text-slate-500">Active Donations</p>

            <p className="mt-2 text-3xl font-bold text-[#4f81b7]">
              {loading ? "..." : activeDonations}
            </p>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-sm backdrop-blur-xl">
            <p className="text-sm text-slate-500">Completed</p>

            <p className="mt-2 text-3xl font-bold text-[#0b306b]">
              {loading ? "..." : completedDonations}
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Recent Donations */}
          <section className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-sm backdrop-blur-xl lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#0b306b]">
                  Recent Donations
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Track your latest food donations.
                </p>
              </div>

              <button
                onClick={() => navigate("/my-donations")}
                className="flex cursor-pointer items-center gap-1 text-sm font-semibold text-[#16796f]"
              >
                View all
                <ArrowRight size={16} />
              </button>
            </div>

            {loading ? (
              <div className="py-12 text-center text-sm text-slate-500">
                Loading donations...
              </div>
            ) : recentDonations.length === 0 ? (
              <div className="py-12 text-center">
                <Package size={40} className="mx-auto text-[#4f81b7]" />

                <p className="mt-4 font-semibold text-[#0b306b]">
                  No donations yet
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Create your first donation to get started.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {recentDonations.map((donation) => (
                  <div
                    key={donation._id}
                    className="flex flex-col justify-between gap-4 rounded-2xl bg-[#fdf6ec] p-4 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fdd8a5] text-[#0b306b]">
                        <Utensils size={20} />
                      </div>

                      <div>
                        <h3 className="font-semibold text-[#0b306b]">
                          {donation.foodName}
                        </h3>

                        <p className="text-sm text-slate-500">
                          {donation.quantity} {donation.unit} •{" "}
                          {formatTime(donation.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {donation.status === "completed" && (
                        <CheckCircle size={17} className="text-[#16796f]" />
                      )}

                      {(donation.status === "accepted" ||
                        donation.status === "requested" ||
                        donation.status === "in_transit") && (
                        <Clock size={17} className="text-[#4f81b7]" />
                      )}

                      {donation.status === "available" && (
                        <Package size={17} className="text-[#16796f]" />
                      )}

                      <span className="text-sm font-semibold text-[#16796f]">
                        {formatStatus(donation.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Quick Action */}
          <section className="rounded-3xl bg-[#0b306b] p-7 text-white shadow-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fdd8a5] text-[#0b306b]">
              <PlusCircle size={23} />
            </div>

            <h2 className="mt-7 text-2xl font-bold">Have surplus food?</h2>

            <p className="mt-3 text-sm leading-6 text-blue-100">
              Post your available food and help it reach someone who needs it.
            </p>

            <button
              onClick={() => navigate("/create-donation")}
              className="mt-7 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#fdd8a5] px-5 py-3 font-semibold text-[#0b306b] transition hover:bg-white"
            >
              Create Donation
              <ArrowRight size={17} />
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}

export default DonorDashboard;
