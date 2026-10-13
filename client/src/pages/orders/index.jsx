
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReceiptText, RefreshCw, Search } from "lucide-react";

import PageHeader from "../../components/layout/PageHeader";
import OrderCard from "../../components/order/OrderCard";
import Alert from "../../components/ui/alert";
import Button from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import EmptyState from "../../components/ui/empty-state";
import FormField from "../../components/ui/form-field";
import Input from "../../components/ui/input";
import Skeleton from "../../components/ui/skeleton";
import { buttonClasses } from "../../components/ui/styles";
import useOrders from "../../hooks/useOrders";

const VALID_ID = /^[1-9]\d*$/;

export default function OrdersPage() {
    const { orders, loading, error, retry } = useOrders();

    let content;

    if (loading) {
        content = (
            <ul aria-busy="true" aria-label="Loading orders" className="space-y-4">
                {[0, 1].map((key) => (
                    <li key={key}>
                        <Skeleton className="h-32 w-full rounded-card" />
                    </li>
                ))}
            </ul>
        );
    } else if (error) {
        content = (
            <Alert
                variant="danger"
                title="We couldn't load orders"
                action={
                    <Button variant="outline" size="sm" onClick={retry}>
                        <RefreshCw size={15} aria-hidden="true" />
                        Try again
                    </Button>
                }
            >
                {error}
            </Alert>
        );
    } else if (orders.length === 0) {
        content = (
            <EmptyState
                icon={ReceiptText}
                title="No orders yet"
                description="Once an order is placed it will show up here so you can track it."
                action={
                    <Link to={{ pathname: "/", hash: "#menu" }} className={buttonClasses()}>
                        Browse the menu
                    </Link>
                }
            />
        );
    } else {
        content = (
            <>
                <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="text-sm text-muted">
                        {orders.length} {orders.length === 1 ? "order" : "orders"}, newest first
                    </p>
                    <Button variant="ghost" size="sm" onClick={retry}>
                        <RefreshCw size={14} aria-hidden="true" />
                        Refresh
                    </Button>
                </div>
                <ul className="space-y-4">
                    {orders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </ul>
            </>
        );
    }

    return (
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <PageHeader
                eyebrow="Orders"
                title="Orders"
                description="Track the status of every order placed."
            />

            <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_320px]">
                <section aria-label="All orders">{content}</section>
                <TrackOrderForm />
            </div>
        </div>
    );
}

function TrackOrderForm() {
    const navigate = useNavigate();
    const [value, setValue] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        const id = value.trim().replace(/^#/, "");

        if (!VALID_ID.test(id)) {
            setError("Enter a valid order number, e.g. 42.");
            return;
        }

        navigate(`/orders/${id}`);
    };

    return (
        <Card as="section" aria-labelledby="track-title" className="p-5 sm:p-6 lg:sticky lg:top-24">
            <h2 id="track-title" className="text-lg font-bold text-foreground">Track an order</h2>
            <p className="mt-1 text-sm text-muted">Know your order number? Jump straight to it.</p>

            <form noValidate onSubmit={handleSubmit} className="mt-5 space-y-4">
                <FormField id="track-order-id" label="Order number" error={error}>
                    {(fieldProps) => (
                        <Input
                            {...fieldProps}
                            value={value}
                            onChange={(event) => {
                                setValue(event.target.value);
                                setError("");
                            }}
                            inputMode="numeric"
                            placeholder="e.g. 42"
                        />
                    )}
                </FormField>
                <Button type="submit" className="w-full">
                    <Search size={16} aria-hidden="true" />
                    Track order
                </Button>
            </form>
        </Card>
    );
}
