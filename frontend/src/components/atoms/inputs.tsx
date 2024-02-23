import React, { InputHTMLAttributes, FC } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

export const InputVariants = cva(
  `
  border rounded-xl italic focus:outline-none focus:border-sky-300 py-2 pl-9 pr-5 shadow-sm
    `,
  {
    variants: {
      variant: {
        default: "",
        error: "border-red-500",
      },
      size: {
        default: "",
        sm: "w-40 text-sm",
        md: "w-64 text-sm",
        lg: "w-80 text-base",
        xlg: "w-96 text-base",
        xxlg: "w-[30rem] text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof InputVariants> {
  placeholder?: string;
  size?: "default" | "sm" | "md" | "lg" | "xlg" | "xxlg";
}

const Inputs: FC<InputProps> = ({ variant, size, placeholder, ...props }) => {
  return (
    <input
      className={cn(InputVariants({ variant, size }))}
      placeholder={placeholder}
      {...props}
    />
  );
};

export default Inputs;
