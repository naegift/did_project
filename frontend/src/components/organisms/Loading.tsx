import { loadingCat } from "../../images/Icon";

const Loading = () => {
  return (
    <>
      <div className="absolute w-full h-full top-0 left-0 bg-white opacity-70 z-999 flex flex-col items-center justify-center">
        <div className="text-center">Please wait a moment...</div>
        <img src={loadingCat} alt="로딩중" className="w-20" />
      </div>
    </>
  );
};

export default Loading;
