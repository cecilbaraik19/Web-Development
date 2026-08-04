import React from "react";

export default function Banner() {
  return (
    <div>
      <section className="relative w-full h-[600px]">
        <img
          className="w-full h-full object-cover"
          src="/images/Banner.png"
          alt=""
        />
        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center mt-[-17.5rem]">
          <h1 className="text-white text-5xl font-bold text-center">
            Order food. Discover best
            <br />
            restaurants. Swiggy it!
          </h1>

          <div className="flex mt-8 gap-4">
            <input
              type="text"
              placeholder="Enter Location"
              className="w-80 h-14 rounded-xl px-4"
            />

            <input
              type="text"
              placeholder="Search restaurants"
              className="w-[500px] h-14 rounded-xl px-4"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
