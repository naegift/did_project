import React, { useState } from "react";
import Button from "../atoms/button";
import { viewImg1 } from "../../images/Product";
import { Product } from "../../pages/View";
import Modal from "./Modal";

interface viewBoxData {
  product: Product[];
}

const ViewBox: React.FC<viewBoxData> = ({ product }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  return (
    <>
      {product.map((item, index) => (
        <div key={index} className="w-pull px-28 py-10 flex justify-around">
          <div className=" bg-fuchsia-100 ">
            <div>
              <img
                src={
                  item.image && item.image !== "http://example.com"
                    ? item.image
                    : viewImg1
                }
                alt=""
              />
            </div>
          </div>
          <div className=" w-[450px]">
            <p className="text-3xl py-5">{item.title}</p>
            <p className="text-2xl ">{item.price}</p>
            <p className="py-7">{item.content}</p>
            <Button
              onClick={openModal}
              variant="sendBtn2"
              size="lg"
              label="선물하기"
            />
            {modalOpen && <Modal onClose={() => setModalOpen(false)} />}
          </div>
        </div>
      ))}
    </>
  );
};

export default ViewBox;
