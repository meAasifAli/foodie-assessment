
import { Plus } from "lucide-react";

import useCart from "../../hooks/useCart";
import { MAX_QUANTITY } from "../../features/cart/cartSlice";
import { formatPaise } from "../../lib/money";
import Button from "../ui/button";
import Badge from "../ui/badge";
import FoodImage from "../ui/food-image";
import QuantityStepper from "../ui/quantity-stepper";
import Skeleton from "../ui/skeleton";
import { Card } from "../ui/card";

export default function MenuCard({ item }) {
    const { addItem, increment, decrement, getQuantity } = useCart();
    const quantity = getQuantity(item.id);
    const inCart = quantity > 0;

    return (
        <Card
            as="article"
            className={[
                "group flex flex-col overflow-hidden transition-all duration-300",
                "hover:-translate-y-1 hover:shadow-card-hover",
                inCart ? "ring-2 ring-primary/30" : "",
            ].join(" ")}
        >
            <div className="relative">
                <FoodImage
                    src={item.imageUrl}
                    alt={item.name}
                    className="aspect-4/3"
                    imgClassName="transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute left-3 top-3 flex gap-2">
                    {!item.isAvailable && <Badge variant="destructive">Sold out</Badge>}
                    {inCart && <Badge variant="solid">{quantity} in cart</Badge>}
                </div>
            </div>

            <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold leading-snug text-foreground">{item.name}</h3>
                    <span className="shrink-0 font-bold text-primary tabular-nums">
                        {formatPaise(item.pricePaise)}
                    </span>
                </div>

                <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-muted">
                    {item.description || "Freshly prepared and ready to enjoy."}
                </p>

                <div className="mt-auto pt-4">
                    {!item.isAvailable ? (
                        <Button className="w-full" variant="secondary" disabled>
                            Currently unavailable
                        </Button>
                    ) : inCart ? (
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-medium text-muted">In your cart</span>
                            <QuantityStepper
                                size="sm"
                                quantity={quantity}
                                max={MAX_QUANTITY}
                                itemName={item.name}
                                removeAtOne
                                onIncrement={() => increment(item.id)}
                                onDecrement={() => decrement(item.id)}
                            />
                        </div>
                    ) : (
                        <Button
                            className="w-full"
                            onClick={() => addItem(item)}
                            aria-label={`Add ${item.name} to cart`}
                        >
                            <Plus size={17} aria-hidden="true" />
                            Add to cart
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}

export function MenuCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-card border border-border bg-surface">
            <Skeleton className="aspect-4/3 w-full rounded-none" />
            <div className="space-y-3 p-4">
                <div className="flex justify-between gap-4">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-5 w-14" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-11 w-full rounded-button" />
            </div>
        </div>
    );
}
