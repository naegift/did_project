import React from "react";
import { Link } from "react-router-dom";
import { formatEther } from "@ethersproject/units";

interface Product {
  id: number;
  title: string;
  image: string;
  price: string;
  seller: string;
}

interface MyProductListProps {
  products: Product[];
  userAddress: string;
}

const MyProductList: React.FC<MyProductListProps> = ({ products }) => {
  return (
    <>
      <div>
        {products.map((product) => {
          const priceETH = formatEther(product.price);
          return (
            <div className="flex flex-col mx-[auto]  h-full " key={product.id}>
              <Link to={`/product/${product.id}`}>
                <div className="flex flex-row justify-around border rounded-md mt-[20px] h-full  hover:scale-90 transition duration-700">
                  <div className="p-[20px] flex flex-row">
                    <span className="">No.{product.id}</span>
                  </div>
                  <img
                    src={product.image}
                    alt={product.title}
                    className=" h-[70px] "
                  />
                  <div>
                    <h3 className="truncate">{product.title}</h3>
                  </div>
                  <div>
                    <p className="truncate">{priceETH} ETH</p>
                    <p className="truncate opacity-[50%]">
                      {product.price} WEI
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MyProductList;
