
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

// React Router doesn't restore scroll or follow #hash links on its own.
function useScrollOnNavigate() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (hash) {
            document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
        } else {
            window.scrollTo(0, 0);
        }
    }, [pathname, hash]);
}

export default function AppLayout() {
    useScrollOnNavigate();

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-button focus:bg-surface focus:px-4 focus:py-2 focus:shadow-card"
            >
                Skip to content
            </a>

            <Navbar />

            <main id="main" className="flex-1">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}
