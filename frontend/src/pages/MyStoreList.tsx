import React, { useEffect, useState } from "react";
import MyProductList from "../components/templates/MyProductList";
import axios from "axios";
import { ethers } from "ethers";

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
  const [product, setProduct] = useState<Product[]>([]);
  const [userAddress, setUserAddress] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [order, setOrder] = useState<string>("desc");
  const [seller, setSeller] = useState<string>("");

  useEffect(() => {
    const getWalletAddress = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const userAddress = await signer.getAddress();
          setSeller(userAddress);
        } catch (error) {
          console.log("자갑주소 가져오기 에러", error);
        }
      } else {
        console.log("메타마스크 설치하십시오");
      }
    };

    getWalletAddress();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Data>(
          `${
            // process.env
            //   .REACT_APP_API ||
            process.env.REACT_APP_AWS
          }/store?seller=${seller}&page=${page}&order=${order}`
        );
        setProduct(response.data.products);
      } catch (error) {
        console.error("데이터를 불러오는 중 에러 발생:", error);
      }
    };

    if (seller) {
      fetchData();
    }
  }, [seller]);

  return (
    <div>
      <h1>Store</h1>
      <div>Address : {seller}</div>
      <MyProductList products={product} userAddress={userAddress} />
    </div>
  );
};

export default MyStoreList;
