import { Heart, Utensils, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fdf6ec] text-[#0b306b]">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2 text-2xl font-bold">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#16796f] text-white">
            <Utensils size={20} />
          </div>
          FoodRescue
        </div>

        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#how-it-works"
            className="text-sm font-medium hover:text-[#16796f]"
          >
            How It Works
          </a>

          <a href="#about" className="text-sm font-medium hover:text-[#16796f]">
            About Us
          </a>

          <button
            onClick={() => navigate("/login")}
            className="rounded-full bg-[#0b306b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#16796f]"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="mx-auto grid max-w-7xl items-center gap-12 px-8 pb-20 pt-10 lg:grid-cols-2">
        {/* Left Content */}
        <section>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur-md">
            <Heart size={16} className="text-[#16796f]" />
            <span>Good food deserves a second chance</span>
          </div>

          <h1 className="max-w-2xl text-5xl font-bold leading-tight md:text-6xl">
            Turn surplus food into
            <span className="text-[#16796f]"> meaningful meals.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            FoodRescue connects restaurants, organizations and volunteers to
            make sure surplus food reaches people who need it.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/role-selection")}
              className="flex items-center gap-2 rounded-full bg-[#0b306b] px-7 py-4 font-semibold text-white shadow-lg transition hover:bg-[#16796f]"
            >
              Donate Food
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => navigate("/role-selection")}
              className="rounded-full border border-[#4f81b7] bg-white/70 px-7 py-4 font-semibold text-[#0b306b] backdrop-blur-md transition hover:bg-[#fdd8a5]"
            >
              Find Food
            </button>
          </div>

          {/* Small Stats */}
          <div className="mt-12 flex flex-wrap gap-8">
            <div>
              <p className="text-2xl font-bold">1,250+</p>
              <p className="text-sm text-slate-500">Meals rescued</p>
            </div>

            <div>
              <p className="text-2xl font-bold">180+</p>
              <p className="text-sm text-slate-500">Donors</p>
            </div>

            <div>
              <p className="text-2xl font-bold">65+</p>
              <p className="text-sm text-slate-500">Volunteers</p>
            </div>
          </div>
        </section>

        {/* Right Visual */}
        <section className="relative">
          <div className="absolute -right-10 -top-10 h-72 w-72 rounded-full bg-[#fdd8a5]/70 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/60 p-5 shadow-2xl backdrop-blur-xl">
            <img
              src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80"
              alt="Fresh food ready to be shared"
              className="h-[480px] w-full rounded-[2rem] object-cover"
            />

            <div className="absolute bottom-10 left-10 right-10 rounded-3xl border border-white/60 bg-white/85 p-5 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fdd8a5]">
                  <Users size={22} className="text-[#0b306b]" />
                </div>

                <div>
                  <p className="font-semibold text-[#0b306b]">
                    Community powered
                  </p>
                  <p className="text-sm text-slate-500">
                    Donors • NGOs • Volunteers
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-5 -right-3 h-16 w-16 rounded-full bg-[#fdd8a5] opacity-80 blur-md" />
        </section>
      </main>

      {/* How It Works */}
      <section id="how-it-works" className="bg-white/60 px-8 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#16796f]">
            Simple process
          </p>

          <h2 className="mt-3 text-4xl font-bold text-[#0b306b]">
            Food rescue made simple
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-[#fdf6ec] p-8 text-left shadow-sm">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fdd8a5]">
                <Utensils />
              </div>

              <h3 className="text-xl font-bold">1. Donate</h3>

              <p className="mt-3 text-slate-600">
                Donors quickly post their safe surplus food and pickup details.
              </p>
            </div>

            <div className="rounded-3xl bg-[#eef7f6] p-8 text-left shadow-sm">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4f81b7] text-white">
                <Heart />
              </div>

              <h3 className="text-xl font-bold">2. Connect</h3>

              <p className="mt-3 text-slate-600">
                NGOs discover available food and request what their communities
                need.
              </p>
            </div>

            <div className="rounded-3xl bg-[#fdf6ec] p-8 text-left shadow-sm">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#16796f] text-white">
                <Users />
              </div>

              <h3 className="text-xl font-bold">3. Deliver</h3>

              <p className="mt-3 text-slate-600">
                Volunteers pick up and deliver food, with OTP verification at
                the end.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0b306b] px-8 py-8 text-center text-white">
        <p className="font-semibold">FoodRescue</p>

        <p className="mt-2 text-sm text-blue-100">
          Reducing food waste. Strengthening communities.
        </p>
      </footer>
    </div>
  );
}

export default App;
