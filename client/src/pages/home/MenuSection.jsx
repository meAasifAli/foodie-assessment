
import { useState } from "react";
import { RefreshCw, Search, SearchX, UtensilsCrossed, X } from "lucide-react";

import MenuCard, { MenuCardSkeleton } from "../../components/menu/MenuCard";
import Alert from "../../components/ui/alert";
import Button from "../../components/ui/button";
import EmptyState from "../../components/ui/empty-state";
import Input from "../../components/ui/input";
import Pagination from "../../components/ui/pagination";
import Spinner from "../../components/ui/spinner";
import useDebouncedValue from "../../hooks/useDebouncedValue";
import useMenu from "../../hooks/useMenu";
import { MENU_PAGE_SIZE } from "../../services/menuApi";

const GRID = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

const SEARCH_DEBOUNCE_MS = 300;

export default function MenuSection() {
    const [searchInput, setSearchInput] = useState("");
    const search = useDebouncedValue(searchInput.trim(), SEARCH_DEBOUNCE_MS);

    // The page belongs to the search it was chosen for, so a new search
    // starts from page 1 without needing an effect to reset it.
    const [pageState, setPageState] = useState({ search: "", page: 1 });
    const page = pageState.search === search ? pageState.page : 1;

    const { items, resultSearch, pagination, loading, initialLoading, error, retry } = useMenu({ page, search });

    const goToPage = (next) => {
        setPageState({ search, page: next });
        document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
    };

    const clearSearch = () => setSearchInput("");

    let content;

    if (initialLoading) {
        content = (
            <div className={GRID} aria-busy="true" aria-label="Loading menu">
                {Array.from({ length: MENU_PAGE_SIZE }, (_, index) => (
                    <MenuCardSkeleton key={index} />
                ))}
            </div>
        );
    } else if (error) {
        content = (
            <Alert
                variant="danger"
                title="We couldn't load the menu"
                action={
                    <Button variant="outline" size="sm" onClick={retry}>
                        <RefreshCw size={15} aria-hidden="true" />
                        Try again
                    </Button>
                }
            >
                {error}
            </Alert>
        );
    } else if (pagination.totalItems === 0 && !resultSearch) {
        content = (
            <EmptyState
                icon={UtensilsCrossed}
                title="The kitchen is resting"
                description="There are no dishes available right now. Please check back a little later."
                action={
                    <Button variant="outline" onClick={retry}>
                        <RefreshCw size={16} aria-hidden="true" />
                        Refresh menu
                    </Button>
                }
            />
        );
    } else if (pagination.totalItems === 0) {
        content = (
            <EmptyState
                icon={SearchX}
                title={`No dishes match “${resultSearch}”`}
                description="Try a different dish name or ingredient."
                action={
                    <Button variant="outline" onClick={clearSearch}>
                        Clear search
                    </Button>
                }
            />
        );
    } else if (items.length === 0) {
        // The menu shrank since this page number was chosen.
        content = (
            <EmptyState
                icon={UtensilsCrossed}
                title="This page is empty"
                description="The menu has changed since this page was loaded."
                action={<Button onClick={() => goToPage(1)}>Back to first page</Button>}
            />
        );
    } else {
        const from = (pagination.page - 1) * pagination.limit + 1;
        const to = from + items.length - 1;

        content = (
            <>
                <div className="mb-5 flex items-center justify-between gap-4">
                    <p className="text-sm text-muted" aria-live="polite">
                        Showing <strong className="font-semibold text-foreground">{from}–{to}</strong> of{" "}
                        <strong className="font-semibold text-foreground">{pagination.totalItems}</strong>{" "}
                        {resultSearch ? `dishes matching “${resultSearch}”` : pagination.totalItems === 1 ? "dish" : "dishes"}
                    </p>
                    {loading && (
                        <span className="flex items-center gap-2 text-sm text-muted">
                            <Spinner size="sm" className="text-primary" />
                            Loading…
                        </span>
                    )}
                </div>

                <div
                    aria-busy={loading || undefined}
                    className={[GRID, "transition-opacity duration-200", loading ? "opacity-50" : ""].join(" ")}
                >
                    {items.map((item) => (
                        <MenuCard key={item.id} item={item} />
                    ))}
                </div>

                <Pagination
                    label="Menu pages"
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={goToPage}
                    disabled={loading}
                    className="mt-10"
                />
            </>
        );
    }

    return (
        <section
            id="menu"
            aria-labelledby="menu-title"
            className="scroll-mt-20 border-t border-border/70 bg-surface-muted/50"
        >
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-widest text-primary">
                            Our menu
                        </p>
                        <h2 id="menu-title" className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                            What are you craving today?
                        </h2>
                        <p className="mt-2 text-muted">
                            Everything is made fresh when you order.
                        </p>
                    </div>

                    <div className="relative w-full md:max-w-sm">
                        <Search
                            size={18}
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                        />
                        <Input
                            type="search"
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                            placeholder="Search dishes or ingredients"
                            aria-label="Search menu"
                            maxLength={100}
                            className="h-12 rounded-full bg-surface pl-11 pr-11 shadow-sm [&::-webkit-search-cancel-button]:hidden"
                        />
                        {searchInput && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                aria-label="Clear search text"
                                className="absolute right-2.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-8">{content}</div>
            </div>
        </section>
    );
}
