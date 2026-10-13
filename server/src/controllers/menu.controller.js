
import * as menuService from "../services/menu.service.js";

export const getMenu = async (req, res, next) => {
    try {
        const { items, pagination } = await menuService.getMenu(req.query);

        return res.status(200).json({
            success: true,
            count: items.length,
            data: items,
            pagination,
        });
    } catch (error) {
        next(error);
    }
};
