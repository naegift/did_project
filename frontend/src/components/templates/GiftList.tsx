import React from "react";
import Pagination from "react-js-pagination";

import { Product } from "../../pages/Gift";
import PayBox from "../molecules/PayBox";
import ReceiveBox from "../molecules/ReceiveBox";
import Button from "../atoms/button";
import { cn } from "../../utils/cn";

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
    <div
      className={cn(
        "w-full px-20 flex flex-row py-8 gap-8",
        "note:px-7 note:gap-3",
        "tablet:flex-col tablet:px-10 ",
        "mobile:flex-col mobile:gap-1 mobile:py-2 mobile:px-0"
      )}
    >
      <div
        className={cn(
          "hidden",
          "tablet:flex tablet:justify-center tablet:items-center tablet:gap-3 tablet:px-3",
          "mobile:block mobile:py-3 mobile:mx-auto"
        )}
      >
        <span className="tablet:border tablet:flex-1"></span>
        <span className=" mobile:text-sm">
          "The received gift can be viewed on the desktop environment."
        </span>
        <span className="tablet:border tablet:flex-1"></span>
      </div>
      <div className="w-1/2 px-8 note:px-3 tablet:mx-auto tablet:w-full mobile:w-full">
        <div
          className={cn(
            "w-full bg-slate-50 rounded-md p-5 shadow-md h-[700px]",
            " tablet:p-7 tablet:py-0",
            "mobile:px-2 mobile:py-5"
          )}
        >
          <div
            className={cn("flex justify-between items-center ", "tablet:py-3")}
          >
            <h2 className="text-xl mobile:text-base">🎁 Gifts Sent</h2>
            <div className="flex flex-row gap-5 mobile:hidden">
              <Button
                variant="basicBtn2"
                size="md"
                label="Latest"
                onClick={() => payOrderChange("desc")}
              />
              <Button
                variant="basicBtn2"
                size="md"
                label="Past"
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
              <p className=" tablet:text-center mobile:text-center">
                {payProducts.length === 0
                  ? "You didn't send any gift. Try Gifting!"
                  : ""}
              </p>
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
      <div className="w-1/2 px-8 note:px-3 tablet:hidden mobile:hidden">
        <div
          className={cn(
            "w-full bg-slate-50 rounded-md p-5 shadow-md h-[700px]  "
          )}
        >
          <div className="flex justify-between items-center tablet:flex-col tablet:gap-5">
            <h2 className="text-xl">🎁 Gifts Received</h2>
            <div className="flex flex-row gap-5">
              <Button
                variant="basicBtn2"
                size="md"
                label="Latest"
                onClick={() => receiveOrderChange("desc")}
              />
              <Button
                variant="basicBtn2"
                size="md"
                label="Past"
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
              <p className=" tablet:text-center">
                {receiveProducts.length === 0 ? "No gifts in the inbox." : ""}
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
