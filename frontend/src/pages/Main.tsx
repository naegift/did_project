import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "react-js-pagination";

import { bannerImg2 } from "../images/Banner";
import ProductList from "../components/templates/ProductList";
import Button from "../components/atoms/button";

export interface Data {
  nextPage: number;
  products: [];
  productsCount: number;
  totalPages: number;
}

export interface Product {
  id: number;
  title: string;
  image: string;
  price: number;
}

const Main: React.FC = () => {
  const [product, setProduct] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [order, setOrder] = useState<string>("desc");

  const changePage = async (pageNumber: number) => {
    setPage(pageNumber);
  };

  const mainData = async (page: number) => {
    try {
      const response = await axios.get<Data>(
        `https://naegift.subin.kr/?page=${page}&order=${order}`
      );
      console.log(response.data);
      console.log(response.data.products);
      setProduct(response.data.products);
      setTotalPage(response.data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect((): void => {
    mainData(page);
  }, [page, order]);

  const orderChange = (selected: string) => {
    setOrder(selected);
  };

  return (
    <div className="">
      <div className="w-pull">
        <img src={bannerImg2} alt="" className="w-[100%]" />
      </div>
      <div className="w-5/6 flex flex-row py-5 gap-5 px-20 mx-auto items-center">
        <span className="text-xl">전체 상품 리스트</span>
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

      <div className="w-5/6 flex flex-row py-2 gap-5 px-20 mx-auto">
        <ProductList products={product} />
      </div>
      <div className="w-5/6 flex flex-row py-2 gap-5 px-20 justify-center items-center">
        <Pagination
          activePage={page}
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
  );
};

export default Main;
