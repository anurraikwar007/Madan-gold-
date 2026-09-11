import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/common/ScrollToTop";
import ProtectedRoute from "../components/common/ProtectedRoute";

const Home = lazy(() => import("../pages/Home"));
const Shop = lazy(() => import("../pages/Shop"));
const ProductDetail = lazy(() => import("../pages/ProductDetail"));
const Cart = lazy(() => import("../pages/Cart"));
const Wishlist = lazy(() => import("../pages/Wishlist"));
const Login = lazy(() => import("../pages/Login"));
const VerifyEmail = lazy(() => import("../pages/VerifyEmail"));
const Signup = lazy(() => import("../pages/Signup"));
const Checkout = lazy(() => import("../pages/Checkout"));
const Orders = lazy(() => import("../pages/Orders"));
const Admin = lazy(() => import("../pages/Admin"));
const AdminLogin = lazy(() => import("../pages/AdminLogin"));
const Profile = lazy(() => import("../pages/Profile"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));

const RouteLoader = () => (
  <div className="flex min-h-[60vh] items-center justify-center bg-[var(--background)] px-6">
    <div className="flex items-center gap-3 rounded-full border border-[#213C51]/10 bg-white px-5 py-3 text-sm font-semibold text-[#213C51] shadow-sm">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#DDAED3] border-t-[#213C51]" />
      Loading Madan Gold…
    </div>
  </div>
);

const AppLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--body)] flex flex-col">
      {!isAdminRoute && <Navbar />}

      <main className={isAdminRoute ? "flex-1" : "flex-1 pt-[78px] md:pt-[86px] pb-28 lg:pb-0"}>
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<Admin />} />
          </Routes>
        </Suspense>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppLayout />
    </Router>
  );
}

export default App;
