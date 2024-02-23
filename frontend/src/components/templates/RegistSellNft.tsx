import React from "react";
import RegistrationNFT from "../organisms/RegistrationNFT";
import Button from "../atoms/button";

const RegistSellNft: React.FC = () => {
  return (
    <div>
      <div className="flex flex-col justify-center w-[500px] mx-[auto]">
        <RegistrationNFT />
        <div className="flex flex-row mx-[auto] p-4 gap-x-1.5">
          <Button variant="iconTextBtn" size="mdl" label="최소" />
          <Button variant="sendBtn1" size="mdl" label="저장" />
        </div>
      </div>
    </div>
  );
};

export default RegistSellNft;
