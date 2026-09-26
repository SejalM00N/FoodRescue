import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons in Vite
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const DEFAULT_LOCATION = [21.1458, 79.0882];

function MapClickHandler({ onSelect }) {
  useMapEvents({
    click(event) {
      onSelect(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

function RecenterMap({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 16);
    }
  }, [position, map]);

  return null;
}

export default function LocationPicker({
  initialLocation = null,
  onConfirm,
  onClose,
}) {
  const [selectedLocation, setSelectedLocation] = useState(
    initialLocation
      ? [initialLocation.latitude, initialLocation.longitude]
      : null,
  );

  const [address, setAddress] = useState(initialLocation?.address || "");

  const [searchText, setSearchText] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");

  const handleMapSelection = async (latitude, longitude) => {
    setSelectedLocation([latitude, longitude]);
    setError("");

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2&addressdetails=1`,
        {
          headers: {
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to find address");
      }

      const data = await response.json();

      setAddress(
        data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
      );
    } catch {
      setAddress(
        `Selected location (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`,
      );
    }
  };

  const handleSearch = async () => {
    const query = searchText.trim();

    if (!query) {
      return;
    }

    setSearching(true);
    setError("");
    setSearchResults([]);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query,
        )}&format=jsonv2&addressdetails=1&limit=5&countrycodes=in`,
        {
          headers: {
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const results = await response.json();

      if (!results.length) {
        setError(
          "Location not found. You can still select the location directly on the map.",
        );
      } else {
        setSearchResults(results);
      }
    } catch {
      setError(
        "Search is unavailable. You can select the location directly on the map.",
      );
    } finally {
      setSearching(false);
    }
  };

  const handleSelectSearchResult = (result) => {
    const latitude = Number(result.lat);
    const longitude = Number(result.lon);

    setSelectedLocation([latitude, longitude]);
    setAddress(result.display_name || "");
    setSearchResults([]);
    setError("");
  };

  const handleConfirm = () => {
    if (!selectedLocation) {
      setError("Please select a location on the map first.");
      return;
    }

    onConfirm({
      address:
        address ||
        `Selected location (${selectedLocation[0].toFixed(
          6,
        )}, ${selectedLocation[1].toFixed(6)})`,
      latitude: selectedLocation[0],
      longitude: selectedLocation[1],
    });
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4">
      <div className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-xl font-bold text-[#0b306b]">
              Choose Delivery Location
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Search for a place or click directly on the map.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-2 text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            ×
          </button>
        </div>

        {/* Search */}
        <div className="relative z-[1001] border-b border-slate-200 bg-white p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="Search area, landmark, street or PIN code"
              className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#4f81b7] focus:ring-2 focus:ring-[#4f81b7]/20"
            />

            <button
              type="button"
              onClick={handleSearch}
              disabled={searching}
              className="rounded-xl bg-[#0b306b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#082654] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {searching ? "Searching..." : "Search"}
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="mt-2 max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
              {searchResults.map((result, index) => (
                <button
                  key={`${result.place_id}-${index}`}
                  type="button"
                  onClick={() => handleSelectSearchResult(result)}
                  className="block w-full border-b border-slate-100 px-4 py-3 text-left text-sm transition last:border-b-0 hover:bg-slate-50"
                >
                  <div className="font-medium text-slate-800">
                    {result.name || "Location"}
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    {result.display_name}
                  </div>
                </button>
              ))}
            </div>
          )}

          {error && (
            <div className="mt-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
              {error}
            </div>
          )}
        </div>

        {/* Map */}
        <div className="relative min-h-0 flex-1">
          <MapContainer
            center={selectedLocation || DEFAULT_LOCATION}
            zoom={selectedLocation ? 16 : 12}
            scrollWheelZoom
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapClickHandler onSelect={handleMapSelection} />

            {selectedLocation && (
              <>
                <Marker position={selectedLocation} />

                <RecenterMap position={selectedLocation} />
              </>
            )}
          </MapContainer>

          {/* Map instruction */}
          <div className="pointer-events-none absolute left-1/2 top-4 z-[500] -translate-x-1/2 rounded-full bg-white/95 px-4 py-2 text-xs font-medium text-slate-700 shadow-md">
            Click anywhere on the map to place the delivery pin
          </div>
        </div>

        {/* Selected location */}
        <div className="border-t border-slate-200 bg-white p-4">
          {selectedLocation ? (
            <div className="mb-3 rounded-xl bg-[#fdd8a5]/30 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#0b306b]">
                Selected delivery location
              </p>

              <p className="mt-1 text-sm text-slate-700">
                {address ||
                  `${selectedLocation[0].toFixed(
                    6,
                  )}, ${selectedLocation[1].toFixed(6)}`}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Coordinates: {selectedLocation[0].toFixed(6)},{" "}
                {selectedLocation[1].toFixed(6)}
              </p>
            </div>
          ) : (
            <div className="mb-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-500">
              No delivery location selected yet.
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={!selectedLocation}
              className="rounded-xl bg-[#16796f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#12665d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Confirm Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
