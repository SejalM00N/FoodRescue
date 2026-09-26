import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Bike,
  Clock,
  MapPin,
  Package,
  Route,
  Truck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AvailablePickups() {
  const navigate = useNavigate();

  const [deliveries, setDeliveries] = useState([]);
  const [volunteerLocation, setVolunteerLocation] = useState(null);

  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(true);
  const [error, setError] = useState("");
  const [acceptingId, setAcceptingId] = useState("");

  // --------------------------------------------------
  // GET VOLUNTEER LOCATION
  // --------------------------------------------------

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationLoading(false);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setVolunteerLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setLocationLoading(false);
      },
      (locationError) => {
        console.error("VOLUNTEER LOCATION ERROR:", locationError);

        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 10000,
      },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // --------------------------------------------------
  // FETCH AVAILABLE PICKUPS
  // --------------------------------------------------

  useEffect(() => {
    fetchAvailablePickups();
  }, []);

  const fetchAvailablePickups = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/deliveries/available");

      console.log("AVAILABLE DELIVERIES:", response.data);

      setDeliveries(
        Array.isArray(response.data?.deliveries)
          ? response.data.deliveries
          : [],
      );
    } catch (error) {
      console.error("AVAILABLE DELIVERIES ERROR:", error);

      setError(
        error.response?.data?.message || "Could not load available pickups.",
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // DISTANCE CALCULATION
  // --------------------------------------------------

  const calculateDistance = (latitude1, longitude1, latitude2, longitude2) => {
    const earthRadiusKm = 6371;

    const lat1 = (latitude1 * Math.PI) / 180;
    const lat2 = (latitude2 * Math.PI) / 180;

    const deltaLatitude = ((latitude2 - latitude1) * Math.PI) / 180;

    const deltaLongitude = ((longitude2 - longitude1) * Math.PI) / 180;

    const a =
      Math.sin(deltaLatitude / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLongitude / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c;
  };

  const getPickupDistance = (delivery) => {
    const pickupLocation = delivery?.donation?.location;

    if (
      !volunteerLocation ||
      pickupLocation?.latitude == null ||
      pickupLocation?.longitude == null
    ) {
      return null;
    }

    return calculateDistance(
      volunteerLocation.latitude,
      volunteerLocation.longitude,
      Number(pickupLocation.latitude),
      Number(pickupLocation.longitude),
    );
  };

  // --------------------------------------------------
  // SORT PICKUPS BY PROXIMITY
  // --------------------------------------------------

  const sortedDeliveries = [...deliveries].sort((deliveryA, deliveryB) => {
    const distanceA = getPickupDistance(deliveryA);
    const distanceB = getPickupDistance(deliveryB);

    // If location isn't available, keep those pickups at the bottom.
    if (distanceA == null && distanceB == null) {
      return 0;
    }

    if (distanceA == null) {
      return 1;
    }

    if (distanceB == null) {
      return -1;
    }

    return distanceA - distanceB;
  });

  // --------------------------------------------------
  // ACCEPT PICKUP
  // --------------------------------------------------

  const handleAcceptPickup = async (deliveryId) => {
    try {
      setAcceptingId(deliveryId);
      setError("");

      const response = await api.put(`/deliveries/${deliveryId}/accept`);

      console.log("DELIVERY ACCEPTED:", response.data);

      // Remove accepted delivery from available list
      setDeliveries((currentDeliveries) =>
        currentDeliveries.filter((delivery) => delivery._id !== deliveryId),
      );

      // Move volunteer directly to active delivery page
      navigate("/lets-deliver");
    } catch (error) {
      console.error("ACCEPT PICKUP ERROR:", error);

      setError(
        error.response?.data?.message || "Could not accept this pickup.",
      );
    } finally {
      setAcceptingId("");
    }
  };

  // --------------------------------------------------
  // FORMAT DEADLINE
  // --------------------------------------------------

  const formatDeadline = (deadline) => {
    if (!deadline) return "No deadline";

    return new Date(deadline).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // --------------------------------------------------
  // FORMAT DISTANCE
  // --------------------------------------------------

  const formatDistance = (distance) => {
    if (distance == null) {
      return "Distance unavailable";
    }

    if (distance < 1) {
      return `${Math.round(distance * 1000)} m away`;
    }

    return `${distance.toFixed(1)} km away`;
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-[#fdf6ec] px-6 py-8">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate("/volunteer-dashboard")}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-[#0b306b] transition hover:text-[#16796f]"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#16796f]">
            Volunteer
          </p>

          <h1 className="mt-2 text-4xl font-bold text-[#0b306b]">
            Available Pickups
          </h1>

          <p className="mt-2 text-slate-500">
            Choose a nearby food pickup and help deliver it to an NGO.
          </p>
        </div>

        {/* Location notice */}
        <div className="mt-8 flex items-center gap-4 rounded-3xl border border-white/70 bg-white/65 p-5 shadow-sm backdrop-blur-xl">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#dcecf8] text-[#0b306b]">
            <MapPin size={21} />
          </div>

          <div>
            <p className="font-semibold text-[#0b306b]">
              {locationLoading
                ? "Finding your location..."
                : volunteerLocation
                  ? "Pickups near you"
                  : "Location unavailable"}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {volunteerLocation
                ? "Pickups are prioritized by distance from your current location."
                : "Allow location access to sort pickups by proximity."}
            </p>
          </div>
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
            Loading available pickups...
          </div>
        )}

        {/* Empty */}
        {!loading && !error && deliveries.length === 0 && (
          <div className="mt-8 rounded-[2rem] border border-white/70 bg-white/65 px-6 py-16 text-center shadow-lg backdrop-blur-xl">
            <Truck size={45} className="mx-auto text-[#4f81b7]" />

            <h2 className="mt-5 text-xl font-bold text-[#0b306b]">
              No pickups available
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              There are currently no accepted donations waiting for a volunteer.
            </p>
          </div>
        )}

        {/* Pickup cards */}
        {!loading && sortedDeliveries.length > 0 && (
          <div className="mt-8 space-y-5">
            {sortedDeliveries.map((delivery) => {
              const donation = delivery.donation;
              const ngo = delivery.ngo;

              const isAccepting = acceptingId === delivery._id;

              const pickupDistance = getPickupDistance(delivery);

              return (
                <div
                  key={delivery._id}
                  className="rounded-[2rem] border border-white/70 bg-white/65 p-6 shadow-lg backdrop-blur-xl"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    {/* Food */}
                    <div className="flex gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#fdd8a5] text-[#0b306b]">
                        <Package size={23} />
                      </div>

                      <div>
                        <h2 className="text-xl font-bold text-[#0b306b]">
                          {donation?.foodName || "Food Donation"}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                          {donation?.quantity || ""} {donation?.unit || ""}
                        </p>

                        <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#16796f]">
                          <Bike size={16} />
                          Volunteer Pickup
                        </div>

                        {/* Distance */}
                        <div className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-[#0b306b]">
                          <MapPin size={15} />

                          {formatDistance(pickupDistance)}
                        </div>
                      </div>
                    </div>

                    {/* Route */}
                    <div className="rounded-2xl bg-[#fdf6ec] p-4 lg:min-w-[300px]">
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center pt-1">
                          <div className="h-3 w-3 rounded-full bg-[#16796f]" />

                          <div className="my-1 h-10 w-px bg-[#4f81b7]/40" />

                          <div className="h-3 w-3 rounded-full bg-[#0b306b]" />
                        </div>

                        <div className="space-y-4 text-sm">
                          <div>
                            <p className="text-xs text-slate-400">PICKUP</p>

                            <p className="font-semibold text-[#0b306b]">
                              Donor
                            </p>

                            <p className="text-slate-500">
                              {donation?.location?.address ||
                                "Pickup location unavailable"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-400">DELIVERY</p>

                            <p className="font-semibold text-[#0b306b]">
                              {ngo?.name || "NGO"}
                            </p>

                            <p className="text-slate-500">
                              NGO delivery location
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Details + action */}
                    <div className="lg:min-w-[190px]">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock size={16} />

                        <span>
                          Before {formatDeadline(donation?.pickupDeadline)}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                        <Route size={16} />
                        Donor → NGO
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAcceptPickup(delivery._id)}
                        disabled={isAccepting}
                        className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#0b306b] px-5 py-3 font-semibold text-white shadow-md transition hover:bg-[#16796f] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Truck size={18} />

                        {isAccepting ? "Accepting..." : "Accept Pickup"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AvailablePickups;
