import { useEffect, useState } from "react";
import { Check, Clock, HeartHandshake, MessageSquare, X } from "lucide-react";
import api from "../services/api";
import DashboardLayout from "../components/DashboardLayout.jsx";

function DonationRequests() {
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
    <DashboardLayout role="donor">
      <div className="min-h-screen bg-[#fdf6ec] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#16796f] sm:text-sm">
              Donor
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#0b306b] sm:text-4xl">
              Donation Requests
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Review requests from NGOs for your surplus food.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm leading-6 text-red-600 sm:mt-6 sm:px-5 sm:py-4">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="py-16 text-center text-sm text-slate-500 sm:text-base">
              Loading donation requests...
            </div>
          )}

          {/* Empty */}
          {!loading && !error && requests.length === 0 && (
            <div className="mt-6 rounded-[1.5rem] border border-white/70 bg-white/65 px-5 py-12 text-center shadow-lg backdrop-blur-xl sm:mt-8 sm:rounded-[2rem] sm:px-6 sm:py-16">
              <HeartHandshake
                size={42}
                className="mx-auto text-[#4f81b7] sm:h-11 sm:w-11"
              />

              <h2 className="mt-5 text-lg font-bold text-[#0b306b] sm:text-xl">
                No requests yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                When an NGO requests one of your available donations, the
                request will appear here.
              </p>
            </div>
          )}

          {/* Requests */}
          {!loading && requests.length > 0 && (
            <section className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
              {requests.map((request) => {
                const donation = request.donation;
                const ngo = request.ngo;

                const isUpdating = updatingId === request._id;
                const isPending = request.status === "pending";

                return (
                  <div
                    key={request._id}
                    className="rounded-[1.5rem] border border-white/70 bg-white/65 p-4 shadow-lg backdrop-blur-xl sm:rounded-[2rem] sm:p-6"
                  >
                    {/* Top section */}
                    <div className="flex flex-col gap-4 sm:gap-5 md:flex-row md:items-start md:justify-between">
                      <div className="flex min-w-0 gap-3 sm:gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#dcecf8] text-[#0b306b] sm:h-14 sm:w-14 sm:rounded-2xl">
                          <HeartHandshake size={22} className="sm:h-6 sm:w-6" />
                        </div>

                        <div className="min-w-0">
                          <h2 className="break-words text-lg font-bold text-[#0b306b] sm:text-xl">
                            {ngo?.name || "NGO"}
                          </h2>

                          <p className="mt-1 break-words text-sm leading-6 text-slate-500">
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
                        className={`w-fit shrink-0 rounded-full px-3 py-1.5 text-xs font-bold sm:px-4 sm:py-2 ${getStatusStyle(
                          request.status,
                        )}`}
                      >
                        {formatStatus(request.status)}
                      </span>
                    </div>

                    {/* Message */}
                    <div className="mt-5 rounded-2xl bg-[#fdf6ec] p-4 sm:mt-6 sm:p-5">
                      <div className="flex gap-3">
                        <MessageSquare
                          size={18}
                          className="mt-0.5 shrink-0 text-[#4f81b7]"
                        />

                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            NGO message
                          </p>

                          <p className="mt-2 break-words text-sm leading-6 text-slate-600">
                            {request.message
                              ? `"${request.message}"`
                              : "No message provided."}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom */}
                    <div className="mt-5 flex flex-col gap-4 sm:mt-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-400 sm:text-sm">
                        <Clock size={15} className="shrink-0 sm:h-4 sm:w-4" />
                        <span>{formatTime(request.createdAt)}</span>
                      </div>

                      {isPending && (
                        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-3">
                          <button
                            onClick={() =>
                              handleRequestStatus(request._id, "rejected")
                            }
                            disabled={isUpdating}
                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                          >
                            <X size={17} />
                            {isUpdating ? "Updating..." : "Reject"}
                          </button>

                          <button
                            onClick={() =>
                              handleRequestStatus(request._id, "accepted")
                            }
                            disabled={isUpdating}
                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#16796f] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#0b306b] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
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
    </DashboardLayout>
  );
}

export default DonationRequests;
