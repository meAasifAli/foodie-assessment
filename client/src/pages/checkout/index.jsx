
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, ShoppingBag } from "lucide-react";

import OrderSummary from "../../components/cart/OrderSummary";
import CheckoutForm from "../../components/checkout/CheckoutForm";
import PageHeader from "../../components/layout/PageHeader";
import Alert from "../../components/ui/alert";
import Button from "../../components/ui/button";
import EmptyState from "../../components/ui/empty-state";
import { buttonClasses } from "../../components/ui/styles";
import useCart from "../../hooks/useCart";
import useCheckout from "../../hooks/useCheckout";

const FORM_ID = "checkout-form";

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { items, itemCount, subtotalPaise, isEmpty, clear } = useCart();
    const { submit, isSubmitting, error } = useCheckout();

    const handleSubmit = async (details) => {
        const order = await submit(details, items);
        if (!order) return;

        // Only clear the cart once the backend has confirmed the order.
        navigate(`/orders/${order.id}`, { replace: true, state: { justPlaced: true } });
        clear();
    };

    if (isEmpty) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
                <EmptyState
                    icon={ShoppingBag}
                    title="Nothing to check out yet"
                    description="Your cart is empty. Add a few dishes from the menu to place an order."
                    action={
                        <Link to={{ pathname: "/", hash: "#menu" }} className={buttonClasses()}>
                            Browse the menu
                        </Link>
                    }
                />
            </div>
        );
    }

    const lines = items.map((item) => ({
        key: item.id,
        name: item.name,
        quantity: item.quantity,
        totalPaise: item.pricePaise * item.quantity,
    }));

    return (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <Link
                to="/cart"
                className="inline-flex items-center gap-1.5 rounded text-sm font-semibold text-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
                <ArrowLeft size={16} aria-hidden="true" />
                Back to cart
            </Link>

            <div className="mt-4">
                <PageHeader
                    eyebrow="Checkout"
                    title="Almost there"
                    description="Tell us where to bring your food. Checkout takes less than a minute."
                />
            </div>

            <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_400px]">
                <div className="space-y-6">
                    {error && (
                        <Alert variant="danger" title="We couldn't place your order">
                            {error}
                            {" "}
                            <Link to="/cart" className="font-semibold text-primary underline-offset-4 hover:underline">
                                Review cart
                            </Link>
                        </Alert>
                    )}

                    <CheckoutForm formId={FORM_ID} onSubmit={handleSubmit} disabled={isSubmitting} />
                </div>

                <OrderSummary
                    title="Your order"
                    lines={lines}
                    itemCount={itemCount}
                    subtotalPaise={subtotalPaise}
                    totalLabel="To pay"
                    note="Prices and the final total are confirmed by the restaurant when your order is placed."
                    className="lg:sticky lg:top-24"
                >
                    <Button
                        type="submit"
                        form={FORM_ID}
                        size="lg"
                        className="w-full"
                        loading={isSubmitting}
                    >
                        {isSubmitting ? "Placing order…" : "Place order"}
                    </Button>
                    <p className="flex items-center justify-center gap-1.5 text-xs text-muted">
                        <Lock size={13} aria-hidden="true" />
                        Guest checkout — no account required
                    </p>
                </OrderSummary>
            </div>
        </div>
    );
}
