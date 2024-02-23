import React, { useState } from "react";
import NftNameInput from "../molecules/NftNameInput";
import CoinInput from "../molecules/CoinInput";
import SignatureInput from "../molecules/SignatureInput";

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = () => {
    onChange({ title, content, image: image || "", price, signature });
  };
  return (
    <div
      className={`w-full  mx-auto my-auto mt-10 ${
        "mobileTab" ? "flex flex-col" : "flex flex-row justify-around"
      }`}
    >
      <div className="border w-full h-[200px] py-[70px]">
        {image ? (
          <img
            src={image}
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
