
import { forwardRef } from "react";
import { buttonClasses } from "./styles";
import Spinner from "./spinner";

const Button = forwardRef(function Button(
    {
        variant = "default",
        size = "default",
        className = "",
        type = "button",
        children,
        disabled = false,
        loading = false,
        ...props
    },
    ref
) {
    return (
        <button
            ref={ref}
            type={type}
            disabled={disabled || loading}
            aria-busy={loading || undefined}
            className={buttonClasses({ variant, size, className })}
            {...props}
        >
            {loading && <Spinner size="sm" />}
            {children}
        </button>
    );
});

export default Button;
