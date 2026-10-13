
import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-border bg-surface">
            <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
                <div>
                    <Logo />
                    <p className="mt-3 max-w-xs text-sm leading-6 text-muted">
                        Good food, made simple. Order in a few taps — no account needed.
                    </p>
                </div>

                <nav aria-label="Footer">
                    <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-muted">
                        <li><Link to="/" className="hover:text-foreground">Home</Link></li>
                        <li><Link to={{ pathname: "/", hash: "#menu" }} className="hover:text-foreground">Menu</Link></li>
                        <li><Link to="/orders" className="hover:text-foreground">Orders</Link></li>
                        <li><Link to="/cart" className="hover:text-foreground">Cart</Link></li>
                    </ul>
                </nav>
            </div>

            <div className="border-t border-border">
                <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-muted sm:px-6 lg:px-8">
                    © {new Date().getFullYear()} foodie. All prices in INR.
                </p>
            </div>
        </footer>
    );
}
