import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loading from "../components/organisms/Loading";
import ViewBox from "../components/molecules/ViewBox";
import { ethers } from "ethers";

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
  const [userWalletAddress, setUserWalletAddress] = useState("");

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Product>(
          `${process.env.REACT_APP_AWS}/product/${id}`
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
          await window.ethereum.enable();
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setUserWalletAddress(address);
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
    <>
       
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full h-[90vh] mt-10">
          <ViewBox product={product} userWalletAddress={userWalletAddress} />
        </div>
      )}
    </>
  );
};

export default View;
