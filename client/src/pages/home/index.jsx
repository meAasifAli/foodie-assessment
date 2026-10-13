
import { ArrowDown, Clock, ShieldCheck, Sparkles, Star } from "lucide-react";

import Button from "../../components/ui/button";
import MenuSection from "./MenuSection";

const HERO_IMAGE =
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1100&q=80";
const HERO_SIDE_IMAGE =
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80";

const highlights = [
    { icon: Sparkles, title: "Freshly prepared", text: "Cooked when you order" },
    { icon: ShieldCheck, title: "Guest checkout", text: "No sign-up required" },
    { icon: Clock, title: "Order tracking", text: "Follow every step" },
];

function scrollToMenu() {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
}

export default function HomePage() {
    return (
        <>
            <section className="relative overflow-hidden">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-40 -top-40 size-[34rem] rounded-full bg-primary-light blur-3xl"
                />

                <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:px-8 lg:pb-24 lg:pt-20">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-surface px-3 py-1.5 text-sm font-semibold text-primary shadow-sm">
                            <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
                            Hot, fresh & delivered to your door
                        </span>

                        <h1 className="mt-6 max-w-xl text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                            Cravings,{" "}
                            <span className="relative whitespace-nowrap text-primary">
                                sorted
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 200 12"
                                    preserveAspectRatio="none"
                                    className="absolute -bottom-2 left-0 h-3 w-full text-primary/30"
                                >
                                    <path d="M2 9c48-6 148-8 196-3" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                                </svg>
                            </span>
                            <br />
                            in a few taps.
                        </h1>

                        <p className="mt-6 max-w-lg text-base leading-7 text-muted sm:text-lg sm:leading-8">
                            Burgers, pizzas and comfort classics made fresh to order.
                            Pick your favourites, check out as a guest and follow your
                            order from kitchen to doorstep.
                        </p>

                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <Button size="lg" onClick={scrollToMenu}>
                                Explore the menu
                                <ArrowDown size={18} aria-hidden="true" />
                            </Button>
                            <p className="flex items-center gap-1.5 text-sm text-muted">
                                <Star size={16} aria-hidden="true" className="fill-primary text-primary" />
                                <span><strong className="text-foreground">Free delivery</strong> on every order</span>
                            </p>
                        </div>

                        <ul className="mt-12 grid max-w-xl gap-4 sm:grid-cols-3">
                            {highlights.map(({ icon: Icon, title, text }) => (
                                <li key={title} className="flex items-start gap-3">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface text-primary shadow-card">
                                        <Icon size={19} aria-hidden="true" />
                                    </span>
                                    <span>
                                        <span className="block text-sm font-bold text-foreground">{title}</span>
                                        <span className="block text-xs text-muted">{text}</span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
                        <div className="relative overflow-hidden rounded-[2rem] shadow-card-hover">
                            <img
                                src={HERO_IMAGE}
                                alt="A colourful spread of freshly prepared dishes on a table"
                                fetchPriority="high"
                                className="aspect-[4/3] w-full object-cover sm:aspect-[5/4]"
                            />
                        </div>

                        <div className="absolute -bottom-6 -left-2 hidden items-center gap-3 rounded-2xl border border-border bg-surface p-3 pr-5 shadow-card-hover sm:flex lg:-left-8">
                            <img
                                src={HERO_SIDE_IMAGE}
                                alt=""
                                className="size-14 rounded-xl object-cover"
                            />
                            <div>
                                <p className="text-sm font-bold text-foreground">Made to order</p>
                                <p className="text-xs text-muted">Straight from our kitchen</p>
                            </div>
                        </div>

                        <div className="absolute -right-2 top-6 rounded-2xl border border-border bg-surface px-4 py-3 shadow-card-hover lg:-right-6">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Checkout</p>
                            <p className="text-sm font-bold text-foreground">No account needed</p>
                        </div>
                    </div>
                </div>
            </section>

            <MenuSection />
        </>
    );
}
