
import * as menuRepository from "../repositories/menu.repository.js";

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 10;
const MAX_SEARCH_LENGTH = 100;

const fail = (message, status = 400) => {
    const error = new Error(message);
    error.status = status;
    throw error;
};

const parsePositiveInt = (value, name, fallback) => {
    if (value === undefined || value === "") return fallback;

    if (!/^[1-9]\d*$/.test(String(value))) {
        fail(`${name} must be a positive integer`);
    }

    const parsed = Number(value);
    if (!Number.isSafeInteger(parsed)) fail(`${name} must be a positive integer`);

    return parsed;
};

export const getMenu = async (query = {}) => {
    const page = parsePositiveInt(query.page, "page", 1);
    const limit = parsePositiveInt(query.limit, "limit", DEFAULT_PAGE_SIZE);

    if (limit > MAX_PAGE_SIZE) {
        fail(`limit must be between 1 and ${MAX_PAGE_SIZE}`);
    }

    if (query.search !== undefined && typeof query.search !== "string") {
        fail("search must be a single string");
    }

    const search = (query.search ?? "").trim();

    if (search.length > MAX_SEARCH_LENGTH) {
        fail(`search must be ${MAX_SEARCH_LENGTH} characters or fewer`);
    }

    const { items, total } = await menuRepository.findAvailablePage({
        limit,
        offset: (page - 1) * limit,
        search,
    });

    const totalPages = Math.ceil(total / limit);

    return {
        items,
        pagination: {
            page,
            limit,
            totalItems: total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        },
    };
};
