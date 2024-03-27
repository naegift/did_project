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
    <div className="w-full  mobile:w-[400px]">
      <table className="w-full ">
        <tr className="border-b-4 flex flex-row p-[20px] justify-between">
          <th className="text-center w-[30%]">Items</th>
          <th className="text-center w-[10%] ">Seller</th>
          <th className="text-center w-[10%]">Buyer</th>
          <th className="text-center w-[20%]">Recipient</th>
          <th className="text-center w-[10%]">State</th>
          <th className="text-center w-[20%]">Date</th>
        </tr>
        {gifts.map((gift) => (
          <tr
            className=" flex flex-row p-[20px] mt-2 justify-between border-b-[3px]"
            key={gift.id}
          >
            <td className="flex flex-row gap-x-2 text-center w-[30%]">
              <img src={gift.image} alt={gift.title} />
              <p>{gift.title}</p>
            </td>

            <td className="text-center w-[10%] overflow-hidden text-ellipsis whitespace-nowrap">
              {gift.seller}
            </td>
            <td className="text-center w-[15%] overflow-hidden text-ellipsis whitespace-nowrap ">
              {gift.buyer}
            </td>
            <td className="text-center w-[15%] overflow-hidden text-ellipsis whitespace-nowrap ">
              {gift.receiver}
            </td>

            <td className="text-center w-[10%]"> {gift.state}</td>
            <td className="text-center w-[20%]">{gift.updatedAt}</td>
          </tr>
        ))}
      </table>
      {/* {gifts.map((gift) => (
        <div >
          <h3>{gift.title}</h3>
          <p>{gift.content}</p>
          <img src="" alt={gift.title} />
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
