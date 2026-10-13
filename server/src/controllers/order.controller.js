
import * as orderService from "../services/order.service.js";

export const createOrder = async (req, res, next) => {
    try {
        const order = await orderService.createOrder(req.body);

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

export const getOrders = async (req, res, next) => {
    try {
        const orders = await orderService.getOrders();

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
        });
    } catch (error) {
        next(error);
    }
};

export const getOrderById = async (req, res, next) => {
    try {
        const order = await orderService.getOrderById(req.params.id);

        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

export const updateOrderStatus = async (req, res, next) => {
    try {
        const order = await orderService.changeOrderStatus(
            req.params.id,
            req.body.status
        );

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

export const updateOrderDetails = async (req, res, next) => {
    try {
        const order = await orderService.updateOrderDetails(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Order details updated successfully",
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteOrder = async (req, res, next) => {
    try {
        await orderService.deleteOrder(req.params.id);

        res.status(200).json({
            success: true,
            message: "Order deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
