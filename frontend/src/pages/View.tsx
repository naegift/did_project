import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loading from "../components/organisms/Loading";
import ViewBox from "../components/molecules/ViewBox";
import { ethers } from "ethers";
import ViewDetail from "../components/molecules/ViewDetail";
import { bannerImg1 } from "../images/Banner";

export interface Product {
  id: number;
  title: string;
  content: string;
  image: string;
  price: string;
  seller: string;
}

const View: React.FC = () => {
  const protocol = window.location.href.split("//")[0] + "//";
  const [product, setProduct] = useState<Product>({
    id: 0,
    title: "",
    content: "",
    image: "",
    price: "",
    seller: "",
  });
  const [loading, setLoading] = useState(true);
  const [userWalletAddress, setUserWalletAddress] = useState("");

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Product>(
          `${process.env.REACT_APP_API}/product/${id}`
        );
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchWalletAddress = async () => {
      if (window.ethereum) {
        try {
          // MetaMask에 계정 접근을 요청합니다.
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          // 첫 번째 계정을 사용합니다.
          const account = accounts[0];
          setUserWalletAddress(account);
        } catch (error) {
          console.error(
            "MetaMask 또는 유사한 웹3 지갑이 설치되어 있지 않습니다."
          );
        }
      } else {
        console.error(
          "MetaMask 또는 유사한 웹3 지갑이 설치되어 있지 않습니다."
        );
      }
    };

    fetchData();
    fetchWalletAddress();
  }, [id]);

  return (
    <div className="mt-[97px]">
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full">
          <ViewBox product={product} userWalletAddress={userWalletAddress} />
          <ViewDetail />
          <div className="pt-20">
            <img
              src={bannerImg1}
              alt=""
              className="w-full h-[250px] mobile:h-[150px]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default View;
