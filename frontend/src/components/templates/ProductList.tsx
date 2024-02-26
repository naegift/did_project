import React from "react";

import { Product } from "../../pages/Main";
import ProductBox from "../molecules/ProductBox";

interface mainData {
  products: Product[];
}

const ProductList: React.FC<mainData> = ({ products }) => {
  return (
    <>
      {products.map((product, index) => (
        <ProductBox key={index} product={product} />
      ))}
    </>
  );
};

export default ProductList;
