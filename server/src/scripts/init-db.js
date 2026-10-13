// Creates the schema from tables.sql. Safe to re-run: every statement uses
// IF NOT EXISTS, so existing tables and data are left untouched.
//
// Usage: npm run db:init   (uses DATABASE_URL or the DB_* variables)

import "dotenv/config";
import { readFile } from "node:fs/promises";
import pool from "../config/db.js";

const schema = await readFile(new URL("./tables.sql", import.meta.url), "utf8");

try {
    await pool.query(schema);
    console.log("Database schema is ready");
} catch (error) {
    console.error("Failed to create the database schema:", error.message);
    process.exitCode = 1;
} finally {
    await pool.end();
}
