import {
  ArrowLeft,
  Bike,
  Clock,
  MapPin,
  Package,
  Route,
  Truck,
} from "lucide-react";

function AvailablePickups() {
  const pickups = [
    {
      id: 1,
      food: "Vegetable Biryani",
      quantity: "20 servings",
      donor: "Green Kitchen",
      donorLocation: "Civil Lines, Nagpur",
      ngo: "Helping Hands NGO",
      ngoLocation: "Sadar, Nagpur",
      distance: "3.2 km",
      deadline: "Today, 8:00 PM",
    },
    {
      id: 2,
      food: "Fresh Bread",
      quantity: "15 packets",
      donor: "City Bakery",
      donorLocation: "Dharampeth, Nagpur",
      ngo: "Hope Foundation",
      ngoLocation: "Manish Nagar, Nagpur",
      distance: "4.5 km",
      deadline: "Today, 6:30 PM",
    },
    {
      id: 3,
      food: "Fruit Boxes",
      quantity: "25 boxes",
      donor: "Community Events",
      donorLocation: "Wardha Road, Nagpur",
      ngo: "Care Community",
      ngoLocation: "Pratap Nagar, Nagpur",
      distance: "6.1 km",
      deadline: "Tomorrow, 10:00 AM",
    },
  ];

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
            Volunteer
          </p>

          <h1 className="mt-2 text-4xl font-bold text-[#0b306b]">
            Available Pickups
          </h1>

          <p className="mt-2 text-slate-500">
            Choose a nearby food pickup that you can deliver.
          </p>
        </div>

        {/* Location notice */}
        <div className="mt-8 flex items-center gap-4 rounded-3xl border border-white/70 bg-white/65 p-5 shadow-sm backdrop-blur-xl">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#dcecf8] text-[#0b306b]">
            <MapPin size={21} />
          </div>

          <div>
            <p className="font-semibold text-[#0b306b]">
              Showing pickups near you
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Pickup distance is calculated from your volunteer location.
            </p>
          </div>
        </div>

        {/* Pickup cards */}
        <div className="mt-8 space-y-5">
          {pickups.map((pickup) => (
            <div
              key={pickup.id}
              className="rounded-[2rem] border border-white/70 bg-white/65 p-6 shadow-lg backdrop-blur-xl"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                {/* Food */}
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#fdd8a5] text-[#0b306b]">
                    <Package size={23} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-[#0b306b]">
                      {pickup.food}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {pickup.quantity}
                    </p>

                    <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#16796f]">
                      <Bike size={16} />
                      {pickup.distance} total route
                    </div>
                  </div>
                </div>

                {/* Route */}
                <div className="rounded-2xl bg-[#fdf6ec] p-4 lg:min-w-[300px]">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center pt-1">
                      <div className="h-3 w-3 rounded-full bg-[#16796f]" />

                      <div className="my-1 h-10 w-px bg-[#4f81b7]/40" />

                      <div className="h-3 w-3 rounded-full bg-[#0b306b]" />
                    </div>

                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="text-xs text-slate-400">PICKUP</p>

                        <p className="font-semibold text-[#0b306b]">
                          {pickup.donor}
                        </p>

                        <p className="text-slate-500">{pickup.donorLocation}</p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">DELIVERY</p>

                        <p className="font-semibold text-[#0b306b]">
                          {pickup.ngo}
                        </p>

                        <p className="text-slate-500">{pickup.ngoLocation}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details + action */}
                <div className="lg:min-w-[180px]">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock size={16} />
                    Before {pickup.deadline}
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                    <Route size={16} />
                    Donor → NGO
                  </div>

                  <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0b306b] px-5 py-3 font-semibold text-white shadow-md transition hover:bg-[#16796f]">
                    <Truck size={18} />
                    Accept Pickup
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AvailablePickups;
