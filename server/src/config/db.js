import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

// Managed Postgres (Neon, Supabase, Render, Railway...) hands out a single
// DATABASE_URL and requires TLS. Local development keeps using DB_* vars.
const connection = process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 5432,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    };

// Only needed when the URL has no `sslmode` parameter of its own.
if (process.env.DB_SSL === "true") {
    connection.ssl = { rejectUnauthorized: true };
}

const pool = new Pool({
    ...connection,

    max: Number(process.env.DB_POOL_MAX) || 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});

pool.on("error", (error) => {
    console.error("Unexpected PostgreSQL pool error:", error);
});

export default pool;
