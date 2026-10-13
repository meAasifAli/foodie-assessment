
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";

import CartItem from "../../components/cart/CartItem";
import OrderSummary from "../../components/cart/OrderSummary";
import Button from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import EmptyState from "../../components/ui/empty-state";
import { buttonClasses } from "../../components/ui/styles";
import useCart from "../../hooks/useCart";
import PageHeader from "../../components/layout/PageHeader";

export default function CartPage() {
    const { items, itemCount, subtotalPaise, isEmpty, increment, decrement, removeItem, clear } = useCart();
    const [confirmingClear, setConfirmingClear] = useState(false);

    if (isEmpty) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
                <EmptyState
                    icon={ShoppingBag}
                    title="Your cart is empty"
                    description="Looks like you haven't added anything yet. Browse the menu and pick something delicious."
                    action={
                        <Link to={{ pathname: "/", hash: "#menu" }} className={buttonClasses()}>
                            Browse the menu
                        </Link>
                    }
                />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <PageHeader
                eyebrow="Your cart"
                title="Review your order"
                description={`${itemCount} ${itemCount === 1 ? "item" : "items"} ready for checkout.`}
            />

            <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_380px]">
                <Card as="section" aria-labelledby="cart-items-title" className="p-5 sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                        <h2 id="cart-items-title" className="text-lg font-bold">
                            Items
                        </h2>

                        {confirmingClear ? (
                            <div role="group" aria-label="Confirm clearing the cart" className="flex items-center gap-2">
                                <span className="text-sm font-medium text-muted">Remove all items?</span>
                                <Button size="sm" variant="ghost" onClick={() => setConfirmingClear(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => {
                                        clear();
                                        setConfirmingClear(false);
                                    }}
                                >
                                    Yes, clear
                                </Button>
                            </div>
                        ) : (
                            <Button size="sm" variant="ghost-danger" onClick={() => setConfirmingClear(true)}>
                                Clear cart
                            </Button>
                        )}
                    </div>

                    <ul className="divide-y divide-border pt-5">
                        {items.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onIncrement={() => increment(item.id)}
                                onDecrement={() => decrement(item.id)}
                                onRemove={() => removeItem(item.id)}
                            />
                        ))}
                    </ul>
                </Card>

                <OrderSummary
                    itemCount={itemCount}
                    subtotalPaise={subtotalPaise}
                    totalLabel="Estimated total"
                    note="Final prices are confirmed by the restaurant when you place your order."
                    className="lg:sticky lg:top-24"
                >
                    <Link to="/checkout" className={buttonClasses({ size: "lg", className: "w-full" })}>
                        Proceed to checkout
                        <ArrowRight size={18} aria-hidden="true" />
                    </Link>
                    <Link to={{ pathname: "/", hash: "#menu" }} className={buttonClasses({ variant: "ghost", className: "w-full" })}>
                        <ArrowLeft size={16} aria-hidden="true" />
                        Continue shopping
                    </Link>
                </OrderSummary>
            </div>
        </div>
    );
}
