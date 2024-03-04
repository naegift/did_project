import React, { useState } from "react";
import Button from "../atoms/button";
import axios from "axios";
import { runEthers } from "../../utils/ethers";
import Loading from "../organisms/Loading";
import { ethers } from "ethers";

interface ModalProps {
  onClose: () => void;
  title: string;
  content: string;
  file: File;
  signature: string;
  price: string;
  // userWalletAddress: string;
  onSubmit: () => Promise<void>;
}

const WriteModal: React.FC<ModalProps> = ({
  onClose,
  title,
  content,
  file,
  signature,
  price,
  // userWalletAddress,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleRegistration = async () => {
    onClose();
    setIsLoading(true);
    const ethPrice = ethers.utils.parseUnits(price, "ether").toString();
    try {
      const { message, signature } = await runEthers(title, content, ethPrice);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("content", content);
      formData.append("price", ethPrice);
      formData.append("signature", signature);

      // formData.append("seller", userWalletAddress);

      const response = await axios.post(
        `${process.env.REACT_APP_AWS}/product`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Product registered:", response.data);

      const productId = response.data.id;
      console.log(file, title, content, price, signature);

      window.location.href = `/product/${productId}`;
    } catch (error) {
      console.error("Error registering product:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };
  return (
    <div className="fixed inset-0 bg-black opacity-80">
      {isLoading && <Loading />}
      <div className="w-full y-full flex justify-center flex-col items-center mt-[100px] gap-y-10">
        <p className="text-white">Title: {title}</p>
        <p className="text-white text-wrap">Image: {file ? file.name : ""}</p>
        <p className="text-white">Price: {price} eth</p>
        <p className="text-white text-wrap">Content: {content}</p>
      </div>
      <div className="flex flex-row  justify-center my-[50px] gap-x-5">
        <Button
          variant="iconTextBtn"
          size="mdl"
          label="뒤로"
          onClick={onClose}
        />

        <Button
          variant="sendBtn1"
          size="mdl"
          label="등록"
          onClick={handleRegistration}
        />
      </div>
    </div>
  );
};

export default WriteModal;
