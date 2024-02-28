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
  const [sortOrder, setSortOrder] = useState<String>("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);

  const changePage = async (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  return (
    <>
      <div>
        <h2>My Products</h2>
        <div>
          <label>
            Page Size:
            <select
              value={pageSize.toString()}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
            </select>
          </label>
          <label>
            Sort Order:
            <select
              value={sortOrder.toString()}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>
        </div>
        {products.map((product) => {
          return (
            <Link to={`/product/${product.id}`}>
              <div className="flex flex-col mx-[auto] h-full " key={product.id}>
                <div className="flex flex-row border rounded-md mt-[20px] mx-10 gap-x-4   hover:scale-90 transition duration-700">
                  <div className="p-[20px] flex flex-row">
                    <span className="">No.{product.id}</span>
                  </div>
                  <img
                    src={product.image}
                    alt={product.title}
                    className=" h-[70px] "
                  />
                  <div className="w-full">
                    <h3>{product.title}</h3>
                    <p>Price: {product.price} WEI</p>
                    <span className="whitespace-normal overflow-hidden">
                      {product.seller}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
        <div className="w-5/6 flex flex-row py-2 gap-5 px-20 justify-center items-center">
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={5}
            // totalItemsCount={product.length * totalPage}
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
