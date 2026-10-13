
import { Minus, Plus, Trash2 } from "lucide-react";

const sizes = {
    sm: { wrapper: "h-9", button: "size-9", value: "min-w-8 text-sm", icon: 15 },
    default: { wrapper: "h-11", button: "size-11", value: "min-w-10 text-base", icon: 17 },
};

/**
 * Compact −/qty/+ control. When `removeAtOne` is set, the minus button
 * shows a trash icon at quantity 1 to make the removal explicit.
 */
export default function QuantityStepper({
    quantity,
    onIncrement,
    onDecrement,
    itemName,
    max,
    removeAtOne = false,
    size = "default",
    className = "",
}) {
    const s = sizes[size] ?? sizes.default;
    const willRemove = removeAtOne && quantity <= 1;
    const atMax = max !== undefined && quantity >= max;

    const buttonClass = [
        "flex items-center justify-center rounded-full transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        "disabled:pointer-events-none disabled:opacity-40",
        s.button,
    ].join(" ");

    return (
        <div
            role="group"
            aria-label={`Quantity of ${itemName}`}
            className={[
                "inline-flex items-center rounded-full border border-border bg-surface",
                s.wrapper,
                className,
            ].join(" ")}
        >
            <button
                type="button"
                onClick={onDecrement}
                aria-label={willRemove ? `Remove ${itemName} from cart` : `Decrease quantity of ${itemName}`}
                className={[buttonClass, willRemove ? "text-danger hover:bg-danger-light" : "text-foreground hover:bg-surface-muted"].join(" ")}
            >
                {willRemove ? <Trash2 size={s.icon} /> : <Minus size={s.icon} />}
            </button>

            <span
                aria-live="polite"
                className={["text-center font-bold tabular-nums text-foreground", s.value].join(" ")}
            >
                {quantity}
            </span>

            <button
                type="button"
                onClick={onIncrement}
                disabled={atMax}
                aria-label={`Increase quantity of ${itemName}`}
                className={[buttonClass, "text-primary hover:bg-primary-light"].join(" ")}
            >
                <Plus size={s.icon} />
            </button>
        </div>
    );
}
