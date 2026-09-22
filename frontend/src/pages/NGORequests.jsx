import {
  ArrowLeft,
  CheckCircle,
  Clock,
  MapPin,
  Package,
  Truck,
  XCircle,
} from "lucide-react";

function NGORequests() {
  const requests = [
    {
      food: "Vegetable Biryani",
      quantity: "20 servings",
      donor: "Green Kitchen",
      location: "Nagpur",
      status: "Accepted",
      date: "Today, 2:00 PM",
    },
    {
      food: "Fresh Bread",
      quantity: "15 packets",
      donor: "City Bakery",
      location: "Nagpur",
      status: "Pending",
      date: "Today, 11:30 AM",
    },
    {
      food: "Mixed Vegetables",
      quantity: "10 kg",
      donor: "Fresh Mart",
      location: "Nagpur",
      status: "Rejected",
      date: "Yesterday",
    },
    {
      food: "Fruit Boxes",
      quantity: "25 boxes",
      donor: "Community Events",
      location: "Nagpur",
      status: "Completed",
      date: "2 days ago",
    },
  ];

  const getStatusStyle = (status) => {
    if (status === "Accepted") {
      return "bg-[#dcecf8] text-[#0b306b]";
    }

    if (status === "Completed") {
      return "bg-[#dcefeb] text-[#16796f]";
    }

    if (status === "Rejected") {
      return "bg-red-50 text-red-600";
    }

    return "bg-[#fff0d9] text-[#9a6500]";
  };

  const getStatusIcon = (status) => {
    if (status === "Accepted") {
      return <Truck size={16} />;
    }

    if (status === "Completed") {
      return <CheckCircle size={16} />;
    }

    if (status === "Rejected") {
      return <XCircle size={16} />;
    }

    return <Clock size={16} />;
  };

  return (
    <div className="min-h-screen bg-[#fdf6ec] px-6 py-8">
      {/* Back */}
      <button
        onClick={() => window.history.back()}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-[#0b306b] transition hover:text-[#16796f]"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#16796f]">
            NGO
          </p>

          <h1 className="mt-2 text-4xl font-bold text-[#0b306b]">
            My Requests
          </h1>

          <p className="mt-2 text-slate-500">
            Track the food donations requested by your organization.
          </p>
        </div>

        {/* Summary */}
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-sm backdrop-blur-xl">
            <p className="text-sm text-slate-500">Total Requests</p>

            <p className="mt-2 text-3xl font-bold text-[#0b306b]">24</p>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-sm backdrop-blur-xl">
            <p className="text-sm text-slate-500">Pending</p>

            <p className="mt-2 text-3xl font-bold text-[#4f81b7]">3</p>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-sm backdrop-blur-xl">
            <p className="text-sm text-slate-500">Completed</p>

            <p className="mt-2 text-3xl font-bold text-[#16796f]">18</p>
          </div>
        </div>

        {/* Request list */}
        <section className="mt-8 rounded-[2rem] border border-white/70 bg-white/65 p-6 shadow-lg backdrop-blur-xl md:p-8">
          <div>
            <h2 className="text-xl font-bold text-[#0b306b]">
              Request History
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View the current status of your food requests.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {requests.map((request) => (
              <div
                key={`${request.food}-${request.donor}`}
                className="rounded-2xl bg-[#fdf6ec] p-5"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  {/* Food */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#fdd8a5] text-[#0b306b]">
                      <Package size={22} />
                    </div>

                    <div>
                      <h3 className="font-bold text-[#0b306b]">
                        {request.food}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {request.quantity} • {request.donor}
                      </p>

                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                        <MapPin size={13} />
                        {request.location} • {request.date}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${getStatusStyle(
                        request.status,
                      )}`}
                    >
                      {getStatusIcon(request.status)}
                      {request.status}
                    </span>

                    {request.status === "Accepted" && (
                      <button className="flex items-center gap-2 rounded-xl bg-[#0b306b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#16796f]">
                        <Truck size={16} />
                        Track Delivery
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default NGORequests;
