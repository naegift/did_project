import React from "react";
import Inputs, { InputProps } from "../atoms/inputs";
import { iconsCoin1 } from "../../images/Icon";

const CoinInput = () => {
  const inputProps: InputProps = {
    variant: "default",
    size: "lg",
    placeholder: "시작가를 입력해주세요 ",
    // onChange: (e) => {
    //   console.log(e.target.value);
    // },
  };
  return (
    <div style={{ position: "relative" }}>
      <Inputs
        {...inputProps}
        style={{
          backgroundImage: `url(${iconsCoin1})`,
          backgroundPosition: "10px center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "8%",
        }}
      />
    </div>
  );
};

export default CoinInput;
