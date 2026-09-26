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

    // Do not automatically select a location.
    // The NGO must choose one of the two options.
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
        onClick={() => navigate(-1)}
        className="mb-6 flex cursor-pointer items-center gap-2 text-sm font-medium text-[#0b306b] transition hover:text-[#16796f]"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#16796f]">
            NGO
          </p>

          <h1 className="mt-2 text-4xl font-bold text-[#0b306b]">Find Food</h1>

          <p className="mt-2 text-slate-500">
            Discover surplus food available near your organization.
          </p>
        </div>

        {/* Search */}
        <div className="mt-8 flex flex-col gap-4 md:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 shadow-sm backdrop-blur-xl">
            <Search size={19} className="text-[#4f81b7]" />

            <input
              type="text"
              placeholder="Search food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none placeholder:text-slate-400"
            />
          </div>

          <button
            type="button"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-[#4f81b7]/30 bg-white/70 px-5 py-3 font-semibold text-[#0b306b] shadow-sm backdrop-blur-xl transition hover:bg-[#dcecf8]"
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>
        </div>

        {/* Success */}
        {success && (
          <div className="mt-6 rounded-2xl border border-[#16796f]/20 bg-[#dcefeb] px-5 py-4 text-sm font-medium text-[#16796f]">
            {success}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-12 text-center">
            <p className="text-sm font-medium text-[#16796f]">
              Loading available food...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && filteredDonations.length === 0 && (
          <div className="mt-12 rounded-[2rem] border border-white/70 bg-white/65 p-12 text-center shadow-lg backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#dcecf8] text-[#0b306b]">
              <Package size={28} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#0b306b]">
              No food donations available
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Check again later for new surplus food donations.
            </p>
          </div>
        )}

        {/* Donations */}
        {!loading && filteredDonations.length > 0 && (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {filteredDonations.map((donation) => (
              <div
                key={donation._id}
                className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/65 shadow-lg backdrop-blur-xl"
              >
                {/* Food Image */}
                <div className="relative h-52 overflow-hidden bg-gradient-to-br from-[#dcecf8] via-[#eef7f6] to-[#fdd8a5]">
                  {donation.imageUrl ? (
                    <img
                      src={donation.imageUrl}
                      alt={donation.foodName || "Food donation"}
                      className="h-full w-full object-cover"
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

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-[#0b306b]">
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

                  {/* Donation Details */}
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-[#fdf6ec] p-3">
                      <p className="text-xs text-slate-400">Quantity</p>

                      <p className="mt-1 text-sm font-semibold text-[#0b306b]">
                        {donation.quantity} {donation.unit}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#fdf6ec] p-3">
                      <p className="text-xs text-slate-400">Location</p>

                      <p className="mt-1 flex items-start gap-1 text-sm font-semibold text-[#0b306b]">
                        <MapPin size={14} className="mt-0.5 shrink-0" />

                        <span>
                          {donation.location?.address || "Not specified"}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Pickup Deadline */}
                  <div className="mt-4 flex items-start gap-2 text-sm text-slate-500">
                    <Clock size={16} className="mt-0.5 shrink-0" />

                    <span>
                      Pickup before{" "}
                      <span className="font-medium text-[#0b306b]">
                        {formatDeadline(donation.pickupDeadline)}
                      </span>
                    </span>
                  </div>

                  {/* Description */}
                  {donation.description && (
                    <p className="mt-4 rounded-2xl bg-[#fdf6ec] p-3 text-sm text-slate-500">
                      {donation.description}
                    </p>
                  )}

                  {/* Request */}
                  <button
                    onClick={() => handleRequestFood(donation)}
                    disabled={requestingId === donation._id}
                    className="mt-6 w-full cursor-pointer rounded-2xl bg-[#0b306b] py-3.5 font-semibold text-white shadow-md transition hover:bg-[#16796f] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {requestingId === donation._id
                      ? "Sending Request..."
                      : "Request Food"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delivery Location Modal */}
      {selectedDonation && !showLocationPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b306b]/40 px-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2rem] border border-white/70 bg-[#fdf6ec]/95 p-6 shadow-2xl backdrop-blur-xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-[#16796f]">
                  Delivery Location
                </p>

                <h2 className="mt-1 text-2xl font-bold text-[#0b306b]">
                  Where should this food be delivered?
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Select the location where you want this food delivered.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDonation(null)}
                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-white/70 text-slate-500 transition hover:bg-white hover:text-[#0b306b]"
              >
                <X size={19} />
              </button>
            </div>

            {/* Location Options */}
            <div className="mt-6 space-y-3">
              {/* Saved Location */}
              <button
                type="button"
                onClick={handleUseSavedLocation}
                disabled={!ngoLocation}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  locationMode === "saved"
                    ? "border-[#16796f] bg-[#dcefeb]"
                    : "border-slate-200 bg-white/70 hover:border-[#4f81b7]"
                } ${
                  !ngoLocation
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

                    <p className="mt-1 text-sm text-slate-500">
                      {ngoLocation?.address || "No saved location available"}
                    </p>
                  </div>
                </div>
              </button>

              {/* Map Location */}
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

                {/* Selected Map Location */}
                {locationMode === "custom" && deliveryAddress && (
                  <div className="mt-3 rounded-xl bg-white/80 p-3">
                    <p className="text-xs font-semibold text-[#0b306b]">
                      Selected location
                    </p>

                    <p className="mt-1 text-sm leading-5 text-slate-600">
                      {deliveryAddress}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Error */}
            {locationError && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {locationError}
              </div>
            )}

            {/* Confirm */}
            <button
              type="button"
              onClick={handleConfirmRequest}
              disabled={
                requestingId === selectedDonation._id ||
                !deliveryAddress.trim() ||
                deliveryLatitude == null ||
                deliveryLongitude == null
              }
              className="mt-6 w-full rounded-2xl bg-[#0b306b] py-3.5 font-semibold text-white shadow-md transition hover:bg-[#16796f] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {requestingId === selectedDonation._id
                ? "Sending Request..."
                : "Confirm & Request Food"}
            </button>
          </div>
        </div>
      )}

      {/* Map Location Picker */}
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
    </div>
  );
}

export default FindFood;
