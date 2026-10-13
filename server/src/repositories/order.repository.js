
import pool from "../config/db.js";

export const findAll = async () => {
    const { rows } = await pool.query(`
    SELECT id, customer_name, delivery_address, phone,
           status, total_amount, created_at, updated_at
    FROM orders
    ORDER BY created_at DESC
  `);

    return rows;
};

export const findById = async (id) => {
    const { rows } = await pool.query(
        `SELECT id, customer_name, delivery_address, phone,
            status, total_amount, created_at, updated_at
     FROM orders
     WHERE id = $1`,
        [id]
    );

    return rows[0] || null;
};

export const findItemsByOrderId = async (id) => {
    const { rows } = await pool.query(
        `SELECT oi.menu_item_id, mi.name, oi.quantity,
            oi.unit_price,
            oi.quantity * oi.unit_price AS subtotal
     FROM order_items oi
     JOIN menu_items mi ON mi.id = oi.menu_item_id
     WHERE oi.order_id = $1
     ORDER BY oi.id`,
        [id]
    );

    return rows;
};

export const create = async ({
    customerName,
    deliveryAddress,
    phone,
    items,
}) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const menuItemIds = items.map((item) => item.menuItemId);

        const { rows: menuItems } = await client.query(
            `SELECT id, name, price, is_available
       FROM menu_items
       WHERE id = ANY($1::integer[])
       FOR SHARE`,
            [menuItemIds]
        );

        if (menuItems.length !== menuItemIds.length) {
            const error = new Error("One or more menu items were not found");
            error.status = 404;
            throw error;
        }

        const menuMap = new Map(
            menuItems.map((item) => [item.id, item])
        );

        const unavailable = items.some(
            (item) => !menuMap.get(item.menuItemId).is_available
        );

        if (unavailable) {
            const error = new Error("One or more menu items are unavailable");
            error.status = 409;
            throw error;
        }

        const orderItems = items.map((item) => {
            const menuItem = menuMap.get(item.menuItemId);

            return {
                menuItemId: menuItem.id,
                name: menuItem.name,
                quantity: item.quantity,
                unitPrice: menuItem.price,
            };
        });

        // Calculate using integer cents to avoid floating-point money errors.
        const totalCents = orderItems.reduce((sum, item) => {
            const priceCents = Math.round(Number(item.unitPrice) * 100);
            return sum + priceCents * item.quantity;
        }, 0);

        const totalAmount = (totalCents / 100).toFixed(2);

        const { rows: orderRows } = await client.query(
            `INSERT INTO orders
         (customer_name, delivery_address, phone, total_amount)
       VALUES ($1, $2, $3, $4)
       RETURNING id, customer_name, delivery_address, phone,
                 status, total_amount, created_at, updated_at`,
            [customerName, deliveryAddress, phone, totalAmount]
        );

        const order = orderRows[0];

        for (const item of orderItems) {
            await client.query(
                `INSERT INTO order_items
           (order_id, menu_item_id, quantity, unit_price)
         VALUES ($1, $2, $3, $4)`,
                [order.id, item.menuItemId, item.quantity, item.unitPrice]
            );
        }

        await client.query("COMMIT");

        return {
            ...order,
            items: orderItems.map((item) => ({
                menuItemId: item.menuItemId,
                name: item.name,
                quantity: item.quantity,
                unitPrice: Number(item.unitPrice).toFixed(2),
                subtotal: (
                    Math.round(Number(item.unitPrice) * 100) *
                    item.quantity /
                    100
                ).toFixed(2),
            })),
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

export const updateStatus = async (id, status) => {
    const { rows } = await pool.query(
        `UPDATE orders
     SET status = $2, updated_at = NOW()
     WHERE id = $1
     RETURNING id, customer_name, delivery_address, phone,
               status, total_amount, created_at, updated_at`,
        [id, status]
    );

    return rows[0] || null;
};

export const updateDetails = async (
    id,
    { customerName, deliveryAddress, phone }
) => {
    const { rows } = await pool.query(
        `UPDATE orders
     SET customer_name = $2,
         delivery_address = $3,
         phone = $4,
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, customer_name, delivery_address, phone,
               status, total_amount, created_at, updated_at`,
        [id, customerName, deliveryAddress, phone]
    );

    return rows[0] || null;
};

export const remove = async (id) => {
    const { rows } = await pool.query(
        `DELETE FROM orders
     WHERE id = $1 AND status = 'RECEIVED'
     RETURNING id`,
        [id]
    );

    return rows[0] || null;
};
