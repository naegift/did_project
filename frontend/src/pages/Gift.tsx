import axios from "axios";
import React, { useEffect, useState } from "react";
import GiftList from "../components/templates/GiftList";
import { useRecoilValue } from "recoil";
import { walletState } from "../recoil/walletState";

export interface Product {
  id: number;
  title: string;
  content: string;
  price: string;
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
  const protocol = window.location.href.split("//")[0] + "//";
  const recevieGiftData = async (_walletAddress: string, page: number) => {
    try {
      const url = `${process.env.REACT_APP_API}/gift?receiver=${_walletAddress}&page=${page}&order=${receiveOrder}`;
      const response = await axios.get(url);
      // console.log(`response from ${url}`, response);
      // console.log(response.data.gifts);
      setReceiveProduct(response.data.gifts);
      setReceiveTotalPage(response.data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  const payGiftData = async (_walletAddress: string, page: number) => {
    try {
      const url = `${process.env.REACT_APP_API}/gift?buyer=${_walletAddress}&page=${page}&order=${payOrder}`;
      const response = await axios.get(url);
      // console.log(`response from ${url}`, response);
      // console.log(response.data.gifts);
      setPayProduct(response.data.gifts);
      setPayTotalPage(response.data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect((): void => {
    recevieGiftData(walletAddress, receivePage);
    payGiftData(walletAddress, payPage);
  }, [receivePage, payPage, receiveOrder, payOrder, walletAddress]);

  const receivePageChange = (pageNumber: number) => {
    setReceivePage(pageNumber);
  };

  const payPageChange = (pageNumber: number) => {
    setPayPage(pageNumber);
  };

  const receiveOrderChange = (selected: string) => {
    setReceiveOrder(selected);
  };

  const payOrderChange = (selected: string) => {
    setPayOrder(selected);
  };

  return (
    <div className="mt-[97px]">
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
    </div>
  );
};

export default Gift;
