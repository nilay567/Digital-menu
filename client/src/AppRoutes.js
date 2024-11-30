import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import FoodPage from "./pages/Food/FoodPage.jsx";
import CartPage from "./pages/Cart/CartPage.jsx";
import Login from "./pages/Login/Login.jsx";
import RegisterPage from "./pages/Register/Register.jsx";
import MenuCard from "./pages/MenuCard/MenuCard.jsx";
import Restaurant from "./pages/Restaurant/Restaurant.jsx";
import QRCodeGenerator from "./pages/QrCodeGenerator/QrCodeGenerator.jsx";
import QrCodeScanner from "./pages/QrCodeScanner/QrCodeScanner.jsx";
import OrderDetails from "./pages/OrderDetails/OrderDetails.jsx";
import UsersOrder from "./pages/UsersOrder/UsersOrder.jsx";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage.jsx";
import AuthRoute from "./components/AuthRoute/AuthRoute.jsx";
import PaymentSuccess from "./pages/PaymentSuccess/PaymentSuccess.jsx";
import UserMenu from "./pages/UserMenu/UserMenu.jsx";
import ReorderPage from "./pages/ReorderPage/ReorderPage.jsx";
import PromotionsPage from "./pages/PromotionPage/PromotionPage.jsx";
import AdminOrders from "./pages/AdminsOder/AdminOrders.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/restaurant" element={<Restaurant />} />
      <Route path="/menu" element={<MenuCard />} />
      <Route path="/generate-qrcode" element={<QRCodeGenerator />} />
      <Route path="/scan-qrcode" element={<QrCodeScanner />} />
      <Route path="/:selectedRestaurantId/userMenu" element={<UserMenu />} />
      <Route path="/promotions" element={<PromotionsPage />} />
      <Route path="/orders" element={<AdminOrders />} />
      <Route
        path="/orders/:restaurantId/:orderId"
        element={<OrderDetails />}
      />
      <Route path="/cart/:selectedRestaurantId" element={<CartPage />} />
      <Route path="/:selectedRestaurantId/orders" element={<UsersOrder />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/checkout/:selectedRestaurantId"
        element={
          <AuthRoute>
            <CheckoutPage />
          </AuthRoute>
        }
      />
      <Route
        path="/reorder/:selectedRestaurantId/:orderId"
        element={
          <AuthRoute>
            <ReorderPage />
          </AuthRoute>
        }
      />
      <Route
        path="/success"
        element={
          <AuthRoute>
            <PaymentSuccess />
          </AuthRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
