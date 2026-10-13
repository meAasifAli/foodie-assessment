
import pool from "../config/db.js";

export const findAll = async () => {
    const query = `
    SELECT
      id,
      name,
      description,
      price,
      image_url,
      is_available
    FROM menu_items
    ORDER BY id ASC
  `;

    const { rows } = await pool.query(query);

    return rows;
};

// Escape LIKE wildcards so user input is matched literally.
const toLikePattern = (search) =>
    `%${search.replace(/[\%_]/g, (char) => `\${char}`)}%`;

/**
 * One page of available items, plus the total across all pages.
 * Ordered by id so pages are stable between requests.
 */
export const findAvailablePage = async ({ limit, offset, search = "" }) => {
    const params = [];
    let where = "WHERE is_available = TRUE";

    if (search) {
        params.push(toLikePattern(search));
        where += ` AND (name ILIKE $1 OR description ILIKE $1)`;
    }

    const { rows: countRows } = await pool.query(
        `SELECT COUNT(*)::int AS total FROM menu_items ${where}`,
        params
    );

    const { rows } = await pool.query(
        `SELECT
       id,
       name,
       description,
       price,
       image_url,
       is_available
     FROM menu_items
     ${where}
     ORDER BY id ASC
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        [...params, limit, offset]
    );

    return { items: rows, total: countRows[0].total };
};
