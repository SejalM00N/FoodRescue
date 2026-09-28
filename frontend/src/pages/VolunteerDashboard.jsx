import { useEffect, useState } from "react";
import { Truck, CheckCircle, ArrowRight, MapPin, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import DashboardLayout from "../components/DashboardLayout.jsx";

function VolunteerDashboard() {
  const navigate = useNavigate();

  const [availableDeliveries, setAvailableDeliveries] = useState([]);
  const [myDeliveries, setMyDeliveries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [acceptingId, setAcceptingId] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [availableResponse, myResponse] = await Promise.all([
        api.get("/deliveries/available"),
        api.get("/deliveries/my"),
      ]);

      console.log("VOLUNTEER AVAILABLE DELIVERIES:", availableResponse.data);
      console.log("VOLUNTEER MY DELIVERIES:", myResponse.data);

      setAvailableDeliveries(
        Array.isArray(availableResponse.data?.deliveries)
          ? availableResponse.data.deliveries
          : [],
      );

      setMyDeliveries(
        Array.isArray(myResponse.data?.deliveries)
          ? myResponse.data.deliveries
          : [],
      );
    } catch (error) {
      console.error("VOLUNTEER DASHBOARD ERROR:", error);

      setError(
        error.response?.data?.message || "Could not load your dashboard data.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptPickup = async (deliveryId) => {
    try {
      setAcceptingId(deliveryId);
      setError("");

      const response = await api.put(`/deliveries/${deliveryId}/accept`);

      console.log("DELIVERY ACCEPTED:", response.data);

      navigate("/lets-deliver");
    } catch (error) {
      console.error("ACCEPT DELIVERY ERROR:", error);

      setError(
        error.response?.data?.message || "Could not accept this pickup.",
      );
    } finally {
      setAcceptingId("");
    }
  };

  const activeDeliveries = myDeliveries.filter((delivery) =>
    ["pending", "in_transit", "delivered"].includes(delivery.deliveryStatus),
  );

  const completedDeliveries = myDeliveries.filter(
    (delivery) => delivery.deliveryStatus === "verified",
  );

  const verifiedDeliveries = myDeliveries.filter(
    (delivery) => delivery.deliveryStatus === "verified",
  );

  const totalEarnings = verifiedDeliveries.reduce(
    (total, delivery) => total + Number(delivery.deliveryFee || 0),
    0,
  );

  const formatCategory = (category) => {
    if (!category) return "";

    return category
      .replace("-", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  return (
    <DashboardLayout role="volunteer">
      <div className="px-4 py-6 sm:px-6 sm:py-8 md:px-10">
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#16796f]">
              Volunteer Dashboard
            </p>

            <h1 className="mt-1 text-2xl font-bold text-[#0b306b] sm:text-3xl">
              Ready to rescue some food? 👋
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Find nearby pickups and help deliver food to NGOs.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/available-pickups")}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#0b306b] px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-[#16796f] sm:w-auto"
          >
            <Search size={19} />
            Available Pickups
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* STATS */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-white/70 bg-white/65 p-5 shadow-sm backdrop-blur-xl sm:p-6">
            <p className="text-sm text-slate-500">Available Pickups</p>

            <p className="mt-2 text-3xl font-bold text-[#0b306b]">
              {loading ? "—" : availableDeliveries.length}
            </p>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/65 p-5 shadow-sm backdrop-blur-xl sm:p-6">
            <p className="text-sm text-slate-500">Active Delivery</p>

            <p className="mt-2 text-3xl font-bold text-[#4f81b7]">
              {loading ? "—" : activeDeliveries.length}
            </p>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/65 p-5 shadow-sm backdrop-blur-xl sm:p-6">
            <p className="text-sm text-slate-500">Meals Delivered</p>

            <p className="mt-2 text-3xl font-bold text-[#16796f]">
              {loading ? "—" : completedDeliveries.length}
            </p>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/65 p-5 shadow-sm backdrop-blur-xl sm:p-6">
            <p className="text-sm text-slate-500">Earnings</p>

            <p className="mt-2 text-3xl font-bold text-[#0b306b]">
              {loading ? "—" : `₹${totalEarnings}`}
            </p>

            <p className="mt-1 text-xs text-slate-400">Delivery fees earned</p>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* AVAILABLE PICKUPS */}
          <section className="min-w-0 rounded-3xl border border-white/70 bg-white/65 p-5 shadow-sm backdrop-blur-xl sm:p-6 lg:col-span-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#0b306b]">
                  Available Pickups
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Food pickups currently waiting for a volunteer.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/available-pickups")}
                className="flex w-fit cursor-pointer items-center gap-1 text-sm font-semibold text-[#16796f]"
              >
                View all
                <ArrowRight size={16} />
              </button>
            </div>

            {/* LOADING */}
            {loading && (
              <div className="py-12 text-center text-sm text-slate-500">
                Loading available pickups...
              </div>
            )}

            {/* EMPTY */}
            {!loading && !error && availableDeliveries.length === 0 && (
              <div className="mt-6 rounded-2xl bg-[#fdf6ec] px-5 py-10 text-center">
                <Truck size={38} className="mx-auto text-[#4f81b7]" />

                <h3 className="mt-4 font-semibold text-[#0b306b]">
                  No pickups available
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  New pickup opportunities will appear here when donors and NGOs
                  are matched.
                </p>
              </div>
            )}

            {/* REAL PICKUPS */}
            {!loading && availableDeliveries.length > 0 && (
              <div className="mt-6 space-y-4">
                {availableDeliveries.slice(0, 3).map((delivery) => {
                  const donation = delivery.donation;
                  const ngo = delivery.ngo;

                  const isAccepting = acceptingId === delivery._id;

                  return (
                    <div
                      key={delivery._id}
                      className="rounded-2xl bg-[#fdf6ec] p-4"
                    >
                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fdd8a5] text-[#0b306b]">
                            <Truck size={20} />
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-semibold text-[#0b306b]">
                              {donation?.foodName || "Food Donation"}
                            </h3>

                            <p className="text-sm text-slate-500">
                              {donation?.quantity || ""} {donation?.unit || ""}
                            </p>

                            {donation?.category && (
                              <p className="mt-1 text-xs text-slate-400">
                                {formatCategory(donation.category)}
                              </p>
                            )}

                            <p className="mt-1 truncate text-xs text-slate-400">
                              Donor →{" "}
                              {donation?.location?.address || "Pickup location"}
                            </p>

                            <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                              <MapPin size={13} className="shrink-0" />
                              Delivery to {ngo?.name || "NGO"}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAcceptPickup(delivery._id)}
                          disabled={isAccepting}
                          className="w-full cursor-pointer rounded-xl bg-[#16796f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0b306b] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                        >
                          {isAccepting ? "Accepting..." : "Accept Pickup"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* IMPACT CARD */}
          <section className="rounded-3xl bg-[#0b306b] p-6 text-white shadow-xl sm:p-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fdd8a5] text-[#0b306b]">
              <CheckCircle size={23} />
            </div>

            <h2 className="mt-7 text-2xl font-bold">Your impact matters.</h2>

            <p className="mt-3 text-sm leading-6 text-blue-100">
              Every pickup you complete helps good food reach people who need
              it.
            </p>

            <div className="mt-7 rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-blue-100">Deliveries completed</p>

              <p className="mt-1 text-3xl font-bold">
                {loading ? "—" : completedDeliveries.length}
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/my-deliveries")}
              className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#fdd8a5] px-5 py-3 font-semibold text-[#0b306b] transition hover:bg-white"
            >
              View My Deliveries
              <ArrowRight size={17} />
            </button>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default VolunteerDashboard;
