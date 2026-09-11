
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  Clock3,
  Sparkles,
  Package,
} from "lucide-react";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useSearch } from "../../context/SearchContext";
import { getSearchSuggestions } from "../../api/product.api";
import LogoutModal from "../common/LogoutModal";
import madanLogo from "../../assets/logo/icon_Madan.png";


const Navbar = () => {
  const { cartCount = 0, wishlist = [] } = useCart();
  const { user, logout } = useAuth();
  const {
    query,
    setQuery,
  } = useSearch();

const location = useLocation();
const navigate = useNavigate();

   const handleSearchSubmit = (nextValue = query) => {
    const value = String(nextValue).trim();

    if (!value) {
      navigate("/shop");
      return;
    }

    navigate(`/shop?search=${encodeURIComponent(value)}`);
    setSuggestionOpen(false);
    setMobileOpen(false);
    setShopOpen(false);
  };

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [suggestions, setSuggestions] = useState({ products: [], keywords: [] });
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    const value = query.trim();
    if (!value) {
      setSuggestions({ products: [], keywords: [] });
      setSuggestionOpen(false);
      return undefined;
    }
    const timer = setTimeout(async () => {
      try {
        const response = await getSearchSuggestions(value);
        const data = response?.data?.data || {};
        const products = Array.isArray(data?.products) ? data.products : [];
        const keywords = Array.isArray(data?.suggestions) ? data.suggestions : [];
        setSuggestions({ products: products.slice(0, 7), keywords: keywords.slice(0, 6) });
        setSuggestionOpen(true);
      } catch {
        setSuggestions({ products: [], keywords: [] });
      }
    }, 180);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") { setSuggestionOpen(false); setShopOpen(false); setMobileOpen(false); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  

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
            bg-[#EEEEEE]
            text-[9px]
            font-medium
            uppercase
            tracking-[0.28em]
            text-[#213C51]
            lg:flex
          "
        >
          Complimentary shipping on orders above ₹1,000
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
                  border-white/15
                  bg-gradient-to-br
                  from-[#213C51]
                  via-[#2d526b]
                  to-[#213C51]
                  shadow-[inset_0_1px_5px_rgba(255,255,255,.12),0_6px_20px_rgba(33,60,81,.20)]
                  sm:h-10
                  sm:w-10
                "
              >
                <img
                  src={madanLogo}
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
                    text-[20px]
                    font-semibold
                    tracking-[0.13em]
                    text-[#213C51]
                    sm:text-[20px]
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
                  text-[#213C51]
                  transition-colors
                  hover:text-[#6594B1]
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
                    text-[#213C51]
                    transition-colors
                    hover:text-[#6594B1]
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
                        <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#6594B1]">
                          Collections
                        </p>

                        <div className="space-y-3">
                          <Link
                            to="/shop"
                            className="block text-sm text-[#213C51] hover:text-[#6594B1]"
                          >
                            All Jewellery
                          </Link>

                          <Link
                            to="/shop"
                            className="block text-sm text-[#213C51] hover:text-[#6594B1]"
                          >
                            New Arrivals
                          </Link>

                          <Link
                            to="/shop"
                            className="block text-sm text-[#213C51] hover:text-[#6594B1]"
                          >
                            Best Sellers
                          </Link>
                        </div>
                      </div>

                      <div>
                        <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#6594B1]">
                          Jewellery
                        </p>

                        <div className="space-y-3">
                          <Link
                            to="/shop"
                            className="block text-sm text-[#213C51] hover:text-[#6594B1]"
                          >
                            Rings
                          </Link>

                          <Link
                            to="/shop"
                            className="block text-sm text-[#213C51] hover:text-[#6594B1]"
                          >
                            Earrings
                          </Link>

                          <Link
                            to="/shop"
                            className="block text-sm text-[#213C51] hover:text-[#6594B1]"
                          >
                            Necklaces
                          </Link>
                        </div>
                      </div>

                      <div className="rounded-sm bg-gradient-to-br from-[#f7dfe4] to-[#e9c5cc] p-5">
                        <span className="text-[8px] uppercase tracking-[0.25em] text-[#213C51]">
                          Madan Gold
                        </span>

                        <h3 className="mt-2 font-serif text-xl text-[#213C51]">
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
                  text-[#213C51]
                  transition-colors
                  hover:text-[#6594B1]
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
                  text-[#213C51]
                  transition-colors
                  hover:text-[#6594B1]
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
                <div className="relative"
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
                    value={query}
                    placeholder="Search jewellery..."
                    onFocus={() => query.trim() && setSuggestionOpen(true)}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                    className="w-full bg-transparent text-xs text-[#213C51] outline-none placeholder:text-[#9b858a]"
                  />
                  {suggestionOpen && (suggestions.products?.length > 0 || suggestions.keywords?.length > 0) && (
                    <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-[150] overflow-hidden rounded-2xl border border-[#213C51]/10 bg-white p-2 shadow-[0_25px_70px_rgba(33,60,81,.16)]">
                      {suggestions.keywords?.slice(0, 5).map((keyword) => (
                        <button key={`keyword-${keyword}`} type="button" onClick={() => handleSearchSubmit(keyword)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-[#EEEEEE]/70">
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#DDAED3]/20"><Sparkles size={15} className="text-[#213C51]"/></span>
                          <span className="min-w-0 flex-1 truncate text-sm font-medium text-[#213C51]">{keyword}</span>
                          <span className="text-[10px] text-slate-400">Search</span>
                        </button>
                      ))}
                      {suggestions.products?.slice(0, 7).map((item) => {
                        const id = item?._id || item?.id;
                        const name = item?.name || item?.title || "Product";
                        const image = typeof item?.images?.[0] === "string" ? item.images[0] : item?.images?.[0]?.url;
                        return <Link key={id || name} to={id ? `/product/${id}` : `/shop?search=${encodeURIComponent(name)}`} onClick={() => setSuggestionOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-[#EEEEEE]/70">{image ? <img src={image} alt="" className="h-9 w-9 rounded-lg object-cover"/> : <Sparkles size={16} className="text-[#6594B1]"/>}<span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-[#213C51]">{name}</span><span className="block truncate text-[10px] text-slate-400">{item?.category || "925 Silver Jewellery"}</span></span><span className="text-[10px] text-slate-400">View</span></Link>;
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile search */}
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
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
                  text-[#213C51]
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
                  text-[#213C51]
                  transition-all
                  hover:text-[#6594B1]
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
                      bg-[#6594B1]
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
                  text-[#213C51]
                  transition-all
                  hover:text-[#6594B1]
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
                      bg-[#6594B1]
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
                <div className="relative hidden lg:block group">
                  <button type="button" className="flex h-10 items-center gap-2 rounded-full bg-[#213C51] px-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                    <User size={15} /> {user?.name?.split(" ")[0] || "Account"} <ChevronDown size={13}/>
                  </button>
                  <div className="pointer-events-none absolute right-0 top-[calc(100%+10px)] w-64 translate-y-2 rounded-2xl border border-[#213C51]/10 bg-white p-2 opacity-0 shadow-[0_25px_70px_rgba(33,60,81,.16)] transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="border-b border-slate-100 px-3 py-3"><p className="text-sm font-semibold text-[#213C51]">Hi, {user?.name || "there"}</p><p className="mt-1 text-xs text-slate-400">Manage your Madan Gold account</p></div>
                    <Link to="/profile" onClick={() => { setMobileOpen(false); setShopOpen(false); setSuggestionOpen(false); }} className="block rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-[#EEEEEE]">My Profile</Link>
                    <Link to="/orders" onClick={() => { setMobileOpen(false); setShopOpen(false); setSuggestionOpen(false); }} className="block rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-[#EEEEEE]">My Orders</Link>
                    <Link to="/wishlist" onClick={() => { setMobileOpen(false); setShopOpen(false); setSuggestionOpen(false); }} className="block rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-[#EEEEEE]">Wishlist</Link>
                    <button onClick={() => { setMobileOpen(false); setLogoutOpen(true); }} className="mt-1 w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50">Sign out</button>
                  </div>
                </div>
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
                    text-[#213C51]
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
                  text-[#213C51]
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
            <div className="relative mb-4">
              <div className="flex h-11 items-center rounded-full border border-[#8f5361]/10 bg-[#f9eef0] px-4">
                <Search
                  size={17}
                  strokeWidth={1.6}
                  className="mr-2 shrink-0 text-[#87616a]"
                  onClick={() => handleSearchSubmit()}
                />
                <input
                  type="search"
                  value={query}
                  placeholder="Search 925 silver jewellery..."
                  onFocus={() => query.trim() && setSuggestionOpen(true)}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearchSubmit();
                    if (e.key === "Escape") setSuggestionOpen(false);
                  }}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[#a18b91]"
                />
              </div>
              {suggestionOpen && (suggestions.products?.length > 0 || suggestions.keywords?.length > 0) && (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[180] overflow-hidden rounded-2xl border border-[#213C51]/10 bg-white p-2 shadow-[0_24px_60px_rgba(33,60,81,.16)]">
                  {suggestions.keywords?.slice(0, 4).map((keyword) => (
                    <button key={`mobile-keyword-${keyword}`} type="button" onClick={() => handleSearchSubmit(keyword)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-[#EEEEEE]">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#DDAED3]/20"><Sparkles size={14} className="text-[#213C51]"/></span>
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-[#213C51]">{keyword}</span>
                    </button>
                  ))}
                  {suggestions.products?.slice(0, 5).map((item) => {
                    const id = item?._id || item?.id;
                    const image = typeof item?.images?.[0] === "string" ? item.images[0] : item?.images?.[0]?.url;
                    return (
                      <Link key={`mobile-product-${id}`} to={id ? `/product/${id}` : `/shop?search=${encodeURIComponent(item?.name || query)}`} onClick={() => { setSuggestionOpen(false); setMobileOpen(false); }} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-[#EEEEEE]">
                        {image ? <img src={image} alt="" className="h-9 w-9 shrink-0 rounded-lg object-cover"/> : <Sparkles size={15} className="shrink-0 text-[#6594B1]"/>}
                        <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-[#213C51]">{item?.name}</span><span className="block truncate text-[10px] text-slate-400">{item?.category || "925 Silver Jewellery"}</span></span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Links */}
            <nav className="divide-y divide-[#8f5361]/10">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className={`
                  flex
                  items-center
                  justify-between
                  py-4
                  text-sm
                  ${
                    navActive("/")
                      ? "font-medium text-[#6594B1]"
                      : "text-[#213C51]"
                  }
                `}
              >
                Home
              </Link>

              <Link
                to="/shop"
                onClick={() => setMobileOpen(false)}
                className="
                  flex
                  items-center
                  justify-between
                  py-4
                  text-sm
                  text-[#213C51]
                "
              >
                Shop All
              </Link>

              <Link
                to="/shop"
                onClick={() => setMobileOpen(false)}
                className="
                  flex
                  items-center
                  justify-between
                  py-4
                  text-sm
                  text-[#213C51]
                "
              >
                New Arrivals
              </Link>

              <Link
                to="/shop"
                onClick={() => setMobileOpen(false)}
                className="
                  flex
                  items-center
                  justify-between
                  py-4
                  text-sm
                  text-[#213C51]
                "
              >
                Best Sellers
              </Link>

              <Link
                to="/wishlist"
                onClick={() => setMobileOpen(false)}
                className="
                  flex
                  items-center
                  justify-between
                  py-4
                  text-sm
                  text-[#213C51]
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
                      text-[#6594B1]
                    "
                  >
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                onClick={() => setMobileOpen(false)}
                className="
                  flex
                  items-center
                  justify-between
                  py-4
                  text-sm
                  text-[#213C51]
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
                      text-[#6594B1]
                    "
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="py-2">
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center justify-between py-3 text-sm text-[#213C51]">My Profile <User size={17}/></Link>
                  <Link to="/orders" onClick={() => setMobileOpen(false)} className="flex items-center justify-between py-3 text-sm text-[#213C51]">My Orders <Package size={17}/></Link>
                  <button type="button" onClick={() => { setMobileOpen(false); setLogoutOpen(true); }}
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    py-4
                    text-left
                    text-sm
                    text-[#6594B1]
                  "
                >
                  Logout
                  <User size={17} strokeWidth={1.6} />
                </button>
                </div>
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
                    text-[#6594B1]
                  "
                >
                  Account
                  <User size={17} strokeWidth={1.6} />
                </Link>
              )}
            </nav>

            {/* Mobile luxury footer */}
            <div className="mt-6 rounded-2xl bg-gradient-to-br from-[#f7dfe4] to-[#ead0d5] p-5">
              <p className="text-[8px] font-medium uppercase tracking-[0.3em] text-[#213C51]">
                MADAN GOLD
              </p>

              <p className="mt-2 font-serif text-lg text-[#213C51]">
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
      <LogoutModal
        open={logoutOpen}
        loading={logoutLoading}
        onCancel={() => !logoutLoading && setLogoutOpen(false)}
        onConfirm={async () => {
          setLogoutLoading(true);
          try { await logout(); } finally { setLogoutLoading(false); setLogoutOpen(false); }
        }}
      />
    </>
  );
};

export default Navbar;

