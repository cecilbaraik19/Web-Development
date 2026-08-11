import React, { useState } from "react";

import { RxCaretDown } from "react-icons/rx";
import { MdSearch } from "react-icons/md";
import { RiDiscountPercentLine } from "react-icons/ri";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { MdOutlineShoppingCart } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

import LocationSidebar from "./LocationSidebar";

export default function Header() {
  const [toggle, setToggle] = useState(false);

  const [location, setLocation] = useState(
    localStorage.getItem("selectedLocation") ||
      "Ranchi, Jharkhand, India"
  );

  const showSideMenu = () => {
    setToggle(true);
  };

  const hideSideMenu = () => {
    setToggle(false);
  };

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
  };

  const links = [
    {
      icon: <MdSearch />,
      name: "Search",
    },
    {
      icon: <RiDiscountPercentLine />,
      name: "Offers",
      sup: "New",
    },
    {
      icon: <IoMdHelpCircleOutline />,
      name: "Help",
    },
    {
      icon: <MdOutlineShoppingCart />,
      name: "Cart",
    },
    {
      icon: <CgProfile />,
      name: "Sign In",
    },
  ];

  return (
    <>
      {/* ================= HEADER ================= */}

      <header className="bg-white shadow-sm relative z-50">
        <div className="max-w-[1200px] mx-auto h-[80px] flex items-center justify-between px-5">

          {/* Logo + Location */}
          <div className="flex items-center gap-6">

            {/* Logo */}
            <div className="text-orange-500 text-4xl font-bold">
              S
            </div>

            {/* Location */}
            <button
              type="button"
              onClick={showSideMenu}
              className="flex items-center gap-1 hover:text-orange-500 transition"
            >
              <span className="font-bold underline">
                {location.split(",")[0]}
              </span>

              <span className="text-sm">
                {location.includes(",")
                  ? location.substring(
                      location.indexOf(",") + 1
                    )
                  : ""}
              </span>

              <RxCaretDown className="text-xl text-orange-500" />
            </button>

          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-8">

            {links.map((link, index) => (
              <button
                key={index}
                type="button"
                className="flex items-center gap-2 text-gray-800 hover:text-orange-500 transition"
              >
                {/* Icon */}
                <span className="text-xl">
                  {link.icon}
                </span>

                {/* Name */}
                <span>
                  {link.name}
                </span>

                {/* New badge */}
                {link.sup && (
                  <sup className="text-orange-500 text-xs font-bold">
                    {link.sup}
                  </sup>
                )}
              </button>
            ))}

          </nav>

        </div>
      </header>

      {/* ================= LOCATION SIDEBAR ================= */}

      <LocationSidebar
        isOpen={toggle}
        onClose={hideSideMenu}
        onSelectLocation={handleLocationSelect}
      />
    </>
  );
}