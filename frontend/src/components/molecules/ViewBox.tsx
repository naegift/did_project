import React from "react";

import { viewImg1 } from "../../images/Product";
import Button from "../atoms/button";

const ViewBox: React.FC = () => {
  return (
    <div className="w-pull px-28 py-10 flex justify-around">
      <div className=" bg-fuchsia-100 ">
        <div>
          <img src={viewImg1} alt="" />
        </div>
      </div>
      <div className=" w-[450px]">
        <p className="text-3xl py-5">생활가전 교환권</p>
        <p className="text-2xl ">0.75 ETH</p>
        <p className="py-7">
          This hypothetical t-shirt is made of cotton fabric, offering a
          comfortable and breathable feel. Its soft texture makes it an ideal
          choice for everyday wear, ensuring both style and comfort. making it
          suitable for various occasions.
        </p>
        <Button variant="sendBtn2" size="lg" label="선물하기" />
        <br />
      </div>
    </div>
  );
};

export default ViewBox;
