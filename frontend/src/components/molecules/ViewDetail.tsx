import React from "react";
import { cn } from "../../utils/cn";

const ViewDetail: React.FC = () => {
  return (
    <div
      className={cn(
        "w-2/3 py-10 mx-auto px-48 flex flex-row gap-14 border-t border-b bg-slate-50",
        "note:px-10 note:w-3/4",
        "tablet:px-10 tablet:w-full",
        "mobile:w-full mobile:flex mobile:flex-col mobile:gap-4"
      )}
    >
      <div className=" mobile:font-bold">Instructions</div>
      <ul className=" flex flex-col gap-1 list-disc mobile:gap-3 mobile:text-sm">
        <li>
          Please enter the address of the account to receive the gift
          accurately, then proceed with the payment.
        </li>
        <li>
          When proceeding with payment, it may take time depending on the
          network environment.
        </li>
        <li>The gift you sent can be checked in the gift box.</li>
        <li>
          This product is an example image and may differ from the actual
          product.
        </li>
        <li>
          For dispatched products, the validity period cannot be extended, and
          they are not eligible for a refund.
        </li>
        <li>
          As a telecommunication sales intermediary, we are not the party to the
          transaction, so we are not responsible for the product information
          registered by the seller or the transaction itself.
        </li>
      </ul>
    </div>
  );
};

export default ViewDetail;
