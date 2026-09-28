import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Package, Truck, Clock, CheckCircle } from "lucide-react";

import api from "../services/api";
import DashboardLayout from "../components/DashboardLayout.jsx";

function NGODeliveries() {
  const navigate = useNavigate();

  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/deliveries/ngo");

      setDeliveries(response.data.deliveries || []);
    } catch (error) {
      console.error("FETCH NGO DELIVERIES ERROR:", error);

      setError(
        error.response?.data?.message || "Could not load your deliveries.",
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getStatus = (delivery) => {
    if (delivery.otpVerified) {
      return {
        label: "Completed",
        icon: CheckCircle,
        className: "bg-green-50 text-green-700",
      };
    }

    if (delivery.deliveryStatus === "delivered") {
      return {
        label: "Ready for Verification",
        icon: Clock,
        className: "bg-[#fff8ed] text-[#a66a00]",
      };
    }

    if (delivery.pickupStatus === "picked_up") {
      return {
        label: "In Transit",
        icon: Truck,
        className: "bg-blue-50 text-blue-700",
      };
    }

    return {
      label: "Pending",
      icon: Clock,
      className: "bg-slate-100 text-slate-600",
    };
  };

  return (
    <DashboardLayout role="ngo">
      <div className="min-h-screen bg-[#fdf6ec] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#16796f] sm:text-sm">
              NGO Deliveries
            </p>

            <h1 className="mt-2 text-2xl font-bold text-[#0b306b] sm:text-3xl">
              Your Food Deliveries
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Track deliveries connected to your food requests and verify
              completed deliveries.
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="rounded-3xl bg-white/70 p-8 text-center text-sm text-slate-500 shadow-lg backdrop-blur-xl">
              Loading deliveries...
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-3xl bg-red-50 p-6 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && deliveries.length === 0 && (
            <div className="rounded-3xl bg-white/70 p-8 text-center shadow-lg backdrop-blur-xl sm:p-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#dcecf8] text-[#0b306b]">
                <Package size={28} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-[#0b306b]">
                No deliveries yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Once a food request is accepted and assigned for delivery, it
                will appear here.
              </p>
            </div>
          )}

          {/* Delivery Cards */}
          {!loading && !error && deliveries.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2">
              {deliveries.map((delivery) => {
                const status = getStatus(delivery);
                const StatusIcon = status.icon;

                return (
                  <div
                    key={delivery._id}
                    className="rounded-3xl border border-white/70 bg-white/65 p-5 shadow-lg backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-xl sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fdd8a5] text-[#0b306b]">
                          <Package size={21} />
                        </div>

                        <div className="min-w-0">
                          <h2 className="truncate font-bold text-[#0b306b]">
                            {delivery.donation?.foodName || "Food Donation"}
                          </h2>

                          <p className="mt-1 text-sm text-slate-500">
                            {delivery.donation?.quantity || ""}{" "}
                            {delivery.donation?.unit || ""}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
                      >
                        <StatusIcon size={14} />
                        <span className="hidden sm:inline">{status.label}</span>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400">
                          Volunteer
                        </p>

                        <p className="mt-1 break-words text-sm font-semibold text-[#0b306b]">
                          {delivery.volunteer?.name || "Not assigned"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400">
                          Updated
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#0b306b]">
                          {formatDate(delivery.updatedAt)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/ngo-verification?deliveryId=${delivery._id}`)
                      }
                      className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#0b306b] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#16796f]"
                    >
                      View Delivery
                      <ArrowRight size={17} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default NGODeliveries;
