
import { Trash2 } from "lucide-react";

import { MAX_QUANTITY } from "../../features/cart/cartSlice";
import { formatPaise } from "../../lib/money";
import FoodImage from "../ui/food-image";
import QuantityStepper from "../ui/quantity-stepper";

export default function CartItem({ item, onIncrement, onDecrement, onRemove }) {
    const lineTotal = item.pricePaise * item.quantity;

    return (
        <li className="flex gap-4 py-5 first:pt-0 last:pb-0">
            <FoodImage
                src={item.imageUrl}
                alt={item.name}
                width={240}
                className="size-20 shrink-0 rounded-xl sm:size-24"
            />

            <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="min-w-0">
                    <h3 className="truncate font-bold text-foreground">{item.name}</h3>
                    <p className="mt-1 text-sm text-muted tabular-nums">
                        {formatPaise(item.pricePaise)} each
                    </p>
                    <button
                        type="button"
                        onClick={onRemove}
                        aria-label={`Remove ${item.name} from cart`}
                        className="mt-2 inline-flex items-center gap-1.5 rounded text-xs font-semibold text-muted transition-colors hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                        <Trash2 size={14} aria-hidden="true" />
                        Remove
                    </button>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end sm:gap-6">
                    <QuantityStepper
                        size="sm"
                        quantity={item.quantity}
                        max={MAX_QUANTITY}
                        itemName={item.name}
                        onIncrement={onIncrement}
                        onDecrement={onDecrement}
                        removeAtOne
                    />
                    <p className="min-w-20 text-right font-bold text-foreground tabular-nums">
                        {formatPaise(lineTotal)}
                    </p>
                </div>
            </div>
        </li>
    );
}
