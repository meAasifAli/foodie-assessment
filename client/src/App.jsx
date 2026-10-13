
import { Routes, Route } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";
import HomePage from "./pages/home";
import CartPage from "./pages/cart";
import CheckoutPage from "./pages/checkout";
import OrdersPage from "./pages/orders";
import OrderPage from "./pages/orders/detail";
import NotFoundPage from "./pages/not-found";

export default function App() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route index element={<HomePage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="orders/:id" element={<OrderPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
}
