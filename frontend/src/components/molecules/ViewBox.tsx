import React, { useState } from "react";
import Button from "../atoms/button";
import { Product } from "../../pages/View";
import axios from "axios";
import Modal from "./Modal";
import { runEthers } from "../../utils/ethers";
import { formatEther } from "@ethersproject/units";
import { cn } from "../../utils/cn";
import { useNavigate } from "react-router-dom";

interface viewBoxData {
  product: Product;
  userWalletAddress: string;
}

const ViewBox: React.FC<viewBoxData> = ({ product, userWalletAddress }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [updatedData, setUpdatedData] = useState<Product>(product);
  const [isEditMode, setIsEditMode] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isInputValid, setIsInputValid] = useState(false);
  const navigate = useNavigate();
  const protocol = window.location.href.split("//")[0] + "//";

  const openModal = () => {
    if (window.innerWidth <= 1024) {
      alert("Please proceed with gifting on the desktop environment.");
    } else {
      setModalOpen(true);
    }
  };

  const handleEditProduct = async (productId: number) => {
    try {
      const formData = new FormData();
      const { signature } = await runEthers(
        updatedData.title,
        updatedData.content,
        updatedData.price
      );
      formData.append("title", updatedData.title);
      formData.append("price", updatedData.price);
      formData.append("content", updatedData.content);
      formData.append("signature", signature);
      if (imageFile) {
        formData.append("file", imageFile);
      }

      const response = await axios.put(
        `${process.env.REACT_APP_API}/product/${productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setIsEditMode(false);
      return response;
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };
  const handleDeleteProduct = async (productId: number) => {
    try {
      const { signature } = await runEthers("delete", "delete", "delete");
      if (product.seller === userWalletAddress) {
        const response = await axios.delete(
          `${process.env.REACT_APP_API}/product/${productId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "*/*",
            },
            data: {
              title: "delete",
              content: "delete",
              price: "delete",
              signature,
            },
          }
        );

        navigate("/store");
      } else {
        navigate("/");
      }
    } catch (error) {
      navigate("/");
    }
  };

  const handleEditButtonClick = () => {
    setUpdatedData({ ...product });
    setIsEditMode(true);
  };

  const handleDeleteButtonClick = () => {
    handleDeleteProduct(product.id);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "price") {
      const validNumberRegex = /^[0-9.]+$/;
      if (value === "" || validNumberRegex.test(value)) {
        setUpdatedData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else {
      setUpdatedData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
    setIsInputValid(
      !!updatedData.title && !!updatedData.price && !!updatedData.content
    );
  };

  const handleCompleteButtonClick = () => {
    if (isInputValid) {
      handleEditProduct(product.id);
    }
  };

  return (
    <div
      className={cn(
        "w-full py-14 flex justify-center gap-36 ",
        "tablet:flex-col tablet:items-center tablet:gap-10 tablet:w-full tablet:px-3",
        "mobile:flex-col mobile:gap-2 mobile:py-5 "
      )}
    >
      <div className="mobile:px-5">
        <img
          className="w-[320px] h-[300px] object-cover rounded-lg"
          src={imageFile ? URL.createObjectURL(imageFile) : updatedData.image}
          alt=""
        />
        {isEditMode && (
          <input type="file" accept="image/*" onChange={handleImageChange} />
        )}
        <div className="flex flex-row gap-10 mt-6 justify-center ">
          {product.seller === userWalletAddress && (
            <>
              {isEditMode ? (
                <Button
                  variant="basicBtn2"
                  size="mm"
                  label="complete"
                  onClick={handleCompleteButtonClick}
                  disabled={!isInputValid}
                  style={{
                    opacity: isInputValid ? 1 : 0.5,
                  }}
                />
              ) : (
                <Button
                  variant="iconBtn"
                  size="mm"
                  label="edit"
                  onClick={handleEditButtonClick}
                />
              )}
              <Button
                variant="basicBtn2"
                size="mm"
                label="delete"
                onClick={handleDeleteButtonClick}
              />
            </>
          )}
        </div>
      </div>

      <div className={cn("w-1/4 tablet:w-2/3 mobile:w-full mobile:px-5 ")}>
        {isEditMode ? (
          <div className="flex flex-col gap-y-5">
            <div>
              <p>Title</p>
              <input
                type="text"
                name="title"
                value={updatedData.title}
                onChange={handleChange}
                className="border w-full"
              />
            </div>
            <div>
              <p>WEI</p>
              <input
                type="text"
                name="price"
                value={updatedData.price}
                onChange={handleChange}
                className="border w-full"
              />
            </div>
            <div>
              <p>Content</p>
              <textarea
                name="content"
                value={updatedData.content}
                onChange={handleChange}
                className="border w-full h-[200px] resize-none"
              />
            </div>
          </div>
        ) : (
          <>
            <p className="text-3xl mobile:text-2xl">{updatedData.title}</p>
            <p className="text-2xl py-3 border-b mobile:text-xl">
              {formatEther(updatedData.price).toString()} ETH
            </p>
            <span className="inline-block py-3">Description</span>
            <p className="py-5">{updatedData.content}</p>
          </>
        )}
        {/* <p className="py-7">Seller: {updatedData.seller}</p> */}
        <div
          className={cn(
            "py-5 tablet:flex tablet:items-center tablet:justify-center",
            "mobile:flex mobile:justify-center mobile:items-center"
          )}
        >
          {isEditMode ? (
            <></>
          ) : (
            <Button
              onClick={openModal}
              variant="sendBtn2"
              size="lg"
              label="Send Gift"
            />
          )}
        </div>
      </div>
      {modalOpen && (
        <Modal product={product} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
};

export default ViewBox;
