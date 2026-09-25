import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  MapPin,
  Package,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api";

function DeliveryTracking() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isVolunteer = user?.role === "volunteer";

  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    fetchDeliveries();
  }, [isVolunteer]);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      setError("");

      const endpoint = isVolunteer ? "/deliveries/my" : "/deliveries/ngo";

      const response = await api.get(endpoint);

      console.log(
        isVolunteer
          ? "VOLUNTEER DELIVERIES RESPONSE:"
          : "NGO DELIVERIES RESPONSE:",
        response.data,
      );

      setDeliveries(
        Array.isArray(response.data?.deliveries)
          ? response.data.deliveries
          : [],
      );
    } catch (error) {
      console.error("DELIVERIES ERROR:", error);

      setError(
        error.response?.data?.message || "Could not load your deliveries.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePickup = async (deliveryId) => {
    try {
      setUpdatingId(deliveryId);
      setError("");

      await api.put(`/deliveries/${deliveryId}/pickup`);

      await fetchDeliveries();
    } catch (error) {
      console.error("PICKUP ERROR:", error);

      setError(
        error.response?.data?.message || "Could not update pickup status.",
      );
    } finally {
      setUpdatingId("");
    }
  };

  const handleDelivered = async (deliveryId) => {
    try {
      setUpdatingId(deliveryId);
      setError("");

      await api.put(`/deliveries/${deliveryId}/delivered`);

      await fetchDeliveries();
    } catch (error) {
      console.error("DELIVERED ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Could not mark delivery as delivered.",
      );
    } finally {
      setUpdatingId("");
    }
  };

  const getCurrentStatus = (delivery) => {
    if (delivery.deliveryStatus === "verified") {
      return {
        title: "Verified",
        description: "The delivery has been verified successfully.",
        icon: ShieldCheck,
      };
    }

    if (delivery.deliveryStatus === "delivered") {
      return {
        title: "Delivered",
        description: isVolunteer
          ? "Food has been delivered. Waiting for NGO verification."
          : "Food has been delivered. Verify it using the OTP.",
        icon: CheckCircle,
      };
    }

    if (delivery.deliveryStatus === "in_transit") {
      return {
        title: "In Transit",
        description: isVolunteer
          ? "You are currently delivering the food to the NGO."
          : "The volunteer is currently delivering the food.",
        icon: Truck,
      };
    }

    if (delivery.pickupStatus === "picked_up") {
      return {
        title: "Picked Up",
        description: "The food has been collected from the donor.",
        icon: Package,
      };
    }

    if (delivery.pickupStatus === "accepted") {
      return {
        title: "Pickup Accepted",
        description: isVolunteer
          ? "You have accepted this pickup."
          : "A volunteer has accepted this pickup.",
        icon: CheckCircle,
      };
    }

    return {
      title: "Waiting for Volunteer",
      description: "Waiting for a volunteer to accept this pickup.",
      icon: Clock,
    };
  };

  const formatStatus = (status) => {
    if (!status) return "";

    return status
      .replace("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdf6ec] px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <button
            onClick={() =>
              navigate(isVolunteer ? "/volunteer-dashboard" : "/ngo-dashboard")
            }
            className="mb-6 flex items-center gap-2 text-sm font-medium text-[#0b306b] transition hover:text-[#16796f]"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

          <div className="py-20 text-center text-slate-500">
            Loading deliveries...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf6ec] px-6 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Back */}
        <button
          onClick={() =>
            navigate(isVolunteer ? "/volunteer-dashboard" : "/ngo-dashboard")
          }
          className="mb-6 flex items-center gap-2 text-sm font-medium text-[#0b306b] transition hover:text-[#16796f]"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        {/* Header */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#16796f]">
            {isVolunteer ? "Volunteer" : "NGO"}
          </p>

          <h1 className="mt-2 text-4xl font-bold text-[#0b306b]">
            My Deliveries
          </h1>

          <p className="mt-2 text-slate-500">
            {isVolunteer
              ? "Manage your accepted food pickups and deliveries."
              : "Track food donations being delivered to your organization."}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Empty */}
        {!error && deliveries.length === 0 && (
          <div className="mt-8 rounded-[2rem] border border-white/70 bg-white/65 px-6 py-16 text-center shadow-lg backdrop-blur-xl">
            <Truck size={48} className="mx-auto text-[#4f81b7]" />

            <h2 className="mt-5 text-xl font-bold text-[#0b306b]">
              {isVolunteer ? "No deliveries yet" : "No deliveries yet"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {isVolunteer
                ? "Accept a pickup from the Available Pickups page and it will appear here."
                : "When a donor accepts one of your food requests, the delivery will appear here."}
            </p>

            {isVolunteer && (
              <button
                onClick={() => navigate("/available-pickups")}
                className="mt-6 rounded-2xl bg-[#0b306b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#16796f]"
              >
                Find Pickups
              </button>
            )}

            {!isVolunteer && (
              <button
                onClick={() => navigate("/find-food")}
                className="mt-6 rounded-2xl bg-[#0b306b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#16796f]"
              >
                Find Food
              </button>
            )}
          </div>
        )}

        {/* Deliveries */}
        {!error && deliveries.length > 0 && (
          <div className="mt-8 space-y-6">
            {deliveries.map((delivery) => {
              const donation = delivery.donation;
              const volunteer = delivery.volunteer;
              const currentStatus = getCurrentStatus(delivery);
              const StatusIcon = currentStatus.icon;
              const isUpdating = updatingId === delivery._id;

              return (
                <div
                  key={delivery._id}
                  className="rounded-[2rem] border border-white/70 bg-white/65 p-6 shadow-lg backdrop-blur-xl"
                >
                  {/* Top */}
                  <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                    <div className="flex gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#dcecf8] text-[#0b306b]">
                        <Package size={25} />
                      </div>

                      <div>
                        <h2 className="text-2xl font-bold text-[#0b306b]">
                          {donation?.foodName || "Food Donation"}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                          {donation?.quantity || ""} {donation?.unit || ""}
                          {donation?.category
                            ? ` • ${formatStatus(donation.category)}`
                            : ""}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${
                        delivery.deliveryStatus === "verified"
                          ? "bg-[#dcefeb] text-[#16796f]"
                          : delivery.deliveryStatus === "delivered"
                            ? "bg-[#dcecf8] text-[#0b306b]"
                            : delivery.deliveryStatus === "in_transit"
                              ? "bg-[#fff0d9] text-[#9a6500]"
                              : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <StatusIcon size={15} />
                      {currentStatus.title}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="mt-6 rounded-2xl bg-[#0b306b] p-6 text-white">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                        <StatusIcon size={22} />
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-200">
                          Current Status
                        </p>

                        <h3 className="mt-1 text-xl font-bold">
                          {currentStatus.title}
                        </h3>

                        <p className="mt-1 text-sm text-blue-100">
                          {currentStatus.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    {/* Pickup */}
                    <div className="rounded-2xl bg-[#fdf6ec] p-5">
                      <h3 className="font-bold text-[#0b306b]">
                        Pickup Details
                      </h3>

                      <div className="mt-4 flex gap-3">
                        <MapPin
                          size={19}
                          className="mt-1 shrink-0 text-[#16796f]"
                        />

                        <div>
                          <p className="font-semibold text-[#0b306b]">
                            Donor Location
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {donation?.location?.address ||
                              "Location not available"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Other party */}
                    <div className="rounded-2xl bg-[#fdf6ec] p-5">
                      <h3 className="font-bold text-[#0b306b]">
                        {isVolunteer ? "NGO" : "Volunteer"}
                      </h3>

                      <div className="mt-4 flex gap-3">
                        <Truck
                          size={19}
                          className="mt-1 shrink-0 text-[#16796f]"
                        />

                        <div>
                          {isVolunteer ? (
                            <>
                              <p className="font-semibold text-[#0b306b]">
                                NGO receiving food
                              </p>

                              <p className="mt-1 text-sm text-slate-500">
                                Delivery destination
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="font-semibold text-[#0b306b]">
                                {volunteer?.name || "Waiting for volunteer"}
                              </p>

                              <p className="mt-1 text-sm text-slate-500">
                                {volunteer
                                  ? "Assigned volunteer"
                                  : "No volunteer assigned yet"}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Deadline */}
                  {donation?.pickupDeadline && (
                    <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                      <Clock size={17} className="text-[#4f81b7]" />
                      Pickup deadline:
                      <span className="font-semibold text-[#0b306b]">
                        {new Date(donation.pickupDeadline).toLocaleString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            hour: "numeric",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                    </div>
                  )}

                  {/* Volunteer actions */}
                  {isVolunteer &&
                    delivery.pickupStatus === "accepted" &&
                    delivery.deliveryStatus === "pending" && (
                      <button
                        onClick={() => handlePickup(delivery._id)}
                        disabled={isUpdating}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#16796f] px-5 py-3 font-semibold text-white transition hover:bg-[#0b306b] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Package size={18} />

                        {isUpdating ? "Updating..." : "Mark Food as Picked Up"}
                      </button>
                    )}

                  {isVolunteer &&
                    delivery.pickupStatus === "picked_up" &&
                    delivery.deliveryStatus === "in_transit" && (
                      <button
                        onClick={() => handleDelivered(delivery._id)}
                        disabled={isUpdating}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#16796f] px-5 py-3 font-semibold text-white transition hover:bg-[#0b306b] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <CheckCircle size={18} />

                        {isUpdating ? "Updating..." : "Mark as Delivered"}
                      </button>
                    )}

                  {/* NGO verification */}
                  {!isVolunteer && delivery.deliveryStatus === "delivered" && (
                    <button
                      onClick={() =>
                        navigate(`/ngo-verification?deliveryId=${delivery._id}`)
                      }
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#16796f] px-5 py-3 font-semibold text-white transition hover:bg-[#0b306b]"
                    >
                      <ShieldCheck size={18} />
                      Verify Delivery with OTP
                    </button>
                  )}

                  {/* Verified */}
                  {delivery.deliveryStatus === "verified" && (
                    <div className="mt-6 flex items-center gap-3 rounded-2xl bg-[#dcefeb] px-5 py-4 text-sm font-semibold text-[#16796f]">
                      <CheckCircle size={20} />
                      This delivery has been successfully verified.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default DeliveryTracking;
