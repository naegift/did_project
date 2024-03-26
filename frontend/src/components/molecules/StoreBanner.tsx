import { useState } from "react";
import { giftImage4 } from "../../images/Banner/";
import { itemIcon } from "../../images/Icon";
import { saleIcon } from "../../images/Icon";
import { messageIcon } from "../../images/Icon";
import MyNotificationBox from "../templates/MyNotificationBox";

const StoreBanner = () => {
  const [showModal, setShowModal] = useState(false);

  const scrollToComponent = (products: string) => {
    const element = document.getElementById(products);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleModal = () => setShowModal(!showModal);

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
            onClick={() => scrollToComponent("myProductList")}
          />
          <p className="">Items</p>
        </button>
        <button className="flex flex-col items-center">
          <img
            src={saleIcon}
            alt=""
            className="mobile:h-[30px] mobile:w-[30px]"
            onClick={() => scrollToComponent("MyVerifiedBox")}
          />
          <p>Activity</p>
        </button>
        <button className="flex flex-col items-center">
          <img
            src={messageIcon}
            alt=""
            className="mobile:h-[30px] mobile:w-[30px]"
            onClick={toggleModal}
          />
          <p>Message</p>
        </button>
      </div>

      {showModal && (
        <MyNotificationBox showModal={showModal} toggleModal={toggleModal} />
      )}

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl font-bold">
        Welcome to our store
      </div>
    </div>
  );
};

export default StoreBanner;
