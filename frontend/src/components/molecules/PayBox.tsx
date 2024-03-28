import React from "react";
import { Product } from "../../pages/Gift";
import DateTime from "./DateTime";
import { cn } from "../../utils/cn";

interface GiftListData {
  payItem: Product;
}
const PayBox: React.FC<GiftListData> = ({ payItem }) => {
  return (
    <>
      <div
        className={cn(
          "w-full shadow-xl bg-slate-200 rounded-xl py-9 flex flex-col gap-1 px-7",

          "tablet:py-6",
          "mobile:p-5 mobile:gap-1 "
        )}
      >
        <p className="text-lg font-extrabold mobile:text-base">
          {payItem.title}
        </p>
        <p>
          Date : <DateTime dateString={payItem.updatedAt} />
        </p>
        <p>State : {payItem.state !== "active" ? "Used" : "Not Used"}</p>
        <p className="mobile:truncate">To : {payItem.receiver}</p>
      </div>
    </>
  );
};

export default PayBox;
