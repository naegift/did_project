import React, { useState } from "react";
import RegistrationNFT from "../organisms/RegistrationNFT";
import Button from "../atoms/button";
import WriteModal from "../molecules/WriteModal";
import Swal from "sweetalert2";

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
  const openWriteModal = () => {
    if (
      !productData.title ||
      !productData.content ||
      !productData.image ||
      !productData.price ||
      isNaN(Number(productData.price)) ||
      Number(productData.price) <= 0
    ) {
      Swal.fire({
        icon: "error",
        title: "Please fill out all input fields.",
      });
      return;
    }
    setModalOpen(true);
  };

  const handleRegistration = async () => {
    try {
      setModalOpen(false);
    } catch (error) {
      console.error("Error registering product:", error);
      Swal.fire({
        icon: "error",
        title: "Error registering product:",
      });
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-center w-[500px] mx-[auto] mt-6">
        <RegistrationNFT onChange={setProductData} />
        <div className="flex flex-row mx-[auto] p-4 gap-x-1.5">
          <Button variant="iconTextBtn" size="mdl" label="Cancel" />
          <Button
            variant="sendBtn1"
            size="mdl"
            label="Save"
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
