
import { Check } from "lucide-react";
import { ORDER_STEPS, STATUS_META } from "./orderStatusMeta";

/**
 * Horizontal (desktop) / vertical (mobile) progress tracker.
 * The API does not return status history, so a cancelled order is shown
 * as a muted timeline rather than guessing the stage it was cancelled at.
 */
export default function OrderTimeline({ status }) {
    const cancelled = status === "CANCELLED";
    const currentIndex = ORDER_STEPS.indexOf(status);

    return (
        <ol aria-label="Order progress" className="relative grid gap-6 sm:grid-cols-4 sm:gap-2">
            {ORDER_STEPS.map((step, index) => {
                const meta = STATUS_META[step];
                const Icon = meta.icon;
                const done = !cancelled && index < currentIndex;
                const current = !cancelled && index === currentIndex;
                const reached = done || current;
                const isLast = index === ORDER_STEPS.length - 1;
                const complete = current && step === "DELIVERED";

                const state = cancelled
                    ? "not reached"
                    : done || complete
                        ? "completed"
                        : current
                            ? "current"
                            : "upcoming";

                return (
                    <li
                        key={step}
                        aria-current={current ? "step" : undefined}
                        className="relative flex gap-4 sm:flex-col sm:items-center sm:gap-3 sm:text-center"
                    >
                        {!isLast && (
                            <span
                                aria-hidden="true"
                                className={[
                                    "absolute left-5 top-12 h-[calc(100%-1.5rem)] w-0.5 -translate-x-1/2",
                                    "sm:left-[calc(50%+1.75rem)] sm:top-5 sm:h-0.5 sm:w-[calc(100%-3.5rem)] sm:translate-x-0",
                                    done ? "bg-primary" : "bg-border",
                                ].join(" ")}
                            />
                        )}

                        <span
                            className={[
                                "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                                cancelled
                                    ? "border-border bg-surface-muted text-muted-light"
                                    : complete
                                        ? "border-success bg-success text-white"
                                        : done
                                            ? "border-primary bg-primary text-white"
                                            : current
                                                ? "border-primary bg-primary-light text-primary ring-4 ring-primary/15"
                                                : "border-border bg-surface text-muted-light",
                            ].join(" ")}
                        >
                            {done ? <Check size={18} aria-hidden="true" /> : <Icon size={18} aria-hidden="true" />}
                        </span>

                        <div className="pt-1 sm:pt-0">
                            <p className={["text-sm font-bold", reached ? "text-foreground" : "text-muted"].join(" ")}>
                                {meta.short}
                            </p>
                            <p className="sr-only">{state}</p>
                            {current && !cancelled && (
                                <p className="mt-1 text-xs leading-5 text-muted sm:hidden">{meta.description}</p>
                            )}
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}
