import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import ScrollToTop from "./components/common/ScrollToTop";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import Signup from "./pages/Signup";
import Checkout from "./pages/Checkout";

import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";



const AppLayout = () => {
  const location = useLocation();

  const isAdminRoute =
    location.pathname.startsWith(
      "/admin"
    );

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#111111] flex flex-col">

      {!isAdminRoute && (
        <Navbar />
      )}

      <main
        className={
          isAdminRoute
            ? "flex-1"
            : "flex-1 pt-[78px] md:pt-[86px] pb-28 lg:pb-0"
        }
      >

        <Routes>

          {/* CUSTOMER ROUTES */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/shop"
            element={<Shop />}
          />

          <Route
            path="/product/:id"
            element={
              <ProductDetail />
            }
          />

          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/wishlist"
            element={<Wishlist />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/verify-email"
            element={
              <VerifyEmail />
            }
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          {/* ADMIN LOGIN */}

          <Route
            path="/admin/login"
            element={
              <AdminLogin />
            }
          />

          {/* ADMIN DASHBOARD */}

          <Route
            path="/admin/*"
            element={<Admin />}
          />

        </Routes>

      </main>

      {!isAdminRoute && (
        <Footer />
      )}

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