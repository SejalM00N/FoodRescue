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
import DashboardLayout from "../components/DashboardLayout.jsx";

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

    const socket = io(import.meta.env.VITE_SOCKET_URL);

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
    <DashboardLayout role="ngo">
      <div className="min-h-screen bg-[#fdf6ec] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-5xl">
          {/* Back button */}
          <button
            type="button"
            onClick={() => navigate("/ngo-deliveries")}
            className="mb-5 flex cursor-pointer items-center gap-2 rounded-xl px-1 py-2 text-sm font-medium text-[#0b306b] transition hover:text-[#16796f] sm:mb-8"
          >
            <ArrowLeft size={18} />
            Back to Deliveries
          </button>

          <div className="rounded-[1.5rem] border border-white/70 bg-white/65 p-5 shadow-xl backdrop-blur-xl sm:rounded-[2rem] sm:p-8 md:p-12">
            {/* Header icon */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#dcecf8] text-[#0b306b] sm:h-16 sm:w-16 sm:rounded-3xl">
              <ShieldCheck size={27} className="sm:h-[30px] sm:w-[30px]" />
            </div>

            {/* Heading */}
            <div className="mx-auto mt-5 max-w-xl text-center sm:mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#16796f] sm:text-sm">
                Delivery Verification
              </p>

              <h1 className="mt-2 text-2xl font-bold text-[#0b306b] sm:text-3xl">
                Verify Food Delivery
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                Track the volunteer and verify the food delivery once it reaches
                your NGO.
              </p>
            </div>

            {/* Loading */}
            {loading && (
              <div className="mx-auto mt-6 max-w-xl rounded-3xl bg-[#fdf6ec] p-6 text-center text-sm text-slate-500 sm:mt-8 sm:p-8">
                Loading delivery details...
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mx-auto mt-6 max-w-xl rounded-2xl bg-red-50 px-4 py-4 text-sm leading-5 text-red-600 sm:mt-8 sm:px-5">
                {error}
              </div>
            )}

            {!loading && delivery && (
              <>
                {/* Delivery information */}
                <div className="mx-auto mt-6 max-w-xl rounded-3xl bg-[#fdf6ec] p-5 sm:mt-8 sm:p-6">
                  <div className="flex items-start gap-3 sm:items-center sm:gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fdd8a5] text-[#0b306b] sm:h-12 sm:w-12">
                      <Package size={21} />
                    </div>

                    <div className="min-w-0">
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

                      <p className="mt-1 break-words font-semibold text-[#0b306b]">
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
                <div className="mx-auto mt-7 max-w-3xl sm:mt-8">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-[#0b306b]">
                        Live Delivery Tracking
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Follow the volunteer&apos;s current location.
                      </p>
                    </div>

                    {volunteerLocation && (
                      <div className="flex w-fit items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        Live
                      </div>
                    )}
                  </div>

                  <div className="mt-3 overflow-hidden rounded-3xl border border-white/70 shadow-lg">
                    {volunteerLocation ? (
                      <div className="h-[300px] w-full sm:h-[380px] md:h-[420px]">
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
                      <div className="flex h-[300px] items-center justify-center bg-[#dcecf8]/60 px-5 text-center sm:h-[380px] md:h-[420px]">
                        <div>
                          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 text-[#16796f] shadow-sm">
                            <ShieldCheck size={26} />
                          </div>

                          <p className="mt-4 font-semibold text-[#0b306b]">
                            Waiting for volunteer location
                          </p>

                          <p className="mt-1 text-sm leading-5 text-slate-500">
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
                  <div className="mx-auto mt-7 max-w-xl rounded-3xl bg-green-50 p-5 text-center sm:mt-8 sm:p-6">
                    <CheckCircle
                      size={40}
                      className="mx-auto text-green-600 sm:h-[42px] sm:w-[42px]"
                    />

                    <h2 className="mt-4 text-xl font-bold text-green-700">
                      Delivery Verified
                    </h2>

                    <p className="mt-2 text-sm leading-5 text-green-600">
                      The food delivery has been successfully verified and
                      completed.
                    </p>
                  </div>
                ) : delivery.deliveryStatus === "delivered" ? (
                  <>
                    {/* OTP */}
                    <div className="mx-auto mt-7 max-w-xl rounded-3xl border border-[#fdd8a5] bg-[#fff8ed] p-5 text-center shadow-sm sm:mt-8 sm:p-7">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fdd8a5] text-[#0b306b]">
                        <LockKeyhole size={22} />
                      </div>

                      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#16796f] sm:text-sm">
                        Delivery Verification OTP
                      </p>

                      <p className="mt-3 break-all text-3xl font-black tracking-[0.2em] text-[#0b306b] sm:text-4xl sm:tracking-[0.25em]">
                        {delivery.otp}
                      </p>

                      <p className="mt-4 text-sm leading-5 text-slate-500">
                        Give this 6-digit code to the volunteer. The volunteer
                        will enter it on their device to complete the delivery.
                      </p>
                    </div>

                    {/* Security message */}
                    <div className="mx-auto mt-5 flex max-w-xl gap-3 rounded-2xl bg-[#dcecf8]/70 p-4 sm:mt-7">
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
                  <div className="mx-auto mt-7 rounded-3xl bg-[#dcecf8]/70 p-5 text-center sm:mt-8 sm:p-6">
                    <ShieldCheck size={36} className="mx-auto text-[#16796f]" />

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
    </DashboardLayout>
  );
}

export default NGOVerification;
