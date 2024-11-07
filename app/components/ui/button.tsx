import * as React from "react"
import { ButtonLoader } from "../Loader/ComponentLoader";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    btnIcon?: React.ReactElement;
    minBtn?: boolean;
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, type, btnIcon, isLoading, minBtn, ...props }, ref) => {
        return (
            <button
                type={type} 
                className={`bg-white relative overflow-hidden text-black font-medium ${minBtn ? "py-2 px-4 text-xs" : "py-3 px-6 text-base"} ${props.disabled ? "opacity-50" : "opacity-100"} rounded-xl w-full hover:bg-primary-foreground hover:text:bg-primary ${className}`}
                ref={ref}
                {...props}
            >
                {btnIcon && <span>{btnIcon}</span>}
                {isLoading && <ButtonLoader />}
                {props.children}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;
