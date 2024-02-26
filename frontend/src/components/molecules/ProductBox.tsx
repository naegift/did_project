import React from "react";
import { Link } from "react-router-dom";

import { Product } from "../../pages/Main";
import { viewImg1 } from "../../images/Product";

interface ProductBox {
  product: Product;
}

const ProductBox: React.FC<ProductBox> = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`}>
      <div className="w-[214px] h-[270px] p-4 shadow-xl rounded-md bg-slate-200">
        <div className="rounded-md">
          <img
            src={
              product.image && product.image !== "http://example.com"
                ? product.image
                : viewImg1
            }
            alt=""
          />
        </div>
        <p className="py-1">{product.title}</p>
        <p className="text-[18px]">{product.price}</p>
      </div>
    </Link>
  );
};

export default ProductBox;
