import React from "react";

import { viewImg1 } from "../../images/Product";
import { Product } from "../../pages/Main";
import { Link } from "react-router-dom";

interface mainData {
  product: Product[];
}

const ProductBox: React.FC<mainData> = ({ product }) => {
  return (
    <>
      {product.map((item, index) => (
        <Link to={`/product/${item.id}`}>
          <div
            key={index}
            className="w-[214px] h-[270px] p-4 shadow-xl rounded-md bg-slate-200"
          >
            <div className="rounded-md">
              <img
                src={
                  item.image && item.image !== "http://example.com"
                    ? item.image
                    : viewImg1
                }
                alt=""
              />
            </div>
            <p className="py-1">{item.title}</p>
            <p className="text-[18px]">{item.price}</p>
          </div>
        </Link>
      ))}
    </>
  );
};

export default ProductBox;
