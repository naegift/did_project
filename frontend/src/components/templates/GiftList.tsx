import React from "react";
import Pagination from "react-js-pagination";

import { Product } from "../../pages/Gift";
import PayBox from "../molecules/PayBox";
import ReceiveBox from "../molecules/ReceiveBox";
import "../../index.css";

interface GiftData {
  payProducts: Product[];
  receiveProducts: Product[];
  receiveTotalPage: number;
  payTotalPage: number;
  payPage: number;
  receivePage: number;
  onReceivePageChange: (pageNumber: number) => void;
  onPayPageChange: (pageNumber: number) => void;
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
}) => {
  const receivePageChange = (pageNumber: number) => {
    onReceivePageChange(pageNumber);
  };

  const payPageChange = (pageNumber: number) => {
    onPayPageChange(pageNumber);
  };

  return (
    <div className="w-full px-20 flex flex-row py-5 gap-8">
      <div className="w-1/2">
        <div className=" bg-slate-50 rounded-md p-3 shadow-md h-[620px] ">
          <div className="">
            <h2 className="text-xl">보낸 선물 내역</h2>
          </div>
          <div className="flex flex-col gap-5 py-3">
            {payProducts && payProducts.length > 0 ? (
              payProducts.map((payItem, payIndex) => (
                <PayBox key={payIndex} payItem={payItem} />
              ))
            ) : (
              <p>{payProducts.length === 0 ? "보낸 선물이 없습니다." : ""}</p>
            )}
          </div>
        </div>
        <div>
          <Pagination
            activePage={payPage}
            itemsCountPerPage={3}
            totalItemsCount={payTotalPage * 3}
            pageRangeDisplayed={5}
            prevPageText={"‹"}
            nextPageText={"›"}
            onChange={(pageNumber) => payPageChange(pageNumber)}
            innerClass="flex flex-row py-5 justify-center items-center gap-2"
            itemClass="inline-block w-10 h-10 border border-gray-300 flex justify-center items-center rounded-3xl hover:bg-[#ff4400] hover:text-white"
            activeClass="text-black hover:bg-[#ff4400] hover:text-white "
          />
        </div>
      </div>
      <div className="w-1/2 ">
        <div className=" bg-slate-50 rounded-md p-3 shadow-md h-[620px] ">
          <div className="">
            <h2 className="text-xl">받은 선물 내역</h2>
          </div>
          <div className="flex flex-col gap-5 py-3">
            {receiveProducts && receiveProducts.length > 0 ? (
              receiveProducts.map((recevieItem, receveIndex) => (
                <ReceiveBox key={receveIndex} recevieItem={recevieItem} />
              ))
            ) : (
              <p>
                {receiveProducts.length === 0 ? "받은 선물이 없습니다." : ""}
              </p>
            )}
          </div>
        </div>
        <div>
          <Pagination
            activePage={receivePage}
            itemsCountPerPage={3}
            totalItemsCount={receiveTotalPage * 3}
            pageRangeDisplayed={5}
            prevPageText={"‹"}
            nextPageText={"›"}
            onChange={(pageNumber) => receivePageChange(pageNumber)}
            innerClass="flex flex-row py-5 justify-center items-center gap-2"
            itemClass="inline-block w-10 h-10 border border-gray-300 flex justify-center items-center rounded-3xl hover:bg-[#ff4400] hover:text-white"
            activeClass="text-black hover:bg-[#ff4400] hover:text-white "
          />
        </div>
      </div>
    </div>
  );
};

export default GiftList;
