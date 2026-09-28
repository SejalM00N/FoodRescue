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
import DashboardLayout from "../components/DashboardLayout.jsx";

function NGORequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const [requestsResponse, deliveriesResponse] = await Promise.all([
        api.get("/donation-requests/my"),
        api.get("/deliveries/ngo"),
      ]);

      console.log(
        "NGO REQUESTS RESPONSE:",
        JSON.stringify(requestsResponse.data, null, 2),
      );

      console.log(
        "NGO DELIVERIES RESPONSE:",
        JSON.stringify(deliveriesResponse.data, null, 2),
      );

      const requestData = Array.isArray(requestsResponse.data?.requests)
        ? requestsResponse.data.requests
        : [];

      const deliveryData = Array.isArray(deliveriesResponse.data?.deliveries)
        ? deliveriesResponse.data.deliveries
        : [];

      setRequests(requestData);
      setDeliveries(deliveryData);
    } catch (error) {
      console.error("Failed to load NGO requests:", error);

      setError(
        error.response?.data?.message ||
          "Could not load your food requests. Please try again.",
      );

      setRequests([]);
      setDeliveries([]);
    } finally {
      setLoading(false);
    }
  };

  const formatStatus = (request) => {
    if (request?.status === "delivered") {
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

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleTrackDelivery = (request) => {
    const delivery = deliveries.find(
      (item) => item.donation?._id === request.donation?._id,
    );

    if (delivery?._id) {
      navigate(`/ngo-verification?deliveryId=${delivery._id}`);
      return;
    }

    setError("Delivery tracking information is not available yet.");
  };

  const totalRequests = requests.length;

  const pendingRequests = requests.filter(
    (request) => request.status === "pending",
  ).length;

  const completedRequests = requests.filter(
    (request) => request.status === "delivered",
  ).length;

  return (
    <DashboardLayout role="ngo">
      <div className="min-w-0 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          {/* BACK */}
          <button
            type="button"
            onClick={() => navigate("/ngo-dashboard")}
            className="mb-6 flex cursor-pointer items-center gap-2 text-sm font-medium text-[#0b306b] transition hover:text-[#16796f]"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

          {/* HEADER */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#16796f]">
              NGO
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0b306b] sm:text-4xl">
              My Requests
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Track the food donations requested by your organization.
            </p>
          </div>

          {/* SUMMARY */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.75rem] border border-white/70 bg-white/65 p-5 shadow-sm backdrop-blur-xl sm:p-6">
              <p className="text-sm text-slate-500">Total Requests</p>

              <p className="mt-2 text-3xl font-bold text-[#0b306b]">
                {loading ? "—" : totalRequests}
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-white/70 bg-white/65 p-5 shadow-sm backdrop-blur-xl sm:p-6">
              <p className="text-sm text-slate-500">Pending</p>

              <p className="mt-2 text-3xl font-bold text-[#4f81b7]">
                {loading ? "—" : pendingRequests}
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-white/70 bg-white/65 p-5 shadow-sm backdrop-blur-xl sm:p-6">
              <p className="text-sm text-slate-500">Completed</p>

              <p className="mt-2 text-3xl font-bold text-[#16796f]">
                {loading ? "—" : completedRequests}
              </p>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* LOADING */}
          {loading && (
            <div className="mt-8 rounded-[2rem] border border-white/70 bg-white/65 p-10 text-center shadow-lg backdrop-blur-xl sm:p-12">
              <p className="text-sm font-medium text-[#16796f]">
                Loading your requests...
              </p>
            </div>
          )}

          {/* EMPTY */}
          {!loading && !error && requests.length === 0 && (
            <div className="mt-8 rounded-[2rem] border border-white/70 bg-white/65 p-8 text-center shadow-lg backdrop-blur-xl sm:p-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#dcecf8] text-[#0b306b]">
                <Package size={28} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-[#0b306b]">
                No requests yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Food donations you request will appear here.
              </p>

              <button
                type="button"
                onClick={() => navigate("/find-food")}
                className="mt-6 cursor-pointer rounded-xl bg-[#0b306b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#16796f]"
              >
                Find Food
              </button>
            </div>
          )}

          {/* REQUEST LIST */}
          {!loading && requests.length > 0 && (
            <section className="mt-8 rounded-[2rem] border border-white/70 bg-white/65 p-5 shadow-lg backdrop-blur-xl sm:p-6 md:p-8">
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
                      className="rounded-2xl bg-[#fdf6ec] p-4 sm:p-5"
                    >
                      <div className="flex flex-col gap-5">
                        {/* FOOD INFORMATION */}
                        <div className="flex min-w-0 items-start gap-4">
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

                          <div className="min-w-0 flex-1">
                            <h3 className="break-words font-bold text-[#0b306b]">
                              {donation?.foodName || "Food donation"}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                              {donation?.quantity || "—"} {donation?.unit || ""}{" "}
                              • {donation?.donor?.name || "Donor"}
                            </p>

                            <p className="mt-1 flex items-start gap-1 text-xs leading-5 text-slate-400">
                              <MapPin size={13} className="mt-0.5 shrink-0" />

                              <span className="break-words">
                                {donation?.location?.address ||
                                  "Location unavailable"}{" "}
                                • Requested {formatDate(request.createdAt)}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* STATUS + ACTION */}
                        <div className="flex flex-col gap-3 border-t border-slate-200/60 pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                          <span
                            className={`flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${getStatusStyle(
                              status,
                            )}`}
                          >
                            {getStatusIcon(status)}
                            {status}
                          </span>

                          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                            {status === "Accepted" && (
                              <button
                                type="button"
                                onClick={() => handleTrackDelivery(request)}
                                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0b306b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#16796f] sm:w-auto"
                              >
                                <Truck size={16} />
                                Track Delivery
                              </button>
                            )}

                            {status === "Completed" && (
                              <span className="text-xs font-medium text-[#16796f] sm:text-right">
                                Food successfully received
                              </span>
                            )}
                          </div>
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
    </DashboardLayout>
  );
}

export default NGORequests;
