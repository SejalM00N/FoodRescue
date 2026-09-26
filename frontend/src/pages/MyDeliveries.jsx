import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  PackageCheck,
  IndianRupee,
  CalendarDays,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const MyDeliveries = () => {
  const navigate = useNavigate();

  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/deliveries/my");

      setDeliveries(response.data.deliveries || []);
    } catch (err) {
      console.error("MY DELIVERIES ERROR:", err);

      setError(
        err.response?.data?.message || "Could not load your delivery history.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const completedDeliveries = deliveries.filter(
    (delivery) => delivery.deliveryStatus === "verified",
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fbff] via-[#eef6ff] to-[#fff8ef] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/volunteer-dashboard")}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-white/80 bg-white/70 px-4 py-2.5 text-sm font-semibold text-[#0b306b] shadow-sm backdrop-blur-xl transition hover:bg-white hover:shadow-md"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0b306b] text-white shadow-sm">
              <PackageCheck size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#0b306b]">
                My Deliveries
              </h1>

              <p className="text-sm text-gray-500">
                Your completed food rescue deliveries
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                Completed Deliveries
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7f7f3] text-[#16796f]">
                <CheckCircle2 size={20} />
              </div>
            </div>

            <p className="text-3xl font-bold text-[#0b306b]">
              {loading ? "—" : completedDeliveries.length}
            </p>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                Delivery Fees Earned
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff3df] text-[#b87924]">
                <IndianRupee size={20} />
              </div>
            </div>

            <p className="text-3xl font-bold text-[#0b306b]">
              {loading
                ? "—"
                : `₹${completedDeliveries.reduce(
                    (total, delivery) =>
                      total + Number(delivery.deliveryFee || 0),
                    0,
                  )}`}
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[250px] items-center justify-center rounded-3xl border border-white/70 bg-white/70 shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-3 text-gray-500">
              <Loader2 className="animate-spin" size={20} />
              <span>Loading your deliveries...</span>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-medium text-red-600">{error}</p>

            <button
              onClick={fetchDeliveries}
              className="mt-4 rounded-xl bg-[#0b306b] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#082653]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && completedDeliveries.length === 0 && (
          <div className="rounded-3xl border border-white/70 bg-white/70 px-6 py-16 text-center shadow-sm backdrop-blur-xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eef5fc] text-[#4f81b7]">
              <PackageCheck size={30} />
            </div>

            <h2 className="text-lg font-semibold text-[#0b306b]">
              No completed deliveries yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              Your verified deliveries will appear here after you successfully
              complete a food rescue pickup and delivery.
            </p>
          </div>
        )}

        {/* Delivery history */}
        {!loading && !error && completedDeliveries.length > 0 && (
          <div className="space-y-5">
            {completedDeliveries.map((delivery) => (
              <div
                key={delivery._id}
                className="overflow-hidden rounded-3xl border border-white/70 bg-white/75 shadow-sm backdrop-blur-xl"
              >
                {/* Card header */}
                <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-[#0b306b]">
                      {delivery.donation?.foodName || "Food Donation"}
                    </h2>

                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                      <CalendarDays size={15} />

                      <span>{formatDate(delivery.updatedAt)}</span>
                    </div>
                  </div>

                  <div className="flex w-fit items-center gap-2 rounded-full bg-[#e7f7f3] px-3 py-1.5 text-sm font-semibold text-[#16796f]">
                    <CheckCircle2 size={16} />
                    Verified
                  </div>
                </div>

                {/* Card content */}
                <div className="grid gap-5 p-5 md:grid-cols-3">
                  {/* Pickup */}
                  <div className="rounded-2xl bg-[#f8fbff] p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#0b306b]">
                      <MapPin size={17} />
                      Pickup Location
                    </div>

                    <p className="text-sm leading-6 text-gray-600">
                      {delivery.donation?.location?.address ||
                        "Pickup location unavailable"}
                    </p>
                  </div>

                  {/* Destination */}
                  <div className="rounded-2xl bg-[#f8fbff] p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#0b306b]">
                      <MapPin size={17} />
                      NGO Destination
                    </div>

                    <p className="text-sm leading-6 text-gray-600">
                      {delivery.deliveryLocation?.address ||
                        "Delivery location unavailable"}
                    </p>
                  </div>

                  {/* Earnings */}
                  <div className="rounded-2xl bg-[#fff8ef] p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#9a651f]">
                      <IndianRupee size={17} />
                      Delivery Fee
                    </div>

                    <p className="text-xl font-bold text-[#0b306b]">
                      ₹{Number(delivery.deliveryFee || 0)}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Added after NGO verification
                    </p>
                  </div>
                </div>

                {/* Food details */}
                <div className="grid gap-3 border-t border-gray-100 bg-white/40 p-5 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Category
                    </p>

                    <p className="mt-1 text-sm font-medium capitalize text-gray-700">
                      {delivery.donation?.category?.replace("-", " ") || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Quantity
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {delivery.donation?.quantity || "—"}{" "}
                      {delivery.donation?.unit || ""}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Delivery Status
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#16796f]">
                      Successfully completed
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDeliveries;
