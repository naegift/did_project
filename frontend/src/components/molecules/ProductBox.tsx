import React from "react";

import { productImg1 } from "../../images/Product";

const ProductBox: React.FC = () => {
  return (
    <div className="w-[214px] h-[240px] p-2 shadow-xl rounded-md bg-slate-200">
      <div className="rounded-md">
        <img src={productImg1} alt="" />
      </div>
      <p className="py-1">식기세척기 교환권</p>
      <p className="text-[18px]">1.8 ETH</p>
    </div>
  );
};

export default ProductBox;
