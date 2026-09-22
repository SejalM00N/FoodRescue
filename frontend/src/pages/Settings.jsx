import { useState } from "react";
import {
  User,
  Lock,
  Bell,
  Globe,
  MapPin,
  Repeat2,
  LogOut,
  ChevronRight,
  Settings as SettingsIcon,
  X,
  Check,
  Eye,
  EyeOff,
  Navigation,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api";

function Settings() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();

  const [activeSection, setActiveSection] = useState(null);

  const [notifications, setNotifications] = useState({
    donationUpdates: true,
    requestUpdates: true,
    deliveryUpdates: true,
  });

  const [language, setLanguage] = useState("English");

  const [location, setLocation] = useState(user?.location || "");

  const [locationCoordinates, setLocationCoordinates] = useState({
    latitude: user?.latitude ?? null,
    longitude: user?.longitude ?? null,
    accuracy: user?.locationAccuracy ?? null,
  });

  const [profileName, setProfileName] = useState(user?.name || "");
  const [profileEmail, setProfileEmail] = useState(user?.email || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationSaving, setLocationSaving] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const settings = [
    {
      id: "profile",
      icon: User,
      title: "Profile",
      description: "Update your name and account information.",
    },
    {
      id: "password",
      icon: Lock,
      title: "Change Password",
      description: "Update your account password.",
    },
    {
      id: "notifications",
      icon: Bell,
      title: "Notifications",
      description: "Manage your FoodRescue notifications.",
    },
    {
      id: "language",
      icon: Globe,
      title: "Language",
      description: "Choose your preferred language.",
    },
    {
      id: "location",
      icon: MapPin,
      title: "Location",
      description: "Update your location for better matching.",
    },
  ];

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setErrorMessage("");

    setTimeout(() => {
      setSuccessMessage("");
    }, 3500);
  };

  const showError = (message) => {
    setErrorMessage(message);
    setSuccessMessage("");

    setTimeout(() => {
      setErrorMessage("");
    }, 4000);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProfileSave = async () => {
    if (!profileName.trim() || !profileEmail.trim()) {
      showError("Name and email are required.");
      return;
    }

    setProfileLoading(true);

    try {
      const response = await api.put("/users/profile", {
        name: profileName.trim(),
        email: profileEmail.trim(),
      });

      updateUser(response.data.user);

      setActiveSection(null);

      showSuccess("Profile updated successfully.");
    } catch (error) {
      showError(
        error.response?.data?.message ||
          "Failed to update profile. Please try again.",
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) {
      showError("Please enter both passwords.");
      return;
    }

    if (newPassword.length < 6) {
      showError("New password must contain at least 6 characters.");
      return;
    }

    setPasswordLoading(true);

    try {
      await api.put("/users/password", {
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");

      setShowCurrentPassword(false);
      setShowNewPassword(false);

      setActiveSection(null);

      showSuccess("Password updated successfully.");
    } catch (error) {
      showError(
        error.response?.data?.message ||
          "Failed to update password. Please try again.",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLanguageSave = () => {
    setActiveSection(null);
    showSuccess(`Language set to ${language}.`);
  };

  // Get current device location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      showError("Location services are not supported by this browser.");
      return;
    }

    setLocationLoading(true);
    setErrorMessage("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
          );

          if (!response.ok) {
            throw new Error("Unable to find your location.");
          }

          const data = await response.json();

          const address = data.address || {};

          const city =
            address.city ||
            address.town ||
            address.village ||
            address.municipality ||
            address.county ||
            "";

          const state = address.state || "";

          let readableLocation = "";

          if (city && state) {
            readableLocation = `${city}, ${state}`;
          } else if (city) {
            readableLocation = city;
          } else if (state) {
            readableLocation = state;
          } else if (data.display_name) {
            readableLocation = data.display_name;
          }

          if (!readableLocation) {
            throw new Error("Could not determine your location.");
          }

          setLocation(readableLocation);

          setLocationCoordinates({
            latitude,
            longitude,
            accuracy,
          });

          showSuccess("Current location detected.");
        } catch (error) {
          showError(
            "We couldn't convert your current location into a readable address. Please enter it manually.",
          );
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        setLocationLoading(false);

        if (error.code === error.PERMISSION_DENIED) {
          showError(
            "Location permission was denied. Please allow location access or enter your location manually.",
          );
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          showError(
            "Your current location could not be determined. Please try again.",
          );
        } else if (error.code === error.TIMEOUT) {
          showError(
            "Location detection timed out. Please try again or enter it manually.",
          );
        } else {
          showError(
            "Unable to detect your current location. Please enter your location manually.",
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

  // Save location to backend
  const handleLocationSave = async () => {
    if (!location.trim()) {
      showError("Please enter your location.");
      return;
    }

    if (
      locationCoordinates.latitude === null ||
      locationCoordinates.longitude === null
    ) {
      showError(
        "Please use your current location before saving, so we can store the pickup coordinates.",
      );
      return;
    }

    setLocationSaving(true);

    try {
      const response = await api.put("/users/location", {
        location: location.trim(),
        latitude: locationCoordinates.latitude,
        longitude: locationCoordinates.longitude,
        locationAccuracy: locationCoordinates.accuracy,
      });

      updateUser(response.data.user);

      setActiveSection(null);

      showSuccess("Location updated successfully.");
    } catch (error) {
      showError(
        error.response?.data?.message ||
          "Failed to update location. Please try again.",
      );
    } finally {
      setLocationSaving(false);
    }
  };

  const closePanel = () => {
    setActiveSection(null);
  };

  return (
    <div className="min-h-screen bg-[#fdf6ec] px-5 py-7 md:px-10 md:py-10">
      {/* Success notification */}
      {successMessage && (
        <div className="fixed right-5 top-5 z-[100] w-[calc(100%-2.5rem)] max-w-sm animate-[slideIn_0.3s_ease-out]">
          <div className="flex items-start gap-3 rounded-2xl border border-[#b8ddd8] bg-white/95 p-4 shadow-2xl backdrop-blur-xl">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#dcefeb] text-[#16796f]">
              <Check size={20} strokeWidth={2.5} />
            </div>

            <div className="flex-1">
              <p className="font-bold text-[#0b306b]">Success</p>

              <p className="mt-1 text-sm leading-5 text-slate-500">
                {successMessage}
              </p>
            </div>

            <button
              onClick={() => setSuccessMessage("")}
              className="cursor-pointer rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-[#0b306b]"
            >
              <X size={17} />
            </button>
          </div>
        </div>
      )}

      {/* Error notification */}
      {errorMessage && (
        <div className="fixed right-5 top-5 z-[100] w-[calc(100%-2.5rem)] max-w-sm animate-[slideIn_0.3s_ease-out]">
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-white/95 p-4 shadow-2xl backdrop-blur-xl">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <X size={20} strokeWidth={2.5} />
            </div>

            <div className="flex-1">
              <p className="font-bold text-[#0b306b]">Something went wrong</p>

              <p className="mt-1 text-sm leading-5 text-slate-500">
                {errorMessage}
              </p>
            </div>

            <button
              onClick={() => setErrorMessage("")}
              className="cursor-pointer rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-[#0b306b]"
            >
              <X size={17} />
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="cursor-pointer rounded-2xl border border-white/80 bg-white/70 px-4 py-2.5 text-sm font-semibold text-[#0b306b] shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white"
          >
            ← Back
          </button>

          <div>
            <p className="text-sm font-semibold text-[#16796f]">Account</p>

            <h1 className="mt-1 flex items-center gap-2 text-3xl font-bold text-[#0b306b]">
              <SettingsIcon size={27} />
              Settings
            </h1>
          </div>
        </div>

        {/* Profile summary */}
        <section className="relative mt-8 overflow-hidden rounded-[2rem] border border-white/80 bg-white/65 p-6 shadow-xl backdrop-blur-xl md:p-8">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#fdd8a5]/40 blur-2xl" />

          <div className="absolute -bottom-10 left-1/3 h-32 w-32 rounded-full bg-[#dcefeb]/50 blur-2xl" />

          <div className="relative flex items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.5rem] bg-[#16796f] text-2xl font-bold text-white shadow-lg">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium text-[#16796f]">
                Your FoodRescue account
              </p>

              <h2 className="mt-1 text-2xl font-bold text-[#0b306b]">
                {user?.name || "FoodRescue User"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {user?.email || "No email available"}
              </p>

              {user?.role && (
                <span className="mt-3 inline-flex rounded-full bg-[#dcefeb] px-3 py-1 text-xs font-bold capitalize text-[#16796f]">
                  {user.role}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Settings heading */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-[#0b306b]">
            Account preferences
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage your FoodRescue account and preferences.
          </p>
        </div>

        {/* Settings cards */}
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {settings.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className="group flex w-full cursor-pointer items-center gap-4 rounded-[1.75rem] border border-white/80 bg-white/65 p-5 text-left shadow-md backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/90 hover:shadow-xl"
              >
                <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-[#dcecf8] text-[#0b306b] transition group-hover:bg-[#fdd8a5]">
                  <Icon size={21} />
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-[#0b306b]">{item.title}</h3>

                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    {item.description}
                  </p>
                </div>

                <ChevronRight
                  size={20}
                  className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#16796f]"
                />
              </button>
            );
          })}

          {/* Change role */}
          <button
            onClick={() => navigate("/role-selection")}
            className="group flex w-full cursor-pointer items-center gap-4 rounded-[1.75rem] border border-white/80 bg-white/65 p-5 text-left shadow-md backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/90 hover:shadow-xl"
          >
            <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-[#dcecf8] text-[#0b306b] transition group-hover:bg-[#fdd8a5]">
              <Repeat2 size={21} />
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-[#0b306b]">Change Role</h3>

              <p className="mt-1 text-sm leading-5 text-slate-500">
                Switch between Donor, NGO, and Volunteer.
              </p>
            </div>

            <ChevronRight
              size={20}
              className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#16796f]"
            />
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-8 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#0b306b] px-5 py-4 font-semibold text-white shadow-lg transition hover:bg-red-600"
        >
          <LogOut size={19} />
          Logout
        </button>
      </div>

      {/* Settings modal */}
      {activeSection && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b306b]/30 px-5 py-6 backdrop-blur-sm"
          onClick={closePanel}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2rem] border border-white/80 bg-[#fffdf9]/95 p-6 shadow-2xl backdrop-blur-xl md:p-8"
          >
            {/* Modal header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#16796f]">
                  Account settings
                </p>

                <h2 className="mt-1 text-2xl font-bold text-[#0b306b]">
                  {activeSection === "profile" && "Edit Profile"}
                  {activeSection === "password" && "Change Password"}
                  {activeSection === "notifications" && "Notifications"}
                  {activeSection === "language" && "Language"}
                  {activeSection === "location" && "Location"}
                </h2>
              </div>

              <button
                onClick={closePanel}
                className="cursor-pointer rounded-xl bg-slate-100 p-2 text-slate-500 transition hover:bg-[#fdd8a5] hover:text-[#0b306b]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Profile */}
            {activeSection === "profile" && (
              <div className="mt-7 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#0b306b]">
                    Full name
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <User size={19} className="text-[#4f81b7]" />

                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#0b306b]">
                    Email address
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <Globe size={19} className="text-[#4f81b7]" />

                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleProfileSave}
                  disabled={profileLoading}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#0b306b] py-3.5 font-semibold text-white transition hover:bg-[#16796f] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Check size={18} />

                  {profileLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}

            {/* Password */}
            {activeSection === "password" && (
              <div className="mt-7 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#0b306b]">
                    Current password
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <Lock size={19} className="text-[#4f81b7]" />

                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full bg-transparent outline-none"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="cursor-pointer text-slate-400 hover:text-[#0b306b]"
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#0b306b]">
                    New password
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <Lock size={19} className="text-[#4f81b7]" />

                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full bg-transparent outline-none"
                    />

                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="cursor-pointer text-slate-400 hover:text-[#0b306b]"
                    >
                      {showNewPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handlePasswordChange}
                  disabled={passwordLoading}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#0b306b] py-3.5 font-semibold text-white transition hover:bg-[#16796f] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Check size={18} />

                  {passwordLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            )}

            {/* Notifications */}
            {activeSection === "notifications" && (
              <div className="mt-7 space-y-4">
                {[
                  {
                    key: "donationUpdates",
                    title: "Donation updates",
                    description: "Updates about your food donations.",
                  },
                  {
                    key: "requestUpdates",
                    title: "Request updates",
                    description: "Know when someone requests your food.",
                  },
                  {
                    key: "deliveryUpdates",
                    title: "Delivery updates",
                    description: "Updates about pickups and deliveries.",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dcefeb] text-[#16796f]">
                      <Bell size={18} />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-[#0b306b]">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {item.description}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        setNotifications((prev) => ({
                          ...prev,
                          [item.key]: !prev[item.key],
                        }))
                      }
                      className={`relative h-7 w-12 cursor-pointer rounded-full transition ${
                        notifications[item.key]
                          ? "bg-[#16796f]"
                          : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                          notifications[item.key] ? "left-6" : "left-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => {
                    closePanel();
                    showSuccess("Notification preferences saved.");
                  }}
                  className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#0b306b] py-3.5 font-semibold text-white transition hover:bg-[#16796f]"
                >
                  <Check size={18} />
                  Done
                </button>
              </div>
            )}

            {/* Language */}
            {activeSection === "language" && (
              <div className="mt-7 space-y-3">
                {["English", "Hindi", "Marathi"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setLanguage(item)}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-2xl border p-4 text-left transition ${
                      language === item
                        ? "border-[#16796f] bg-[#dcefeb]"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Globe
                        size={19}
                        className={
                          language === item
                            ? "text-[#16796f]"
                            : "text-[#4f81b7]"
                        }
                      />

                      <span className="font-semibold text-[#0b306b]">
                        {item}
                      </span>
                    </div>

                    {language === item && (
                      <Check size={19} className="text-[#16796f]" />
                    )}
                  </button>
                ))}

                <button
                  onClick={handleLanguageSave}
                  className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#0b306b] py-3.5 font-semibold text-white transition hover:bg-[#16796f]"
                >
                  <Check size={18} />
                  Save Language
                </button>
              </div>
            )}

            {/* Location */}
            {activeSection === "location" && (
              <div className="mt-7 space-y-5">
                {/* Current location */}
                <div className="rounded-2xl border border-[#b8ddd8] bg-[#eef8f6] p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#16796f] text-white shadow-sm">
                      <Navigation size={20} />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-[#0b306b]">
                        Use your current location
                      </h3>

                      <p className="mt-1 text-sm leading-5 text-slate-500">
                        Allow your browser to detect your current city
                        automatically.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleUseCurrentLocation}
                    disabled={locationLoading}
                    className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#16796f] px-4 py-3 font-semibold text-white transition hover:bg-[#0b306b] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Navigation size={17} />

                    {locationLoading
                      ? "Detecting location..."
                      : "Use Current Location"}
                  </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-200" />

                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Or enter manually
                  </span>

                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                {/* Manual location */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#0b306b]">
                    Your location
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 focus-within:border-[#16796f] focus-within:ring-2 focus-within:ring-[#16796f]/10">
                    <MapPin size={19} className="text-[#4f81b7]" />

                    <input
                      type="text"
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);

                        // Manual changes should not reuse old GPS coordinates.
                        setLocationCoordinates({
                          latitude: null,
                          longitude: null,
                          accuracy: null,
                        });
                      }}
                      placeholder="Enter your city or area"
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Location accuracy */}
                {locationCoordinates.accuracy !== null && (
                  <div className="rounded-2xl border border-[#b8ddd8] bg-white p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dcefeb] text-[#16796f]">
                        <MapPin size={18} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-[#0b306b]">
                          Location detected
                        </p>

                        {/* <p className="mt-1 text-xs text-slate-500">
                          Approximately{" "}
                          {Math.round(locationCoordinates.accuracy)} meters
                        </p> */}
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-xs leading-5 text-slate-400">
                  Your location can be used to match donations, volunteers, and
                  NGOs nearby.
                </p>

                <button
                  onClick={handleLocationSave}
                  disabled={locationSaving}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#0b306b] py-3.5 font-semibold text-white transition hover:bg-[#16796f] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Check size={18} />

                  {locationSaving ? "Saving..." : "Save Location"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast animation */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-12px) translateX(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0) translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

export default Settings;
