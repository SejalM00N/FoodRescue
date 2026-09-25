import {
  ArrowLeft,
  CheckCircle,
  Clock,
  ImageOff,
  MapPin,
  Package,
  Truck,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function NGORequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/donation-requests/my");

      console.log(
        "NGO REQUESTS RESPONSE:",
        JSON.stringify(response.data, null, 2),
      );

      const requestData = Array.isArray(response.data?.requests)
        ? response.data.requests
        : [];

      setRequests(requestData);
    } catch (error) {
      console.error("Failed to load NGO requests:", error);

      setError(
        error.response?.data?.message ||
          "Could not load your food requests. Please try again.",
      );

      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const formatStatus = (request) => {
    if (request?.donation?.status === "completed") {
      return "Completed";
    }

    if (request?.status === "accepted") {
      return "Accepted";
    }

    if (request?.status === "rejected") {
      return "Rejected";
    }

    return "Pending";
  };

  const getStatusStyle = (status) => {
    if (status === "Accepted") {
      return "bg-[#dcecf8] text-[#0b306b]";
    }

    if (status === "Completed") {
      return "bg-[#dcefeb] text-[#16796f]";
    }

    if (status === "Rejected") {
      return "bg-red-50 text-red-600";
    }

    return "bg-[#fff0d9] text-[#9a6500]";
  };

  const getStatusIcon = (status) => {
    if (status === "Accepted") {
      return <Truck size={16} />;
    }

    if (status === "Completed") {
      return <CheckCircle size={16} />;
    }

    if (status === "Rejected") {
      return <XCircle size={16} />;
    }

    return <Clock size={16} />;
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const totalRequests = requests.length;

  const pendingRequests = requests.filter(
    (request) => request.status === "pending",
  ).length;

  const completedRequests = requests.filter(
    (request) => request?.donation?.status === "completed",
  ).length;

  return (
    <div className="min-h-screen bg-[#fdf6ec] px-6 py-8">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-[#0b306b] transition hover:text-[#16796f]"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#16796f]">
            NGO
          </p>

          <h1 className="mt-2 text-4xl font-bold text-[#0b306b]">
            My Requests
          </h1>

          <p className="mt-2 text-slate-500">
            Track the food donations requested by your organization.
          </p>
        </div>

        {/* Summary */}
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-sm backdrop-blur-xl">
            <p className="text-sm text-slate-500">Total Requests</p>

            <p className="mt-2 text-3xl font-bold text-[#0b306b]">
              {totalRequests}
            </p>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-sm backdrop-blur-xl">
            <p className="text-sm text-slate-500">Pending</p>

            <p className="mt-2 text-3xl font-bold text-[#4f81b7]">
              {pendingRequests}
            </p>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-sm backdrop-blur-xl">
            <p className="text-sm text-slate-500">Completed</p>

            <p className="mt-2 text-3xl font-bold text-[#16796f]">
              {completedRequests}
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-12 rounded-[2rem] border border-white/70 bg-white/65 p-12 text-center shadow-lg backdrop-blur-xl">
            <p className="text-sm font-medium text-[#16796f]">
              Loading your requests...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && requests.length === 0 && (
          <div className="mt-8 rounded-[2rem] border border-white/70 bg-white/65 p-12 text-center shadow-lg backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#dcecf8] text-[#0b306b]">
              <Package size={28} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#0b306b]">
              No requests yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Food donations you request will appear here.
            </p>

            <button
              onClick={() => navigate("/find-food")}
              className="mt-6 rounded-xl bg-[#0b306b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#16796f]"
            >
              Find Food
            </button>
          </div>
        )}

        {/* Request list */}
        {!loading && requests.length > 0 && (
          <section className="mt-8 rounded-[2rem] border border-white/70 bg-white/65 p-6 shadow-lg backdrop-blur-xl md:p-8">
            <div>
              <h2 className="text-xl font-bold text-[#0b306b]">
                Request History
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                View the current status of your food requests.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {requests.map((request) => {
                const donation = request.donation;
                const status = formatStatus(request);

                return (
                  <div
                    key={request._id}
                    className="rounded-2xl bg-[#fdf6ec] p-5"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      {/* Food */}
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-[#fdd8a5]">
                          {donation?.imageUrl ? (
                            <img
                              src={donation.imageUrl}
                              alt={donation.foodName || "Food donation"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[#0b306b]">
                              <ImageOff size={22} />
                            </div>
                          )}
                        </div>

                        <div>
                          <h3 className="font-bold text-[#0b306b]">
                            {donation?.foodName || "Food donation"}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            {donation?.quantity || "—"} {donation?.unit || ""} •{" "}
                            {donation?.donor?.name || "Donor"}
                          </p>

                          <p className="mt-1 flex items-start gap-1 text-xs text-slate-400">
                            <MapPin size={13} className="mt-0.5 shrink-0" />

                            <span>
                              {donation?.location?.address ||
                                "Location unavailable"}{" "}
                              • Requested {formatDate(request.createdAt)}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Status + Action */}
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${getStatusStyle(
                            status,
                          )}`}
                        >
                          {getStatusIcon(status)}
                          {status}
                        </span>

                        {status === "Accepted" && (
                          <button
                            onClick={() => navigate("/delivery-tracking")}
                            className="flex items-center gap-2 rounded-xl bg-[#0b306b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#16796f]"
                          >
                            <Truck size={16} />
                            Track Delivery
                          </button>
                        )}

                        {status === "Completed" && (
                          <span className="text-xs font-medium text-[#16796f]">
                            Food successfully received
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default NGORequests;
