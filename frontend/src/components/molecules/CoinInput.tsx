import React, { useState } from "react";
import Inputs, { InputProps } from "../atoms/inputs";
import { iconsCoin1 } from "../../images/Icon";

interface CoinPriceInput {
  onChange: (value: string) => void;
}

const CoinInput: React.FC<CoinPriceInput> = ({ onChange }) => {
  const [value, setValue] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let numericValue = e.target.value.replace(/[^\d.]/g, "");
    const decimalCount = (numericValue.match(/\./g) || []).length;
    if (decimalCount > 1) {
      numericValue = numericValue.slice(0, -1);
    }
    setValue(numericValue);
    onChange(numericValue);
  };

  const inputProps: InputProps = {
    variant: "default",
    size: "xlg",
    placeholder: "Enter the price ex) 0.00001",
    value: value,
    onChange: handleChange,
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
