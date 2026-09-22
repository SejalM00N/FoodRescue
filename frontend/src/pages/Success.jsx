import { ArrowRight, CheckCircle, Heart, Home, Package } from "lucide-react";

function Success() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fdf6ec] px-6 py-10">
      <div className="w-full max-w-2xl">
        {/* Main Card */}
        <div className="rounded-[2rem] border border-white/70 bg-white/65 p-8 text-center shadow-xl backdrop-blur-xl md:p-12">
          {/* Success Icon */}
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#dcecf8] text-[#16796f] shadow-sm">
            <CheckCircle size={48} strokeWidth={2} />
          </div>

          {/* Heading */}
          <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-[#16796f]">
            Delivery Completed
          </p>

          <h1 className="mt-2 text-4xl font-bold text-[#0b306b]">
            Food successfully delivered!
          </h1>

          <p className="mx-auto mt-4 max-w-lg leading-7 text-slate-500">
            The donation has been verified by the NGO. Your contribution helped
            turn surplus food into meaningful meals.
          </p>

          {/* Impact Card */}
          <div className="mx-auto mt-8 max-w-lg rounded-3xl bg-[#0b306b] p-6 text-white">
            <div className="flex items-center justify-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fdd8a5] text-[#0b306b]">
                <Package size={21} />
              </div>

              <div className="text-left">
                <p className="text-xs text-blue-200">DONATION COMPLETED</p>

                <p className="mt-1 font-bold">
                  Vegetable Biryani • 20 servings
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/15 pt-5">
              <div>
                <p className="text-2xl font-bold">20</p>
                <p className="mt-1 text-xs text-blue-200">Meals rescued</p>
              </div>

              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="mt-1 text-xs text-blue-200">
                  Successful delivery
                </p>
              </div>
            </div>
          </div>

          {/* Thank You */}
          <div className="mx-auto mt-7 flex max-w-lg items-center justify-center gap-2 text-[#16796f]">
            <Heart size={18} fill="currentColor" />
            <span className="font-semibold">
              Thank you for making a difference.
            </span>
          </div>

          {/* Actions */}
          <div className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#0b306b] px-5 py-3.5 font-semibold text-white shadow-md transition hover:bg-[#16796f]">
              <Home size={18} />
              Back to Dashboard
            </button>

            <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#4f81b7]/30 bg-white px-5 py-3.5 font-semibold text-[#0b306b] transition hover:bg-[#dcecf8]">
              View Impact
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Success;
