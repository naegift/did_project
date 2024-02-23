import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import ViewBox from "../components/molecules/ViewBox";

export interface Product {
  id: number;
  title: string;
  content: string;
  image: string;
  price: number;
  seller: string;
}

const View: React.FC = () => {
  const [product, setProduct] = useState<Product[]>([]);
  const { id } = useParams();

  useEffect((): void => {
    const productData = async () => {
      try {
        const response = await axios.get<Product>(
          `https://naegift.subin.kr/product/${id}`
        );
        console.log(response.data);
        setProduct([response.data]);
      } catch (error) {
        console.log(error);
      }
    };
    productData();
  }, []);

  return (
    <>
      <ViewBox product={product} />
    </>
  );
};

export default View;