import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loading from "../components/organisms/Loading";
import ViewBox from "../components/molecules/ViewBox";

export interface Product {
  id: number;
  title: string;
  content: string;
  image: string;
  price: string;
  seller: string;
}

const View: React.FC = () => {
  const [product, setProduct] = useState<Product>({
    id: 0,
    title: "",
    content: "",
    image: "",
    price: "",
    seller: "",
  });
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  useEffect((): void => {
    const productData = async () => {
      try {
        const response = await axios.get<Product>(
          `https://naegift.subin.kr/product/${id}`
        );
        console.log(response.data);
        setProduct(response.data);
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.log(error);
      }
    };
    productData();
  }, []);

  return (
    <>
       {loading ? <Loading /> : null}
      <ViewBox product={product} />
    </>
  );
};

export default View;
