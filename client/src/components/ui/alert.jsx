
import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";

const variants = {
    info: { classes: "border-primary/20 bg-primary-light text-foreground", icon: Info, iconClass: "text-primary" },
    success: { classes: "border-success/20 bg-success-light text-foreground", icon: CircleCheck, iconClass: "text-success" },
    warning: { classes: "border-warning/20 bg-warning-light text-foreground", icon: TriangleAlert, iconClass: "text-warning" },
    danger: { classes: "border-danger/20 bg-danger-light text-foreground", icon: CircleAlert, iconClass: "text-danger" },
};

export default function Alert({ variant = "info", title, children, action, className = "", ...props }) {
    const { classes, icon: Icon, iconClass } = variants[variant] ?? variants.info;
    const urgent = variant === "danger" || variant === "warning";

    return (
        <div
            role={urgent ? "alert" : "status"}
            className={["flex gap-3 rounded-card border p-4", classes, className].join(" ")}
            {...props}
        >
            <Icon size={20} aria-hidden="true" className={["mt-0.5 shrink-0", iconClass].join(" ")} />

            <div className="min-w-0 flex-1">
                {title && <p className="font-semibold">{title}</p>}
                {children && (
                    <div className={["text-sm text-muted", title ? "mt-1" : ""].join(" ")}>
                        {children}
                    </div>
                )}
                {action && <div className="mt-3">{action}</div>}
            </div>
        </div>
    );
}
