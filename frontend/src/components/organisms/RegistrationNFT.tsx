import React from "react";
import NftNameInput from "../molecules/NftNameInput";
import CoinInput from "../molecules/CoinInput";

const RegistrationNFT: React.FC = () => {
  return (
    <div
      className={`w-full h-[100vh] mx-auto my-auto mt-10 ${
        "mobileTab" ? "flex flex-col" : "flex flex-row justify-around"
      }`}
    >
      <div className="border w-full h-[200px] py-[70px]">
        <p className=" w-[50px] mx-[auto]">NFT</p>
      </div>
      <div>
        <div>
          <NftNameInput />
        </div>
        <div>
          <p>Meta</p>
          <CoinInput />
        </div>
        <div>
          <p>내용</p>
          <textarea className="border w-full h-[200px] resize-none focus:outline-none focus:border-sky-300"></textarea>
        </div>
      </div>
    </div>
  );
};

export default RegistrationNFT;
