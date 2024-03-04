import React from "react";
import Pagination from "react-js-pagination";

import { Product } from "../../pages/Gift";
import PayBox from "../molecules/PayBox";
import ReceiveBox from "../molecules/ReceiveBox";
import Button from "../atoms/button";

interface GiftData {
  payProducts: Product[];
  receiveProducts: Product[];
  receiveTotalPage: number;
  payTotalPage: number;
  payPage: number;
  receivePage: number;
  onReceivePageChange: (pageNumber: number) => void;
  onPayPageChange: (pageNumber: number) => void;
  onReceiveOrderChange: (selected: string) => void;
  onPayOrderChange: (selected: string) => void;
}

const GiftList: React.FC<GiftData> = ({
  payProducts,
  receiveProducts,
  receiveTotalPage,
  payTotalPage,
  payPage,
  receivePage,
  onReceivePageChange,
  onPayPageChange,
  onReceiveOrderChange,
  onPayOrderChange,
}) => {
  const receivePageChange = (pageNumber: number) => {
    onReceivePageChange(pageNumber);
  };

  const payPageChange = (pageNumber: number) => {
    onPayPageChange(pageNumber);
  };

  const receiveOrderChange = (selected: string) => {
    onReceiveOrderChange(selected);
  };
  const payOrderChange = (selected: string) => {
    onPayOrderChange(selected);
  };

  return (
    <div className="w-full px-20 flex flex-row py-8 gap-8">
      <div className="w-1/2 px-8">
        <div className=" bg-slate-50 rounded-md p-5 shadow-md h-[660px] ">
          <div className="flex justify-between items-center">
            <h2 className="text-xl">🎁보낸 선물 내역</h2>
            <div className="flex flex-row gap-5">
              <Button
                variant="basicBtn2"
                size="md"
                label="최신순"
                onClick={() => payOrderChange("desc")}
              />
              <Button
                variant="basicBtn2"
                size="md"
                label="과거순"
                onClick={() => payOrderChange("asc")}
              />
            </div>
          </div>
          <div className="flex flex-col gap-5 py-5">
            {payProducts && payProducts.length > 0 ? (
              payProducts.map((payItem, payIndex) => (
                <PayBox key={payIndex} payItem={payItem} />
              ))
            ) : (
              <p>{payProducts.length === 0 ? "보낸 선물이 없습니다." : ""}</p>
            )}
          </div>
        </div>
        <Pagination
          activePage={payPage}
          itemsCountPerPage={3}
          totalItemsCount={payTotalPage * 3}
          pageRangeDisplayed={5}
          prevPageText={"‹"}
          nextPageText={"›"}
          onChange={(pageNumber) => payPageChange(pageNumber)}
          innerClass="flex flex-row py-5 justify-center items-center gap-2"
          itemClass="inline-block w-10 h-10 border border-gray-300 flex justify-center items-center rounded-3xl hover:bg-[#ff4400] hover:text-white hover:border-none"
          activeClass="pagination-active text-black"
        />
      </div>
      <div className="w-1/2 px-8 he">
        <div className=" bg-slate-50 rounded-md p-5 shadow-md h-[660px] ">
          <div className="flex justify-between items-center ">
            <h2 className="text-xl">🎁받은 선물 내역</h2>
            <div className="flex flex-row gap-5">
              <Button
                variant="basicBtn2"
                size="md"
                label="최신순"
                onClick={() => receiveOrderChange("desc")}
              />
              <Button
                variant="basicBtn2"
                size="md"
                label="과거순"
                onClick={() => receiveOrderChange("asc")}
              />
            </div>
          </div>
          <div className="flex flex-col gap-5 py-5">
            {receiveProducts && receiveProducts.length > 0 ? (
              receiveProducts.map((receivedItem, receveIndex) => (
                <ReceiveBox key={receveIndex} receivedItem={receivedItem} />
              ))
            ) : (
              <p>
                {receiveProducts.length === 0 ? "받은 선물이 없습니다." : ""}
              </p>
            )}
          </div>
        </div>
        <Pagination
          activePage={receivePage}
          itemsCountPerPage={3}
          totalItemsCount={receiveTotalPage * 3}
          pageRangeDisplayed={5}
          prevPageText={"‹"}
          nextPageText={"›"}
          onChange={(pageNumber) => receivePageChange(pageNumber)}
          innerClass="flex flex-row py-5 justify-center items-center gap-2"
          itemClass="inline-block w-10 h-10 border border-gray-300 flex justify-center items-center rounded-3xl hover:bg-[#ff4400] hover:text-white hover:border-none"
          activeClass="pagination-active text-black"
        />
      </div>
    </div>
  );
};

export default GiftList;
