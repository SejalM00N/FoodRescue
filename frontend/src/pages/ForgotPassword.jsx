import { useState } from "react";
import { ArrowLeft, Heart, Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/reset-password", {
        email,
        newPassword,
      });

      setSuccess(response.data.message || "Password reset successfully.");

      setEmail("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Could not reset password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf6ec] px-6 py-8">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate("/login")}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-[#0b306b] transition hover:text-[#16796f]"
      >
        <ArrowLeft size={18} />
        Back to Login
      </button>

      <div className="mx-auto flex min-h-[85vh] max-w-6xl items-center justify-center">
        <div className="w-full max-w-md rounded-[2.5rem] border border-white/70 bg-white/60 p-8 shadow-2xl backdrop-blur-xl md:p-12">
          {/* Logo */}
          <div className="mb-10 flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#16796f] text-white">
                <Heart size={20} />
              </div>

              <span className="text-2xl font-bold text-[#0b306b]">
                FoodRescue
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fdd8a5] text-[#0b306b]">
              <Lock size={28} />
            </div>

            <h1 className="mt-6 text-3xl font-bold text-[#0b306b]">
              Reset your password
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Enter your account email and choose a new password.
            </p>
          </div>

          <form onSubmit={handleReset} className="mt-8">
            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#0b306b]">
                Email address
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm">
                <Mail size={19} className="text-[#4f81b7]" />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* New password */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-[#0b306b]">
                New password
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm">
                <Lock size={19} className="text-[#4f81b7]" />

                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-transparent outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Confirm password */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-[#0b306b]">
                Confirm new password
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm">
                <Lock size={19} className="text-[#4f81b7]" />

                <input
                  type="password"
                  placeholder="Enter password again"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-transparent outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            {/* Success */}
            {success && (
              <p className="mt-4 rounded-xl bg-[#dcefeb] px-4 py-3 text-sm font-medium text-[#16796f]">
                {success}
              </p>
            )}

            {/* Reset */}
            <button
              type="submit"
              disabled={loading}
              className="mt-7 w-full rounded-2xl bg-[#0b306b] py-4 font-semibold text-white shadow-lg transition hover:bg-[#16796f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Resetting password..." : "Reset Password"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Remember your password?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-semibold text-[#16796f] hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
