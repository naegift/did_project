import React, { useEffect, useState } from "react";
import MyProductList from "../components/templates/MyProductList";
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
  price: string;
  seller: string;
}

const MyStoreList: React.FC = () => {
  const [data, setData] = useState<Data[]>([]);
  const [product, setProduct] = useState<Product[]>([]);
  const [userAddress, setUserAddress] = useState<string>("");

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
    <div>
      <h1>Store</h1>
      <MyProductList products={product} userAddress={userAddress} />
    </div>
  );
};

export default MyStoreList;
