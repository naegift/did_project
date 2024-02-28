import axios from "axios";
import React, { useEffect, useState } from "react";
import GiftList from "../components/templates/GiftList";
import { useRecoilValue } from "recoil";
import { walletState } from "../recoil/walletState";

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
  const [receiveTotalPage, setReceiveTotalPage] = useState<number>(1);
  const [payTotalPage, setPayTotalPage] = useState<number>(1);
  const [receiveOrder, setReceiveOrder] = useState<string>("desc");
  const [payOrder, setPayOrder] = useState<string>("desc");
  const { walletAddress } = useRecoilValue(walletState);

  const recevieGiftData = async (page: number) => {
    try {
      const response = await axios.get(
        `https://naegift.subin.kr/gift?receiver=${walletAddress}&page=${page}&order=${receiveOrder}`
      );
      console.log(response.data.gifts);
      setReceiveProduct(response.data.gifts);
      setReceiveTotalPage(response.data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };
  const payGiftData = async (page: number) => {
    try {
      const response = await axios.get(
        `https://naegift.subin.kr/gift?buyer=${walletAddress}&page=${page}&order=${payOrder}`
      );
      console.log(response.data.gifts);
      setPayProduct(response.data.gifts);
      setPayTotalPage(response.data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect((): void => {
    recevieGiftData(receivePage);
    payGiftData(payPage);
  }, [receivePage, payPage, receiveOrder, payOrder]);

  const receivePageChange = (pageNumber: number) => {
    setReceivePage(pageNumber);
  };

  const payPageChange = (pageNumber: number) => {
    console.log(pageNumber);
    setPayPage(pageNumber);
  };

  const receiveOrderChange = (selected: string) => {
    setReceiveOrder(selected);
  };

  const payOrderChange = (selected: string) => {
    setPayOrder(selected);
  };

  return (
    <>
      <GiftList
        payProducts={payProduct}
        receiveProducts={receiveProduct}
        payPage={payPage}
        receivePage={receivePage}
        receiveTotalPage={receiveTotalPage}
        payTotalPage={payTotalPage}
        onReceivePageChange={receivePageChange}
        onPayPageChange={payPageChange}
        onReceiveOrderChange={receiveOrderChange}
        onPayOrderChange={payOrderChange}
      />
    </>
  );
};

export default Gift;
