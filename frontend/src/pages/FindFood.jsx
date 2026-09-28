import {
  ArrowLeft,
  Clock,
  ImageOff,
  MapPin,
  Package,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import LocationPicker from "../LocationPicker";
import DashboardLayout from "../components/DashboardLayout.jsx";

function FindFood() {
  const navigate = useNavigate();

  const [donations, setDonations] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // NGO saved location
  const [ngoLocation, setNgoLocation] = useState(null);
  const [ngoLocationLoading, setNgoLocationLoading] = useState(true);

  // Delivery-location modal
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [locationMode, setLocationMode] = useState("");

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryLatitude, setDeliveryLatitude] = useState(null);
  const [deliveryLongitude, setDeliveryLongitude] = useState(null);

  const [locationError, setLocationError] = useState("");

  // Map picker
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  useEffect(() => {
    fetchDonations();
    fetchNGOLocation();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/donations/available");

      console.log(
        "AVAILABLE DONATIONS FULL RESPONSE:",
        JSON.stringify(response.data, null, 2),
      );

      let donationData = [];

      if (Array.isArray(response.data)) {
        donationData = response.data;
      } else if (Array.isArray(response.data?.donations)) {
        donationData = response.data.donations;
      } else if (Array.isArray(response.data?.data)) {
        donationData = response.data.data;
      } else if (Array.isArray(response.data?.data?.donations)) {
        donationData = response.data.data.donations;
      }

      console.log("DONATIONS ARRAY USED BY FRONTEND:", donationData);

      setDonations(donationData);
    } catch (error) {
      console.error("Failed to load donations:", error);

      setError(
        error.response?.data?.message || "Could not load available donations.",
      );

      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchNGOLocation = async () => {
    try {
      setNgoLocationLoading(true);

      const response = await api.get("/users/profile");

      const user = response.data?.user || response.data;

      console.log("NGO PROFILE LOCATION:", user);

      if (user?.location && user?.latitude != null && user?.longitude != null) {
        setNgoLocation({
          address: user.location,
          latitude: Number(user.latitude),
          longitude: Number(user.longitude),
        });
      } else {
        setNgoLocation(null);
      }
    } catch (error) {
      console.error("Failed to load NGO location:", error);
      setNgoLocation(null);
    } finally {
      setNgoLocationLoading(false);
    }
  };

  const handleRequestFood = (donation) => {
    setError("");
    setSuccess("");
    setLocationError("");
    setShowLocationPicker(false);

    setSelectedDonation(donation);

    setLocationMode("");
    setDeliveryAddress("");
    setDeliveryLatitude(null);
    setDeliveryLongitude(null);
  };

  const handleUseSavedLocation = () => {
    if (!ngoLocation) {
      setLocationError("No saved location available.");
      return;
    }

    setLocationError("");

    setLocationMode("saved");
    setDeliveryAddress(ngoLocation.address);
    setDeliveryLatitude(ngoLocation.latitude);
    setDeliveryLongitude(ngoLocation.longitude);
  };

  const handleOpenLocationPicker = () => {
    setLocationError("");
    setLocationMode("custom");
    setShowLocationPicker(true);
  };

  const handleConfirmPickedLocation = (location) => {
    setDeliveryAddress(location.address);
    setDeliveryLatitude(Number(location.latitude));
    setDeliveryLongitude(Number(location.longitude));

    setLocationMode("custom");
    setLocationError("");
    setShowLocationPicker(false);
  };

  const handleCloseLocationPicker = () => {
    setShowLocationPicker(false);
  };

  const handleConfirmRequest = async () => {
    if (!selectedDonation) return;

    if (
      !deliveryAddress.trim() ||
      deliveryLatitude == null ||
      deliveryLongitude == null
    ) {
      setLocationError(
        "Please select a valid delivery location before continuing.",
      );
      return;
    }

    try {
      setRequestingId(selectedDonation._id);
      setLocationError("");
      setError("");
      setSuccess("");

      await api.post("/donation-requests", {
        donationId: selectedDonation._id,
        message: "We would like to receive this food donation.",
        deliveryLocation: {
          address: deliveryAddress.trim(),
          latitude: Number(deliveryLatitude),
          longitude: Number(deliveryLongitude),
        },
      });

      setSuccess("Food request sent successfully.");

      setDonations((currentDonations) =>
        Array.isArray(currentDonations)
          ? currentDonations.filter(
              (donation) => donation._id !== selectedDonation._id,
            )
          : [],
      );

      setSelectedDonation(null);
      setShowLocationPicker(false);
      setLocationMode("");
      setDeliveryAddress("");
      setDeliveryLatitude(null);
      setDeliveryLongitude(null);
    } catch (error) {
      console.error("Food request failed:", error);

      setLocationError(
        error.response?.data?.message ||
          "Could not send food request. Please try again.",
      );
    } finally {
      setRequestingId("");
    }
  };

  const filteredDonations = Array.isArray(donations)
    ? donations.filter((donation) => {
        const searchText = search.toLowerCase().trim();

        if (!searchText) return true;

        return (
          donation.foodName?.toLowerCase().includes(searchText) ||
          donation.category?.toLowerCase().includes(searchText) ||
          donation.location?.address?.toLowerCase().includes(searchText)
        );
      })
    : [];

  const formatCategory = (category) => {
    if (!category) return "Food";

    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDeadline = (date) => {
    if (!date) return "Not specified";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not specified";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  };

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
              Find Food
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Discover surplus food available near your organization.
            </p>
          </div>

          {/* SEARCH */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 shadow-sm backdrop-blur-xl">
              <Search size={19} className="shrink-0 text-[#4f81b7]" />

              <input
                type="text"
                placeholder="Search food, category or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="min-w-0 w-full bg-transparent text-sm outline-none placeholder:text-slate-400 sm:text-base"
              />
            </div>

            <button
              type="button"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-[#4f81b7]/30 bg-white/70 px-5 py-3 text-sm font-semibold text-[#0b306b] shadow-sm backdrop-blur-xl transition hover:bg-[#dcecf8] sm:text-base"
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>
          </div>

          {/* SUCCESS */}
          {success && (
            <div className="mt-6 rounded-2xl border border-[#16796f]/20 bg-[#dcefeb] px-5 py-4 text-sm font-medium text-[#16796f]">
              {success}
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* LOADING */}
          {loading && (
            <div className="flex min-h-[260px] items-center justify-center text-center">
              <p className="text-sm font-medium text-[#16796f]">
                Loading available food...
              </p>
            </div>
          )}

          {/* EMPTY */}
          {!loading && filteredDonations.length === 0 && (
            <div className="mt-10 rounded-[2rem] border border-white/70 bg-white/65 p-8 text-center shadow-lg backdrop-blur-xl sm:p-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#dcecf8] text-[#0b306b]">
                <Package size={28} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-[#0b306b]">
                No food donations available
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {search.trim()
                  ? "Try a different food, category or location."
                  : "Check again later for new surplus food donations."}
              </p>

              {!search.trim() && (
                <button
                  type="button"
                  onClick={fetchDonations}
                  className="mt-5 cursor-pointer rounded-xl bg-[#0b306b] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#16796f]"
                >
                  Refresh
                </button>
              )}
            </div>
          )}

          {/* DONATIONS */}
          {!loading && filteredDonations.length > 0 && (
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredDonations.map((donation) => (
                <div
                  key={donation._id}
                  className="flex min-w-0 flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-white/65 shadow-lg backdrop-blur-xl"
                >
                  {/* FOOD IMAGE */}
                  <div className="relative h-52 shrink-0 overflow-hidden bg-gradient-to-br from-[#dcecf8] via-[#eef7f6] to-[#fdd8a5] sm:h-56">
                    {donation.imageUrl ? (
                      <img
                        src={donation.imageUrl}
                        alt={donation.foodName || "Food donation"}
                        className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/70 text-[#0b306b] shadow-sm backdrop-blur-md">
                          <ImageOff size={34} />
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />

                    <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-[#16796f] shadow-sm backdrop-blur-md">
                      Available
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    {/* TITLE */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="break-words text-xl font-bold text-[#0b306b]">
                          {donation.foodName}
                        </h2>

                        <p className="mt-1 text-sm text-[#16796f]">
                          {formatCategory(donation.category)}
                        </p>
                      </div>

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fdd8a5] text-[#0b306b]">
                        <Package size={20} />
                      </div>
                    </div>

                    {/* DONATION DETAILS */}
                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-[#fdf6ec] p-3">
                        <p className="text-xs text-slate-400">Quantity</p>

                        <p className="mt-1 text-sm font-semibold text-[#0b306b]">
                          {donation.quantity} {donation.unit}
                        </p>
                      </div>

                      <div className="min-w-0 rounded-2xl bg-[#fdf6ec] p-3">
                        <p className="text-xs text-slate-400">Location</p>

                        <p className="mt-1 flex min-w-0 items-start gap-1 text-sm font-semibold text-[#0b306b]">
                          <MapPin size={14} className="mt-0.5 shrink-0" />

                          <span className="line-clamp-3 break-words">
                            {donation.location?.address || "Not specified"}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* PICKUP DEADLINE */}
                    <div className="mt-4 flex items-start gap-2 text-sm text-slate-500">
                      <Clock size={16} className="mt-0.5 shrink-0" />

                      <span>
                        Pickup before{" "}
                        <span className="font-medium text-[#0b306b]">
                          {formatDeadline(donation.pickupDeadline)}
                        </span>
                      </span>
                    </div>

                    {/* DESCRIPTION */}
                    {donation.description && (
                      <p className="mt-4 line-clamp-3 rounded-2xl bg-[#fdf6ec] p-3 text-sm leading-5 text-slate-500">
                        {donation.description}
                      </p>
                    )}

                    {/* REQUEST */}
                    <button
                      type="button"
                      onClick={() => handleRequestFood(donation)}
                      disabled={requestingId === donation._id}
                      className="mt-auto pt-6"
                    >
                      <span className="flex w-full cursor-pointer items-center justify-center rounded-2xl bg-[#0b306b] py-3.5 font-semibold text-white shadow-md transition hover:bg-[#16796f] disabled:cursor-not-allowed disabled:opacity-60">
                        {requestingId === donation._id
                          ? "Sending Request..."
                          : "Request Food"}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DELIVERY LOCATION MODAL */}
      {selectedDonation && !showLocationPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b306b]/40 px-4 py-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[2rem] border border-white/70 bg-[#fdf6ec]/95 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
            {/* MODAL HEADER */}
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#16796f] sm:text-sm">
                  Delivery Location
                </p>

                <h2 className="mt-1 text-xl font-bold leading-tight text-[#0b306b] sm:text-2xl">
                  Where should this food be delivered?
                </h2>

                <p className="mt-2 text-sm leading-5 text-slate-500">
                  Select the location where you want this food delivered.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDonation(null)}
                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-white/70 text-slate-500 transition hover:bg-white hover:text-[#0b306b]"
                aria-label="Close delivery location modal"
              >
                <X size={19} />
              </button>
            </div>

            {/* LOCATION OPTIONS */}
            <div className="mt-6 space-y-3">
              {/* SAVED LOCATION */}
              <button
                type="button"
                onClick={handleUseSavedLocation}
                disabled={!ngoLocation || ngoLocationLoading}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  locationMode === "saved"
                    ? "border-[#16796f] bg-[#dcefeb]"
                    : "border-slate-200 bg-white/70 hover:border-[#4f81b7]"
                } ${
                  !ngoLocation || ngoLocationLoading
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#16796f]">
                    <MapPin size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-[#0b306b]">
                      Use my saved location
                    </p>

                    <p className="mt-1 break-words text-sm leading-5 text-slate-500">
                      {ngoLocationLoading
                        ? "Loading saved location..."
                        : ngoLocation?.address || "No saved location available"}
                    </p>
                  </div>
                </div>
              </button>

              {/* MAP LOCATION */}
              <div
                className={`w-full rounded-2xl border p-4 transition ${
                  locationMode === "custom"
                    ? "border-[#16796f] bg-[#dcefeb]"
                    : "border-slate-200 bg-white/70"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#0b306b]">
                    <MapPin size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-[#0b306b]">
                      Choose delivery location
                    </p>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      Search or place a pin on the map to select the exact
                      delivery point.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleOpenLocationPicker}
                  className="mt-4 w-full cursor-pointer rounded-2xl bg-[#16796f] py-3 font-semibold text-white transition hover:bg-[#0b306b]"
                >
                  {locationMode === "custom"
                    ? "Change Location on Map"
                    : "Choose Location on Map"}
                </button>

                {locationMode === "custom" && deliveryAddress && (
                  <div className="mt-3 rounded-xl bg-white/80 p-3">
                    <p className="text-xs font-semibold text-[#0b306b]">
                      Selected location
                    </p>

                    <p className="mt-1 break-words text-sm leading-5 text-slate-600">
                      {deliveryAddress}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* LOCATION ERROR */}
            {locationError && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {locationError}
              </div>
            )}

            {/* CONFIRM */}
            <button
              type="button"
              onClick={handleConfirmRequest}
              disabled={
                requestingId === selectedDonation._id ||
                !deliveryAddress.trim() ||
                deliveryLatitude == null ||
                deliveryLongitude == null
              }
              className="mt-6 w-full cursor-pointer rounded-2xl bg-[#0b306b] py-3.5 font-semibold text-white shadow-md transition hover:bg-[#16796f] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {requestingId === selectedDonation._id
                ? "Sending Request..."
                : "Confirm & Request Food"}
            </button>
          </div>
        </div>
      )}

      {/* MAP LOCATION PICKER */}
      {showLocationPicker && (
        <LocationPicker
          initialLocation={
            deliveryLatitude != null && deliveryLongitude != null
              ? {
                  address: deliveryAddress,
                  latitude: deliveryLatitude,
                  longitude: deliveryLongitude,
                }
              : null
          }
          onConfirm={handleConfirmPickedLocation}
          onClose={handleCloseLocationPicker}
        />
      )}
    </DashboardLayout>
  );
}

export default FindFood;
