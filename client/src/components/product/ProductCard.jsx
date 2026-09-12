import { useState } from "react";
import { Heart, ShoppingBag, Eye, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../../context/CartContext";

const ProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  const [wishlistBusy, setWishlistBusy] = useState(false);
  const { addToCart, wishlist = [], toggleWishlist } = useCart();
  const productId = product?._id || product?.id;
  const image = product?.images?.[0]?.url || product?.image || "/placeholder.png";
  const hoverImage = product?.images?.[1]?.url || product?.hoverImage || image;
  const isWishlisted = wishlist.some((item) => String(item?._id || item?.id) === String(productId));
  const handleWishlist = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (wishlistBusy) return;
    setWishlistBusy(true);
    try { await toggleWishlist(product); } finally { setWishlistBusy(false); }
  };
  const basePrice = Number(product?.price) || 0;
  const finalPrice = Number(product?.finalPrice) || (product?.discountPrice > 0 && product.discountPrice < basePrice ? Number(product.discountPrice) : basePrice);
  const stock = Number(product?.inventory?.availableStock ?? 0);
  const outOfStock = stock <= 0;
  const discount = basePrice > finalPrice ? Math.round(((basePrice-finalPrice)/basePrice)*100) : 0;

  const handleAdd = async () => { if (!outOfStock) await addToCart(product, 1, { openDrawer: true }); };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: .28 }}
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden rounded-[24px] border border-[#213C51]/10 bg-white shadow-[0_8px_35px_rgba(33,60,81,.06)] transition-shadow duration-300 group-hover:shadow-[0_22px_55px_rgba(33,60,81,.13)]">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#EEEEEE]">
          <img src={hovered ? hoverImage : image} alt={product?.name || "925 silver jewellery"} loading="lazy" decoding="async" width="700" height="875" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.045]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
            <div className="flex flex-wrap gap-1.5">
              {product?.newLaunch && <span className="inline-flex items-center gap-1 rounded-full bg-[#DDAED3] px-2.5 py-1 text-[9px] font-bold tracking-[.12em] text-[#213C51]"><Sparkles size={11}/> NEW</span>}
              {product?.bestseller && <span className="rounded-full bg-[#213C51] px-2.5 py-1 text-[9px] font-bold tracking-[.12em] text-white">BESTSELLER</span>}
              {discount > 0 && <span className="rounded-full bg-white/95 px-2.5 py-1 text-[9px] font-bold text-emerald-700">-{discount}%</span>}
            </div>
            <button type="button" aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"} onClick={handleWishlist} disabled={wishlistBusy} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/95 text-[#213C51] shadow-sm transition hover:scale-105" >
              <Heart size={17} fill={isWishlisted ? "currentColor" : "none"}/>
            </button>
          </div>
          {stock > 0 && stock <= 3 && <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold text-[#213C51] shadow-sm">Only {stock} left</span>}
          <Link to={`/product/${productId}`} aria-label={`View ${product?.name || "product"}`} className="absolute bottom-3 right-3 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-[#213C51] text-white opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 max-sm:opacity-100 max-sm:translate-y-0"><Eye size={17}/></Link>
        </div>
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-[10px] font-bold uppercase tracking-[.18em] text-[#6594B1]">{product?.category?.name || product?.category || "925 Silver"}</p>
            {product?.metal === "Silver" && <span className="shrink-0 text-[9px] font-semibold text-slate-400">925 SILVER</span>}
          </div>
          <Link to={`/product/${productId}`}><h3 className="mt-2 line-clamp-2 min-h-[44px] text-[15px] font-semibold leading-6 text-[#213C51] transition-colors group-hover:text-[#6594B1]">{product?.name}</h3></Link>
          <div className="mt-3 flex items-end justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2"><span className="text-lg font-bold text-[#213C51]">₹{finalPrice.toLocaleString("en-IN")}</span>{discount > 0 && <span className="text-xs text-slate-400 line-through">₹{basePrice.toLocaleString("en-IN")}</span>}</div>
              <p className="mt-0.5 text-[10px] text-slate-400">Inclusive of applicable taxes</p>
            </div>
            <button type="button" onClick={handleAdd} disabled={outOfStock} aria-label={outOfStock ? "Out of stock" : "Add to cart"} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DDAED3] text-[#213C51] transition hover:scale-105 hover:bg-[#213C51] hover:text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"><ShoppingBag size={17}/></button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};
export default ProductCard;
