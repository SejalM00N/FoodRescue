import {
  ArrowLeft,
  CheckCircle,
  Clock,
  MapPin,
  Package,
  Phone,
  Truck,
} from "lucide-react";

function DeliveryTracking() {
  const steps = [
    {
      title: "Pickup Accepted",
      description: "You accepted this pickup.",
      completed: true,
    },
    {
      title: "Food Picked Up",
      description: "Food has been collected from the donor.",
      completed: true,
    },
    {
      title: "In Transit",
      description: "Food is on the way to the NGO.",
      completed: false,
      current: true,
    },
    {
      title: "Delivered",
      description: "NGO will verify the delivery with an OTP.",
      completed: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#fdf6ec] px-6 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Back */}
        <button
          onClick={() => window.history.back()}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-[#0b306b] transition hover:text-[#16796f]"
        >
          <ArrowLeft size={18} />
          Back to Pickups
        </button>

        {/* Header */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#16796f]">
            Delivery Tracking
          </p>

          <h1 className="mt-2 text-4xl font-bold text-[#0b306b]">
            Vegetable Biryani
          </h1>

          <p className="mt-2 text-slate-500">20 servings • Helping Hands NGO</p>
        </div>

        {/* Status */}
        <div className="mt-8 rounded-[2rem] bg-[#0b306b] p-7 text-white shadow-xl">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-blue-200">Current Status</p>

              <div className="mt-2 flex items-center gap-3">
                <Truck size={28} />

                <h2 className="text-2xl font-bold">In Transit</h2>
              </div>

              <p className="mt-2 text-sm text-blue-100">
                Please deliver the food to the NGO before the pickup deadline.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 px-5 py-4">
              <p className="text-xs text-blue-200">ESTIMATED DISTANCE</p>

              <p className="mt-1 text-2xl font-bold">2.4 km</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Timeline */}
          <section className="rounded-[2rem] border border-white/70 bg-white/65 p-7 shadow-sm backdrop-blur-xl lg:col-span-2">
            <h2 className="text-xl font-bold text-[#0b306b]">
              Delivery Progress
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Follow the delivery status step by step.
            </p>

            <div className="mt-8">
              {steps.map((step, index) => (
                <div key={step.title} className="relative flex gap-5">
                  {/* Line */}
                  {index !== steps.length - 1 && (
                    <div
                      className={`absolute left-5 top-10 h-16 w-0.5 ${
                        step.completed ? "bg-[#16796f]" : "bg-slate-200"
                      }`}
                    />
                  )}

                  {/* Icon */}
                  <div
                    className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      step.completed
                        ? "bg-[#16796f] text-white"
                        : step.current
                          ? "bg-[#fdd8a5] text-[#0b306b]"
                          : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle size={20} />
                    ) : step.current ? (
                      <Truck size={19} />
                    ) : (
                      <Clock size={19} />
                    )}
                  </div>

                  {/* Text */}
                  <div className="pb-10">
                    <h3
                      className={`font-semibold ${
                        step.current ? "text-[#0b306b]" : "text-slate-700"
                      }`}
                    >
                      {step.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action */}
            <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#16796f] px-5 py-3 font-semibold text-white transition hover:bg-[#0b306b]">
              <CheckCircle size={18} />
              Mark as Delivered
            </button>
          </section>

          {/* Details */}
          <section className="space-y-6">
            {/* Pickup */}
            <div className="rounded-[2rem] border border-white/70 bg-white/65 p-6 shadow-sm backdrop-blur-xl">
              <h2 className="font-bold text-[#0b306b]">Pickup Details</h2>

              <div className="mt-5 flex gap-3">
                <MapPin size={19} className="mt-1 shrink-0 text-[#16796f]" />

                <div>
                  <p className="font-semibold text-[#0b306b]">Green Kitchen</p>

                  <p className="mt-1 text-sm text-slate-500">
                    Civil Lines, Nagpur
                  </p>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <Package size={19} className="mt-1 shrink-0 text-[#16796f]" />

                <div>
                  <p className="font-semibold text-[#0b306b]">20 servings</p>

                  <p className="mt-1 text-sm text-slate-500">
                    Vegetable Biryani
                  </p>
                </div>
              </div>
            </div>

            {/* NGO */}
            <div className="rounded-[2rem] border border-white/70 bg-white/65 p-6 shadow-sm backdrop-blur-xl">
              <h2 className="font-bold text-[#0b306b]">Delivery To</h2>

              <div className="mt-5 flex gap-3">
                <MapPin size={19} className="mt-1 shrink-0 text-[#16796f]" />

                <div>
                  <p className="font-semibold text-[#0b306b]">
                    Helping Hands NGO
                  </p>

                  <p className="mt-1 text-sm text-slate-500">Sadar, Nagpur</p>
                </div>
              </div>

              <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#4f81b7]/30 bg-white px-4 py-3 text-sm font-semibold text-[#0b306b] transition hover:bg-[#dcecf8]">
                <Phone size={17} />
                Contact NGO
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default DeliveryTracking;
