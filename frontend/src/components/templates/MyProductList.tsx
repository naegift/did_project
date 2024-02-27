import React, { useState } from "react";
import Button from "../atoms/button";
import { arrowBTN } from "../../images/Icon";
import { Link } from "react-router-dom";
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

  const onPageChange = (action: "next" | "prev") => {
    if (action === "next") {
      console.log("Next page");
    } else if (action === "prev") {
      console.log("Previous page");
    }
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
        <div className=" y-full flex flex-row justify-around mt-5">
          {/* <button onClick={() => onPageChange(1)}>First</button> */}
          <Button
            variant="iconBtn"
            size="md"
            onClick={() => onPageChange("prev")}
          >
            <img src={arrowBTN} alt="" className="mr-1 w-10 rotate-180" />
          </Button>

          <span>Current Page: {currentPage}</span>
          {/* <button onClick={() => onPageChange("next")}>Next</button> */}
          <Button
            variant="iconBtn"
            size="md"
            onClick={() => onPageChange("next")}
          >
            <img src={arrowBTN} alt="" className="mr-1 w-10" />
          </Button>
          {/* <button onClick={() => onPageChange(4)}>Last</button> */}
        </div>
      </div>
    </>
  );
};

export default MyProductList;
