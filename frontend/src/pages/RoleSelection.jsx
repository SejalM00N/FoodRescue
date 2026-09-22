import { useState } from "react";
import { Utensils, HeartHandshake, Bike, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function RoleSelection() {
  const navigate = useNavigate();
  const { updateRole } = useAuth();

  const [loadingRole, setLoadingRole] = useState("");
  const [error, setError] = useState("");

  const roles = [
    {
      title: "Donor",
      role: "donor",
      description:
        "Share surplus food from your restaurant, event, or organization.",
      icon: Utensils,
      color: "bg-[#fdd8a5]",
    },
    {
      title: "NGO",
      role: "ngo",
      description:
        "Find available food and request donations for your community.",
      icon: HeartHandshake,
      color: "bg-[#dcecf8]",
    },
    {
      title: "Volunteer",
      role: "volunteer",
      description: "Help pick up surplus food and deliver it to NGOs.",
      icon: Bike,
      color: "bg-[#dcefeb]",
    },
  ];

  const handleRoleSelect = async (role) => {
    setError("");
    setLoadingRole(role);

    try {
      const user = await updateRole(role);

      if (user.role === "donor") {
        navigate("/donor-dashboard");
      } else if (user.role === "ngo") {
        navigate("/ngo-dashboard");
      } else if (user.role === "volunteer") {
        navigate("/volunteer-dashboard");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Could not save your role. Please try again.",
      );
    } finally {
      setLoadingRole("");
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf6ec] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#16796f] text-white shadow-lg">
            <HeartHandshake size={26} />
          </div>

          <h1 className="mt-6 text-4xl font-bold text-[#0b306b]">
            How would you like to help?
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-slate-500">
            Choose your role in the FoodRescue community. You can change this
            later from Settings.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-auto mt-6 max-w-xl rounded-2xl bg-red-50 px-5 py-4 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Role cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {roles.map((item) => {
            const Icon = item.icon;
            const isLoading = loadingRole === item.role;

            return (
              <button
                key={item.role}
                onClick={() => handleRoleSelect(item.role)}
                disabled={loadingRole !== ""}
                className="group cursor-pointer rounded-[2rem] border border-white/70 bg-white/70 p-7 text-left shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl ${item.color} text-[#0b306b]`}
                >
                  <Icon size={30} />
                </div>

                <h2 className="mt-7 text-2xl font-bold text-[#0b306b]">
                  {item.title}
                </h2>

                <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-500">
                  {item.description}
                </p>

                <div className="mt-7 flex items-center gap-2 font-semibold text-[#16796f]">
                  {isLoading ? "Saving..." : "Continue"}
                  {!isLoading && (
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default RoleSelection;
