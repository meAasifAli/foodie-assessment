
import { forwardRef } from "react";
import { fieldClasses } from "./styles";

const Textarea = forwardRef(function Textarea({ className = "", rows = 3, ...props }, ref) {
    return (
        <textarea
            ref={ref}
            rows={rows}
            className={["min-h-24 resize-y leading-6", fieldClasses, className].join(" ")}
            {...props}
        />
    );
});

export default Textarea;
