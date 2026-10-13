
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonClasses } from "./styles";

// Page numbers to show: always first/last, a window around the current
// page, and "…" gaps in between. e.g. 1 … 4 5 6 … 12
function pageItems(page, totalPages) {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages = new Set([1, totalPages, page - 1, page, page + 1]);
    const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

    return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? ["gap-" + p, p] : [p]));
}

export default function Pagination({ page, totalPages, onPageChange, label = "Pagination", disabled = false, className = "" }) {
    if (totalPages <= 1) return null;

    const arrow = buttonClasses({ variant: "outline", size: "sm", className: "h-10 px-3" });

    return (
        <nav aria-label={label} className={["flex items-center justify-center gap-1.5", className].join(" ")}>
            <button
                type="button"
                className={arrow}
                onClick={() => onPageChange(page - 1)}
                disabled={disabled || page <= 1}
                aria-label="Previous page"
            >
                <ChevronLeft size={16} aria-hidden="true" />
                <span className="hidden sm:inline">Prev</span>
            </button>

            <ul className="flex items-center gap-1.5">
                {pageItems(page, totalPages).map((item) =>
                    typeof item === "string" ? (
                        <li key={item} aria-hidden="true" className="px-1 text-sm text-muted">
                            …
                        </li>
                    ) : (
                        <li key={item}>
                            <button
                                type="button"
                                onClick={() => onPageChange(item)}
                                disabled={disabled}
                                aria-label={`Page ${item}`}
                                aria-current={item === page ? "page" : undefined}
                                className={buttonClasses({
                                    variant: item === page ? "default" : "ghost",
                                    size: "icon",
                                    className: "tabular-nums",
                                })}
                            >
                                {item}
                            </button>
                        </li>
                    )
                )}
            </ul>

            <button
                type="button"
                className={arrow}
                onClick={() => onPageChange(page + 1)}
                disabled={disabled || page >= totalPages}
                aria-label="Next page"
            >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={16} aria-hidden="true" />
            </button>
        </nav>
    );
}
