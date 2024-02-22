import React from "react";

import { bannerImg1 } from "../images/Banner";
import ProductBox from "../components/molecules/ProductBox";

const Main: React.FC = () => {
  return (
    <div className="">
      <div className="w-pull h-[400px] overflow-hidden">
        <img src={bannerImg1} alt="" className="w-[100%]" />
      </div>
      <ProductBox />
    </div>
  );
};

export default Main;
