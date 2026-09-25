import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle,
  LockKeyhole,
  Package,
  ShieldCheck,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

function NGOVerification() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const deliveryId = searchParams.get("deliveryId");

  const [delivery, setDelivery] = useState(null);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const handleVerify = async () => {
    if (!otp.trim()) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("OTP must contain exactly 6 digits.");
      return;
    }

    try {
      setVerifying(true);
      setError("");
      setSuccess("");

      const response = await api.put(`/deliveries/${deliveryId}/verify`, {
        otp: otp.trim(),
      });

      console.log("DELIVERY VERIFIED:", response.data);

      setSuccess("Delivery verified successfully.");
      setDelivery((currentDelivery) => ({
        ...currentDelivery,
        deliveryStatus: "verified",
        otpVerified: true,
      }));
      setOtp("");
    } catch (error) {
      console.error("VERIFY DELIVERY ERROR:", error);

      setError(
        error.response?.data?.message || "Could not verify this delivery.",
      );
    } finally {
      setVerifying(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Delivery time unavailable";

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
        <button
          onClick={() => navigate("/delivery-tracking")}
          className="mb-8 flex items-center gap-2 text-sm font-medium text-[#0b306b] transition hover:text-[#16796f]"
        >
          <ArrowLeft size={18} />
          Back to Deliveries
        </button>

        <div className="rounded-[2rem] border border-white/70 bg-white/65 p-8 shadow-xl backdrop-blur-xl md:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#dcecf8] text-[#0b306b]">
            <ShieldCheck size={30} />
          </div>

          <div className="mx-auto mt-6 max-w-xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#16796f]">
              Delivery Verification
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#0b306b]">
              Verify Food Delivery
            </h1>

            <p className="mt-3 leading-6 text-slate-500">
              Enter the OTP provided by the volunteer to confirm that the food
              has been successfully delivered.
            </p>
          </div>

          {loading && (
            <div className="mx-auto mt-8 max-w-xl rounded-3xl bg-[#fdf6ec] p-8 text-center text-slate-500">
              Loading delivery details...
            </div>
          )}

          {error && (
            <div className="mx-auto mt-8 max-w-xl rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="mx-auto mt-8 max-w-xl rounded-2xl bg-green-50 px-5 py-4 text-sm text-green-700">
              {success}
            </div>
          )}

          {!loading && delivery && (
            <>
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
                      {delivery.donation?.unit || ""} • Delivered
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

              {!delivery.otpVerified ? (
                <>
                  <div className="mx-auto mt-8 max-w-xl">
                    <label className="text-sm font-semibold text-[#0b306b]">
                      Enter 6-digit OTP
                    </label>

                    <div className="relative mt-3">
                      <LockKeyhole
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otp}
                        onChange={(event) => {
                          const value = event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 6);

                          setOtp(value);
                          setError("");
                        }}
                        placeholder="Enter OTP"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-12 py-4 text-center text-xl font-bold tracking-[0.5em] text-[#0b306b] outline-none transition focus:border-[#16796f] focus:ring-4 focus:ring-[#16796f]/10"
                      />
                    </div>

                    <p className="mt-3 text-center text-xs text-slate-400">
                      Ask the volunteer for the OTP generated for this delivery.
                    </p>
                  </div>

                  <div className="mx-auto mt-7 max-w-xl">
                    <button
                      onClick={handleVerify}
                      disabled={verifying || otp.length !== 6}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0b306b] px-5 py-4 font-semibold text-white shadow-lg transition hover:bg-[#16796f] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <CheckCircle size={19} />

                      {verifying ? "Verifying..." : "Verify Delivery"}
                    </button>
                  </div>
                </>
              ) : (
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
              )}

              <div className="mx-auto mt-7 flex max-w-xl gap-3 rounded-2xl bg-[#dcecf8]/70 p-4">
                <ShieldCheck
                  size={20}
                  className="mt-0.5 shrink-0 text-[#16796f]"
                />

                <p className="text-sm leading-5 text-slate-600">
                  This verification confirms that the donated food reached the
                  intended NGO and completes the delivery.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default NGOVerification;
