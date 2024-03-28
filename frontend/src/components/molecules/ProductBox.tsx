import React from "react";
import { Link } from "react-router-dom";
import { ethIcon } from "../../images/Icon";
import { Product } from "../../pages/Main";
import { viewImg1 } from "../../images/Product";
import { formatEther } from "@ethersproject/units";
import { cn } from "../../utils/cn";

interface iProductBox {
  product: Product;
}

const ProductBox: React.FC<iProductBox> = ({ product }) => {
  const priceETH = formatEther(product.price);

  return (
    <Link to={`/product/${product.id}`}>
      <div
        className={cn(
          "drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] rounded-md hover:scale-105 duration-200 pb-3",
          ""
        )}
      >
        <div className="w-full h-full ">
          <img
            className={cn(
              "rounded-tl-lg rounded-tr-lg",
              "w-[350px] h-[300px] object-cover",
              "tablet:w-[240px] tablet:h-[265px]",
              "mobile:w-[250px] mobile:h-[275px]"
            )}
            src={
              product.image && product.image !== "http://example.com"
                ? product.image
                : viewImg1
            }
            alt=""
          />
        </div>
        <div className="">
          <p className="py-2 pl-2 text-xl font-extrabold  ">{product.title}</p>
          <div className="flex flex-row p-2">
            <img src={ethIcon} alt="" className="w-[30px] h-[30px]" />
            <p className="text-[18px] text-slate-400 pl-2">{priceETH} ETH</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductBox;
