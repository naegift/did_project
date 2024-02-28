import React from "react";
import { Product } from "../../pages/Gift";

interface GiftListData {
  payItem: Product;
}
const PayBox: React.FC<GiftListData> = ({ payItem }) => {
  return (
    <>
      <div className="shadow-xl bg-slate-200 rounded-xl p-7 flex flex-col gap-1">
        <p className="text-lg font-extrabold">{payItem.title}</p>
        <p>선물 보낸 날짜 : {payItem.updatedAt}</p>
        <p>상태 : {payItem.state !== "active" ? "사용 완료" : "사용전"}</p>
        <p>To : {payItem.receiver}</p>
      </div>
    </>
  );
};

export default PayBox;
