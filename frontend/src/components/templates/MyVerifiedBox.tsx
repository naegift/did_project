import React from "react";

interface Gift {
  id: number;
  title: string;
  content: string;
  image: string;
  price: string;
  seller: string;
  buyer: string;
  receiver: string;
  contract: string;
  state: string;
  updatedAt: string;
}

interface MyVerifiedBoxProps {
  gifts: Gift[];
}

const MyVerifiedBox: React.FC<MyVerifiedBoxProps> = ({ gifts }) => {
  return (
    <div className="w-full h-[100vh]">
      <table className="w-full ">
        <tr className="border-b-4 flex flex-row p-[20px] justify-between">
          <td className="text-center w-[20%]">아이템</td>
          <td className="text-center w-[20%]">판매자</td>
          <td className="text-center w-[20%]">구매자</td>
          <td className="text-center w-[20%]">수령인</td>
          <td className="text-center w-[10%]">상태</td>
          <td className="text-center w-[10%]">날짜</td>
        </tr>

        {gifts.map((gift) => (
          <tr
            className=" flex flex-row p-[20px] mt-2 justify-between"
            key={gift.id}
          >
            <td className="flex flex-row gap-x-2 text-center w-[20%]">
              <img src={gift.image} alt={gift.title} />
              <p>{gift.title}</p>
            </td>

            <td className="text-center w-[20%]">{gift.seller}1</td>
            <td className="text-center w-[20%]">{gift.buyer}2</td>
            <td className="text-center w-[20%]">{gift.receiver}</td>

            <td className="text-center w-[10%]"> {gift.state}</td>
            <td className="text-center w-[10%]">{gift.updatedAt}</td>
          </tr>
        ))}
      </table>
      {/* {gifts.map((gift) => (
        <div key={gift.id}>
          <h3>{gift.title}</h3>
          <p>{gift.content}</p>
          <img src={gift.image} alt={gift.title} />
          <p>Price: {gift.price}</p>
          <p>Seller: {gift.seller}</p>
          <p>Buyer: {gift.buyer}</p>
          <p>Receiver: {gift.receiver}</p>
          <p>Contract: {gift.contract}</p>
          <p>State: {gift.state}</p>
          <p>Updated At: {gift.updatedAt}</p>
        </div>
      ))} */}
    </div>
  );
};

export default MyVerifiedBox;
