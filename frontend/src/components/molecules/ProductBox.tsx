import React from "react";
import { Link } from "react-router-dom";

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
          "p-4 shadow-xl rounded-md bg-slate-200 hover:scale-105 duration-200",
          ""
        )}
      >
        <div className="rounded-md">
          <img
            className={cn(
              "w-[220px] h-[225px] ",
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
        <p className="py-2 font-extrabold">{product.title}</p>
        <p className="text-[18px]">{priceETH} ETH</p>
      </div>
    </Link>
  );
};

export default ProductBox;
