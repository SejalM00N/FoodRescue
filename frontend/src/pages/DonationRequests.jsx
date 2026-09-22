import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Clock,
  HeartHandshake,
  MessageSquare,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function DonationRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/donation-requests/donor");

      console.log("DONOR REQUESTS RESPONSE:", response.data);

      const data = response.data;

      if (Array.isArray(data)) {
        setRequests(data);
      } else if (Array.isArray(data.requests)) {
        setRequests(data.requests);
      } else if (Array.isArray(data.data)) {
        setRequests(data.data);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error("DONOR REQUESTS ERROR:", error);

      setError(
        error.response?.data?.message || "Could not load donation requests.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRequestStatus = async (requestId, status) => {
    try {
      setUpdatingId(requestId);
      setError("");

      const response = await api.put(`/donation-requests/${requestId}`, {
        status,
      });

      console.log("REQUEST STATUS UPDATED:", response.data);

      await fetchRequests();
    } catch (error) {
      console.error("REQUEST STATUS ERROR:", error);

      setError(
        error.response?.data?.message || "Could not update the request.",
      );
    } finally {
      setUpdatingId("");
    }
  };

  const getStatusStyle = (status) => {
    if (status === "accepted") {
      return "bg-[#dcefeb] text-[#16796f]";
    }

    if (status === "rejected") {
      return "bg-red-50 text-red-600";
    }

    return "bg-[#fff0d9] text-[#9a6500]";
  };

  const formatStatus = (status) => {
    if (!status) return "Pending";

    return status
      .replace("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

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
    <div className="min-h-screen bg-[#fdf6ec] px-6 py-8">
      {/* Back */}
      <button
        onClick={() => navigate("/donor-dashboard")}
        className="mb-6 flex cursor-pointer items-center gap-2 text-sm font-medium text-[#0b306b] transition hover:text-[#16796f]"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#16796f]">
            Donor
          </p>

          <h1 className="mt-2 text-4xl font-bold text-[#0b306b]">
            Donation Requests
          </h1>

          <p className="mt-2 text-slate-500">
            Review requests from NGOs for your surplus food.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="py-16 text-center text-slate-500">
            Loading donation requests...
          </div>
        )}

        {/* Empty */}
        {!loading && !error && requests.length === 0 && (
          <div className="mt-8 rounded-[2rem] border border-white/70 bg-white/65 px-6 py-16 text-center shadow-lg backdrop-blur-xl">
            <HeartHandshake size={45} className="mx-auto text-[#4f81b7]" />

            <h2 className="mt-5 text-xl font-bold text-[#0b306b]">
              No requests yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              When an NGO requests one of your available donations, the request
              will appear here.
            </p>
          </div>
        )}

        {/* Requests */}
        {!loading && requests.length > 0 && (
          <section className="mt-8 space-y-5">
            {requests.map((request) => {
              const donation = request.donation;
              const ngo = request.ngo;

              const isUpdating = updatingId === request._id;
              const isPending = request.status === "pending";

              return (
                <div
                  key={request._id}
                  className="rounded-[2rem] border border-white/70 bg-white/65 p-6 shadow-lg backdrop-blur-xl"
                >
                  {/* Top section */}
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#dcecf8] text-[#0b306b]">
                        <HeartHandshake size={25} />
                      </div>

                      <div>
                        <h2 className="text-xl font-bold text-[#0b306b]">
                          {ngo?.name || "NGO"}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                          Requested{" "}
                          <span className="font-semibold text-[#0b306b]">
                            {donation?.foodName || "Food donation"}
                          </span>
                          {" • "}
                          {donation?.quantity || ""} {donation?.unit || ""}
                        </p>

                        {donation?.category && (
                          <p className="mt-1 text-xs text-slate-400">
                            {formatCategory(donation.category)}
                          </p>
                        )}
                      </div>
                    </div>

                    <span
                      className={`w-fit rounded-full px-4 py-2 text-xs font-bold ${getStatusStyle(
                        request.status,
                      )}`}
                    >
                      {formatStatus(request.status)}
                    </span>
                  </div>

                  {/* Message */}
                  <div className="mt-6 rounded-2xl bg-[#fdf6ec] p-5">
                    <div className="flex gap-3">
                      <MessageSquare
                        size={19}
                        className="mt-0.5 shrink-0 text-[#4f81b7]"
                      />

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          NGO message
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {request.message
                            ? `"${request.message}"`
                            : "No message provided."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom */}
                  <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Clock size={16} />
                      {formatTime(request.createdAt)}
                    </div>

                    {isPending && (
                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            handleRequestStatus(request._id, "rejected")
                          }
                          disabled={isUpdating}
                          className="flex cursor-pointer items-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <X size={17} />
                          {isUpdating ? "Updating..." : "Reject"}
                        </button>

                        <button
                          onClick={() =>
                            handleRequestStatus(request._id, "accepted")
                          }
                          disabled={isUpdating}
                          className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#16796f] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#0b306b] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Check size={17} />
                          {isUpdating ? "Updating..." : "Accept"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
}

export default DonationRequests;
