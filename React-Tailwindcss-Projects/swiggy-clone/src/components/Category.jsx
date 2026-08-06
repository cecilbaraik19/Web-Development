import React, {useState, useEffect } from "react";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import categoriesData from "../api/categoryApi.js";

export default function Category () {
  const [slide, setSlide] = useState(0);
  const [categories, setCategory] = useState([]);

  useEffect(() => {
    setCategory(categoriesData);
  }, []);

  const nextSlide = () => {
    if (categories.length - 8 === slide) return false;
    setSlide(slide + 3);
  };
  const prevSlide = () => {
    if (slide === 0) return false;
    setSlide(slide - 3);
  };
  return (
    <>
      <div className="max-w-[1200px] mx-auto mt-24">
        <div className="flex my-3 items-center justify-between">
          <div className="text-[25px] font-bold">What's on your mind?</div>
          <div className="flex">
            <div
              className="flex justify-center items-center w-[30px] h-[30px] bg-[#e2e2e7] rounded-full mx-2 cursor-pointer"
              onClick={prevSlide}
            >
              <FaArrowLeft />
            </div>
            <div
              className="flex justify-center items-center w-[30px] h-[30px] bg-[#e2e2e7] rounded-full mx-2 cursor-pointer"
              onClick={nextSlide}
            >
              <FaArrowRight />
            </div>
          </div>
        </div>
        <div className="flex overflow-hidden">
          {categories.map((cat) => (
            <div
              key={cat.id}
              style={{
                transform: `translateX(-${slide * 100}%)`,
              }}
              className="w-[150px] shrink-0 duration-500"
            >
              <img src={cat.image} alt={cat.name} className="w-full h-auto" />
            </div>
          ))}
        </div>
      </div>
      <hr className="my-6 border-[1px]" />
    </>
  );
}
