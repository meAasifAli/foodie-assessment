
/**
 * Unsplash URLs stored in the database have no sizing parameters,
 * which downloads multi-megabyte originals. Request a sensible size instead.
 */
export function sizedImageUrl(url, width = 640) {
    if (typeof url !== "string" || !url) return "";

    try {
        const parsed = new URL(url);

        if (parsed.hostname === "images.unsplash.com" && !parsed.search) {
            parsed.search = `auto=format&fit=crop&w=${width}&q=80`;
        }

        return parsed.toString();
    } catch {
        return url;
    }
}
