import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminAddProductPage from "./admin/AdminAddProductPage.jsx";
import AdminDashboardPage from "./admin/AdminDashboardPage.jsx";
import AdminDeliveryDetailsPage from "./admin/AdminDeliveryDetailsPage.jsx";
import AdminOrdersPage from "./admin/AdminOrdersPage.jsx";
import AdminProductPage from "./admin/AdminProductPage.jsx";
import AdminUserPage from "./admin/AdminUserPage.jsx";
import AddressPage from "./pages/AddressPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CategoriesPage from "./pages/CategoriesPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import OrderSuccessPage from "./pages/OrderSuccessPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import TrackingPage from "./pages/TrackingPage.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/add-product" element={<AdminAddProductPage />} />
        <Route
          path="/admin/add-product.html"
          element={<AdminAddProductPage />}
        />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/dashboard.html" element={<AdminDashboardPage />} />
        <Route
          path="/admin/delivery-details"
          element={<AdminDeliveryDetailsPage />}
        />
        <Route
          path="/admin/delivery-details.html"
          element={<AdminDeliveryDetailsPage />}
        />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
        <Route path="/admin/orders.html" element={<AdminOrdersPage />} />
        <Route path="/admin/products" element={<AdminProductPage />} />
        <Route path="/admin/product.html" element={<AdminProductPage />} />
        <Route path="/admin/users" element={<AdminUserPage />} />
        <Route path="/admin/user.html" element={<AdminUserPage />} />
        <Route path="/address" element={<AddressPage />} />
        <Route path="/address.html" element={<AddressPage />} />
        <Route path="/pages/address.html" element={<AddressPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/cart.html" element={<CartPage />} />
        <Route path="/pages/cart.html" element={<CartPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/categories.html" element={<CategoriesPage />} />
        <Route path="/pages/categories.html" element={<CategoriesPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout.html" element={<CheckoutPage />} />
        <Route path="/pages/checkout.html" element={<CheckoutPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/forgot-password.html" element={<ForgotPasswordPage />} />
        <Route
          path="/pages/forgot-password.html"
          element={<ForgotPasswordPage />}
        />
        <Route path="/" element={<HomePage />} />
        <Route path="/home.html" element={<HomePage />} />
        <Route path="/pages/home.html" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login.html" element={<LoginPage />} />
        <Route path="/pages/login.html" element={<LoginPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/order-success.html" element={<OrderSuccessPage />} />
        <Route
          path="/pages/order-success.html"
          element={<OrderSuccessPage />}
        />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders.html" element={<OrdersPage />} />
        <Route path="/pages/orders.html" element={<OrdersPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/product.html" element={<ProductPage />} />
        <Route path="/pages/product.html" element={<ProductPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile.html" element={<ProfilePage />} />
        <Route path="/pages/profile.html" element={<ProfilePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register.html" element={<RegisterPage />} />
        <Route path="/pages/register.html" element={<RegisterPage />} />
        <Route path="/tracking" element={<TrackingPage />} />
        <Route path="/tracking.html" element={<TrackingPage />} />
        <Route path="/pages/tracking.html" element={<TrackingPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/wishlist.html" element={<WishlistPage />} />
        <Route path="/pages/wishlist.html" element={<WishlistPage />} />
        <Route path="/products.html" element={<ProductPage />} />
        <Route path="/admin/products.html" element={<AdminProductPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
