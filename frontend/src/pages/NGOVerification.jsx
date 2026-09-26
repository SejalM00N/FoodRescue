import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  ArrowLeft,
  CheckCircle,
  LockKeyhole,
  Package,
  ShieldCheck,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Moves the map whenever the volunteer location changes
function VolunteerMapFollower({ location }) {
  const map = useMap();

  useEffect(() => {
    if (!location) {
      return;
    }

    map.setView([location.latitude, location.longitude], map.getZoom(), {
      animate: true,
    });
  }, [location, map]);

  return null;
}

function NGOVerification() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const deliveryId = searchParams.get("deliveryId");

  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [volunteerLocation, setVolunteerLocation] = useState(null);

  // Fetch delivery details
  useEffect(() => {
    fetchDelivery();
  }, [deliveryId]);

  const fetchDelivery = async () => {
    try {
      setLoading(true);
      setError("");

      if (!deliveryId) {
        setError("Delivery ID is missing.");
        return;
      }

      const response = await api.get("/deliveries/ngo");

      const foundDelivery = response.data.deliveries?.find(
        (item) => item._id === deliveryId,
      );

      if (!foundDelivery) {
        setError("Delivery not found.");
        return;
      }

      setDelivery(foundDelivery);
    } catch (error) {
      console.error("FETCH DELIVERY ERROR:", error);

      setError(
        error.response?.data?.message || "Could not load delivery details.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Socket.IO connection for live volunteer location
  useEffect(() => {
    if (!deliveryId) {
      return;
    }

    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("NGO SOCKET CONNECTED:", socket.id);

      const token = localStorage.getItem("foodrescue_token");

      console.log("NGO SOCKET TOKEN EXISTS:", !!token);

      socket.emit("authenticate", token);
    });

    socket.on("socket-authenticated", () => {
      console.log("NGO SOCKET AUTHENTICATED");

      socket.emit("join-delivery", deliveryId);
    });

    socket.on("delivery-access-granted", ({ deliveryId: joinedDeliveryId }) => {
      console.log("NGO JOINED DELIVERY TRACKING:", joinedDeliveryId);
    });

    socket.on("volunteer-location", (location) => {
      console.log("NGO RECEIVED VOLUNTEER LOCATION:", location);

      setVolunteerLocation(location);
    });

    socket.on("socket-auth-error", (socketError) => {
      console.error("NGO SOCKET AUTH ERROR:", socketError);
    });

    socket.on("delivery-access-denied", (accessError) => {
      console.error("NGO DELIVERY SOCKET ACCESS DENIED:", accessError);
    });

    socket.on("connect_error", (socketError) => {
      console.error("NGO SOCKET CONNECTION ERROR:", socketError);
    });

    return () => {
      socket.disconnect();
    };
  }, [deliveryId]);

  const formatDate = (date) => {
    if (!date) {
      return "Delivery time unavailable";
    }

    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-[#fdf6ec] px-6 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Back button */}
        <button
          onClick={() => navigate("/delivery-tracking")}
          className="mb-8 flex items-center gap-2 text-sm font-medium text-[#0b306b] transition hover:text-[#16796f]"
        >
          <ArrowLeft size={18} />
          Back to Deliveries
        </button>

        <div className="rounded-[2rem] border border-white/70 bg-white/65 p-8 shadow-xl backdrop-blur-xl md:p-12">
          {/* Header icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#dcecf8] text-[#0b306b]">
            <ShieldCheck size={30} />
          </div>

          {/* Heading */}
          <div className="mx-auto mt-6 max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#16796f]">
              Delivery Verification
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#0b306b]">
              Verify Food Delivery
            </h1>

            <p className="mt-3 leading-6 text-slate-500">
              Track the volunteer and verify the food delivery once it reaches
              your NGO.
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="mx-auto mt-8 max-w-xl rounded-3xl bg-[#fdf6ec] p-8 text-center text-slate-500">
              Loading delivery details...
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mx-auto mt-8 max-w-xl rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {!loading && delivery && (
            <>
              {/* Delivery information */}
              <div className="mx-auto mt-8 max-w-xl rounded-3xl bg-[#fdf6ec] p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fdd8a5] text-[#0b306b]">
                    <Package size={21} />
                  </div>

                  <div>
                    <h2 className="font-bold text-[#0b306b]">
                      {delivery.donation?.foodName || "Food Donation"}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {delivery.donation?.quantity || ""}{" "}
                      {delivery.donation?.unit || ""} • Delivery
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Volunteer
                    </p>

                    <p className="mt-1 font-semibold text-[#0b306b]">
                      {delivery.volunteer?.name || "Volunteer"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Delivery
                    </p>

                    <p className="mt-1 font-semibold text-[#0b306b]">
                      {formatDate(delivery.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* LIVE VOLUNTEER MAP */}
              <div className="mx-auto mt-8 max-w-3xl">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-[#0b306b]">
                      Live Delivery Tracking
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Follow the volunteer's current location.
                    </p>
                  </div>

                  {volunteerLocation && (
                    <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      Live
                    </div>
                  )}
                </div>

                <div className="overflow-hidden rounded-3xl border border-white/70 shadow-lg">
                  {volunteerLocation ? (
                    <div className="h-[420px] w-full">
                      <MapContainer
                        center={[
                          volunteerLocation.latitude,
                          volunteerLocation.longitude,
                        ]}
                        zoom={16}
                        scrollWheelZoom={true}
                        className="h-full w-full"
                      >
                        <TileLayer
                          attribution="&copy; OpenStreetMap contributors"
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <VolunteerMapFollower location={volunteerLocation} />

                        <Marker
                          position={[
                            volunteerLocation.latitude,
                            volunteerLocation.longitude,
                          ]}
                        >
                          <Popup>
                            <strong>Volunteer</strong>
                            <br />
                            Live location
                          </Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  ) : (
                    <div className="flex h-[420px] items-center justify-center bg-[#dcecf8]/60">
                      <div className="text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 text-[#16796f] shadow-sm">
                          <ShieldCheck size={26} />
                        </div>

                        <p className="mt-4 font-semibold text-[#0b306b]">
                          Waiting for volunteer location
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Live location will appear here once the volunteer
                          starts sharing.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Verification status */}
              {delivery.otpVerified ? (
                <div className="mx-auto mt-8 max-w-xl rounded-3xl bg-green-50 p-6 text-center">
                  <CheckCircle size={42} className="mx-auto text-green-600" />

                  <h2 className="mt-4 text-xl font-bold text-green-700">
                    Delivery Verified
                  </h2>

                  <p className="mt-2 text-sm text-green-600">
                    The food delivery has been successfully verified and
                    completed.
                  </p>
                </div>
              ) : delivery.deliveryStatus === "delivered" ? (
                <>
                  {/* OTP */}
                  <div className="mx-auto mt-8 max-w-xl rounded-3xl border border-[#fdd8a5] bg-[#fff8ed] p-7 text-center shadow-sm">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fdd8a5] text-[#0b306b]">
                      <LockKeyhole size={22} />
                    </div>

                    <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-[#16796f]">
                      Delivery Verification OTP
                    </p>

                    <p className="mt-3 text-4xl font-black tracking-[0.25em] text-[#0b306b]">
                      {delivery.otp}
                    </p>

                    <p className="mt-4 text-sm leading-5 text-slate-500">
                      Give this 6-digit code to the volunteer. The volunteer
                      will enter it on their device to complete the delivery.
                    </p>
                  </div>

                  {/* Security message */}
                  <div className="mx-auto mt-7 flex max-w-xl gap-3 rounded-2xl bg-[#dcecf8]/70 p-4">
                    <ShieldCheck
                      size={20}
                      className="mt-0.5 shrink-0 text-[#16796f]"
                    />

                    <p className="text-sm leading-5 text-slate-600">
                      Do not share this code with anyone other than the
                      volunteer handling this delivery.
                    </p>
                  </div>
                </>
              ) : (
                <div className="mx-auto mt-8 rounded-3xl bg-[#dcecf8]/70 p-6 text-center">
                  <ShieldCheck size={38} className="mx-auto text-[#16796f]" />

                  <h2 className="mt-4 text-xl font-bold text-[#0b306b]">
                    Waiting for Volunteer
                  </h2>

                  <p className="mt-2 text-sm leading-5 text-slate-500">
                    The OTP will appear here after the volunteer marks the
                    delivery as reached.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default NGOVerification;
