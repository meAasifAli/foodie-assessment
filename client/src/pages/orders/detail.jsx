
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, ReceiptText, RefreshCw, SearchX, User } from "lucide-react";

import OrderSummary from "../../components/cart/OrderSummary";
import OrderStatus from "../../components/order/OrderStatus";
import OrderTimeline from "../../components/order/OrderTimeline";
import { STATUS_META } from "../../components/order/orderStatusMeta";
import Alert from "../../components/ui/alert";
import Button from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import EmptyState from "../../components/ui/empty-state";
import Skeleton from "../../components/ui/skeleton";
import { buttonClasses } from "../../components/ui/styles";
import useOrder, { ORDER_POLL_INTERVAL_MS } from "../../hooks/useOrder";
import { formatDateTime } from "../../lib/dates";

const VALID_ID = /^[1-9]\d*$/;

const timeFormatter = new Intl.DateTimeFormat("en-IN", { timeStyle: "medium" });

export default function OrderPage() {
    const { id } = useParams();

    if (!VALID_ID.test(id ?? "")) {
        return <OrderNotFound />;
    }

    // Keying by id resets all tracking state when navigating between orders.
    return <OrderTracking key={id} id={id} />;
}

function OrderTracking({ id }) {
    const location = useLocation();
    const justPlaced = Boolean(location.state?.justPlaced);
    const { order, loading, refreshing, error, errorStatus, lastUpdated, isPolling, refresh } = useOrder(id);

    if (loading) return <OrderSkeleton />;

    if (!order) {
        if (errorStatus === 404) return <OrderNotFound id={id} />;

        return (
            <PageShell>
                <Alert
                    variant="danger"
                    title="We couldn't load this order"
                    action={
                        <Button variant="outline" size="sm" onClick={refresh}>
                            <RefreshCw size={15} aria-hidden="true" />
                            Try again
                        </Button>
                    }
                >
                    {error}
                </Alert>
            </PageShell>
        );
    }

    const meta = STATUS_META[order.status];
    const StatusIcon = meta.icon;
    const cancelled = order.status === "CANCELLED";
    const delivered = order.status === "DELIVERED";

    const lines = order.items.map((item) => ({
        key: item.menuItemId,
        name: item.name,
        quantity: item.quantity,
        totalPaise: item.subtotalPaise,
    }));
    const subtotalPaise = order.items.reduce((sum, item) => sum + item.subtotalPaise, 0);
    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <PageShell>
            {justPlaced && (
                <Alert variant="success" title="Order placed successfully!" className="mb-6">
                    Thanks, {order.customerName.split(" ")[0] || "friend"}. Your order number is{" "}
                    <strong className="text-foreground">#{order.id}</strong> — keep this page open
                    or bookmark it to check on your order.
                </Alert>
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-primary">Order tracking</p>
                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                        Order #{order.id}
                    </h1>
                    {order.createdAt && (
                        <p className="mt-2 text-muted">Placed on {formatDateTime(order.createdAt)}</p>
                    )}
                </div>
                <OrderStatus status={order.status} className="self-start sm:self-auto" />
            </div>

            <Card as="section" aria-labelledby="status-title" className="mt-8 overflow-hidden">
                <div
                    className={[
                        "flex items-start gap-4 border-b border-border p-5 sm:p-6",
                        cancelled ? "bg-danger-light" : delivered ? "bg-success-light" : "bg-primary-light",
                    ].join(" ")}
                >
                    <span
                        className={[
                            "flex size-12 shrink-0 items-center justify-center rounded-2xl text-white",
                            cancelled ? "bg-danger" : delivered ? "bg-success" : "bg-primary",
                        ].join(" ")}
                    >
                        <StatusIcon size={24} aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1" aria-live="polite">
                        <h2 id="status-title" className="text-lg font-bold text-foreground">
                            {meta.label}
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-muted">{meta.description}</p>
                    </div>
                </div>

                <div className="p-5 sm:p-8">
                    <OrderTimeline status={order.status} />
                </div>

                <div className="flex flex-col gap-3 border-t border-border bg-surface-muted/50 px-5 py-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <p>
                        {lastUpdated && <>Last checked at {timeFormatter.format(lastUpdated)}. </>}
                        {isPolling
                            ? `Status refreshes automatically every ${ORDER_POLL_INTERVAL_MS / 1000} seconds.`
                            : "This order is complete — no further updates."}
                    </p>
                    {isPolling && (
                        <Button variant="outline" size="sm" onClick={refresh} loading={refreshing} className="self-start sm:self-auto">
                            {!refreshing && <RefreshCw size={14} aria-hidden="true" />}
                            Refresh now
                        </Button>
                    )}
                </div>
            </Card>

            {error && (
                <Alert variant="warning" title="Couldn't refresh the latest status" className="mt-4">
                    {error} Showing the last known status.
                </Alert>
            )}

            <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_380px]">
                <OrderSummary
                    title="Items ordered"
                    lines={lines}
                    itemCount={itemCount}
                    subtotalPaise={subtotalPaise}
                    totalPaise={order.totalPaise}
                    totalLabel="Total charged"
                />

                <Card as="section" aria-labelledby="delivery-title" className="p-5 sm:p-6">
                    <h2 id="delivery-title" className="text-lg font-bold text-foreground">Delivery details</h2>
                    <dl className="mt-5 space-y-4 text-sm">
                        <DetailRow icon={User} label="Name" value={order.customerName} />
                        <DetailRow icon={Phone} label="Phone" value={order.phone} />
                        <DetailRow icon={MapPin} label="Address" value={order.deliveryAddress} />
                    </dl>
                </Card>
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link to="/orders" className={buttonClasses({ variant: "outline" })}>
                    <ArrowLeft size={16} aria-hidden="true" />
                    All orders
                </Link>
                <Link to={{ pathname: "/", hash: "#menu" }} className={buttonClasses()}>
                    <ReceiptText size={16} aria-hidden="true" />
                    Order something else
                </Link>
            </div>
        </PageShell>
    );
}

function PageShell({ children }) {
    return <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">{children}</div>;
}

function DetailRow({ icon: Icon, label, value }) {
    return (
        <div className="flex gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-muted">
                <Icon size={16} aria-hidden="true" />
            </span>
            <div className="min-w-0">
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</dt>
                <dd className="mt-0.5 break-words font-medium text-foreground">{value || "—"}</dd>
            </div>
        </div>
    );
}

function OrderNotFound({ id }) {
    return (
        <PageShell>
            <EmptyState
                icon={SearchX}
                title="Order not found"
                description={
                    id
                        ? `We couldn't find order #${id}. Please check the link and try again.`
                        : "That doesn't look like a valid order link."
                }
                action={
                    <Link to="/" className={buttonClasses()}>
                        Back to home
                    </Link>
                }
            />
        </PageShell>
    );
}

function OrderSkeleton() {
    return (
        <PageShell>
            <div aria-busy="true" aria-label="Loading order">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-3 h-10 w-56" />
                <Skeleton className="mt-3 h-4 w-48" />
                <Skeleton className="mt-8 h-72 w-full rounded-card" />
                <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
                    <Skeleton className="h-64 rounded-card" />
                    <Skeleton className="h-64 rounded-card" />
                </div>
            </div>
        </PageShell>
    );
}
