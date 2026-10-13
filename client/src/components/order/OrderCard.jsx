
import { Link } from "react-router-dom";
import { ChevronRight, MapPin } from "lucide-react";

import { formatDateTime } from "../../lib/dates";
import { formatPaise } from "../../lib/money";
import { Card } from "../ui/card";
import OrderStatus from "./OrderStatus";

// The list endpoint returns order rows without line items, so the card
// shows who/where/when; items are on the order detail page.
export default function OrderCard({ order }) {
    return (
        <Card as="li" className="transition-shadow hover:shadow-card-hover">
            <Link
                to={`/orders/${order.id}`}
                aria-label={`Order #${order.id}, view details`}
                className="flex items-center gap-4 rounded-card p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:p-6"
            >
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <h2 className="text-lg font-bold text-foreground">Order #{order.id}</h2>
                        <OrderStatus status={order.status} />
                    </div>

                    <p className="mt-1 text-sm text-muted">
                        {[order.customerName, formatDateTime(order.createdAt)].filter(Boolean).join(" · ")}
                    </p>

                    {order.deliveryAddress && (
                        <p className="mt-3 flex items-center gap-1.5 text-sm text-foreground">
                            <MapPin size={14} aria-hidden="true" className="shrink-0 text-muted" />
                            <span className="line-clamp-1">{order.deliveryAddress}</span>
                        </p>
                    )}
                </div>

                <p className="shrink-0 text-lg font-extrabold text-foreground tabular-nums">
                    {formatPaise(order.totalPaise)}
                </p>

                <ChevronRight size={20} aria-hidden="true" className="shrink-0 text-muted" />
            </Link>
        </Card>
    );
}
