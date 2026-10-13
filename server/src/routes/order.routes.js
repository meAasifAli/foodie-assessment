
import { Router } from "express";

import {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    updateOrderDetails,
    deleteOrder,
} from "../controllers/order.controller.js";

const router = Router();

router.route("/")
    .get(getOrders)
    .post(createOrder);

router.route("/:id")
    .get(getOrderById)
    .patch(updateOrderDetails)
    .delete(deleteOrder);

router.patch("/:id/status", updateOrderStatus);

export default router;
