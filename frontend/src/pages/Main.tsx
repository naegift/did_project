import React, { useEffect, useState } from "react";

import { bannerImg2 } from "../images/Banner";
import ProductBox from "../components/molecules/ProductBox";
import axios from "axios";

export interface Data {
  nextPage: number;
  products: [];
  productsCount: number;
}

export interface Product {
  id: number;
  title: string;
  image: string;
  price: number;
}

const Main: React.FC = () => {
  const [data, setData] = useState<Data[]>([]);
  const [product, setProduct] = useState<Product[]>([]);

  useEffect((): void => {
    const mainData = async () => {
      try {
        const response = await axios.get<Data>(
          `https://naegift.subin.kr/?page=1`
        );
        console.log(response.data.products);
        setData([response.data]);
        setProduct(response.data.products);
      } catch (error) {
        console.log(error);
      }
    };
    mainData();
  }, []);

  return (
    <div className="">
      <div className="w-pull">
        <img src={bannerImg2} alt="" className="w-[100%]" />
      </div>
      <div className="flex flex-row p-5 gap-5 px-20">
        <ProductBox product={product} />
      </div>
    </div>
  );
};

export default Main;
