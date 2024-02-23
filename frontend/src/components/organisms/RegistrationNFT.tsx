import React, { useState, useEffect } from "react";
import NftNameInput from "../molecules/NftNameInput";
import CoinInput from "../molecules/CoinInput";
import SignatureInput from "../molecules/SignatureInput";
import axios from "axios";
// import { ethers } from "ethers";

interface RegistrationNFTProps {
  onChange: (data: {
    title: string;
    content: string;
    image: string;
    price: string;
    signature: string;
  }) => void;
}

const RegistrationNFT: React.FC<RegistrationNFTProps> = ({ onChange }) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [price, setPrice] = useState<string>("0");
  const [signature, setSignature] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  // useEffect(() => {
  //   runEthers();
  // }, []);

  // const runEthers = async () => {
  //   try {
  //     // Frontend
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const wallets = await window.ethereum.request({
  //       method: "eth_requestAccounts",
  //     });
  //     const address = wallets[0];

  //     const message = {
  //       title,
  //       content,
  //       image: imageUrl || "http://example.com",
  //       price,
  //     };

  //     const signer = provider.getSigner(address);
  //     const signature = await signer.signMessage(JSON.stringify(message));

  //     setSignature(signature);

  //     onChange({ title, content, image: imageUrl || "", price, signature });
  //   } catch (error) {
  //     console.error("Error signing message:", error);
  //   }
  // };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setImageUrl(reader.result as string);
        await uploadImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = () => {
    onChange({ title, content, image: image || "", price, signature });
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(
        "https://naegift.subin.kr/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setImage(response.data.link);
    } catch (error) {
      console.error("Image Error uploading ", error);
    }
  };

  return (
    <div
      className={`w-full mx-auto my-auto mt-10 ${
        "mobileTab" ? "flex flex-col" : "flex flex-row justify-around"
      }`}
    >
      <div className="border w-full h-[200px] py-[70px]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="NFT"
            className="w-[100px] h-[100px] object-cover mx-auto"
          />
        ) : (
          <p className="w-[50px] mx-[auto]">Product</p>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer mx-[auto] border"
        >
          Choose Product
        </label>
      </div>
      <div className="my-[10px]">
        <p>Title</p>
        <div>
          <NftNameInput
            onChange={(value) => {
              setTitle(value);
              handleInputChange();
            }}
          />
        </div>
        <div>
          <p>Signature</p>
          <SignatureInput
            onChange={(value) => {
              setSignature(value);
              handleInputChange();
            }}
          />
        </div>
        <div>
          <p>Meta</p>
          <CoinInput
            onChange={(value) => {
              setPrice(value);
              handleInputChange();
            }}
          />
        </div>
        <div>
          <p>내용</p>
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              handleInputChange();
            }}
            className="border w-full h-[200px] resize-none focus:outline-none focus:border-sky-300"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default RegistrationNFT;
