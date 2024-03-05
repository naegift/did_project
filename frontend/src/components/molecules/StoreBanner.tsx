import React from "react";
import { giftImage4 } from "../../images/Banner/";

const StoreBanner = () => {
  return (
    <div className="relative  w-full">
      <img
        src={giftImage4}
        alt=""
        className="w-[100%] h-[900px] mobile:h-[150px] object-cover"
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl font-bold">
        Welcome to our store
      </div>
    </div>
  );
};

export default StoreBanner;
