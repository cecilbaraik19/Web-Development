import React, { useState, useEffect } from "react";
import { FaArrowRight, FaArrowLeft, FaStar } from "react-icons/fa";
import restaurantData from "../api/restaurantData";

export default function TopRest() {
  const [restaurants, setRestaurant] = useState([]);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    setRestaurant(restaurantData);
  }, []);

  const nextSlide = () => {
    if (slide >= restaurants.length - 3) return;
    setSlide(slide + 1);
  };

  const prevSlide = () => {
    if (slide <= 0) return;
    setSlide(slide - 1);
  };

  return (
    <>
      <div className="max-w-[1200px] mx-auto mt-10">

        {/* Heading */}

        <div className="flex my-5 items-center justify-between">

          <h2 className="text-[25px] font-bold">
            Top Restaurant chains in Ranchi
          </h2>

          <div className="flex">

            <div
              onClick={prevSlide}
              className="flex justify-center items-center w-[35px] h-[35px] bg-gray-200 rounded-full mx-2 cursor-pointer hover:bg-gray-300"
            >
              <FaArrowLeft />
            </div>

            <div
              onClick={nextSlide}
              className="flex justify-center items-center w-[35px] h-[35px] bg-gray-200 rounded-full mx-2 cursor-pointer hover:bg-gray-300"
            >
              <FaArrowRight />
            </div>

          </div>
        </div>

        {/* Cards */}

        <div className="overflow-hidden cursor-pointer">

          <div
            className="flex gap-6 duration-500"
            style={{
              transform: `translateX(-${slide * 398}px)`,
            }}
          >
            {restaurants.map((item) => (
              <div
                key={item.id}
                className="min-w-[380px] rounded-2xl overflow-hidden shadow-lg border bg-white"
              >
                {/* Image */}

                <div className="relative overflow-hidden rounded-t-2xl cursor-pointer">

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-[230px] object-cover transition-all duration-500 ease-in-out hover:scale-110"
                  />

                  <div className="absolute bottom-3 left-3 text-white">
                    <h2 className="text-2xl font-bold">
                      {item.name}
                    </h2>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-green-600 text-white px-2 py-1 rounded flex items-center gap-1">
                    <FaStar size={12} />
                    {item.rating}
                  </div>

                </div>

                {/* Details */}

                <div className="p-4">

                  <div className="flex justify-between">
                    <p>{item.cuisine}</p>
                    <p>{item.price}</p>
                  </div>

                  <div className="flex justify-between text-gray-500 mt-2">
                    <p>{item.location}</p>
                    <p>{item.distance}</p>
                  </div>

                  <div className="flex justify-between bg-green-600 text-white rounded-lg px-4 py-3 mt-4">
                    <span>{item.offer}</span>
                    <span>{item.extra}</span>
                  </div>

                  <div className="bg-green-100 text-green-700 rounded-lg p-3 mt-3">
                    {item.bankOffer}
                  </div>

                  <p className="text-purple-700 mt-3">
                    Get extra ₹50 off using PAYTM UPI
                  </p>

                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
      <hr className="my-6 border-[1px]" />
    </>
  );
}