import React from "react";
import { giftImage4 } from "../../images/Banner/";
import { itemIcon } from "../../images/Icon";
import { saleIcon } from "../../images/Icon";
import { messageIcon } from "../../images/Icon";

const StoreBanner = () => {
  return (
    <div className="relative  w-full">
      <img
        src={giftImage4}
        alt=""
        className="w-[100%] h-[900px] mobile:h-[150px] object-cover"
      />
      <div className="absolute  w-full top-[80%] mx-[auto] transform -translate-y-1/2 z-10 flex flex-row justify-center gap-x-36">
        <button className=" flex flex-col items-center">
          <img
            src={itemIcon}
            alt=""
            className="mobile:h-[30px] mobile:w-[30px]"
          />
          <p className="">아이템</p>
        </button>
        <button className="flex flex-col items-center">
          <img
            src={saleIcon}
            alt=""
            className="mobile:h-[30px] mobile:w-[30px]"
          />
          <p>활동</p>
        </button>
        <button className="flex flex-col items-center">
          <img
            src={messageIcon}
            alt=""
            className="mobile:h-[30px] mobile:w-[30px]"
          />
          <p>메세지</p>
        </button>
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl font-bold">
        Welcome to our store
      </div>
    </div>
  );
};

export default StoreBanner;
