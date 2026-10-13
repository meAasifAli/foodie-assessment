
import { CircleAlert } from "lucide-react";
import Label from "./label";

/**
 * Wires a label, hint and inline error to a control.
 * `children` is a render function that receives the accessibility props.
 */
export default function FormField({ id, label, hint, error, required, className = "", children }) {
    const hintId = hint ? `${id}-hint` : undefined;
    const errorId = error ? `${id}-error` : undefined;
    const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

    return (
        <div className={["flex flex-col gap-2", className].join(" ")}>
            <Label htmlFor={id} required={required}>
                {label}
            </Label>

            {children({
                id,
                "aria-invalid": error ? true : undefined,
                "aria-describedby": describedBy,
                "aria-required": required || undefined,
            })}

            {hint && !error && (
                <p id={hintId} className="text-xs text-muted">
                    {hint}
                </p>
            )}

            {error && (
                <p id={errorId} className="flex items-center gap-1.5 text-xs font-medium text-danger">
                    <CircleAlert size={14} aria-hidden="true" />
                    {error}
                </p>
            )}
        </div>
    );
}
