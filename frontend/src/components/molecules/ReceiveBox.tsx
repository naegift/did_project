import React from "react";
import { Product } from "../../pages/Gift";
import Button from "../atoms/button";

interface GiftListData {
  recevieItem: Product;
}
const ReceiveBox: React.FC<GiftListData> = ({ recevieItem }) => {
  return (
    <>
      <div className="shadow-xl bg-slate-200 rounded-xl p-7 flex flex-row gap-10 items-center">
        <div className="flex flex-col gap-1">
          <p className="text-lg font-extrabold">{recevieItem.title}</p>
          <p>선물 받은 날짜 : {recevieItem.updatedAt}</p>
          <p>
            상태 : {recevieItem.state !== "active" ? "사용 완료" : "사용 가능"}
          </p>
          <p>From : {recevieItem.buyer}</p>
        </div>
        <div>
          <Button variant="basicBtn" size="dd" label="선물받기" />
        </div>
      </div>
    </>
  );
};

export default ReceiveBox;
