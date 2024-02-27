import React, { useEffect, useState } from "react";
import axios from "axios";

import { bannerImg2 } from "../images/Banner";
import ProductList from "../components/templates/ProductList";
import Button from "../components/atoms/button";

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
          `https://naegift.subin.kr/?page=1&order=desc`
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
      <div className="w-5/6 flex flex-row py-5 gap-5 px-20 mx-auto items-center">
        <span className="text-xl">전체 상품 리스트</span>
        <Button variant="basicBtn2" size="md" label="최신순" />
        <Button variant="basicBtn2" size="md" label="과거순" />
      </div>

      <div className="w-5/6 flex flex-row py-2 gap-5 px-20 mx-auto">
        <ProductList products={product} />
      </div>
      <div className="w-5/6 flex flex-row p-5 gap-5 px-20 mx-auto">
        페이지네이션 자리
      </div>
    </div>
  );
};

export default Main;
