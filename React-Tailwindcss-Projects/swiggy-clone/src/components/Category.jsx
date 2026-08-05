import React, { useEffectEvent, useState } from "react";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

export default function () {
    const [slide,setSlide] = useState(0);
    const [categories, setCategory] = useState([]);
    const fetchCategory = async () => {
        const response = await fetch("http://localhost:5000/categories");
        const data = await response.json();
        setCategory(data);
    }
    useEffect(
        () => {
            fetchCategory();
        },[]
    )
    const nextSlide = () =>{
        if(categories.length - 8 == slide) return false;
        setSlide(slide + 3);
    }
    const prevSlide = () =>{
        if(slide == 0) return false;
        setSlide(slide - 3)
    }
  return (
    <>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex my-3 items-center justify-between">
          <div className="text-[25px] font-bold">What's on your mind?</div>
          <div className="flex">
            <div className="flex justify-center items-center w-[30px] h-[30px] bg-[#e2e2e7] rounded-full mx-2 cursor-pointer" onClick={prevSlide}>
            <FaArrowLeft />
          </div>
          <div className="flex justify-center items-center w-[30px] h-[30px] bg-[#e2e2e7] rounded-full mx-2 cursor-pointer" onClick={nextSlide}>
            <FaArrowRight />
          </div>
          </div>
        </div>
      </div>
    </>
  );
}
