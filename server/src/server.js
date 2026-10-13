
import "dotenv/config";
import app from "./app.js";
import pool from "./config/db.js";

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const shutdown = () => {
    server.close(async () => {
        try {
            await pool.end();
            console.log("PostgreSQL pool closed");
            process.exit(0);
        } catch (error) {
            console.error("Shutdown failed:", error);
            process.exit(1);
        }
    });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
