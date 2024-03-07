import React, { useState } from "react";
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
  const [modalOpen, setModalOpen] = useState(false);

  const handleMouseEnter = () => {
    setModalOpen(true);
  };

  const handleMouseLeave = () => {
    setModalOpen(false);
  };
  return (
    <>
      <div>
        {products.map((product) => {
          const priceETH = formatEther(product.price);
          return (
            <div className="flex flex-col mx-[auto]  h-full " key={product.id}>
              <Link to={`/product/${product.id}`}>
                <div className="flex flex-row justify-around border rounded-md mt-[20px] h-full ">
                  <div className="p-[20px] flex flex-row">
                    <span className="">No.{product.id}</span>
                  </div>
                  <div
                    className="hover:scale-90 transition duration-700 "
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {modalOpen && (
                      <div className="absolute top-0 left-0 w-[200px] y-[200px] flex justify-start bg-opacity-50 ">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="object-contain mr-[30%]"
                        />
                      </div>
                    )}
                    <img
                      src={product.image}
                      alt={product.title}
                      className=" h-[70px] cursor-pointer"
                    />
                  </div>

                  <div>
                    <h3 className="truncate">{product.title}</h3>
                  </div>
                  <div>
                    <p>{priceETH} ETH</p>
                    <p className="truncate opacity-[50%] transition-transform hover:scale-125">
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
