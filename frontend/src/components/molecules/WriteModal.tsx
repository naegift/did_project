import React from "react";
import Button from "../atoms/button";

interface ModalProps {
  onClose: () => void;
  title: string;
  content: string;
  image: string;
  price: string;
  signature: string;
}

const WriteModal: React.FC<ModalProps> = ({
  onClose,
  title,
  content,
  image,
  price,
  signature,
}) => {
  return (
    <div className="fixed inset-0 bg-black opacity-80">
      <div className="w-full y-full flex justify-center flex-col items-center mt-[100px] gap-y-10">
        <p className="text-white">Title: {title}</p>
        <p className="text-white text-wrap">Image: {image}</p>
        <p className="text-white">Price: {price} eth</p>
        <p className="text-white text-wrap">Content: {content}</p>
        <p className="text-white">Signature: {signature}</p>
      </div>
      <div className="flex flex-row  justify-center my-[50px] gap-x-5">
        <Button
          variant="iconTextBtn"
          size="mdl"
          label="뒤로"
          onClick={onClose}
        />
        <Button variant="sendBtn1" size="mdl" label="등록" />
      </div>
    </div>
  );
};

export default WriteModal;
