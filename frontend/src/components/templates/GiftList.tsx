import React from "react";

import { Product } from "../../pages/Gift";
import PayBox from "../molecules/PayBox";
import ReceiveBox from "../molecules/ReceiveBox";

interface GiftData {
  payProducts: Product[];
  receiveProducts: Product[];
  receivePage: number;
  payPage: number;
}

const GiftList: React.FC<GiftData> = ({
  payProducts,
  receiveProducts,
  receivePage,
  payPage,
}) => {
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
          페이지네이션자리
          {payPage}
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
          페이지네이션자리
          {receivePage}
        </div>
      </div>
    </div>
  );
};

export default GiftList;
