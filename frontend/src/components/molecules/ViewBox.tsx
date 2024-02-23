import React from "react";

import { viewImg1 } from "../../images/Product";
import Button from "../atoms/button";

interface ViewBoxProps {
  productDetails: {
    title: string;
    content: string;
    image: string;
    price: string;
    signature: string;
  };
}

const ViewBox: React.FC<ViewBoxProps> = ({ productDetails }) => {
  const { title, content, image, price } = productDetails;
  return (
    <div className="w-pull px-28 py-10 flex justify-around">
      <div className=" bg-fuchsia-100 ">
        <div>
          <img src={viewImg1} alt="" />
        </div>
      </div>

      <div className=" w-[450px]">
        <div>
          <span>{image}</span>
          <span className="text-3xl py-5">{title}</span>
          <span>{price} Meta</span>
          <span className="py-7">{content}</span>
        </div>
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
