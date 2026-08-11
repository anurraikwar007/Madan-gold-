
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useSearch } from "../../context/SearchContext";

const Navbar = () => {
  const { cartCount = 0, wishlist = [] } = useCart();
  const { user, logout } = useAuth();
  const { setQuery } = useSearch();

  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setShopOpen(false);
  }, [location.pathname]);

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navActive = (path) => location.pathname === path;

  return (
    <>
      {/* =====================================================
          MAIN NAVBAR
      ===================================================== */}

      <header
        className={`
          fixed
          top-0
          left-0
          right-0
          z-[100]
          w-full
          transition-all
          duration-500
          ${
            scrolled
              ? "bg-[#fffafa]/95 backdrop-blur-xl border-b border-[#8f5361]/10 shadow-[0_8px_30px_rgba(90,45,55,0.07)]"
              : "bg-[#fffafa]/98 backdrop-blur-md"
          }
        `}
      >
        {/* Desktop announcement */}
        <div
          className="
            hidden
            h-7
            items-center
            justify-center
            border-b
            border-[#8f5361]/8
            bg-[#f9e9ec]
            text-[9px]
            font-medium
            uppercase
            tracking-[0.28em]
            text-[#704650]
            lg:flex
          "
        >
          Complimentary shipping on orders above ₹2,000
        </div>

        <div className="mx-auto max-w-[1500px] px-3 sm:px-6 lg:px-10">
          <div
            className={`
              flex
              items-center
              justify-between
              ${
                scrolled
                  ? "h-[64px] sm:h-[68px]"
                  : "h-[68px] sm:h-[76px]"
              }
            `}
          >
            {/* =================================================
                LOGO
            ================================================= */}

            <Link
              to="/"
              className="
                group
                flex
                min-w-0
                shrink-0
                items-center
                gap-2.5
                sm:gap-3
              "
            >
              <div
                className="
                  relative
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-full
                  border
                  border-white/80
                  bg-gradient-to-br
                  from-[#ffffff]
                  via-[#e8e8e8]
                  to-[#bfc1c4]
                  shadow-[inset_0_1px_4px_rgba(255,255,255,.9),0_5px_18px_rgba(80,55,60,.12)]
                  sm:h-10
                  sm:w-10
                "
              >
                <img
                  src="../../assets/logo/icon_Madan.png"
                  alt="Madan Gold"
                  className="
                    h-[23px]
                    w-[23px]
                    object-contain
                    sm:h-[26px]
                    sm:w-[26px]
                  "
                />
              </div>

              <div className="min-w-0 leading-none">
                <div
                  className="
                    truncate
                    font-serif
                    text-[24px]
                    font-semibold
                    tracking-[0.13em]
                    text-[#35252a]
                    sm:text-[18px]
                    sm:tracking-[0.16em]
                  "
                >
                  MADAN
                </div>

               
              </div>
            </Link>

            {/* =================================================
                DESKTOP NAV
            ================================================= */}

            <nav
              className="
                hidden
                items-center
                gap-7
                lg:flex
                xl:gap-9
              "
            >
              <Link
                to="/"
                className="
                  py-6
                  text-[11px]
                  font-medium
                  uppercase
                  tracking-[0.16em]
                  text-[#403337]
                  transition-colors
                  hover:text-[#8c4e5d]
                "
              >
                Home
              </Link>

              <div
                className="relative"
                onMouseEnter={() => setShopOpen(true)}
                onMouseLeave={() => setShopOpen(false)}
              >
                <button
                  type="button"
                  className="
                    flex
                    items-center
                    gap-1.5
                    py-6
                    text-[11px]
                    font-medium
                    uppercase
                    tracking-[0.16em]
                    text-[#403337]
                    transition-colors
                    hover:text-[#8c4e5d]
                  "
                >
                  Shop

                  <ChevronDown
                    size={13}
                    strokeWidth={1.5}
                    className={`
                      transition-transform
                      duration-300
                      ${shopOpen ? "rotate-180" : ""}
                    `}
                  />
                </button>

                {shopOpen && (
                  <div
                    className="
                      absolute
                      left-1/2
                      top-full
                      w-[580px]
                      -translate-x-1/2
                      border
                      border-[#8f5361]/10
                      bg-[#fffafa]/98
                      p-7
                      shadow-[0_25px_70px_rgba(67,35,43,0.13)]
                      backdrop-blur-xl
                    "
                  >
                    <div className="grid grid-cols-3 gap-8">
                      <div>
                        <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#a05f6d]">
                          Collections
                        </p>

                        <div className="space-y-3">
                          <Link
                            to="/shop"
                            className="block text-sm text-[#403337] hover:text-[#a05f6d]"
                          >
                            All Jewellery
                          </Link>

                          <Link
                            to="/shop"
                            className="block text-sm text-[#403337] hover:text-[#a05f6d]"
                          >
                            New Arrivals
                          </Link>

                          <Link
                            to="/shop"
                            className="block text-sm text-[#403337] hover:text-[#a05f6d]"
                          >
                            Best Sellers
                          </Link>
                        </div>
                      </div>

                      <div>
                        <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#a05f6d]">
                          Jewellery
                        </p>

                        <div className="space-y-3">
                          <Link
                            to="/shop"
                            className="block text-sm text-[#403337] hover:text-[#a05f6d]"
                          >
                            Rings
                          </Link>

                          <Link
                            to="/shop"
                            className="block text-sm text-[#403337] hover:text-[#a05f6d]"
                          >
                            Earrings
                          </Link>

                          <Link
                            to="/shop"
                            className="block text-sm text-[#403337] hover:text-[#a05f6d]"
                          >
                            Necklaces
                          </Link>
                        </div>
                      </div>

                      <div className="rounded-sm bg-gradient-to-br from-[#f7dfe4] to-[#e9c5cc] p-5">
                        <span className="text-[8px] uppercase tracking-[0.25em] text-[#80505b]">
                          Madan Gold
                        </span>

                        <h3 className="mt-2 font-serif text-xl text-[#402b31]">
                          Timeless
                          <br />
                          Elegance
                        </h3>

                        <Link
                          to="/shop"
                          className="mt-4 inline-block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#75434f]"
                        >
                          Explore →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/shop"
                className="
                  py-6
                  text-[11px]
                  font-medium
                  uppercase
                  tracking-[0.16em]
                  text-[#403337]
                  transition-colors
                  hover:text-[#8c4e5d]
                "
              >
                New Arrivals
              </Link>

              <Link
                to="/shop"
                className="
                  py-6
                  text-[11px]
                  font-medium
                  uppercase
                  tracking-[0.16em]
                  text-[#403337]
                  transition-colors
                  hover:text-[#8c4e5d]
                "
              >
                Best Sellers
              </Link>
            </nav>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              {/* Desktop search */}
              <div className="hidden xl:block">
                <div
                  className="
                    flex
                    h-10
                    w-[190px]
                    items-center
                    rounded-full
                    border
                    border-[#8f5361]/10
                    bg-white/70
                    px-4
                    transition-all
                    duration-300
                    focus-within:w-[230px]
                    focus-within:border-[#a45f6e]/30
                    focus-within:bg-white
                  "
                >
                  <Search
                    size={16}
                    strokeWidth={1.7}
                    className="mr-2 shrink-0 text-[#87616a]"
                  />

                  <input
                    type="text"
                    placeholder="Search"
                    onChange={(e) => setQuery(e.target.value)}
                    className="
                      w-full
                      bg-transparent
                      text-xs
                      text-[#35252a]
                      outline-none
                      placeholder:text-[#9b858a]
                    "
                  />
                </div>
              </div>

              {/* Mobile search */}
              <button
                type="button"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#8f5361]/10
                  bg-white/75
                  text-[#403337]
                  sm:h-10
                  sm:w-10
                  xl:hidden
                "
              >
                <Search size={16} strokeWidth={1.7} />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="
                  relative
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#8f5361]/10
                  bg-white/75
                  text-[#403337]
                  transition-all
                  hover:text-[#8c4e5d]
                  sm:h-10
                  sm:w-10
                "
              >
                <Heart size={16} strokeWidth={1.6} />

                {wishlist?.length > 0 && (
                  <span
                    className="
                      absolute
                      -right-0.5
                      -top-0.5
                      flex
                      h-4
                      min-w-4
                      items-center
                      justify-center
                      rounded-full
                      bg-[#8c4e5d]
                      px-1
                      text-[8px]
                      font-semibold
                      text-white
                    "
                  >
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="
                  relative
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#8f5361]/10
                  bg-white/75
                  text-[#403337]
                  transition-all
                  hover:text-[#8c4e5d]
                  sm:h-10
                  sm:w-10
                "
              >
                <ShoppingBag size={16} strokeWidth={1.6} />

                {cartCount > 0 && (
                  <span
                    className="
                      absolute
                      -right-0.5
                      -top-0.5
                      flex
                      h-4
                      min-w-4
                      items-center
                      justify-center
                      rounded-full
                      bg-[#8c4e5d]
                      px-1
                      text-[8px]
                      font-semibold
                      text-white
                    "
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Desktop account */}
              {user ? (
                <button
                  type="button"
                  onClick={logout}
                  className="
                    hidden
                    h-10
                    items-center
                    gap-2
                    rounded-full
                    bg-[#35252a]
                    px-4
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.14em]
                    text-white
                    lg:flex
                  "
                >
                  <User size={15} />
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="
                    hidden
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#8f5361]/10
                    bg-white/75
                    text-[#403337]
                    lg:flex
                  "
                >
                  <User size={17} strokeWidth={1.6} />
                </Link>
              )}

              {/* Mobile menu */}
              <button
                type="button"
                onClick={() => setMobileOpen((prev) => !prev)}
                aria-label="Toggle navigation"
                aria-expanded={mobileOpen}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#8f5361]/10
                  bg-white/75
                  text-[#403337]
                  sm:h-10
                  sm:w-10
                  lg:hidden
                "
              >
                {mobileOpen ? (
                  <X size={18} strokeWidth={1.7} />
                ) : (
                  <Menu size={18} strokeWidth={1.7} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================
            MOBILE MENU
        ===================================================== */}

        <div
          className={`
            overflow-hidden
            border-t
            border-[#8f5361]/10
            bg-[#fffafa]/98
            transition-all
            duration-300
            lg:hidden
            ${
              mobileOpen
                ? "max-h-[calc(100vh-68px)] opacity-100"
                : "max-h-0 opacity-0"
            }
          `}
        >
          <div className="max-h-[calc(100vh-68px)] overflow-y-auto px-5 pb-8 pt-3">
            {/* Mobile search */}
            <div
              className="
                mb-4
                flex
                h-11
                items-center
                rounded-full
                border
                border-[#8f5361]/10
                bg-[#f9eef0]
                px-4
              "
            >
              <Search
                size={17}
                strokeWidth={1.6}
                className="mr-2 text-[#87616a]"
              />

              <input
                type="text"
                placeholder="Search jewellery..."
                onChange={(e) => setQuery(e.target.value)}
                className="
                  w-full
                  bg-transparent
                  text-sm
                  outline-none
                  placeholder:text-[#a18b91]
                "
              />
            </div>

            {/* Links */}
            <nav className="divide-y divide-[#8f5361]/10">
              <Link
                to="/"
                className={`
                  flex
                  items-center
                  justify-between
                  py-4
                  text-sm
                  ${
                    navActive("/")
                      ? "font-medium text-[#8c4e5d]"
                      : "text-[#403337]"
                  }
                `}
              >
                Home
              </Link>

              <Link
                to="/shop"
                className="
                  flex
                  items-center
                  justify-between
                  py-4
                  text-sm
                  text-[#403337]
                "
              >
                Shop All
              </Link>

              <Link
                to="/shop"
                className="
                  flex
                  items-center
                  justify-between
                  py-4
                  text-sm
                  text-[#403337]
                "
              >
                New Arrivals
              </Link>

              <Link
                to="/shop"
                className="
                  flex
                  items-center
                  justify-between
                  py-4
                  text-sm
                  text-[#403337]
                "
              >
                Best Sellers
              </Link>

              <Link
                to="/wishlist"
                className="
                  flex
                  items-center
                  justify-between
                  py-4
                  text-sm
                  text-[#403337]
                "
              >
                <span>Wishlist</span>

                {wishlist?.length > 0 && (
                  <span
                    className="
                      rounded-full
                      bg-[#f0d9de]
                      px-2.5
                      py-1
                      text-[10px]
                      text-[#8c4e5d]
                    "
                  >
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="
                  flex
                  items-center
                  justify-between
                  py-4
                  text-sm
                  text-[#403337]
                "
              >
                <span>Shopping Bag</span>

                {cartCount > 0 && (
                  <span
                    className="
                      rounded-full
                      bg-[#f0d9de]
                      px-2.5
                      py-1
                      text-[10px]
                      text-[#8c4e5d]
                    "
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <button
                  type="button"
                  onClick={logout}
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    py-4
                    text-left
                    text-sm
                    text-[#8c4e5d]
                  "
                >
                  Logout
                  <User size={17} strokeWidth={1.6} />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="
                    flex
                    items-center
                    justify-between
                    py-4
                    text-sm
                    font-medium
                    text-[#8c4e5d]
                  "
                >
                  Account
                  <User size={17} strokeWidth={1.6} />
                </Link>
              )}
            </nav>

            {/* Mobile luxury footer */}
            <div className="mt-6 rounded-2xl bg-gradient-to-br from-[#f7dfe4] to-[#ead0d5] p-5">
              <p className="text-[8px] font-medium uppercase tracking-[0.3em] text-[#80505b]">
                MADAN GOLD
              </p>

              <p className="mt-2 font-serif text-lg text-[#402b31]">
                Jewellery made
                <br />
                for your moments.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          NAVBAR SPACE
          Hero navbar ke neeche start hoga.
      ===================================================== */}

      <div className="h-[68px] sm:h-[76px] lg:h-[103px]" />
    </>
  );
};

export default Navbar;

