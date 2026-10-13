
import { Bike, ChefHat, CircleCheckBig, ClipboardCheck, CircleX } from "lucide-react";

// Happy-path lifecycle as enforced by STATUS_TRANSITIONS in order.service.js.
// CANCELLED is only reachable from RECEIVED or PREPARING.
export const ORDER_STEPS = ["RECEIVED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"];

export const STATUS_META = {
    RECEIVED: {
        label: "Order received",
        short: "Received",
        description: "The restaurant has your order and will start on it shortly.",
        icon: ClipboardCheck,
        badge: "default",
    },
    PREPARING: {
        label: "Being prepared",
        short: "Preparing",
        description: "Your food is being freshly prepared in the kitchen.",
        icon: ChefHat,
        badge: "warning",
    },
    OUT_FOR_DELIVERY: {
        label: "Out for delivery",
        short: "On the way",
        description: "Your order has left the kitchen and is on its way to you.",
        icon: Bike,
        badge: "default",
    },
    DELIVERED: {
        label: "Delivered",
        short: "Delivered",
        description: "Your order has been delivered. Enjoy your meal!",
        icon: CircleCheckBig,
        badge: "success",
    },
    CANCELLED: {
        label: "Cancelled",
        short: "Cancelled",
        description: "This order was cancelled and will not be delivered.",
        icon: CircleX,
        badge: "destructive",
    },
};
