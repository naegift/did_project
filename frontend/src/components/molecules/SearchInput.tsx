import React from "react";
import Inputs, { InputProps } from "../atoms/inputs";
import { inconsSearch4 } from "../../images/Icon";

const SearchInput = () => {
  const inputProps: InputProps = {
    variant: "default",
    size: "md",
    placeholder: "search...",
    // onChange: (e) => {
    //   console.log(e.target.value);
    // },
  };

  return (
    <Inputs
      {...inputProps}
      style={{
        backgroundImage: `url(${inconsSearch4})`,
        backgroundPosition: "10px center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "7%",
      }}
    />
  );
};

export default SearchInput;
