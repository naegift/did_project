import React from "react";

const Loading = () => {
  return (
    <div className="absolute w-[100vw] h-[100vh] top-0 left-0 bg-#ffffffb7 z-999 flex flex-col items-center justify-center">
      <div className="text-center">잠시만 기다려주세요...</div>
    </div>
  );
};

export default Loading;
