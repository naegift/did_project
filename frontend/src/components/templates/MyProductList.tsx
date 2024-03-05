import React, { useState } from "react";
import Button from "../atoms/button";
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";
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
  const [pageSize, setPageSize] = useState<Number>(10);
  const [order, setOrder] = useState<string>("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);

  const changePage = async (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const orderChange = (selected: string) => {
    setOrder(selected);
  };
  return (
    <>
      <div>
        <div>
          <label>
            <div className="w-5/6 flex flex-row py-5 gap-5 px-20 mx-auto items-center">
              <Button
                variant="basicBtn2"
                size="md"
                label="최신순"
                onClick={() => orderChange("desc")}
              />
              <Button
                variant="basicBtn2"
                size="md"
                label="과거순"
                onClick={() => orderChange("asc")}
              />
            </div>
          </label>
        </div>

        {products.map((product) => {
          return (
            <div
              className="flex flex-col mx-[auto] w-[80%] h-full "
              key={product.id}
            >
              <Link to={`/product/${product.id}`}>
                <div className="flex flex-row justify-around border rounded-md mt-[20px]  hover:scale-90 transition duration-700">
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
                    <p className="truncate">{product.price} WEI</p>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
        <div className="w-5/6 flex flex-row py-2 gap-5 px-20 justify-center items-center">
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={5}
            totalItemsCount={totalPage * 5}
            pageRangeDisplayed={5}
            prevPageText={"‹"}
            nextPageText={"›"}
            onChange={(pageNumber) => changePage(pageNumber)}
            innerClass="flex flex-row py-5 justify-center items-center gap-2"
            itemClass="inline-block w-10 h-10 border border-gray-300 flex justify-center items-center rounded-3xl hover:bg-[#ff4400] hover:text-white "
            activeClass="text-black hover:bg-[#ff4400] hover:text-white"
          />
        </div>
      </div>
    </>
  );
};

export default MyProductList;
