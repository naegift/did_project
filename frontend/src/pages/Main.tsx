import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "react-js-pagination";

import { bannerImg2 } from "../images/Banner";
import ProductList from "../components/templates/ProductList";
import Button from "../components/atoms/button";
import { cn } from "../utils/cn";
import MainSlider from "../components/molecules/MainSlider";

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
  const [latestProduct, setLatestProduct] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [order, setOrder] = useState<string>("asc");

  const changePage = async (pageNumber: number) => {
    setPage(pageNumber);
  };
  const protocol = window.location.href.split("//")[0] + "//";

  const mainData = async (page: number) => {
    try {
      const response = await axios.get<Data>(
        `${process.env.REACT_APP_API}/?page=${page}&order=${order}`
      );

      setProduct(response.data.products);
      setTotalPage(response.data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  const latestData = async () => {
    try {
      const latestRes = await axios.get<Data>(
        `${process.env.REACT_APP_API}/?page=1&order=desc`
      );
      // console.log(latestRes.data.products);
      setLatestProduct(latestRes.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect((): void => {
    mainData(page);
    latestData();
  }, [page, order]);

  const orderChange = (selected: string) => {
    setOrder(selected);
  };

  return (
    <div className="mt-[97px]">
      <MainSlider />

      <div
        className={cn(
          "w-4/5 flex flex-row gap-5 py-8 px-20 mt-[50px] mx-auto items-center justify-between ",
          "note:w-full",
          "tablet:w-full tablet:px-14",
          "mobile:px-5 mobile:flex-col"
        )}
      >
        <span className="text-2xl font-extrabold">New collections!</span>
      </div>

      <div
        className={cn(
          "w-4/5 flex flex-row pb-20 pt-[10px] gap-7 px-20 mx-auto",
          "note:w-full",
          "tablet:w-full tablet:flex-wrap tablet:px-16 tablet:gap-12",
          "mobile:flex-wrap mobile:px-6"
        )}
      >
        <ProductList products={latestProduct} />
      </div>

      {/* <div
        className={cn(
          "w-4/5 flex flex-row justify-evenly mx-auto gap-20 px-20 py-10",
          "tablet:flex-col tablet:gap-5 tablet:px-10",
          "mobile:flex-col mobile:gap-5  mobile:px-0 mobile:py-2"
        )}
      >
        <img src={copy2} alt="" />
        <img src={copy1} alt="" />
      </div> */}
      <div
        className={cn(
          "w-4/5 flex flex-row py-5  px-20 mx-auto items-center justify-between ",
          "note:w-full",
          "tablet:w-full tablet:px-14",
          "mobile:px-5 mobile:flex-col"
        )}
      >
        <span className="text-2xl font-extrabold">All collections</span>
        <div className="flex flex-row gap-8">
          <Button
            variant="basicBtn2"
            size="md"
            label="Latest"
            onClick={() => orderChange("desc")}
          />
          <Button
            variant="basicBtn2"
            size="md"
            label="Past"
            onClick={() => orderChange("asc")}
          />
        </div>
      </div>

      <div
        className={cn(
          "w-4/5 flex flex-row py-4 gap-7 px-20 mx-auto ",
          "note:w-full",
          "tablet:w-full tablet:flex-wrap tablet:px-16 tablet:gap-12",
          "mobile:flex-wrap mobile:px-6"
        )}
      >
        <ProductList products={product} />
      </div>

      <div
        className={cn(
          "w-4/5 flex flex-row py-5 gap-5 mx-auto justify-center items-center",
          "mobile:w-full"
        )}
      >
        <Pagination
          activePage={page}
          itemsCountPerPage={5}
          totalItemsCount={totalPage * 5}
          pageRangeDisplayed={5}
          prevPageText={"‹"}
          nextPageText={"›"}
          onChange={(pageNumber) => changePage(pageNumber)}
          innerClass="flex flex-row py-5 justify-center items-center gap-2 mobile:gap-[5px] moblie:w-full"
          itemClass="inline-block w-10 h-10 border border-gray-300 flex justify-center items-center rounded-3xl hover:bg-[#ff4400] hover:text-white hover:border-none"
          activeClass="pagination-active text-black"
        />
      </div>

      <div className="w-full">
        <img src={bannerImg2} alt="" className="w-[100%] mobile:h-[150px]" />
      </div>
    </div>
  );
};

export default Main;
