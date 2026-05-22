import { useState, useEffect } from "react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Home,
  Grid2x2,
} from "lucide-react";

import { useCart } from "../../context/CartContext";
import { useSearch } from "../../context/SearchContext";

const Navbar = () => {

  const { cart = [], wishlist = [] } = useCart();

  const { setQuery } = useSearch();

  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();

  useEffect(() => {

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);

  }, []);

  const navActive = (path) =>
    location.pathname === path;

  return (
    <>
      {/* TOP NAVBAR */}
      <header
        className={`
          fixed
          top-0
          left-0
          w-full
          z-50
          transition-all
          duration-500
          ${
            scrolled
              ? "bg-[#FAF9F6]/80 backdrop-blur-2xl border-b border-black/5"
              : "bg-transparent"
          }
        `}
      >

        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div
            className="
              h-[78px]
              flex
              items-center
              justify-between
            "
          >

            {/* LOGO */}
            <Link
              to="/"
              className="
                flex
                items-center
                gap-3
                shrink-0
              "
            >

              <div
                className="
                  w-11
                  h-11
                  rounded-full
                  bg-[#D4AF37]
                  flex
                  items-center
                  justify-center
                  font-bold
                  text-black
                "
              >
                M
              </div>

              <div>

                <h1
                  className="
                    text-lg
                    sm:text-xl
                    font-bold
                    tracking-wide
                  "
                >
                  MADAN GOLD
                </h1>

                <p
                  className="
                    text-[10px]
                    uppercase
                    tracking-[0.25em]
                    text-gray-500
                  "
                >
                  Luxury Jewelry
                </p>

              </div>

            </Link>

            {/* SEARCH */}
            <div
              className="
                hidden
                lg:flex
                flex-1
                max-w-xl
                mx-10
              "
            >

              <div className="relative w-full">

                <input
                  type="text"
                  placeholder="Search jewellery..."
                  onChange={(e) =>
                    setQuery(e.target.value)
                  }
                  className="
                    w-full
                    h-12
                    rounded-full
                    bg-white/80
                    border
                    border-black/5
                    pl-12
                    pr-5
                    text-sm
                  "
                />

                <Search
                  size={18}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-500
                  "
                />

              </div>

            </div>

            {/* DESKTOP ICONS */}
            <div className="flex items-center gap-3">

              {/* WISHLIST */}
              <Link
                to="/wishlist"
                className="
                  relative
                  w-11
                  h-11
                  rounded-full
                  bg-white/80
                  flex
                  items-center
                  justify-center
                "
              >

                <Heart size={18} />

                <span
                  className="
                    absolute
                    -top-1
                    -right-1
                    bg-black
                    text-white
                    text-[10px]
                    w-5
                    h-5
                    rounded-full
                    flex
                    items-center
                    justify-center
                  "
                >
                  {wishlist.length}
                </span>

              </Link>

              {/* CART */}
              <Link
                to="/cart"
                className="
                  relative
                  w-11
                  h-11
                  rounded-full
                  bg-white/80
                  flex
                  items-center
                  justify-center
                "
              >

                <ShoppingBag size={18} />

                <span
                  className="
                    absolute
                    -top-1
                    -right-1
                    bg-[#D4AF37]
                    text-black
                    text-[10px]
                    w-5
                    h-5
                    rounded-full
                    flex
                    items-center
                    justify-center
                  "
                >
                  {cart.length}
                </span>

              </Link>

              {/* ACCOUNT */}
              <Link
                to="/login"
                className="
                  w-11
                  h-11
                  rounded-full
                  bg-white/80
                  flex
                  items-center
                  justify-center
                "
              >
                <User size={18} />
              </Link>

            </div>

          </div>

        </div>

      </header>

      {/* MOBILE NAV */}
      <div
        className="
          lg:hidden
          fixed
          bottom-4
          left-1/2
          -translate-x-1/2
          z-50
          w-[94%]
          max-w-md
          bg-white/85
          backdrop-blur-2xl
          border
          border-black/5
          rounded-full
          px-6
          py-3
          shadow-xl
        "
      >

        <div className="flex items-center justify-between">

          <Link
            to="/"
            className={`
              flex
              flex-col
              items-center
              text-[11px]
              ${
                navActive("/")
                  ? "text-[#D4AF37]"
                  : "text-black"
              }
            `}
          >
            <Home size={18} />
            Home
          </Link>

          <Link
            to="/wishlist"
            className={`
              flex
              flex-col
              items-center
              text-[11px]
              ${
                navActive("/wishlist")
                  ? "text-[#D4AF37]"
                  : "text-black"
              }
            `}
          >
            <Heart size={18} />
            Wishlist
          </Link>

          <Link
            to="/shop"
            className="-mt-10"
          >

            <div
              className="
                w-16
                h-16
                rounded-full
                bg-[#D4AF37]
                flex
                items-center
                justify-center
                shadow-2xl
              "
            >
              <Grid2x2
                size={24}
                className="text-black"
              />
            </div>

          </Link>

          <Link
            to="/cart"
            className={`
              flex
              flex-col
              items-center
              text-[11px]
              ${
                navActive("/cart")
                  ? "text-[#D4AF37]"
                  : "text-black"
              }
            `}
          >
            <ShoppingBag size={18} />
            Cart
          </Link>

          <Link
            to="/login"
            className={`
              flex
              flex-col
              items-center
              text-[11px]
              ${
                navActive("/login")
                  ? "text-[#D4AF37]"
                  : "text-black"
              }
            `}
          >
            <User size={18} />
            Account
          </Link>

        </div>

      </div>
    </>
  );
};

export default Navbar;