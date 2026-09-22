import { useState } from "react";
import { User, Mail, Lock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await register(name, email, password);

      // Registration successful → go to Login
      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf6ec] px-6 py-8">
      {/* Back */}
      <button
        onClick={() => navigate("/login")}
        className="mb-6 flex cursor-pointer items-center gap-2 text-sm font-medium text-[#0b306b] hover:text-[#16796f]"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="mx-auto grid min-h-[85vh] max-w-6xl overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/50 shadow-2xl backdrop-blur-xl lg:grid-cols-2">
        {/* Left side */}
        <div className="relative hidden overflow-hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80"
            alt="Fresh food"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-[#16796f]/50" />

          <div className="relative flex h-full flex-col justify-end p-12 text-white">
            <h1 className="max-w-md text-4xl font-bold leading-tight">
              Be part of the food rescue community.
            </h1>

            <p className="mt-4 max-w-md text-white/85">
              Whether you donate, receive or deliver food, your contribution
              matters.
            </p>
          </div>
        </div>

        {/* Register form */}
        <div className="flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#16796f] text-white">
                <User size={20} />
              </div>

              <span className="text-2xl font-bold text-[#0b306b]">
                FoodRescue
              </span>
            </div>

            <h2 className="text-4xl font-bold text-[#0b306b]">
              Create account
            </h2>

            <p className="mt-3 text-slate-500">
              Join the FoodRescue community today.
            </p>

            <form onSubmit={handleRegister}>
              {/* Name */}
              <div className="mt-7">
                <label className="mb-2 block text-sm font-semibold text-[#0b306b]">
                  Full name
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3">
                  <User size={19} className="text-[#4f81b7]" />

                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-transparent outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-[#0b306b]">
                  Email address
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3">
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

              {/* Password */}
              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-[#0b306b]">
                  Password
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3">
                  <Lock size={19} className="text-[#4f81b7]" />

                  <input
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-transparent outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              {/* Create account */}
              <button
                type="submit"
                disabled={loading}
                className="mt-7 w-full cursor-pointer rounded-2xl bg-[#0b306b] py-4 font-semibold text-white shadow-lg transition hover:bg-[#16796f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="cursor-pointer font-semibold text-[#16796f] hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
