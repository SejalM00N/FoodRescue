import {
  ArrowLeft,
  CheckCircle,
  LockKeyhole,
  Package,
  ShieldCheck,
} from "lucide-react";

function NGOVerification() {
  return (
    <div className="min-h-screen bg-[#fdf6ec] px-6 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Back */}
        <button
          onClick={() => window.history.back()}
          className="mb-8 flex items-center gap-2 text-sm font-medium text-[#0b306b] transition hover:text-[#16796f]"
        >
          <ArrowLeft size={18} />
          Back to Deliveries
        </button>

        {/* Main Card */}
        <div className="rounded-[2rem] border border-white/70 bg-white/65 p-8 shadow-xl backdrop-blur-xl md:p-12">
          {/* Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#dcecf8] text-[#0b306b]">
            <ShieldCheck size={30} />
          </div>

          {/* Heading */}
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

          {/* Delivery Summary */}
          <div className="mx-auto mt-8 max-w-xl rounded-3xl bg-[#fdf6ec] p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fdd8a5] text-[#0b306b]">
                <Package size={21} />
              </div>

              <div>
                <h2 className="font-bold text-[#0b306b]">Vegetable Biryani</h2>

                <p className="mt-1 text-sm text-slate-500">
                  20 servings • Delivered by Rahul
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Volunteer
                </p>

                <p className="mt-1 font-semibold text-[#0b306b]">
                  Rahul Sharma
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Delivery
                </p>

                <p className="mt-1 font-semibold text-[#0b306b]">
                  Today, 5:30 PM
                </p>
              </div>
            </div>
          </div>

          {/* OTP */}
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
                maxLength="6"
                placeholder="Enter OTP"
                className="w-full rounded-2xl border border-slate-200 bg-white px-12 py-4 text-center text-xl font-bold tracking-[0.5em] text-[#0b306b] outline-none transition focus:border-[#16796f] focus:ring-4 focus:ring-[#16796f]/10"
              />
            </div>

            <p className="mt-3 text-center text-xs text-slate-400">
              Ask the volunteer for the OTP generated for this delivery.
            </p>
          </div>

          {/* Verify */}
          <div className="mx-auto mt-7 max-w-xl">
            <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0b306b] px-5 py-4 font-semibold text-white shadow-lg transition hover:bg-[#16796f]">
              <CheckCircle size={19} />
              Verify Delivery
            </button>
          </div>

          {/* Security note */}
          <div className="mx-auto mt-7 flex max-w-xl gap-3 rounded-2xl bg-[#dcecf8]/70 p-4">
            <ShieldCheck size={20} className="mt-0.5 shrink-0 text-[#16796f]" />

            <p className="text-sm leading-5 text-slate-600">
              This verification confirms that the donated food reached the
              intended NGO and completes the delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NGOVerification;
