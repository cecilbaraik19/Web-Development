import React, { useState } from "react";
import { FaSearch, FaMapMarkerAlt, FaCrosshairs } from "react-icons/fa";

const LocationSidebar = ({ isOpen, onClose, onSelectLocation }) => {
  const [search, setSearch] = useState("");

  const locations = [
    "Ranchi, Jharkhand",
    "Lalpur, Ranchi",
    "Morabadi, Ranchi",
    "Harmu, Ranchi",
    "Doranda, Ranchi",
    "Kanke, Ranchi",
    "Main Road, Ranchi",
  ];

  const filteredLocations = locations.filter((location) =>
    location.toLowerCase().includes(search.toLowerCase())
  );

  const handleLocationSelect = (location) => {
    localStorage.setItem("selectedLocation", location);

    if (onSelectLocation) {
      onSelectLocation(location);
    }

    onClose();
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        const location = "Current Location";

        localStorage.setItem("selectedLocation", location);

        if (onSelectLocation) {
          onSelectLocation(location);
        }

        onClose();
      },
      () => {
        alert(
          "Unable to detect your location. Please search for your location instead."
        );
      }
    );
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Dark Overlay */}
      <div
        className="fixed inset-0 z-[999] bg-black/60"
        onClick={onClose}
      />

      {/* Location Sidebar */}
      <div className="fixed left-0 top-0 z-[1000] h-full w-full max-w-[430px] bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <h2 className="text-xl font-bold text-gray-900">
            Select your location
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close location sidebar"
            className="text-2xl text-gray-500 transition hover:text-gray-900"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">

          {/* Search Box */}
          <div className="relative">
            <FaSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={15}
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for area, street or city"
              className="w-full rounded-lg border border-gray-300 bg-white py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {/* Detect Current Location */}
          <button
            type="button"
            onClick={detectLocation}
            className="mt-5 flex w-full items-center gap-4 rounded-lg border border-gray-200 px-4 py-4 text-left transition hover:bg-orange-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
              <FaCrosshairs className="text-orange-500" />
            </div>

            <div>
              <p className="font-semibold text-gray-900">
                Use current location
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Using your device location
              </p>
            </div>
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />

            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Popular locations
            </span>

            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Locations */}
          <div className="space-y-1">
            {filteredLocations.length > 0 ? (
              filteredLocations.map((location) => (
                <button
                  key={location}
                  type="button"
                  onClick={() => handleLocationSelect(location)}
                  className="flex w-full items-center gap-4 rounded-lg px-3 py-3.5 text-left transition hover:bg-gray-50"
                >
                  <FaMapMarkerAlt
                    className="text-gray-400"
                    size={16}
                  />

                  <span className="text-sm text-gray-700">
                    {location}
                  </span>
                </button>
              ))
            ) : (
              <div className="py-10 text-center">
                <FaMapMarkerAlt
                  className="mx-auto mb-3 text-gray-300"
                  size={28}
                />

                <p className="text-sm font-medium text-gray-700">
                  No location found
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Try searching another area or city
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default LocationSidebar;