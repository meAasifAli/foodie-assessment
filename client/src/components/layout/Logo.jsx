
import { Link } from "react-router-dom";
import { UtensilsCrossed } from "lucide-react";

export default function Logo({ onClick }) {
    return (
        <Link
            to="/"
            onClick={onClick}
            aria-label="foodie. home"
            className="flex items-center gap-2 rounded-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
                <UtensilsCrossed size={20} aria-hidden="true" />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-foreground">
                food<span className="text-primary">ie.</span>
            </span>
        </Link>
    );
}
