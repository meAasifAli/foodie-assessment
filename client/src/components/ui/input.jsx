
import { forwardRef } from "react";
import { fieldClasses } from "./styles";

const Input = forwardRef(function Input({ className = "", type = "text", ...props }, ref) {
    return (
        <input
            ref={ref}
            type={type}
            className={["flex h-11", fieldClasses, className].join(" ")}
            {...props}
        />
    );
});

export default Input;
