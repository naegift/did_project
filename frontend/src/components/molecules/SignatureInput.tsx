import React from "react";
import Inputs, { InputProps } from "../atoms/inputs";
import { iconProfile1 } from "../../images/Icon";

interface SignatureInputProps {
  onChange: (value: string) => void;
}

const SignatureInput: React.FC<SignatureInputProps> = ({ onChange }) => {
  const inputProps: InputProps = {
    variant: "default",
    size: "xlg",
    placeholder: "Signature",
    onChange: (e) => {
      onChange(e.target.value);
    },
  };
  return (
    <div style={{ position: "relative" }}>
      <Inputs
        {...inputProps}
        style={{
          backgroundImage: `url(${iconProfile1})`,
          backgroundPosition: "10px center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "7%",
        }}
      />
    </div>
  );
};

export default SignatureInput;
