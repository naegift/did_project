import React from "react";
import Inputs, { InputProps } from "../atoms/inputs";
import { iconsTag1 } from "../../images/Icon";

interface NftNameInputProps {
  onChange: (value: string) => void;
}

const NftNameInput: React.FC<NftNameInputProps> = ({ onChange }) => {
  const inputProps: InputProps = {
    variant: "default",
    size: "xlg",
    placeholder: "Product Name",
    onChange: (e) => {
      onChange(e.target.value);
    },
  };
  return (
    <div style={{ position: "relative" }}>
      <Inputs
        {...inputProps}
        style={{
          backgroundImage: `url(${iconsTag1})`,
          backgroundPosition: "10px center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "7%",
        }}
      />
    </div>
  );
};

export default NftNameInput;
