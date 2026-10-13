
import { Link } from "react-router-dom";
import { ArrowLeft, UtensilsCrossed } from "lucide-react";
import { buttonClasses } from "../../components/ui/styles";

export default function NotFoundPage() {
    return (
        <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:py-28">
            <span className="flex size-20 items-center justify-center rounded-3xl bg-primary-light text-primary">
                <UtensilsCrossed size={36} aria-hidden="true" />
            </span>

            <p className="mt-8 text-sm font-bold uppercase tracking-widest text-primary">Error 404</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                This plate is empty
            </h1>
            <p className="mt-4 max-w-md text-base leading-7 text-muted">
                The page you're looking for doesn't exist or may have moved.
                Let's get you back to something tasty.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/" className={buttonClasses({ size: "lg" })}>
                    <ArrowLeft size={18} aria-hidden="true" />
                    Return home
                </Link>
                <Link to={{ pathname: "/", hash: "#menu" }} className={buttonClasses({ size: "lg", variant: "outline" })}>
                    Browse the menu
                </Link>
            </div>
        </section>
    );
}
