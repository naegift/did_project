import React from "react";
import { Link } from "react-router-dom";

import { Product } from "../../pages/Main";
import { viewImg1 } from "../../images/Product";
import { formatEther } from "@ethersproject/units";

interface ProductBox {
  product: Product;
}

const ProductBox: React.FC<ProductBox> = ({ product }) => {
  const priceETH = formatEther(product.price);

  return (
    <Link to={`/product/${product.id}`}>
      <div className=" p-4 shadow-xl rounded-md bg-slate-200 hover:scale-105 duration-200">
        <div className="rounded-md">
          <img
            className="w-[220px] h-[225px]"
            src={
              product.image && product.image !== "http://example.com"
                ? product.image
                : viewImg1
            }
            alt=""
          />
        </div>
        <p className="py-1">{product.title}</p>
        <p className="text-[18px]">{priceETH} ETH</p>
      </div>
    </Link>
  );
};

export default ProductBox;
