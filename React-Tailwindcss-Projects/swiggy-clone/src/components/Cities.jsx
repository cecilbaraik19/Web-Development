import React, { useState } from "react";
import { RxCaretDown, RxCaretUp } from "react-icons/rx";
import citiesData from "../api/citiesData";

export default function Cities() {
  const [showAll, setShowAll] = useState(false);

  const visibleCities = showAll
    ? citiesData
    : citiesData.slice(0, 12);

  return (
    <section className="max-w-[1200px] mx-auto my-16">
      <h2 className="text-4xl font-bold mb-8">
        Cities with food delivery
      </h2>

      <div className="grid grid-cols-4 gap-5">

        {visibleCities.map((city, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-2xl h-[82px]
                       flex items-center justify-center
                       cursor-pointer
                       hover:shadow-md
                       hover:border-gray-400
                       duration-300"
          >
            <span className="text-[18px] text-center font-medium">
              Order food online in <br />
              {city}
            </span>
          </div>
        ))}

        {citiesData.length > 12 && (
          <div
            onClick={() => setShowAll(!showAll)}
            className="border border-gray-300 rounded-2xl h-[82px]
                       flex items-center justify-center
                       cursor-pointer
                       hover:shadow-md
                       hover:border-gray-400
                       duration-300"
          >
            <span className="text-[#fc8019] font-semibold flex items-center gap-1">
              {showAll ? "Show Less" : "Show More"}

              {showAll ? (
                <RxCaretUp size={22} />
              ) : (
                <RxCaretDown size={22} />
              )}
            </span>
          </div>
        )}

      </div>
      <hr className="my-6 border-[1px]" />
    </section>
  );
}