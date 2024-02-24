import React from "react";
import Button from "../atoms/button";
import axios from "axios";
import { runEthers } from "../../utils/ethers";

interface ModalProps {
  onClose: () => void;
  title: string;
  content: string;
  image: string;
  price: string;
}

const WriteModal: React.FC<ModalProps> = ({
  onClose,
  title,
  content,
  image,
  price,
}) => {
  const handleRegistration = async () => {
    onClose();
    try {
      const { message, signature } = await runEthers(
        title,
        content,
        image,
        price
      );

      const response = await axios.post("https://naegift.subin.kr/product", {
        title: message.title,
        content: message.content,
        image: message.image,
        price: message.price,
        signature: signature,
      });
      console.log("Product registered:", response.data);

      const productId = response.data.id;
      window.location.href = `/product/${productId}`;
    } catch (error) {
      console.error("Error registering product:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black opacity-80">
      <div className="w-full y-full flex justify-center flex-col items-center mt-[100px] gap-y-10">
        <p className="text-white">Title: {title}</p>
        <p className="text-white text-wrap">Image: {image}</p>
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
