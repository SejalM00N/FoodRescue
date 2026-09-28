import { useEffect, useState } from "react";
import {
  Package,
  HeartHandshake,
  Clock,
  ArrowRight,
  MapPin,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import DashboardLayout from "../components/DashboardLayout.jsx";

function NGODashboard() {
  const navigate = useNavigate();

  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [deliveries, setDeliveries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <DashboardLayout role="ngo">
      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          {/* HEADER */}
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#16796f]">
                NGO Dashboard
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0b306b] sm:text-4xl">
                Welcome back 👋
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Find food donations that match your community&apos;s needs.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/find-food")}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#0b306b] px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-[#16796f] md:w-auto"
            >
              <Search size={19} />
              Find Food
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* STATS */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-[1.75rem] border border-white/70 bg-white/65 p-5 shadow-sm backdrop-blur-xl sm:p-6">
              <p className="text-sm text-slate-500">Available Food</p>

              <p className="mt-2 text-3xl font-bold text-[#0b306b]">
                {loading ? "—" : donations.length}
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-white/70 bg-white/65 p-5 shadow-sm backdrop-blur-xl sm:p-6">
              <p className="text-sm text-slate-500">Active Requests</p>

              <p className="mt-2 text-3xl font-bold text-[#4f81b7]">
                {loading ? "—" : activeRequests.length}
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-white/70 bg-white/65 p-5 shadow-sm backdrop-blur-xl sm:p-6">
              <p className="text-sm text-slate-500">Total Requests</p>

              <p className="mt-2 text-3xl font-bold text-[#16796f]">
                {loading ? "—" : requests.length}
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-white/70 bg-white/65 p-5 shadow-sm backdrop-blur-xl sm:p-6">
              <p className="text-sm text-slate-500">Completed Deliveries</p>

              <p className="mt-2 text-3xl font-bold text-[#0b306b]">
                {loading ? "—" : completedDeliveries.length}
              </p>
            </div>
          </div>

          {/* MAIN DASHBOARD CONTENT */}
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {/* AVAILABLE FOOD */}
            <section className="min-w-0 rounded-[2rem] border border-white/70 bg-white/65 p-5 shadow-sm backdrop-blur-xl sm:p-6 lg:col-span-2">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#0b306b]">
                    Available Food
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Latest donations currently available.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/find-food")}
                  className="flex w-fit cursor-pointer items-center gap-1 text-sm font-semibold text-[#16796f] transition hover:text-[#0b306b]"
                >
                  View all
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* LOADING */}
              {loading && (
                <div className="flex min-h-[220px] items-center justify-center text-center text-sm text-slate-500">
                  Loading available food...
                </div>
              )}

              {/* EMPTY */}
              {!loading && !error && donations.length === 0 && (
                <div className="mt-6 rounded-2xl bg-[#fdf6ec] px-5 py-12 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#dcecf8] text-[#4f81b7]">
                    <Package size={27} />
                  </div>

                  <h3 className="mt-4 font-semibold text-[#0b306b]">
                    No food available right now
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    Check again later for new food donations.
                  </p>

                  <button
                    type="button"
                    onClick={fetchDashboardData}
                    className="mt-5 rounded-xl bg-[#0b306b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#16796f]"
                  >
                    Refresh
                  </button>
                </div>
              )}

              {/* REAL DONATIONS */}
              {!loading && donations.length > 0 && (
                <div className="mt-6 space-y-4">
                  {donations.slice(0, 3).map((donation) => (
                    <div
                      key={donation._id}
                      className="rounded-2xl bg-[#fdf6ec] p-4 sm:p-5"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex min-w-0 items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fdd8a5] text-[#0b306b]">
                            <Package size={20} />
                          </div>

                          <div className="min-w-0">
                            <h3 className="break-words font-semibold text-[#0b306b]">
                              {donation.foodName}
                            </h3>

                            <p className="mt-0.5 text-sm text-slate-500">
                              {donation.quantity} {donation.unit}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {formatCategory(donation.category)}
                            </p>

                            {donation.location?.address && (
                              <div className="mt-1.5 flex min-w-0 items-start gap-1 text-xs text-slate-400">
                                <MapPin size={13} className="mt-0.5 shrink-0" />

                                <span className="line-clamp-2">
                                  {donation.location.address}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-slate-200/60 pt-3 lg:min-w-[190px] lg:border-t-0 lg:pt-0">
                          <span className="flex items-center gap-1 text-xs font-semibold text-[#16796f]">
                            <Clock size={14} />
                            Until {formatTime(donation.pickupDeadline)}
                          </span>

                          <button
                            type="button"
                            onClick={() => navigate("/find-food")}
                            className="flex w-full cursor-pointer items-center justify-center rounded-xl bg-[#16796f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b306b]"
                          >
                            Request
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* COMMUNITY CARD */}
            <section className="flex flex-col rounded-[2rem] bg-[#0b306b] p-6 text-white shadow-xl sm:p-7">
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
                type="button"
                onClick={() => navigate("/settings")}
                className="mt-auto flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#fdd8a5] px-5 py-3 font-semibold text-[#0b306b] transition hover:bg-white"
              >
                Update Needs
                <ArrowRight size={17} />
              </button>
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default NGODashboard;
