import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import api from "../services/api";

function MapFollower({ location }) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.setView([location.latitude, location.longitude], 14, {
        animate: true,
      });
    }
  }, [location, map]);

  return null;
}

function VolunteerMap() {
  const [availableDeliveries, setAvailableDeliveries] = useState([]);
  const [myDeliveries, setMyDeliveries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [volunteerLocation, setVolunteerLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const activeDelivery = myDeliveries.find(
    (delivery) =>
      delivery.volunteer &&
      ["accepted", "picked_up"].includes(delivery.pickupStatus) &&
      ["pending", "in_transit"].includes(delivery.deliveryStatus),
  );
  console.log("MY DELIVERIES:", myDeliveries);
  console.log("ACTIVE DELIVERY:", activeDelivery);
  console.log("VOLUNTEER LOCATION:", volunteerLocation);

  // Fetch available pickups + volunteer's deliveries
  const fetchDeliveries = async () => {
    try {
      const [availableResponse, myResponse] = await Promise.all([
        api.get("/deliveries/available"),
        api.get("/deliveries/my"),
      ]);

      setAvailableDeliveries(availableResponse.data.deliveries || []);
      setMyDeliveries(myResponse.data.deliveries || []);
    } catch (err) {
      console.error("Volunteer map error:", err);

      setError(
        err.response?.data?.message || "Failed to load pickup locations.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  // Track volunteer's live location
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Location services are not supported by this browser.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setVolunteerLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (locationError) => {
        console.error("Volunteer location error:", locationError);

        setError(
          "Location permission is required to show your live position on the map.",
        );
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Get road route from volunteer to pickup
  useEffect(() => {
    const fetchRoute = async () => {
      if (!volunteerLocation || !activeDelivery) {
        setRouteCoordinates([]);
        return;
      }

      const isPickedUp =
        activeDelivery?.pickupStatus === "picked_up" &&
        activeDelivery?.deliveryStatus === "in_transit";

      const destinationLocation = isPickedUp
        ? activeDelivery?.deliveryLocation
        : activeDelivery?.donation?.location;

      console.log("DESTINATION LOCATION:", destinationLocation);
      if (
        destinationLocation?.latitude == null ||
        destinationLocation?.longitude == null
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
  }, [volunteerLocation, activeDelivery]);

  const validAvailableDeliveries = availableDeliveries.filter(
    (delivery) =>
      delivery.donation?.location?.latitude != null &&
      delivery.donation?.location?.longitude != null,
  );

  const activePickupLocation = activeDelivery?.donation?.location;

  const defaultCenter = volunteerLocation
    ? [volunteerLocation.latitude, volunteerLocation.longitude]
    : validAvailableDeliveries.length > 0
      ? [
          validAvailableDeliveries[0].donation.location.latitude,
          validAvailableDeliveries[0].donation.location.longitude,
        ]
      : [20.5937, 78.9629];

  const handleAcceptPickup = async (deliveryId) => {
    try {
      setError("");

      await api.put(`/deliveries/${deliveryId}/accept`);

      await fetchDeliveries();
    } catch (err) {
      console.error("Accept pickup error:", err);

      alert(err.response?.data?.message || "Failed to accept this pickup.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">Loading pickup map...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-[#0b306b]">Pickup Map</h1>

        <p className="mt-1 text-sm text-slate-500">
          {activeDelivery
            ? "Your active pickup route is shown below."
            : "View available food pickups and choose a delivery."}
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/60 bg-white shadow-lg">
        <MapContainer
          center={defaultCenter}
          zoom={
            activeDelivery ? 14 : validAvailableDeliveries.length > 0 ? 13 : 5
          }
          scrollWheelZoom={true}
          style={{ height: "600px", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Keep map centered on volunteer */}
          <MapFollower location={volunteerLocation} />

          {/* Volunteer location */}
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

          {/* BEFORE ACCEPTANCE: show all available pickups */}
          {!activeDelivery &&
            validAvailableDeliveries.map((delivery) => {
              const donation = delivery.donation;

              return (
                <Marker
                  key={delivery._id}
                  position={[
                    donation.location.latitude,
                    donation.location.longitude,
                  ]}
                >
                  <Popup>
                    <div className="min-w-[220px]">
                      <h3 className="font-bold text-[#0b306b]">
                        {donation.foodName}
                      </h3>

                      <p className="mt-1 text-sm">
                        Quantity: {donation.quantity} {donation.unit}
                      </p>

                      <p className="mt-1 text-sm">
                        Pickup: {donation.location.address}
                      </p>

                      {delivery.ngo?.name && (
                        <p className="mt-1 text-sm">NGO: {delivery.ngo.name}</p>
                      )}

                      <button
                        onClick={() => handleAcceptPickup(delivery._id)}
                        className="mt-3 w-full rounded-xl bg-[#0b306b] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#092653]"
                      >
                        Accept Pickup
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

          {/* AFTER ACCEPTANCE: show only assigned pickup */}
          {activeDelivery && activePickupLocation?.latitude != null && (
            <Marker
              position={[
                activePickupLocation.latitude,
                activePickupLocation.longitude,
              ]}
            >
              <Popup>
                <div className="min-w-[220px]">
                  <h3 className="font-bold text-[#0b306b]">
                    {activeDelivery.donation.foodName}
                  </h3>

                  <p className="mt-1 text-sm">
                    Quantity: {activeDelivery.donation.quantity}{" "}
                    {activeDelivery.donation.unit}
                  </p>

                  <p className="mt-1 text-sm">
                    Pickup: {activePickupLocation.address}
                  </p>

                  <p className="mt-2 text-sm font-semibold text-[#16796f]">
                    Pickup assigned to you
                  </p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Actual road route */}
          {activeDelivery && routeCoordinates.length > 0 && (
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
      </div>

      {/* Active pickup information */}
      {activeDelivery && (
        <div className="mt-5 rounded-3xl border border-white/60 bg-white p-5 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#4f81b7]">
            Active Pickup
          </p>

          <h2 className="mt-1 text-xl font-bold text-[#0b306b]">
            {activeDelivery.donation.foodName}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {activeDelivery.donation.location.address}
          </p>

          <div className="mt-4 rounded-2xl bg-[#fdd8a5]/30 p-4">
            <p className="text-sm font-semibold text-[#0b306b]">
              Route to pickup
            </p>

            <p className="mt-1 text-sm text-slate-600">
              Your live location is being tracked while you travel to the pickup
              point.
            </p>
          </div>
        </div>
      )}

      {/* No available pickups */}
      {!activeDelivery && validAvailableDeliveries.length === 0 && (
        <p className="mt-4 text-center text-sm text-slate-500">
          No pickup locations with map coordinates are currently available.
        </p>
      )}
    </div>
  );
}

export default VolunteerMap;
