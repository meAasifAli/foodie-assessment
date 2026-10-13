
import Badge from "../ui/badge";
import { STATUS_META } from "./orderStatusMeta";

export default function OrderStatus({ status, className = "" }) {
    const meta = STATUS_META[status] ?? STATUS_META.RECEIVED;
    const Icon = meta.icon;

    return (
        <Badge variant={meta.badge} size="lg" className={className}>
            <Icon size={15} aria-hidden="true" />
            {meta.label}
        </Badge>
    );
}
