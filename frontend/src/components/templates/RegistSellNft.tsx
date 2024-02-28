import React, { useState, useEffect } from "react";
import RegistrationNFT from "../organisms/RegistrationNFT";
import Button from "../atoms/button";
import { ethers } from "ethers";
import WriteModal from "../molecules/WriteModal";

const RegistSellNft: React.FC = () => {
  const [productData, setProductData] = useState<{
    title: string;
    content: string;
    image: File | null;
    signature: string;
    price: string;
  }>({
    title: "",
    content: "",
    image: null,
    signature: "",
    price: "0",
  });
  const [modalOpen, setModalOpen] = useState(false);
  // const [userWalletAddress, setUserWalletAddress] = useState<string>("");

  // useEffect(() => {
  //   const fetchUserWalletAddress = async () => {
  //     if (window.ethereum) {
  //       await window.ethereum.enable();
  //       const provider = new ethers.providers.Web3Provider(window.ethereum);
  //       const signer = provider.getSigner();
  //       const address = await signer.getAddress();
  //       setUserWalletAddress(address);
  //     } else {
  //       console.error("MetaMask 또는 유사한 지갑이 설치되어 있지 않습니다.");
  //     }
  //   };

  //   fetchUserWalletAddress();
  // }, []);

  const openWriteModal = () => {
    if (
      !productData.title ||
      !productData.content ||
      !productData.image ||
      !productData.price ||
      isNaN(Number(productData.price)) ||
      Number(productData.price) <= 0
    ) {
      alert("모든 입력 필드를 채워주세요.");
      return;
    }
    setModalOpen(true);
  };

  const handleRegistration = async () => {
    try {
      setModalOpen(false);
    } catch (error) {
      console.error("Error registering product:", error);
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-center w-[500px] mx-[auto] mt-6">
        <RegistrationNFT onChange={setProductData} />
        <div className="flex flex-row mx-[auto] p-4 gap-x-1.5">
          <Button variant="iconTextBtn" size="mdl" label="취소" />
          <Button
            variant="sendBtn1"
            size="mdl"
            label="저장"
            onClick={openWriteModal}
          />
          {modalOpen && (
            <WriteModal
              onClose={() => setModalOpen(false)}
              title={productData.title}
              content={productData.content}
              file={productData.image as File}
              signature={productData.signature}
              price={productData.price}
              onSubmit={handleRegistration}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistSellNft;
