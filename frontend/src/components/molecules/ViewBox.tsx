import React, { useState } from "react";
import Button from "../atoms/button";
import { Product } from "../../pages/View";
import axios from "axios";
import Modal from "./Modal";
import { runEthers } from "../../utils/ethers";
import { formatEther } from "@ethersproject/units";
import { ethers } from "ethers";

interface viewBoxData {
  product: Product;
  userWalletAddress: string;
}

const ViewBox: React.FC<viewBoxData> = ({ product, userWalletAddress }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [updatedData, setUpdatedData] = useState<Product>({
    ...product,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentProduct, setCurrentProduct] = useState<Product>(product);

  const openModal = () => {
    setModalOpen(true);
  };

  const handleEditProduct = async (productId: number) => {
    try {
      const formData = new FormData();
      const { message, signature } = await runEthers(
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
        `${process.env.REACT_APP_AWS}/product/${productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Product updated successfully:", response.data);

      setIsEditMode(false);

      setCurrentProduct(response.data);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_AWS}/product/${productId}`
      );

      //   console.log("Product deleted successfully:", response.data);
    } catch (error) {
      console.error("Error deleting product:", error);
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
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCompleteButtonClick = () => {
    handleEditProduct(product.id);
    setUpdatedData(currentProduct);
  };

  return (
    <>
      <div className="w-pull px-28 py-10 flex justify-around">
        <div className=" bg-white">
          <div>
            <img
              className="w-full y-full bg-white"
              src={imageFile ? URL.createObjectURL(imageFile) : product.image}
              alt=""
            />
            {isEditMode && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            )}
          </div>
        </div>
        <div className=" w-[450px]">
          {isEditMode ? (
            <div className="flex flex-col gap-y-5">
              <div>
                <p>제목</p>
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
                <p>내용</p>
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
              <p className="text-3xl py-5">{product.title}</p>
              <p className="text-2xl ">{product.price} WEI</p>
              <p className="py-7">{product.content}</p>
            </>
          )}
          <p className="py-7">Seller: {product.seller}</p>

          <Button
            onClick={openModal}
            variant="sendBtn2"
            size="lg"
            label="선물하기"
          />
          <div className="flex flex-row  gap-10 mt-6">
            {product.seller === userWalletAddress && (
              <>
                {isEditMode ? (
                  <Button
                    variant="basicBtn2"
                    size="mm"
                    label="완료"
                    onClick={handleCompleteButtonClick}
                  />
                ) : (
                  <Button
                    variant="iconBtn"
                    size="mm"
                    label="수정"
                    onClick={handleEditButtonClick}
                  />
                )}
                <Button
                  variant="basicBtn2"
                  size="mm"
                  label="삭제"
                  onClick={handleDeleteButtonClick}
                />
              </>
            )}

            {modalOpen && (
              <Modal product={product} onClose={() => setModalOpen(false)} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewBox;
