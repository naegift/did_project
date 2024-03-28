import React, { useState } from "react";
import Button from "../atoms/button";
import axios from "axios";
import { runEthers } from "../../utils/ethers";
import Loading from "../organisms/Loading";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

interface ModalProps {
  onClose: () => void;
  title: string;
  content: string;
  file: File;
  signature: string;
  price: string;
  onSubmit: () => Promise<void>;
}

const WriteModal: React.FC<ModalProps> = ({
  onClose,
  title,
  content,
  file,
  price,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const protocol = window.location.href.split("//")[0] + "//";
  const navigate = useNavigate();
  const handleRegistration = async () => {
    onClose();
    setIsLoading(true);
    const ethPrice = ethers.utils.parseUnits(price, "ether").toString();
    try {
      const { signature } = await runEthers(title, content, ethPrice);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("content", content);
      formData.append("price", ethPrice);
      formData.append("signature", signature);

      const response = await axios.post(
        `${process.env.REACT_APP_API}/product`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const productId = response.data.id;
      if (response.status === 404) {
        alert("Page Not Found.");
        navigate("/");
      } else {
        navigate(`/product/${productId}`);
      }
    } catch (error) {
      console.error("Error registering product:", error);
      navigate("/");
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black opacity-80">
      {isLoading && <Loading />}
      <div className="w-full y-full flex justify-center flex-col items-center mt-[200px] gap-y-10">
        <p className="text-white">Title: {title}</p>
        <p className="text-white text-wrap">Item: {file ? file.name : ""}</p>
        <p className="text-white">Price: {price} ETH</p>
        <p className="text-white text-wrap">Content: {content}</p>
      </div>
      <div className="flex flex-row  justify-center my-[50px] gap-x-5">
        <Button variant="sendBtn2" size="mdl" label="Back" onClick={onClose} />

        <Button
          variant="sendBtn1"
          size="mdl"
          label="Register"
          onClick={handleRegistration}
        />
      </div>
    </div>
  );
};

export default WriteModal;
