import {
  ArrowLeft,
  Calendar,
  Clock,
  ImagePlus,
  MapPin,
  Navigation,
  Package,
  Send,
  Utensils,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

/* ---------------------------------------------------------
   Helper functions
--------------------------------------------------------- */

const pad = (value) => String(value).padStart(2, "0");

const getLocalDateTimeString = (date = new Date()) => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const parseDateTime = (value) => {
  if (!value) return null;

  const [datePart, timePart = "00:00"] = value.split("T");

  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);

  if (!year || !month || !day || Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  const date = new Date(year, month - 1, day, hours, minutes, 0, 0);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

const toApiDateTime = (value) => {
  const date = parseDateTime(value);

  if (!date || Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
};

const formatDate = (value) => {
  const date = parseDateTime(value);

  if (!date) return "";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatTime = (value) => {
  const date = parseDateTime(value);

  if (!date) return "";

  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

/* ---------------------------------------------------------
   Date + Time Field
   12-hour format with AM / PM.
   No calendar picker.
   Manual typing + spinner controls.
--------------------------------------------------------- */

function DateTimeField({
  label,
  value,
  onChange,
  icon: Icon,
  minDateTime,
  maxDateTime,
  error,
}) {
  const current = value ? parseDateTime(value) : null;

  const get12Hour = (hour24) => {
    if (hour24 === 0) return 12;
    if (hour24 > 12) return hour24 - 12;
    return hour24;
  };

  const getMeridiem = (hour24) => {
    return hour24 >= 12 ? "PM" : "AM";
  };

  const [day, setDay] = useState(current ? current.getDate() : "");

  const [month, setMonth] = useState(current ? current.getMonth() + 1 : "");

  const [year, setYear] = useState(current ? current.getFullYear() : "");

  const [hour, setHour] = useState(
    current ? get12Hour(current.getHours()) : "",
  );

  const [minute, setMinute] = useState(current ? current.getMinutes() : "");

  const [meridiem, setMeridiem] = useState(
    current ? getMeridiem(current.getHours()) : "AM",
  );

  useEffect(() => {
    if (!value) {
      setDay("");
      setMonth("");
      setYear("");
      setHour("");
      setMinute("");
      setMeridiem("AM");
      return;
    }

    const date = parseDateTime(value);

    if (!date) return;

    setDay(date.getDate());
    setMonth(date.getMonth() + 1);
    setYear(date.getFullYear());
    setHour(get12Hour(date.getHours()));
    setMinute(date.getMinutes());
    setMeridiem(getMeridiem(date.getHours()));
  }, [value]);

  const convertTo24Hour = (hour12, selectedMeridiem) => {
    let hour24 = Number(hour12);

    if (selectedMeridiem === "AM") {
      if (hour24 === 12) {
        hour24 = 0;
      }
    } else {
      if (hour24 !== 12) {
        hour24 += 12;
      }
    }

    return hour24;
  };

  const updateDateTime = (
    nextDay = day,
    nextMonth = month,
    nextYear = year,
    nextHour = hour,
    nextMinute = minute,
    nextMeridiem = meridiem,
  ) => {
    if (
      nextDay === "" ||
      nextMonth === "" ||
      nextYear === "" ||
      nextHour === "" ||
      nextMinute === ""
    ) {
      return false;
    }

    const numericHour = Number(nextHour);
    const numericMinute = Number(nextMinute);

    if (numericHour < 1 || numericHour > 12) {
      return false;
    }

    if (numericMinute < 0 || numericMinute > 59) {
      return false;
    }

    const hour24 = convertTo24Hour(numericHour, nextMeridiem);

    const date = new Date(
      Number(nextYear),
      Number(nextMonth) - 1,
      Number(nextDay),
      hour24,
      numericMinute,
      0,
      0,
    );

    if (Number.isNaN(date.getTime())) {
      return false;
    }

    // Prevent invalid dates such as 31 February.
    if (
      date.getFullYear() !== Number(nextYear) ||
      date.getMonth() !== Number(nextMonth) - 1 ||
      date.getDate() !== Number(nextDay)
    ) {
      return false;
    }

    if (minDateTime) {
      const minimum = parseDateTime(minDateTime);

      if (minimum && date < minimum) {
        return false;
      }
    }

    if (maxDateTime) {
      const maximum = parseDateTime(maxDateTime);

      if (maximum && date > maximum) {
        return false;
      }
    }

    onChange(getLocalDateTimeString(date));

    return true;
  };

  const handleChange = (setter, field, rawValue) => {
    if (rawValue === "") {
      setter("");
      return;
    }

    const numericValue = Number(rawValue);

    if (Number.isNaN(numericValue)) return;

    setter(numericValue);

    const nextValues = {
      day,
      month,
      year,
      hour,
      minute,
      meridiem,
      [field]: numericValue,
    };

    updateDateTime(
      nextValues.day,
      nextValues.month,
      nextValues.year,
      nextValues.hour,
      nextValues.minute,
      nextValues.meridiem,
    );
  };

  const handleMeridiemChange = (nextMeridiem) => {
    const updated = updateDateTime(
      day,
      month,
      year,
      hour,
      minute,
      nextMeridiem,
    );

    if (updated) {
      setMeridiem(nextMeridiem);
    }
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#0b306b]">
        {label}
      </label>

      <div
        className={`rounded-2xl border bg-white/80 p-3 transition ${
          error
            ? "border-red-300 ring-2 ring-red-100"
            : "border-slate-200 focus-within:border-[#16796f] focus-within:ring-2 focus-within:ring-[#16796f]/10"
        }`}
      >
        <div className="mb-3 flex items-center gap-2">
          <Icon size={17} className="text-[#4f81b7]" />

          <span className="text-xs font-medium text-slate-400">
            Enter date and time
          </span>
        </div>

        {/* Date */}
        <div className="grid grid-cols-[1fr_auto_1fr_auto_1.4fr] items-center gap-2">
          <input
            type="number"
            min="1"
            max="31"
            placeholder="DD"
            value={day}
            onChange={(e) => handleChange(setDay, "day", e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2 py-2.5 text-center text-sm font-medium text-slate-700 outline-none transition focus:border-[#16796f] focus:ring-2 focus:ring-[#16796f]/10"
          />

          <span className="font-bold text-slate-300">/</span>

          <input
            type="number"
            min="1"
            max="12"
            placeholder="MM"
            value={month}
            onChange={(e) => handleChange(setMonth, "month", e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2 py-2.5 text-center text-sm font-medium text-slate-700 outline-none transition focus:border-[#16796f] focus:ring-2 focus:ring-[#16796f]/10"
          />

          <span className="font-bold text-slate-300">/</span>

          <input
            type="number"
            min="2020"
            max="2100"
            placeholder="YYYY"
            value={year}
            onChange={(e) => handleChange(setYear, "year", e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2 py-2.5 text-center text-sm font-medium text-slate-700 outline-none transition focus:border-[#16796f] focus:ring-2 focus:ring-[#16796f]/10"
          />
        </div>

        {/* Time */}
        <div className="mt-3 flex items-center gap-2">
          <Clock size={15} className="text-[#16796f]" />

          {/* Hour */}
          <input
            type="number"
            min="1"
            max="12"
            placeholder="HH"
            value={hour}
            onChange={(e) => handleChange(setHour, "hour", e.target.value)}
            className="w-20 rounded-xl border border-slate-200 bg-slate-50 px-2 py-2.5 text-center text-sm font-medium text-slate-700 outline-none transition focus:border-[#16796f] focus:ring-2 focus:ring-[#16796f]/10"
          />

          <span className="font-bold text-slate-400">:</span>

          {/* Minute */}
          <input
            type="number"
            min="0"
            max="59"
            placeholder="MM"
            value={minute}
            onChange={(e) => handleChange(setMinute, "minute", e.target.value)}
            className="w-20 rounded-xl border border-slate-200 bg-slate-50 px-2 py-2.5 text-center text-sm font-medium text-slate-700 outline-none transition focus:border-[#16796f] focus:ring-2 focus:ring-[#16796f]/10"
          />

          {/* AM / PM */}
          <div className="ml-1 flex overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={() => handleMeridiemChange("AM")}
              className={`cursor-pointer px-3 py-2.5 text-xs font-bold transition ${
                meridiem === "AM"
                  ? "bg-[#0b306b] text-white"
                  : "text-slate-500 hover:bg-white"
              }`}
            >
              AM
            </button>

            <button
              type="button"
              onClick={() => handleMeridiemChange("PM")}
              className={`cursor-pointer px-3 py-2.5 text-xs font-bold transition ${
                meridiem === "PM"
                  ? "bg-[#16796f] text-white"
                  : "text-slate-500 hover:bg-white"
              }`}
            >
              PM
            </button>
          </div>
        </div>

        {/* Selected value */}
        {value && (
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-xs text-slate-400">Selected</span>

            <span className="text-xs font-semibold text-[#16796f]">
              {formatDate(value)} • {formatTime(value)}
            </span>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   Main component
--------------------------------------------------------- */

function CreateDonation() {
  const navigate = useNavigate();

  const [foodName, setFoodName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");

  const [preparedAt, setPreparedAt] = useState("");
  const [pickupDeadline, setPickupDeadline] = useState("");

  const [address, setAddress] = useState("");

  const [locationCoordinates, setLocationCoordinates] = useState({
    latitude: null,
    longitude: null,
  });

  const [locationLoading, setLocationLoading] = useState(false);

  const [description, setDescription] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [fieldErrors, setFieldErrors] = useState({});

  const now = getLocalDateTimeString();

  /* ---------------------------------------------------------
     Current location
  --------------------------------------------------------- */

  const handleUseCurrentLocation = () => {
    setError("");
    setSuccess("");

    if (!navigator.geolocation) {
      setError("Location detection is not supported by this browser.");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        setLocationCoordinates({
          latitude,
          longitude,
        });

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          );

          if (!response.ok) {
            throw new Error("Address lookup failed.");
          }

          const data = await response.json();

          const addressData = data.address || {};

          const readableLocation =
            [
              addressData.house_number,
              addressData.road,
              addressData.suburb,
              addressData.city ||
                addressData.town ||
                addressData.village ||
                addressData.municipality,
              addressData.state,
            ]
              .filter(Boolean)
              .join(", ") ||
            data.display_name ||
            "";

          if (readableLocation) {
            setAddress(readableLocation);

            setFieldErrors((current) => ({
              ...current,
              address: "",
            }));
          } else {
            setError(
              "Location detected, but the address could not be found. Please enter the pickup address manually.",
            );
          }
        } catch (locationError) {
          console.error("REVERSE GEOCODING FAILED:", locationError);

          setError(
            "Location detected, but the address could not be found. Please enter the pickup address manually.",
          );
        } finally {
          setLocationLoading(false);
        }
      },
      (locationError) => {
        console.error("LOCATION ERROR:", locationError);

        setLocationLoading(false);

        if (locationError.code === 1) {
          setError(
            "Location permission was denied. Please allow location access or enter the address manually.",
          );
        } else if (locationError.code === 2) {
          setError(
            "Your location could not be detected. Please try again or enter the address manually.",
          );
        } else if (locationError.code === 3) {
          setError("Location detection timed out. Please try again.");
        } else {
          setError(
            "Could not detect your location. Please enter the address manually.",
          );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  };

  /* ---------------------------------------------------------
     Image handling
  --------------------------------------------------------- */

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("Image size must be 5 MB or less.");
      return;
    }

    setSelectedImage(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedImage(null);
    setImagePreview("");
  };

  /* ---------------------------------------------------------
     Validation
  --------------------------------------------------------- */

  const validateForm = () => {
    const errors = {};

    if (!foodName.trim()) {
      errors.foodName = "Food name is required.";
    }

    if (!category) {
      errors.category = "Please select a food category.";
    }

    if (!quantity || Number(quantity) <= 0) {
      errors.quantity = "Enter a quantity greater than 0.";
    }

    if (!unit) {
      errors.unit = "Please select a unit.";
    }

    if (!preparedAt) {
      errors.preparedAt = "Please enter when the food was prepared.";
    }

    if (!pickupDeadline) {
      errors.pickupDeadline = "Please enter a pickup deadline.";
    }

    if (!address.trim()) {
      errors.address = "Pickup location is required.";
    }

    if (preparedAt) {
      const preparedDate = parseDateTime(preparedAt);

      if (!preparedDate) {
        errors.preparedAt = "Enter a valid date and time.";
      } else if (preparedDate > new Date()) {
        errors.preparedAt = "Prepared time cannot be in the future.";
      }
    }

    if (preparedAt && pickupDeadline) {
      const preparedDate = parseDateTime(preparedAt);

      const deadlineDate = parseDateTime(pickupDeadline);

      if (!preparedDate || !deadlineDate) {
        errors.pickupDeadline = "Enter a valid date and time.";
      } else {
        if (deadlineDate <= preparedDate) {
          errors.pickupDeadline =
            "Pickup deadline must be after the prepared time.";
        }

        if (deadlineDate <= new Date()) {
          errors.pickupDeadline = "Pickup deadline must be in the future.";
        }
      }
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  /* ---------------------------------------------------------
     Submit
  --------------------------------------------------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!validateForm()) {
      setError("Please correct the highlighted fields before posting.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("foodName", foodName.trim());
      formData.append("category", category);
      formData.append("quantity", String(Number(quantity)));
      formData.append("unit", unit);
      formData.append("preparedAt", toApiDateTime(preparedAt));
      formData.append("pickupDeadline", toApiDateTime(pickupDeadline));

      formData.append(
        "location",
        JSON.stringify({
          address: address.trim(),
          latitude: locationCoordinates.latitude,
          longitude: locationCoordinates.longitude,
        }),
      );

      formData.append("description", description.trim());

      // Send the actual image file
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      console.log("IMAGE BEING SENT:", selectedImage);

      const response = await api.post("/donations", formData);

      console.log("DONATION CREATED:", response.data);

      setSuccess("Donation posted successfully!");

      setFoodName("");
      setCategory("");
      setQuantity("");
      setUnit("");
      setPreparedAt("");
      setPickupDeadline("");
      setAddress("");

      setLocationCoordinates({
        latitude: null,
        longitude: null,
      });

      setDescription("");

      removeImage();

      setFieldErrors({});
    } catch (error) {
      console.error("DONATION CREATION FAILED:", error);

      setError(
        error.response?.data?.message ||
          "Could not post donation. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------------------------
     Image cleanup
  --------------------------------------------------------- */

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="min-h-screen bg-[#fdf6ec] px-6 py-8">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 flex cursor-pointer items-center gap-2 text-sm font-medium text-[#0b306b] transition hover:text-[#16796f]"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#16796f]">
            Donor
          </p>

          <h1 className="mt-2 text-4xl font-bold text-[#0b306b]">
            Share surplus food
          </h1>

          <p className="mt-2 text-slate-500">
            Tell us about the food you would like to rescue.
          </p>
        </div>

        {/* Form + Visual */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-white/70 bg-white/65 p-6 shadow-lg backdrop-blur-xl md:p-8"
          >
            {/* Food name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#0b306b]">
                Food name
              </label>

              <div
                className={`flex items-center gap-3 rounded-2xl border bg-white/80 px-4 py-3 transition ${
                  fieldErrors.foodName
                    ? "border-red-300"
                    : "border-slate-200 focus-within:border-[#16796f] focus-within:ring-2 focus-within:ring-[#16796f]/10"
                }`}
              >
                <Utensils size={18} className="text-[#4f81b7]" />

                <input
                  type="text"
                  placeholder="e.g. Vegetable Biryani"
                  value={foodName}
                  onChange={(e) => {
                    setFoodName(e.target.value);

                    setFieldErrors((current) => ({
                      ...current,
                      foodName: "",
                    }));
                  }}
                  required
                  className="w-full bg-transparent outline-none placeholder:text-slate-400"
                />
              </div>

              {fieldErrors.foodName && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  {fieldErrors.foodName}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-[#0b306b]">
                Food category
              </label>

              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);

                  setFieldErrors((current) => ({
                    ...current,
                    category: "",
                  }));
                }}
                required
                className={`w-full rounded-2xl border bg-white/80 px-4 py-3 outline-none transition focus:border-[#16796f] focus:ring-2 focus:ring-[#16796f]/10 ${
                  fieldErrors.category ? "border-red-300" : "border-slate-200"
                }`}
              >
                <option value="">Select category</option>

                <option value="cooked-meal">Cooked Meal</option>

                <option value="bakery">Bakery</option>

                <option value="fruits">Fruits</option>

                <option value="vegetables">Vegetables</option>

                <option value="packaged-food">Packaged Food</option>

                <option value="other">Other</option>
              </select>

              {fieldErrors.category && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  {fieldErrors.category}
                </p>
              )}
            </div>

            {/* Quantity + Unit */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#0b306b]">
                  Quantity
                </label>

                <div
                  className={`flex items-center gap-3 rounded-2xl border bg-white/80 px-4 py-3 transition ${
                    fieldErrors.quantity
                      ? "border-red-300"
                      : "border-slate-200 focus-within:border-[#16796f] focus-within:ring-2 focus-within:ring-[#16796f]/10"
                  }`}
                >
                  <Package size={18} className="text-[#4f81b7]" />

                  <input
                    type="number"
                    min="1"
                    step="any"
                    placeholder="e.g. 20"
                    value={quantity}
                    onChange={(e) => {
                      setQuantity(e.target.value);

                      setFieldErrors((current) => ({
                        ...current,
                        quantity: "",
                      }));
                    }}
                    required
                    className="w-full bg-transparent outline-none placeholder:text-slate-400"
                  />
                </div>

                {fieldErrors.quantity && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {fieldErrors.quantity}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#0b306b]">
                  Unit
                </label>

                <select
                  value={unit}
                  onChange={(e) => {
                    setUnit(e.target.value);

                    setFieldErrors((current) => ({
                      ...current,
                      unit: "",
                    }));
                  }}
                  required
                  className={`w-full rounded-2xl border bg-white/80 px-4 py-3 outline-none transition focus:border-[#16796f] focus:ring-2 focus:ring-[#16796f]/10 ${
                    fieldErrors.unit ? "border-red-300" : "border-slate-200"
                  }`}
                >
                  <option value="">Select unit</option>

                  <option value="servings">Servings</option>

                  <option value="kg">Kg</option>

                  <option value="liters">Liters</option>

                  <option value="packets">Packets</option>

                  <option value="pieces">Pieces</option>
                </select>

                {fieldErrors.unit && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {fieldErrors.unit}
                  </p>
                )}
              </div>
            </div>

            {/* Prepared + deadline */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <DateTimeField
                label="When was the food prepared?"
                value={preparedAt}
                onChange={(value) => {
                  setPreparedAt(value);

                  setFieldErrors((current) => ({
                    ...current,
                    preparedAt: "",
                    pickupDeadline: "",
                  }));
                }}
                icon={Clock}
                maxDateTime={now}
                error={fieldErrors.preparedAt}
              />

              <DateTimeField
                label="Pickup available until"
                value={pickupDeadline}
                onChange={(value) => {
                  setPickupDeadline(value);

                  setFieldErrors((current) => ({
                    ...current,
                    pickupDeadline: "",
                  }));
                }}
                icon={Calendar}
                minDateTime={preparedAt || now}
                error={fieldErrors.pickupDeadline}
              />
            </div>

            {/* Pickup location */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-[#0b306b]">
                Pickup location
              </label>

              <div
                className={`flex items-center gap-3 rounded-2xl border bg-white/80 px-4 py-3 transition ${
                  fieldErrors.address
                    ? "border-red-300"
                    : "border-slate-200 focus-within:border-[#16796f] focus-within:ring-2 focus-within:ring-[#16796f]/10"
                }`}
              >
                <MapPin size={18} className="shrink-0 text-[#4f81b7]" />

                <input
                  type="text"
                  placeholder="Enter pickup address"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);

                    setLocationCoordinates({
                      latitude: null,
                      longitude: null,
                    });

                    setFieldErrors((current) => ({
                      ...current,
                      address: "",
                    }));
                  }}
                  required
                  className="w-full bg-transparent outline-none placeholder:text-slate-400"
                />
              </div>

              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={locationLoading}
                className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#4f81b7]/30 bg-white/70 px-4 py-2.5 text-sm font-semibold text-[#0b306b] transition hover:border-[#16796f] hover:bg-[#eef7f6] hover:text-[#16796f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Navigation
                  size={16}
                  className={locationLoading ? "animate-pulse" : ""}
                />

                {locationLoading
                  ? "Detecting location..."
                  : "Use Current Location"}
              </button>

              {locationCoordinates.latitude !== null &&
                locationCoordinates.longitude !== null && (
                  <div className="mt-2 flex items-center gap-2 text-xs font-medium text-[#16796f]">
                    <span className="h-2 w-2 rounded-full bg-[#16796f]" />
                    Location coordinates detected
                  </div>
                )}

              {fieldErrors.address && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  {fieldErrors.address}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-[#0b306b]">
                Description
              </label>

              <textarea
                rows="4"
                maxLength="500"
                placeholder="Add useful information such as freshness, packaging, allergens, or pickup instructions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-[#16796f] focus:ring-2 focus:ring-[#16796f]/10"
              />

              <div className="mt-1 flex justify-end text-xs text-slate-400">
                {description.length}/500
              </div>
            </div>

            {/* Image */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-[#0b306b]">
                Food image
              </label>

              {imagePreview ? (
                <div className="relative overflow-hidden rounded-2xl border border-[#4f81b7]/30 bg-white/60">
                  <img
                    src={imagePreview}
                    alt="Selected food preview"
                    className="h-56 w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute right-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#0b306b] shadow-md transition hover:bg-red-50 hover:text-red-500"
                    aria-label="Remove selected image"
                  >
                    <X size={17} />
                  </button>

                  <div className="bg-white/90 px-4 py-3 backdrop-blur-sm">
                    <p className="truncate text-sm font-semibold text-[#0b306b]">
                      {selectedImage?.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Image selected successfully
                    </p>
                  </div>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#4f81b7]/40 bg-white/50 px-6 py-8 text-center transition hover:border-[#16796f] hover:bg-[#eef7f6]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fdd8a5] text-[#0b306b]">
                    <ImagePlus size={22} />
                  </div>

                  <p className="mt-3 font-semibold text-[#0b306b]">
                    Upload a food photo
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    JPG, PNG or WEBP • Max 5 MB
                  </p>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}

              <p className="mt-2 text-xs text-slate-400">
                A clear photo helps NGOs understand what is available.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mt-5 rounded-2xl border border-[#b9ded8] bg-[#dcefeb] px-4 py-3 text-sm font-medium text-[#16796f]">
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-7 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#0b306b] py-4 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#16796f] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              <Send size={18} />

              {loading ? "Posting Donation..." : "Post Donation"}
            </button>
          </form>

          {/* Side information */}
          <div className="space-y-6">
            <div className="relative min-h-[280px] overflow-hidden rounded-[2rem] bg-[#16796f] p-7 text-white shadow-xl">
              <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-[#fdd8a5]/30 blur-2xl" />

              <div className="relative z-10">
                <div className="text-7xl">🍲</div>

                <h2 className="mt-6 text-2xl font-bold">
                  Good food shouldn't go to waste.
                </h2>

                <p className="mt-3 text-sm leading-6 text-teal-50">
                  Add clear information so nearby NGOs can understand what is
                  available and when they can collect it.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/70 bg-white/65 p-6 shadow-sm backdrop-blur-xl">
              <h3 className="font-bold text-[#0b306b]">Before posting</h3>

              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p>✓ Mention the correct quantity.</p>
                <p>✓ Add a realistic pickup deadline.</p>
                <p>✓ Upload a clear food photo.</p>
                <p>✓ Keep the pickup location accurate.</p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#fdd8a5]/50 bg-[#fff8ed] p-6">
              <p className="text-sm font-semibold text-[#0b306b]">
                Food safety matters
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Accurate preparation and pickup times help NGOs make safer
                decisions about surplus food.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateDonation;
