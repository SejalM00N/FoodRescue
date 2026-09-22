import { useState } from "react";
import { Heart, Mail, Lock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);

      if (!user.role) {
        navigate("/role-selection");
      } else if (user.role === "donor") {
        navigate("/donor-dashboard");
      } else if (user.role === "ngo") {
        navigate("/ngo-dashboard");
      } else if (user.role === "volunteer") {
        navigate("/volunteer-dashboard");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please check your email and password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf6ec] px-6 py-8">
      {/* Back button */}
      <button
        onClick={() => window.history.back()}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-[#0b306b] transition hover:text-[#16796f]"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="mx-auto grid min-h-[85vh] max-w-6xl overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/50 shadow-2xl backdrop-blur-xl lg:grid-cols-2">
        {/* Left visual section */}
        <div className="relative hidden overflow-hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80"
            alt="Fresh food"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-[#0b306b]/45" />

          <div className="relative flex h-full flex-col justify-end p-12 text-white">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fdd8a5] text-[#0b306b]">
              <Heart size={26} />
            </div>

            <h1 className="max-w-md text-4xl font-bold leading-tight">
              Every meal rescued can make a difference.
            </h1>

            <p className="mt-4 max-w-md text-white/85">
              Join donors, NGOs and volunteers working together to reduce food
              waste.
            </p>
          </div>
        </div>

        {/* Login form */}
        <div className="flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="mb-10">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#16796f] text-white">
                  <Heart size={20} />
                </div>

                <span className="text-2xl font-bold text-[#0b306b]">
                  FoodRescue
                </span>
              </div>
            </div>

            <h2 className="text-4xl font-bold text-[#0b306b]">Welcome back</h2>

            <p className="mt-3 text-slate-500">
              Sign in to continue your food rescue journey.
            </p>

            <form onSubmit={handleLogin}>
              {/* Email */}
              <div className="mt-8">
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

              {/* Password */}
              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-semibold text-[#0b306b]">
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-xs font-semibold text-[#16796f] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm">
                  <Lock size={19} className="text-[#4f81b7]" />

                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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

              {/* Login button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-7 w-full rounded-2xl bg-[#0b306b] py-4 font-semibold text-white shadow-lg transition hover:bg-[#16796f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="font-semibold text-[#16796f] hover:underline"
              >
                Create one
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
