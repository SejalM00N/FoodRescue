import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  MapPin,
  Navigation,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import api from "../services/api";

import "leaflet/dist/leaflet.css";

function MapFollower({ location }) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.setView([location.latitude, location.longitude], 15, {
        animate: true,
      });
    }
  }, [location, map]);

  return null;
}

function LetsDeliver() {
  const navigate = useNavigate();

  const [deliveries, setDeliveries] = useState([]);
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [completedDelivery, setCompletedDelivery] = useState(null);

  const [volunteerLocation, setVolunteerLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(true);
  const [error, setError] = useState("");

  const [updating, setUpdating] = useState(false);

  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);

  // --------------------------------------------------
  // FETCH VOLUNTEER DELIVERIES
  // --------------------------------------------------

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/deliveries/my");

      const fetchedDeliveries = Array.isArray(response.data?.deliveries)
        ? response.data.deliveries
        : [];

      setDeliveries(fetchedDeliveries);

      const currentActiveDelivery = fetchedDeliveries.find(
        (delivery) =>
          delivery.volunteer &&
          ["accepted", "picked_up"].includes(delivery.pickupStatus) &&
          ["pending", "in_transit", "delivered"].includes(
            delivery.deliveryStatus,
          ),
      );

      const currentCompletedDelivery = fetchedDeliveries.find(
        (delivery) =>
          delivery.volunteer && delivery.deliveryStatus === "verified",
      );

      setActiveDelivery(currentActiveDelivery || null);
      setCompletedDelivery(currentCompletedDelivery || null);
    } catch (err) {
      console.error("LET'S DELIVER ERROR:", err);

      setError(
        err.response?.data?.message || "Could not load your active delivery.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  // --------------------------------------------------
  // LIVE VOLUNTEER LOCATION
  // --------------------------------------------------

  // --------------------------------------------------
  // LIVE VOLUNTEER LOCATION + SOCKET.IO
  // --------------------------------------------------

  useEffect(() => {
    // Do not share location if there is no active delivery
    if (!activeDelivery) {
      setVolunteerLocation(null);
      setLocationLoading(false);
      return;
    }

    // Stop location sharing after delivery is verified
    if (activeDelivery.deliveryStatus === "verified") {
      setVolunteerLocation(null);
      setLocationLoading(false);
      return;
    }

    if (!navigator.geolocation) {
      setLocationLoading(false);
      setError("Location services are not supported by this browser.");
      return;
    }

    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);

      const token = localStorage.getItem("foodrescue_token");

      console.log("SOCKET TOKEN EXISTS:", !!token);

      socket.emit("authenticate", token);
    });

    socket.on("socket-authenticated", () => {
      console.log("Socket authenticated successfully.");

      socket.emit("join-delivery", activeDelivery._id);
    });

    socket.on("socket-auth-error", (socketError) => {
      console.error("SOCKET AUTH ERROR:", socketError);
    });

    socket.on("delivery-access-granted", ({ deliveryId }) => {
      console.log("Joined delivery tracking room:", deliveryId);
    });

    socket.on("delivery-access-denied", (accessError) => {
      console.error("DELIVERY SOCKET ACCESS DENIED:", accessError);
    });

    socket.on("connect_error", (socketError) => {
      console.error("SOCKET CONNECTION ERROR:", socketError);
    });

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        console.log("VOLUNTEER LIVE LOCATION:", location);

        setVolunteerLocation(location);
        setLocationLoading(false);

        // Send live location to other participants
        console.log("SENDING LOCATION TO SOCKET:", {
          deliveryId: activeDelivery._id,
          latitude: location.latitude,
          longitude: location.longitude,
        });

        socket.emit("volunteer-location", {
          deliveryId: activeDelivery._id,
          latitude: location.latitude,
          longitude: location.longitude,
        });
      },
      (locationError) => {
        console.error("VOLUNTEER LOCATION ERROR:", locationError);

        setLocationLoading(false);

        setError("Location permission is required to show your live position.");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      socket.disconnect();

      console.log("Live location sharing stopped.");
    };
  }, [activeDelivery]);

  // --------------------------------------------------
  // CURRENT DELIVERY DATA
  // --------------------------------------------------

  const donation = activeDelivery?.donation;

  // Once food has been picked up, the volunteer should
  // remain on the NGO route even after marking it delivered.
  const hasPickedUp = activeDelivery?.pickupStatus === "picked_up";

  const pickupLocation = activeDelivery?.donation?.location;

  const destinationLocation = hasPickedUp
    ? activeDelivery?.deliveryLocation
    : pickupLocation;

  // --------------------------------------------------
  // FETCH ROAD ROUTE
  // --------------------------------------------------

  useEffect(() => {
    const fetchRoute = async () => {
      if (!volunteerLocation || !activeDelivery || !destinationLocation) {
        setRouteCoordinates([]);
        return;
      }

      if (
        destinationLocation.latitude == null ||
        destinationLocation.longitude == null
      ) {
        setRouteCoordinates([]);
        return;
      }

      try {
        const start = `${volunteerLocation.longitude},${volunteerLocation.latitude}`;

        const end = `${destinationLocation.longitude},${destinationLocation.latitude}`;

        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`,
        );

        if (!response.ok) {
          throw new Error("Route request failed.");
        }

        const data = await response.json();

        if (!data.routes?.length) {
          setRouteCoordinates([]);
          return;
        }

        const coordinates = data.routes[0].geometry.coordinates.map(
          ([longitude, latitude]) => [latitude, longitude],
        );

        setRouteCoordinates(coordinates);
      } catch (routeError) {
        console.error("ROUTE ERROR:", routeError);
        setRouteCoordinates([]);
      }
    };

    fetchRoute();
  }, [volunteerLocation, activeDelivery, destinationLocation]);

  // --------------------------------------------------
  // NO ACTIVE OR COMPLETED DELIVERY
  // --------------------------------------------------

  if (!loading && !activeDelivery && !completedDelivery) {
    return (
      <div className="min-h-screen bg-[#fdf6ec] px-6 py-8">
        <div className="mx-auto max-w-5xl">
          <button
            type="button"
            onClick={() => navigate("/volunteer-dashboard")}
            className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#0b306b] transition hover:text-[#16796f]"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

          <div className="rounded-[2rem] border border-white/70 bg-white/70 px-6 py-16 text-center shadow-xl backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#dcecf8] text-[#0b306b]">
              <Truck size={30} />
            </div>

            <h1 className="mt-6 text-3xl font-bold text-[#0b306b]">
              No Active Delivery
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Once you accept a pickup, your active delivery will appear here
              with navigation, live tracking and delivery actions.
            </p>

            <button
              type="button"
              onClick={() => navigate("/available-pickups")}
              className="mt-7 rounded-2xl bg-[#0b306b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#16796f]"
            >
              View Available Pickups
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdf6ec] px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <button
            type="button"
            onClick={() => navigate("/volunteer-dashboard")}
            className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#0b306b] transition hover:text-[#16796f]"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <Truck
                size={42}
                className="mx-auto animate-pulse text-[#4f81b7]"
              />

              <p className="mt-4 text-sm text-slate-500">
                Loading your active delivery...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // COMPLETED DELIVERY
  // --------------------------------------------------

  if (!activeDelivery && completedDelivery) {
    const completedDonation = completedDelivery.donation;

    return (
      <div className="min-h-screen bg-[#fdf6ec] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <button
            type="button"
            onClick={() => navigate("/volunteer-dashboard")}
            className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#0b306b] transition hover:text-[#16796f]"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

          <div className="rounded-[2rem] border border-[#16796f]/20 bg-white/80 p-8 shadow-xl backdrop-blur-xl">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#dcefeb] text-[#16796f]">
                <CheckCircle size={42} />
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#16796f]">
                Delivery Complete
              </p>

              <h1 className="mt-2 text-3xl font-bold text-[#0b306b]">
                Food successfully delivered
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                The NGO has verified this delivery successfully. Your rescue
                journey for this donation is now complete.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#fdf6ec] p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Food Donation
                </p>

                <p className="mt-2 text-lg font-bold text-[#0b306b]">
                  {completedDonation?.foodName || "Food Donation"}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {completedDonation?.quantity || ""}{" "}
                  {completedDonation?.unit || ""}
                </p>
              </div>

              <div className="rounded-2xl bg-[#fdf6ec] p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Delivery Status
                </p>

                <div className="mt-2 flex items-center gap-2 text-lg font-bold text-[#16796f]">
                  <ShieldCheck size={20} />
                  Verified
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  NGO verification completed successfully.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/delivery-tracking")}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0b306b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#16796f]"
            >
              View My Deliveries
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // MARK FOOD AS PICKED UP
  // --------------------------------------------------

  const handlePickup = async () => {
    if (!activeDelivery) {
      return;
    }

    try {
      setUpdating(true);
      setError("");

      await api.put(`/deliveries/${activeDelivery._id}/pickup`);

      await fetchDeliveries();
    } catch (err) {
      console.error("PICKUP ERROR:", err);

      setError(
        err.response?.data?.message || "Could not mark the food as picked up.",
      );
    } finally {
      setUpdating(false);
    }
  };

  // --------------------------------------------------
  // MARK DELIVERY AS REACHED
  // --------------------------------------------------

  const handleDelivered = async () => {
    if (!activeDelivery) {
      return;
    }

    try {
      setUpdating(true);
      setError("");

      await api.put(`/deliveries/${activeDelivery._id}/delivered`);

      await fetchDeliveries();
    } catch (err) {
      console.error("DELIVERED ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Could not mark the delivery as reached.",
      );
    } finally {
      setUpdating(false);
    }
  };

  // --------------------------------------------------
  // VERIFY OTP
  // --------------------------------------------------

  const handleVerifyOtp = async () => {
    if (!activeDelivery) {
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter the 6-digit OTP provided by the NGO.");
      return;
    }

    try {
      setVerifying(true);
      setError("");

      await api.put(`/deliveries/${activeDelivery._id}/verify`, {
        otp,
      });

      setOtp("");

      await fetchDeliveries();
    } catch (err) {
      console.error("OTP VERIFICATION ERROR:", err);

      setError(err.response?.data?.message || "Could not verify the delivery.");
    } finally {
      setVerifying(false);
    }
  };

  // --------------------------------------------------
  // NAVIGATION
  // --------------------------------------------------

  const openNavigation = (location) => {
    if (location?.latitude == null || location?.longitude == null) {
      return;
    }

    const { latitude, longitude } = location;

    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  // --------------------------------------------------
  // FORMAT DATE
  // --------------------------------------------------

  const formatDeadline = (date) => {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const mapCenter = volunteerLocation
    ? [volunteerLocation.latitude, volunteerLocation.longitude]
    : destinationLocation?.latitude != null &&
        destinationLocation?.longitude != null
      ? [destinationLocation.latitude, destinationLocation.longitude]
      : [20.5937, 78.9629];

  // --------------------------------------------------
  // MAIN PAGE
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-[#fdf6ec] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/volunteer-dashboard")}
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#0b306b] transition hover:text-[#16796f]"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-7">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#16796d]">
            Volunteer
          </p>

          <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-[#0b306b]">
                Let&apos;s Deliver
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Follow your active food rescue journey from donor pickup to
                successful NGO delivery.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-[#16796f] shadow-sm backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#16796f]" />
              Live delivery
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {/* Delivery summary */}
        <div className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-lg backdrop-blur-xl">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
              <div className="flex gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#dcecf8] text-[#0b306b]">
                  <Package size={27} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#4f81b7]">
                    Active Food Donation
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-[#0b306b]">
                    {donation?.foodName || "Food Donation"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {donation?.quantity || ""} {donation?.unit || ""}
                    {donation?.category
                      ? ` • ${donation.category
                          .replace("-", " ")
                          .replace(/\b\w/g, (letter) => letter.toUpperCase())}`
                      : ""}
                  </p>
                </div>
              </div>

              <span className="w-fit rounded-full bg-[#dcefeb] px-4 py-2 text-xs font-bold text-[#16796f]">
                {activeDelivery.deliveryStatus === "delivered"
                  ? "Awaiting OTP"
                  : hasPickedUp
                    ? "In Transit"
                    : "Pickup Accepted"}
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#fdf6ec] p-4">
                <div className="flex items-start gap-3">
                  <Clock size={19} className="mt-0.5 shrink-0 text-[#4f81b7]" />

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Pickup Deadline
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#0b306b]">
                      {formatDeadline(donation?.pickupDeadline)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-[#fdf6ec] p-4">
                <div className="flex items-start gap-3">
                  <Navigation
                    size={19}
                    className="mt-0.5 shrink-0 text-[#16796f]"
                  />

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Current Destination
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#0b306b]">
                      {activeDelivery.deliveryStatus === "delivered"
                        ? "Awaiting NGO verification"
                        : hasPickedUp
                          ? "NGO"
                          : "Donor pickup"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live location */}
          <div className="rounded-[2rem] bg-[#0b306b] p-6 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                <Navigation size={22} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-200">
                  Your Location
                </p>

                <h2 className="mt-1 text-lg font-bold">
                  {locationLoading ? "Finding you..." : "Live location active"}
                </h2>
              </div>
            </div>

            {volunteerLocation ? (
              <div className="mt-5 rounded-2xl bg-white/10 p-4">
                <p className="text-xs text-blue-200">Current coordinates</p>

                <p className="mt-1 text-sm font-semibold">
                  {volunteerLocation.latitude.toFixed(6)},{" "}
                  {volunteerLocation.longitude.toFixed(6)}
                </p>
              </div>
            ) : (
              <p className="mt-5 text-sm leading-6 text-blue-100">
                Allow location access to see your position and calculate the
                road route.
              </p>
            )}
          </div>
        </div>

        {/* Journey cards */}
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {/* Pickup */}
          <div
            className={`rounded-[2rem] border p-6 shadow-lg backdrop-blur-xl ${
              !hasPickedUp
                ? "border-[#4f81b7]/30 bg-white/80"
                : "border-white/70 bg-white/60"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#dcecf8] text-[#0b306b]">
                  <MapPin size={22} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#4f81b7]">
                    Step 1
                  </p>

                  <h2 className="text-xl font-bold text-[#0b306b]">
                    Pickup Food
                  </h2>
                </div>
              </div>

              {!hasPickedUp &&
                activeDelivery.deliveryStatus !== "delivered" && (
                  <span className="rounded-full bg-[#fff0d9] px-3 py-1.5 text-xs font-bold text-[#9a6500]">
                    Current
                  </span>
                )}

              {hasPickedUp && (
                <CheckCircle size={23} className="text-[#16796f]" />
              )}
            </div>

            <div className="mt-5 rounded-2xl bg-[#fdf6ec] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Donor Location
              </p>

              <p className="mt-2 text-sm font-semibold leading-6 text-[#0b306b]">
                {pickupLocation?.address || "Pickup location unavailable"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => openNavigation(pickupLocation)}
              disabled={
                pickupLocation?.latitude == null ||
                pickupLocation?.longitude == null ||
                hasPickedUp
              }
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#0b306b]/20 bg-white px-5 py-3 text-sm font-semibold text-[#0b306b] transition hover:bg-[#dcecf8] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Navigation size={18} />
              {hasPickedUp ? "Pickup Completed" : "Navigate to Pickup"}
            </button>

            {!hasPickedUp && activeDelivery.pickupStatus === "accepted" && (
              <button
                type="button"
                onClick={handlePickup}
                disabled={updating}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#16796f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b306b] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Package size={18} />

                {updating ? "Updating..." : "Mark Food as Picked Up"}
              </button>
            )}

            {hasPickedUp && (
              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-[#dcefeb] px-4 py-3 text-sm font-semibold text-[#16796f]">
                <CheckCircle size={18} />
                Food has been picked up.
              </div>
            )}
          </div>

          {/* NGO destination */}
          <div
            className={`rounded-[2rem] border p-6 shadow-lg backdrop-blur-xl ${
              hasPickedUp
                ? "border-[#16796f]/30 bg-white/80"
                : "border-white/70 bg-white/60"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#dcefeb] text-[#16796f]">
                  <Truck size={22} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#16796f]">
                    Step 2
                  </p>

                  <h2 className="text-xl font-bold text-[#0b306b]">
                    Deliver to NGO
                  </h2>
                </div>
              </div>

              {hasPickedUp && activeDelivery.deliveryStatus !== "delivered" && (
                <span className="rounded-full bg-[#dcefeb] px-3 py-1.5 text-xs font-bold text-[#16796f]">
                  Current
                </span>
              )}

              {activeDelivery.deliveryStatus === "delivered" && (
                <CheckCircle size={23} className="text-[#16796f]" />
              )}
            </div>

            <div className="mt-5 rounded-2xl bg-[#fdf6ec] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Delivery Destination
              </p>

              <p className="mt-2 text-sm font-semibold leading-6 text-[#0b306b]">
                {activeDelivery.deliveryLocation?.address ||
                  "NGO delivery location unavailable"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => openNavigation(activeDelivery.deliveryLocation)}
              disabled={
                activeDelivery.deliveryLocation?.latitude == null ||
                activeDelivery.deliveryLocation?.longitude == null ||
                !hasPickedUp ||
                activeDelivery.deliveryStatus === "delivered"
              }
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#16796f]/20 bg-white px-5 py-3 text-sm font-semibold text-[#16796f] transition hover:bg-[#dcefeb] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Navigation size={18} />
              {activeDelivery.deliveryStatus === "delivered"
                ? "Destination Reached"
                : "Navigate to NGO"}
            </button>

            {hasPickedUp && activeDelivery.deliveryStatus === "in_transit" && (
              <button
                type="button"
                onClick={handleDelivered}
                disabled={updating}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#16796f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b306b] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCircle size={18} />

                {updating ? "Updating..." : "Mark Destination Reached"}
              </button>
            )}

            {activeDelivery.deliveryStatus === "delivered" && (
              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-[#fff0d9] px-4 py-3 text-sm font-semibold text-[#9a6500]">
                <ShieldCheck size={18} />
                Waiting for NGO OTP verification.
              </div>
            )}

            {!hasPickedUp && (
              <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                Pick up the food first. Your route will then switch to this NGO
                destination.
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="mt-6 overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 shadow-lg backdrop-blur-xl">
          <div className="border-b border-slate-200/70 px-6 py-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#4f81b7]">
                  Live Route
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#0b306b]">
                  {activeDelivery.deliveryStatus === "delivered"
                    ? "Delivery Reached"
                    : hasPickedUp
                      ? "Route to NGO"
                      : "Route to Pickup"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  The route updates using your current location.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-[#dcefeb] px-4 py-2 text-xs font-semibold text-[#16796f]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#16796f]" />
                GPS tracking
              </div>
            </div>
          </div>

          <div className="relative h-[520px]">
            <MapContainer
              center={mapCenter}
              zoom={14}
              scrollWheelZoom
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapFollower location={volunteerLocation} />

              {volunteerLocation && (
                <Marker
                  position={[
                    volunteerLocation.latitude,
                    volunteerLocation.longitude,
                  ]}
                >
                  <Popup>
                    <div className="min-w-[180px]">
                      <p className="font-semibold text-[#0b306b]">
                        Your current location
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Live volunteer position
                      </p>
                    </div>
                  </Popup>
                </Marker>
              )}

              {pickupLocation?.latitude != null &&
                pickupLocation?.longitude != null && (
                  <Marker
                    position={[
                      pickupLocation.latitude,
                      pickupLocation.longitude,
                    ]}
                  >
                    <Popup>
                      <div className="min-w-[210px]">
                        <p className="font-bold text-[#0b306b]">
                          Pickup Location
                        </p>

                        <p className="mt-1 text-sm">{pickupLocation.address}</p>

                        <p className="mt-2 text-xs text-slate-500">
                          {donation?.foodName || "Food donation"}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                )}

              {activeDelivery.deliveryLocation?.latitude != null &&
                activeDelivery.deliveryLocation?.longitude != null && (
                  <Marker
                    position={[
                      activeDelivery.deliveryLocation.latitude,
                      activeDelivery.deliveryLocation.longitude,
                    ]}
                  >
                    <Popup>
                      <div className="min-w-[210px]">
                        <p className="font-bold text-[#16796f]">
                          NGO Delivery Location
                        </p>

                        <p className="mt-1 text-sm">
                          {activeDelivery.deliveryLocation.address}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                )}

              {routeCoordinates.length > 0 &&
                activeDelivery.deliveryStatus !== "delivered" && (
                  <Polyline
                    positions={routeCoordinates}
                    pathOptions={{
                      color: "#16796f",
                      weight: 6,
                      opacity: 0.85,
                    }}
                  />
                )}
            </MapContainer>

            {!volunteerLocation && (
              <div className="pointer-events-none absolute left-1/2 top-4 z-[500] -translate-x-1/2 rounded-full bg-white/95 px-4 py-2 text-xs font-medium text-slate-600 shadow-md">
                Waiting for your live location...
              </div>
            )}

            {volunteerLocation &&
              routeCoordinates.length === 0 &&
              activeDelivery.deliveryStatus !== "delivered" && (
                <div className="pointer-events-none absolute left-1/2 top-4 z-[500] -translate-x-1/2 rounded-full bg-white/95 px-4 py-2 text-xs font-medium text-slate-600 shadow-md">
                  Calculating road route...
                </div>
              )}
          </div>
        </div>

        {/* OTP section */}
        {activeDelivery.deliveryStatus === "delivered" && (
          <div className="mt-6 rounded-[2rem] border border-[#16796f]/20 bg-white/80 p-6 shadow-lg backdrop-blur-xl">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#dcefeb] text-[#16796f]">
                <ShieldCheck size={25} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#16796f]">
                  Final Verification
                </p>

                <h2 className="mt-1 text-2xl font-bold text-[#0b306b]">
                  Enter NGO OTP
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Ask the NGO representative for the 6-digit verification code
                  and enter it below to complete the delivery.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={(event) => {
                  const value = event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6);

                  setOtp(value);
                }}
                placeholder="Enter 6-digit OTP"
                className="min-w-0 flex-1 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-center text-lg font-semibold tracking-[0.35em] text-[#0b306b] outline-none transition focus:border-[#16796f] focus:ring-2 focus:ring-[#16796f]/20"
              />

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={verifying || otp.length !== 6}
                className="rounded-2xl bg-[#16796f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0b306b] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {verifying ? "Verifying..." : "Verify Delivery"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LetsDeliver;
