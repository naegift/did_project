import { ButtonHTMLAttributes, Children, FC } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

export const ButtonVariants = cva(
  `
  flex justify-center items-center active:scale-95 rounded-xl 
  font-bold text-slate-100 transition-all shadow-md
  hover:scale-105 duration-200
  `,
  {
    variants: {
      variant: {
        temp: "bg-slate-200 text-slate-600 ",
        temp1: "bg-[#ff4400]",
        temp2: "bg-gradient-to-r from-[#c33603] to-[#ff4400]",
        temp3: "bg-gradient-to-r from-[#ec4609] to-[#facabb]",
        temp4: "bg-gradient-to-r from-[#ec4609] to-[#fd6d38]",
        default: " shadow-none active:scale-100",
      },
      size: {
        default: "",
        sm: "w-[4.5rem] h-[2rem] text-[1rem] rounded-xl",
        md: " w-[6.5rem] h-[2.5rem] text-[1rem] rounded-2xl",
        lg: " w-[15rem] h-[3.2rem] text-[1.5rem] rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ButtonVariants> {
  label?: string;
  children?: React.ReactElement;
}

const Button: FC<ButtonProps> = ({
  variant,
  size,
  children,
  label,
  ...props
}) => {
  return (
    <button className={cn(ButtonVariants({ variant, size }))} {...props}>
      {children && children}
      {label && label}
    </button>
  );
};

export default Button;
