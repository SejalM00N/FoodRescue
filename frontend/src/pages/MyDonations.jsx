import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Package,
  PlusCircle,
  Utensils,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function MyDonations() {
  const navigate = useNavigate();

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Donation currently being viewed
  const [selectedDonation, setSelectedDonation] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await api.get("/donations/my");

        console.log("MY DONATIONS RESPONSE:", response.data);

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
        console.error("MY DONATIONS ERROR:", error);

        setError(
          error.response?.data?.message || "Could not load your donations.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const getStatusStyle = (status) => {
    if (status === "completed") {
      return "bg-[#dcefeb] text-[#16796f]";
    }

    if (status === "accepted") {
      return "bg-[#dcecf8] text-[#0b306b]";
    }

    if (status === "requested") {
      return "bg-[#fff0d9] text-[#9a6500]";
    }

    if (status === "in_transit") {
      return "bg-[#e4edf8] text-[#0b306b]";
    }

    return "bg-[#fff0d9] text-[#9a6500]";
  };

  const formatStatus = (status) => {
    if (!status) return "Available";

    return status
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const formatCategory = (category) => {
    if (!category) return "";

    return category
      .replaceAll("-", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const formatDateTime = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatDeadline = (date) => {
    if (!date) return "No deadline";

    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const activeCount = donations.filter(
    (donation) =>
      donation.status === "available" ||
      donation.status === "requested" ||
      donation.status === "accepted" ||
      donation.status === "in_transit",
  ).length;

  const completedCount = donations.filter(
    (donation) => donation.status === "completed",
  ).length;

  return (
    <div className="min-h-screen bg-[#fdf6ec] px-6 py-8">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate("/donor-dashboard")}
        className="mb-6 flex cursor-pointer items-center gap-2 text-sm font-medium text-[#0b306b] transition hover:text-[#16796f]"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#16796f]">
              Donor
            </p>

            <h1 className="mt-2 text-4xl font-bold text-[#0b306b]">
              My Donations
            </h1>

            <p className="mt-2 text-slate-500">
              Track the surplus food you've shared with the community.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/create-donation")}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#0b306b] px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-[#16796f]"
          >
            <PlusCircle size={19} />
            New Donation
          </button>
        </div>

        {/* Summary */}
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Total Donations</p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fdd8a5] text-[#0b306b]">
                <Package size={19} />
              </div>
            </div>

            <p className="mt-3 text-3xl font-bold text-[#0b306b]">
              {donations.length}
            </p>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Active</p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dcecf8] text-[#0b306b]">
                <Clock size={19} />
              </div>
            </div>

            <p className="mt-3 text-3xl font-bold text-[#4f81b7]">
              {activeCount}
            </p>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Completed</p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dcefeb] text-[#16796f]">
                <CheckCircle size={19} />
              </div>
            </div>

            <p className="mt-3 text-3xl font-bold text-[#16796f]">
              {completedCount}
            </p>
          </div>
        </div>

        {/* Donations */}
        <section className="mt-8 rounded-[2rem] border border-white/70 bg-white/65 p-6 shadow-lg backdrop-blur-xl md:p-8">
          <div>
            <h2 className="text-xl font-bold text-[#0b306b]">
              Donation History
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your recent food rescue activity.
            </p>
          </div>

          {loading && (
            <div className="py-12 text-center text-slate-500">
              Loading your donations...
            </div>
          )}

          {error && !loading && (
            <div className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && donations.length === 0 && (
            <div className="py-12 text-center">
              <Package size={42} className="mx-auto text-[#4f81b7]" />

              <h3 className="mt-4 text-lg font-bold text-[#0b306b]">
                No donations yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Your food donations will appear here.
              </p>

              <button
                type="button"
                onClick={() => navigate("/create-donation")}
                className="mt-5 cursor-pointer rounded-xl bg-[#0b306b] px-5 py-3 text-sm font-semibold text-white hover:bg-[#16796f]"
              >
                Create Donation
              </button>
            </div>
          )}

          {!loading && !error && donations.length > 0 && (
            <div className="mt-6 space-y-4">
              {donations.map((donation) => (
                <div
                  key={donation._id}
                  className="flex flex-col gap-5 rounded-2xl bg-[#fdf6ec] p-5 md:flex-row md:items-center md:justify-between"
                >
                  {/* Food */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#fdd8a5] text-[#0b306b]">
                      <Utensils size={22} />
                    </div>

                    <div>
                      <h3 className="font-bold text-[#0b306b]">
                        {donation.foodName}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {formatCategory(donation.category)} •{" "}
                        {donation.quantity} {donation.unit}
                      </p>
                    </div>
                  </div>

                  {/* Deadline */}
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar size={17} />

                    <span>{formatDeadline(donation.pickupDeadline)}</span>
                  </div>

                  {/* Status + View */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-4 py-2 text-xs font-bold ${getStatusStyle(
                        donation.status,
                      )}`}
                    >
                      {formatStatus(donation.status)}
                    </span>

                    <button
                      type="button"
                      onClick={() => setSelectedDonation(donation)}
                      className="cursor-pointer rounded-xl border border-[#4f81b7]/30 bg-white px-4 py-2 text-sm font-semibold text-[#0b306b] transition hover:bg-[#dcecf8]"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ---------------------------------------------------
          Donation Details Modal
      --------------------------------------------------- */}
      {selectedDonation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b306b]/35 px-5 py-6 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedDonation(null);
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-white/70 bg-[#fdf6ec] shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200/70 bg-[#fdf6ec]/95 px-6 py-5 backdrop-blur-xl md:px-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#16796f]">
                  Donation Details
                </p>

                <h2 className="mt-1 text-2xl font-bold text-[#0b306b]">
                  {selectedDonation.foodName}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDonation(null)}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition hover:bg-red-50 hover:text-red-500"
                aria-label="Close donation details"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-5 p-6 md:p-8">
              {/* Status */}
              <div className="flex items-center justify-between rounded-2xl bg-white/70 p-5">
                <div>
                  <p className="text-sm text-slate-500">Current status</p>

                  <p className="mt-1 font-semibold text-[#0b306b]">
                    Donation status
                  </p>
                </div>

                <span
                  className={`rounded-full px-4 py-2 text-xs font-bold ${getStatusStyle(
                    selectedDonation.status,
                  )}`}
                >
                  {formatStatus(selectedDonation.status)}
                </span>
              </div>

              {/* Basic information */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/70 p-5">
                  <p className="text-xs font-medium text-slate-400">Category</p>

                  <p className="mt-1 font-semibold text-[#0b306b]">
                    {formatCategory(selectedDonation.category)}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/70 p-5">
                  <p className="text-xs font-medium text-slate-400">Quantity</p>

                  <p className="mt-1 font-semibold text-[#0b306b]">
                    {selectedDonation.quantity} {selectedDonation.unit}
                  </p>
                </div>
              </div>

              {/* Time information */}
              <div className="rounded-2xl bg-white/70 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fdd8a5] text-[#0b306b]">
                    <Clock size={18} />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      Prepared
                    </p>

                    <p className="mt-1 font-semibold text-[#0b306b]">
                      {formatDateTime(selectedDonation.preparedAt)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-200/70 pt-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dcecf8] text-[#0b306b]">
                      <Calendar size={18} />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        Pickup deadline
                      </p>

                      <p className="mt-1 font-semibold text-[#0b306b]">
                        {formatDateTime(selectedDonation.pickupDeadline)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="rounded-2xl bg-white/70 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#dcefeb] text-[#16796f]">
                    <MapPin size={18} />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      Pickup location
                    </p>

                    <p className="mt-1 leading-6 font-semibold text-[#0b306b]">
                      {selectedDonation.location?.address ||
                        "Location not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="rounded-2xl bg-white/70 p-5">
                <p className="text-xs font-medium text-slate-400">
                  Description
                </p>

                <p className="mt-2 leading-6 text-slate-600">
                  {selectedDonation.description?.trim() ||
                    "No additional description was provided."}
                </p>
              </div>

              {/* Coordinates */}
              {selectedDonation.location?.latitude !== undefined &&
                selectedDonation.location?.longitude !== undefined &&
                selectedDonation.location?.latitude !== null &&
                selectedDonation.location?.longitude !== null && (
                  <div className="rounded-2xl border border-[#4f81b7]/20 bg-[#eef5fb] p-4">
                    <p className="text-xs font-medium text-slate-500">
                      Location coordinates
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      {selectedDonation.location.latitude.toFixed(6)},{" "}
                      {selectedDonation.location.longitude.toFixed(6)}
                    </p>
                  </div>
                )}

              {/* Close */}
              <button
                type="button"
                onClick={() => setSelectedDonation(null)}
                className="w-full cursor-pointer rounded-2xl bg-[#0b306b] py-3.5 font-semibold text-white transition hover:bg-[#16796f]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyDonations;
