
import express from "express";
import cors from "cors";

import menuRoutes from "./routes/menu.routes.js";
import orderRoutes from "./routes/order.routes.js";
import {
    notFound,
    errorHandler,
} from "./middlewares/error.middleware.js";

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
    })
);

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is running",
    });
});

app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes)

app.use(notFound);
app.use(errorHandler);

export default app;
