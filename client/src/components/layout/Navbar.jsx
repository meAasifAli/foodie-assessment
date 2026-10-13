
import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, ShoppingBag, X } from "lucide-react";

import useCart from "../../hooks/useCart";
import { buttonClasses } from "../ui/styles";
import Logo from "./Logo";

const linkBase =
    "rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

export default function Navbar() {
    const { itemCount } = useCart();
    const { pathname, hash } = useLocation();
    const [open, setOpen] = useState(false);

    const close = () => setOpen(false);
    const onMenu = pathname === "/" && hash === "#menu";
    const onHome = pathname === "/" && !onMenu;

    const links = [
        { to: "/", label: "Home", active: onHome },
        { to: { pathname: "/", hash: "#menu" }, label: "Menu", active: onMenu },
        { to: "/orders", label: "Orders", active: pathname.startsWith("/orders") },
    ];

    const cartLabel = `Cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`;

    return (
        <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
            <nav
                aria-label="Main"
                className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
            >
                <Logo onClick={close} />

                <ul className="hidden items-center gap-1 md:flex">
                    {links.map((link) => (
                        <li key={link.label}>
                            <Link
                                to={link.to}
                                aria-current={link.active ? "page" : undefined}
                                className={[
                                    linkBase,
                                    link.active ? "text-primary" : "text-muted hover:text-foreground",
                                ].join(" ")}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-2">
                    <NavLink
                        to="/cart"
                        onClick={close}
                        aria-label={cartLabel}
                        className={({ isActive }) =>
                            buttonClasses({
                                variant: isActive ? "default" : "outline",
                                size: "sm",
                                className: "relative",
                            })
                        }
                    >
                        <ShoppingBag size={18} aria-hidden="true" />
                        <span className="hidden sm:inline">Cart</span>
                        {itemCount > 0 && (
                            <span
                                aria-hidden="true"
                                className="flex min-w-5 items-center justify-center rounded-full bg-foreground px-1.5 py-0.5 text-xs font-bold text-white"
                            >
                                {itemCount > 99 ? "99+" : itemCount}
                            </span>
                        )}
                    </NavLink>

                    <button
                        type="button"
                        onClick={() => setOpen((value) => !value)}
                        aria-expanded={open}
                        aria-controls="mobile-nav"
                        aria-label={open ? "Close menu" : "Open menu"}
                        className={buttonClasses({ variant: "ghost", size: "icon", className: "md:hidden" })}
                    >
                        {open ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </nav>

            {open && (
                <div id="mobile-nav" className="border-t border-border bg-background md:hidden">
                    <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
                        {links.map((link) => (
                            <li key={link.label}>
                                <Link
                                    to={link.to}
                                    onClick={close}
                                    aria-current={link.active ? "page" : undefined}
                                    className={[
                                        linkBase,
                                        "block py-3 text-base",
                                        link.active ? "bg-primary-light text-primary" : "text-foreground hover:bg-surface-muted",
                                    ].join(" ")}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </header>
    );
}
