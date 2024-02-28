import axios from "axios";
import React, { useEffect, useState } from "react";
import GiftList from "../components/templates/GiftList";

export interface Product {
  id: number;
  title: string;
  image: string;
  state: string;
  updatedAt: string;
  buyer: string;
  receiver: string;
}

const Gift: React.FC = () => {
  const [receiveProduct, setReceiveProduct] = useState<Product[]>([]);
  const [payProduct, setPayProduct] = useState<Product[]>([]);
  const [receivePage, setReceivePage] = useState<number>(1);
  const [payPage, setPayPage] = useState<number>(1);

  const address = "0x925378ab635C0e103ddAf62f8B03a088bbEF5544";

  useEffect((): void => {
    // recoil되면 address 수정하기
    const recevieGiftData = async () => {
      try {
        const response = await axios.get(
          `https://naegift.subin.kr/gift?receiver=${address}&page=1&order=desc`
        );
        console.log(response.data.totalPages);
        console.log(response.data.gifts);
        setReceiveProduct(response.data.gifts);
        setReceivePage(response.data.totalPages);
      } catch (error) {
        console.log(error);
      }
    };
    const payGiftData = async () => {
      try {
        const response = await axios.get(
          `https://naegift.subin.kr/gift?buyer=${address}&page=1&order=desc`
        );
        console.log(response.data.gifts);
        setPayProduct(response.data.gifts);
      } catch (error) {
        console.log(error);
      }
    };
    recevieGiftData();
    payGiftData();
  }, []);
  return (
    <>
      <div className="">
        <GiftList
          payProducts={payProduct}
          receiveProducts={receiveProduct}
          receivePage={receivePage}
          payPage={payPage}
        />
      </div>
    </>
  );
};

export default Gift;
