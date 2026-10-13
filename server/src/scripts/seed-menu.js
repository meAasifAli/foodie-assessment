
// Seeds menu_items with a realistic menu.
// Idempotent: a dish is only inserted if no item with the same name
// (case-insensitive) exists, so re-running never creates duplicates and
// existing rows (which orders may reference) are never modified.
//
// Usage: npm run seed:menu

import "dotenv/config";
import pool from "../config/db.js";

const img = (id) => `https://images.unsplash.com/photo-${id}`;

const MENU_ITEMS = [
    // Indian
    { name: "Butter Chicken", description: "Tandoori chicken simmered in a silky tomato, butter and cream gravy", price: 349, image: "1631452180519-c014fe946bc7" },
    { name: "Chicken Tikka Masala", description: "Charred chicken tikka in a spiced onion-tomato masala, served with steamed rice", price: 339, image: "1585937421612-70a008356fbe" },
    { name: "Chicken Curry with Naan", description: "Home-style chicken curry with two butter naans", price: 329, image: "1565557623262-b51c2513a641" },
    { name: "Paneer Makhani Rice Bowl", description: "Soft paneer cubes in creamy makhani gravy over jeera rice", price: 279, image: "1588166524941-3bf61a9c41db" },
    { name: "Chicken Tikka Skewers", description: "Yoghurt-marinated chicken grilled on skewers, with mint chutney", price: 299, image: "1599487488170-d11ec9c172f0" },
    { name: "Pav Bhaji", description: "Spiced mashed vegetable bhaji with butter-toasted pav buns", price: 159, image: "1606491956689-2ea866880c84" },
    { name: "Punjabi Samosa (2 pcs)", description: "Crisp pastry stuffed with spiced potato and peas, with green chutney", price: 59, image: "1601050690597-df0568f70950" },
    { name: "Steamed Idli (4 pcs)", description: "Fluffy rice cakes served with coconut chutney and sambar", price: 89, image: "1589301760014-d929f3979dbc" },
    { name: "Veg Fried Rice", description: "Wok-tossed rice with carrots, beans and spring onion", price: 189, image: "1603133872878-684f208fb84b" },
    { name: "Tandoori Paneer Pizza", description: "Tandoori paneer, red onion and capsicum on a mozzarella base", price: 299, image: "1565299624946-b28f40a0ae38" },

    // Burgers & sandwiches
    { name: "Cheese Burst Burger", description: "Juicy patty with double cheddar, lettuce, tomato and house sauce", price: 179, image: "1571091718767-18b5b1457add" },
    { name: "Burger & Fries Combo", description: "Classic burger with a side of crispy salted fries", price: 249, image: "1594212699903-ec8a3eca50f5" },
    { name: "Pulled Chicken Burger", description: "Slow-cooked pulled chicken, creamy slaw and chipotle mayo in a brioche bun", price: 229, image: "1606755962773-d324e0a13086" },
    { name: "Chicken Shawarma Wrap", description: "Garlic-marinated chicken, pickled veggies and toum rolled in soft pita", price: 199, image: "1626700051175-6818013e1d4f" },
    { name: "Egg & Avocado Toast", description: "Sourdough topped with smashed avocado, boiled egg and greens", price: 229, image: "1482049016688-2d3e1b311543" },

    // Pizza & pasta
    { name: "Four Cheese Pizza", description: "Mozzarella, cheddar, parmesan and gouda on a thin, crispy crust", price: 329, image: "1513104890138-7c749659a591" },
    { name: "Penne Arrabbiata", description: "Penne in a fiery garlic and red chilli tomato sauce", price: 269, image: "1621996346565-e3dbc646d9a9" },
    { name: "Prawn Spaghetti", description: "Spaghetti tossed with garlic prawns, cherry tomatoes and chilli flakes", price: 399, image: "1563379926898-05f4575a45d8" },
    { name: "Mushroom Tagliatelle", description: "Ribbon pasta with sautéed mushrooms, spinach and parmesan cream", price: 319, image: "1551183053-bf91a1d81141" },
    { name: "Herbed Meatballs", description: "Chicken meatballs with rocket and a smoky tomato dip", price: 269, image: "1529042410759-befb1204b468" },

    // Asian
    { name: "Chef's Sushi Boat", description: "Assorted maki and uramaki rolls for two, with soy and wasabi", price: 699, image: "1553621042-f6e147245754" },
    { name: "Shrimp Ramen", description: "Rich broth with noodles, shrimp, soft-boiled egg and greens", price: 349, image: "1569718212165-3a8278d5f624" },
    { name: "Hakka Noodles", description: "Stir-fried noodles with crunchy vegetables and soy-garlic sauce", price: 199, image: "1585032226651-759b368d7246" },
    { name: "Thai Coconut Noodle Soup", description: "Rice noodles in a fragrant coconut curry broth with lime", price: 299, image: "1617093727343-374698b1b08d" },
    { name: "Thai Beef Salad", description: "Seared beef, fresh herbs, chilli and a tangy lime dressing", price: 349, image: "1504674900247-0877df9cc836" },

    // Mexican & grills
    { name: "Chickpea Veggie Tacos", description: "Roasted chickpeas, avocado and pickled onion in soft tortillas", price: 249, image: "1565299585323-38d6b0865b47" },
    { name: "Street-Style Barbacoa Tacos", description: "Slow-braised shredded meat, onion and coriander on corn tortillas", price: 299, image: "1599974579688-8dbdd335c77f" },
    { name: "Mixed Grill Platter", description: "Grilled chicken skewers, wings and roasted potatoes with dips", price: 549, image: "1555939594-58d7cb561ad1" },
    { name: "Steak Frites", description: "Grilled sirloin with herbed fries and peppercorn butter", price: 599, image: "1600891964092-4316c288032e" },
    { name: "Spicy BBQ Chicken Wings", description: "Six wings glazed in smoky barbecue sauce with a cooling dip", price: 299, image: "1527477396000-e27163b481c2" },
    { name: "Crispy Chicken Tenders", description: "Golden fried chicken strips with garlic mayo", price: 249, image: "1562967914-608f82629710" },
    { name: "Southern Fried Chicken (3 pcs)", description: "Buttermilk-brined, double-coated crispy fried chicken", price: 289, image: "1626082927389-6cd097cdc6ec" },

    // Bowls, salads & soups
    { name: "Rainbow Buddha Bowl", description: "Avocado, chickpeas, roasted sweet potato, cabbage and tomatoes", price: 279, image: "1512621776951-a57141f2eefd" },
    { name: "Grilled Salmon Poke Bowl", description: "Seared salmon, corn, cucumber, red cabbage and edamame", price: 449, image: "1546069901-ba9599a7e63c" },
    { name: "Mediterranean Salad", description: "Crunchy greens, olives, feta and red onion with lemon dressing", price: 249, image: "1540189549336-e6e99c3679fe" },
    { name: "Minestrone Soup", description: "Hearty Italian vegetable and bean soup with herbs", price: 179, image: "1603105037880-880cd4edfb0d" },

    // Breakfast
    { name: "Banana Blueberry French Toast", description: "Brioche French toast with banana, blueberries and maple syrup", price: 219, image: "1484723091739-30a097e8f929" },
    { name: "Honey Butter Pancakes", description: "A fluffy stack drizzled with honey and topped with fresh fruit", price: 199, image: "1567620905732-2d1ec7ab7445" },

    // Desserts
    { name: "Fudge Brownie", description: "Dense, gooey chocolate brownie with a chocolate drizzle", price: 129, image: "1606313564200-e75d5e30476c" },
    { name: "Oreo Brownie Sundae", description: "Brownie chunks, vanilla cream, Oreo crumble and chocolate sauce", price: 199, image: "1563805042-7684c019e1cb" },
    { name: "Raspberry Cream Cake", description: "Light sponge layered with vanilla cream and fresh raspberries", price: 179, image: "1565958011703-44f9829ba187" },
    { name: "Strawberry Panna Cotta", description: "Creamy vanilla panna cotta topped with fresh strawberries", price: 179, image: "1488477181946-6428a0291777" },
    { name: "Strawberry Ice Cream Cone", description: "Two scoops of strawberry ice cream in a crisp waffle cone", price: 99, image: "1497034825429-c343d7c6a68f" },
    { name: "Rainbow Sprinkle Donuts (2 pcs)", description: "Chocolate-glazed donuts covered in rainbow sprinkles", price: 149, image: "1551024601-bec78aea704b" },
    { name: "Choco Chip Cookies (4 pcs)", description: "Chewy, freshly baked cookies loaded with chocolate chips", price: 119, image: "1558961363-fa8fdf82db35" },

    // Drinks
    { name: "Cappuccino", description: "Double-shot espresso with velvety steamed milk foam", price: 129, image: "1509042239860-f550ce710b93" },
    { name: "Iced Caramel Latte", description: "Chilled espresso and milk with house caramel over ice", price: 189, image: "1461023058943-07fcbe16d735" },
    { name: "Oreo Milkshake", description: "Thick vanilla shake blended with Oreo cookies and topped with cream", price: 169, image: "1572490122747-3968b75cc699" },
    { name: "Tropical Smoothie", description: "Mango, banana and pineapple blended with yoghurt", price: 169, image: "1505252585461-04db1eb84625" },
    { name: "Fresh Orange Juice", description: "Freshly squeezed oranges, no added sugar", price: 119, image: "1600271886742-f049cd451bba" },
    { name: "Virgin Mojito", description: "Muddled mint and lime topped with soda", price: 129, image: "1621263764928-df1444c5e859" },
    { name: "Iced Lemon Tea", description: "Brewed black tea with lemon, served over ice", price: 99, image: "1556679343-c7306c1976bc" },
];

async function seedMenu() {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        let inserted = 0;

        for (const item of MENU_ITEMS) {
            const { rowCount } = await client.query(
                `INSERT INTO menu_items (name, description, price, image_url, is_available)
                 SELECT $1::varchar, $2::text, $3::numeric, $4::text, TRUE
                 WHERE NOT EXISTS (
                     SELECT 1 FROM menu_items WHERE LOWER(name) = LOWER($1::varchar)
                 )`,
                [item.name, item.description, item.price.toFixed(2), img(item.image)]
            );

            inserted += rowCount;
        }

        await client.query("COMMIT");

        const { rows } = await client.query("SELECT COUNT(*)::int AS total FROM menu_items");

        console.log(
            `Seeded ${inserted} new menu items (${MENU_ITEMS.length - inserted} already existed). ` +
            `menu_items now has ${rows[0].total} rows.`
        );
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

seedMenu()
    .catch((error) => {
        console.error("Menu seed failed:", error);
        process.exitCode = 1;
    })
    .finally(() => pool.end());
