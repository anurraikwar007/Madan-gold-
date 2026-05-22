import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import ScrollToTop from "./components/common/ScrollToTop";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/common/ProtectedRoute";
function App() {
  return (
    <Router>

      {/* AUTO SCROLL */}
      <ScrollToTop />

      <div
        className="
          min-h-screen
          bg-[#FAF9F6]
          text-[#111111]
          flex
          flex-col
        "
      >

        {/* NAVBAR */}
        <Navbar />

        {/* MAIN */}
        <main
          className="
            flex-1
            pt-[78px]
            md:pt-[86px]
            pb-28
            lg:pb-0
          "
        >

          <Routes>

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
              element={<ProductDetail />}
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
              path="/signup"
              element={<Signup />}
            />

            <Route
              path="/checkout"
              element={<Checkout />}
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <Admin />
                </ProtectedRoute>
              }
            />

          </Routes>

        </main>

        {/* FOOTER */}
        <Footer />

      </div>

    </Router>
  );
}

export default App;