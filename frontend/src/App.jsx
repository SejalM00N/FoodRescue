import {
  Heart,
  Utensils,
  Users,
  ArrowRight,
  MapPin,
  ShieldCheck,
  Truck,
  Clock3,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fdf6ec] text-[#0b306b]">
      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-50 border-b border-white/50 bg-[#fdf6ec]/80 px-5 py-4 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#16796f] text-white shadow-md">
              <Utensils size={21} />
            </div>

            <div className="text-left">
              <p className="text-xl font-bold tracking-tight">FoodRescue</p>
              <p className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500 sm:block">
                Food • People • Community
              </p>
            </div>
          </button>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 transition hover:text-[#16796f]"
            >
              How It Works
            </a>

            <a
              href="#why-foodrescue"
              className="text-sm font-medium text-slate-600 transition hover:text-[#16796f]"
            >
              Why FoodRescue
            </a>

            <button
              onClick={() => navigate("/login")}
              className="rounded-full bg-[#0b306b] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#16796f]"
            >
              Login
            </button>
          </div>

          <button
            onClick={() => navigate("/login")}
            className="rounded-full bg-[#0b306b] px-5 py-2.5 text-sm font-semibold text-white md:hidden"
          >
            Login
          </button>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <main className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-24 pt-12 md:px-8 md:pt-20 lg:grid-cols-2">
        {/* Background glow */}
        <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-[#fdd8a5]/50 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-[#4f81b7]/20 blur-3xl" />

        {/* Hero content */}
        <section className="relative">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur-xl">
            <Sparkles size={16} className="text-[#16796f]" />
            <span>Good food deserves a second chance.</span>
          </div>

          <h1 className="max-w-3xl text-5xl font-bold leading-[1.08] tracking-tight md:text-6xl lg:text-[4.4rem]">
            Turning surplus food into{" "}
            <span className="text-[#16796f]">meaningful meals.</span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 md:text-lg">
            FoodRescue brings donors, NGOs and volunteers together to rescue
            surplus food and move it safely to communities that need it.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => navigate("/login")}
              className="group flex items-center justify-center gap-2 rounded-full bg-[#0b306b] px-7 py-4 font-semibold text-white shadow-lg transition hover:bg-[#16796f]"
            >
              Start Rescuing Food
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>

            <a
              href="#how-it-works"
              className="flex items-center justify-center rounded-full border border-[#4f81b7]/50 bg-white/60 px-7 py-4 font-semibold text-[#0b306b] backdrop-blur-xl transition hover:bg-white"
            >
              See How It Works
            </a>
          </div>

          {/* Trust points */}
          <div className="mt-10 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fdd8a5]">
                <Heart size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold">Donate</p>
                <p className="text-xs text-slate-500">Surplus food</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#dcebef]">
                <Users size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold">Connect</p>
                <p className="text-xs text-slate-500">With NGOs</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#d8eee9]">
                <Truck size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold">Deliver</p>
                <p className="text-xs text-slate-500">Safely & securely</p>
              </div>
            </div>
          </div>
        </section>

        {/* Hero visual */}
        <section className="relative">
          <div className="absolute -right-8 -top-8 h-64 w-64 rounded-full bg-[#fdd8a5]/60 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/50 p-3 shadow-2xl backdrop-blur-2xl md:p-5">
            <div className="relative overflow-hidden rounded-[2rem]">
              <img
                src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85"
                alt="Fresh food ready to be shared"
                className="h-[430px] w-full object-cover md:h-[520px]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#0b306b]/45 via-transparent to-transparent" />

              {/* Floating impact card */}
              <div className="absolute bottom-5 left-5 right-5 rounded-3xl border border-white/50 bg-white/85 p-4 shadow-xl backdrop-blur-xl md:bottom-7 md:left-7 md:right-7 md:p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fdd8a5]">
                    <Users size={22} className="text-[#0b306b]" />
                  </div>

                  <div>
                    <p className="font-bold text-[#0b306b]">
                      Community powered
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500">
                      Donors • NGOs • Volunteers
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Small floating badge */}
          <div className="absolute -bottom-5 -left-2 hidden rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-xl backdrop-blur-xl sm:block">
            <div className="flex items-center gap-2">
              <MapPin size={17} className="text-[#16796f]" />
              <span className="text-sm font-semibold">
                From pickup to delivery
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* ================= HOW IT WORKS ================= */}
      <section
        id="how-it-works"
        className="border-y border-white/60 bg-white/55 px-5 py-20 md:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#16796f]">
              How it works
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              One platform. Three roles. One shared goal.
            </h2>

            <p className="mt-4 text-slate-600">
              FoodRescue coordinates the entire journey from surplus food to
              verified delivery.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {/* Donor */}
            <div className="group rounded-3xl border border-white/70 bg-[#fdf6ec]/80 p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fdd8a5]">
                <Utensils size={25} />
              </div>

              <p className="text-sm font-semibold text-[#16796f]">FOR DONORS</p>

              <h3 className="mt-2 text-2xl font-bold">Share surplus food</h3>

              <p className="mt-3 leading-7 text-slate-600">
                Post available food with quantity, pickup deadline, location and
                an optional image.
              </p>
            </div>

            {/* NGO */}
            <div className="group rounded-3xl border border-white/70 bg-[#eef7f6]/80 p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4f81b7] text-white">
                <Heart size={25} />
              </div>

              <p className="text-sm font-semibold text-[#16796f]">FOR NGOS</p>

              <h3 className="mt-2 text-2xl font-bold">Find food you need</h3>

              <p className="mt-3 leading-7 text-slate-600">
                Discover available donations, request suitable food and provide
                a delivery location.
              </p>
            </div>

            {/* Volunteer */}
            <div className="group rounded-3xl border border-white/70 bg-[#fdf6ec]/80 p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#16796f] text-white">
                <Truck size={25} />
              </div>

              <p className="text-sm font-semibold text-[#16796f]">
                FOR VOLUNTEERS
              </p>

              <h3 className="mt-2 text-2xl font-bold">Move food forward</h3>

              <p className="mt-3 leading-7 text-slate-600">
                Accept pickup tasks, follow the route and share live location
                during delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY FOODRESCUE ================= */}
      <section id="why-foodrescue" className="px-5 py-20 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#16796f]">
              Built for trust
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              More than a food listing platform.
            </h2>

            <p className="mt-5 max-w-xl leading-8 text-slate-600">
              FoodRescue is designed around the complete redistribution workflow
              — from posting surplus food to verified delivery.
            </p>

            <div className="mt-8 space-y-5">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#d8eee9]">
                  <MapPin size={20} className="text-[#16796f]" />
                </div>

                <div>
                  <h3 className="font-bold">Location-aware delivery</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Pickup and delivery locations are captured to support
                    practical routing.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#dcebef]">
                  <Clock3 size={20} className="text-[#0b306b]" />
                </div>

                <div>
                  <h3 className="font-bold">Real-time delivery tracking</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Volunteers can share live location while an active delivery
                    is underway.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fdd8a5]">
                  <ShieldCheck size={20} className="text-[#0b306b]" />
                </div>

                <div>
                  <h3 className="font-bold">OTP-verified handoff</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    The final delivery is verified using a secure six-digit OTP.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature card */}
          <div className="relative">
            <div className="absolute -inset-5 rounded-[3rem] bg-[#4f81b7]/10 blur-2xl" />

            <div className="relative rounded-[2.5rem] border border-white/70 bg-white/65 p-6 shadow-xl backdrop-blur-xl md:p-8">
              <div className="rounded-3xl bg-[#0b306b] p-7 text-white">
                <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">
                  The rescue journey
                </p>

                <div className="mt-7 space-y-5">
                  {[
                    "Surplus food is posted",
                    "An NGO requests it",
                    "The donor accepts the request",
                    "A volunteer accepts pickup",
                    "Food is delivered",
                    "NGO verifies with OTP",
                  ].map((step, index) => (
                    <div key={step} className="flex items-center gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm font-bold">
                        {index + 1}
                      </div>

                      <p className="text-sm font-medium text-blue-50">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <p className="mt-5 text-center text-sm text-slate-500">
                Designed to keep every handoff clear and accountable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-5 pb-20 md:px-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-[#0b306b] px-6 py-14 text-center text-white shadow-2xl md:px-12">
          <div className="mx-auto max-w-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <Heart size={25} />
            </div>

            <h2 className="mt-6 text-3xl font-bold md:text-4xl">
              Give surplus food another purpose.
            </h2>

            <p className="mt-4 leading-7 text-blue-100">
              Join the FoodRescue network and help move good food where it can
              make a difference.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#fdd8a5] px-7 py-4 font-bold text-[#0b306b] transition hover:bg-white"
            >
              Get Started
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#0b306b] px-5 py-8 text-center text-white md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#16796f]">
              <Utensils size={17} />
            </div>

            <p className="font-bold">FoodRescue</p>
          </div>

          <p className="mt-3 text-sm text-blue-100">
            Reducing food waste. Strengthening communities.
          </p>

          <p className="mt-5 text-xs text-blue-200/70">
            © {new Date().getFullYear()} FoodRescue
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
