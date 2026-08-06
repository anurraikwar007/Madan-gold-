import { useState } from "react";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const ProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false);

  const {
    addToCart,
    wishlist = [],
    toggleWishlist,
  } = useCart();

  const productId = product._id || product.id;

  const image =
    product.images?.[0]?.url ||
    product.image ||
    "/placeholder.png";

  const hoverImage =
    product.images?.[1]?.url ||
    product.hoverImage ||
    image;

  const isWishlisted = wishlist.some(
    (item) =>
      (item._id || item.id) === productId
  );

  return (
    <div
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="
          relative
          overflow-hidden
          rounded-[2rem]
          bg-white
          border
          border-black/5
          transition-all
          duration-500
          hover:shadow-2xl
          hover:-translate-y-1
        "
      >
        <div
          className="
            relative
            overflow-hidden
            aspect-[4/5]
            bg-[#F4F1EA]
          "
        >
          <img
            src={hovered ? hoverImage : image}
            alt={product.name}
            loading="lazy"
            className="
              w-full
              h-full
              object-cover
              transition-all
              duration-700
              group-hover:scale-105
            "
          />

          <div
            className="
              absolute
              top-3
              left-3
              flex
              flex-col
              gap-2
            "
          >
            {product.newLaunch && (
              <span className="bg-[#D4AF37] text-black text-[10px] px-3 py-1 rounded-full font-semibold">
                NEW
              </span>
            )}

            {product.bestseller && (
              <span className="bg-black text-white text-[10px] px-3 py-1 rounded-full font-semibold">
                BESTSELLER
              </span>
            )}
          </div>

          <div
            className="
              absolute
              top-3
              right-3
              flex
              flex-col
              gap-2
              opacity-0
              translate-x-5
              group-hover:opacity-100
              group-hover:translate-x-0
              transition-all
            "
          >
            <button
              onClick={() =>
                toggleWishlist(product)
              }
              className="
                w-10
                h-10
                rounded-full
                bg-white
                flex
                items-center
                justify-center
              "
            >
              <Heart
                size={18}
                fill={
                  isWishlisted
                    ? "black"
                    : "transparent"
                }
              />
            </button>

            <Link
              to={`/product/${productId}`}
              className="
                w-10
                h-10
                rounded-full
                bg-white
                flex
                items-center
                justify-center
              "
            >
              <Eye size={18} />
            </Link>
          </div>

          <div
            className="
              absolute
              bottom-0
              left-0
              w-full
              p-3
              translate-y-full
              group-hover:translate-y-0
              transition-all
            "
          >
            <button
              onClick={() =>
                addToCart(product)
              }
              className="
                w-full
                h-12
                rounded-full
                bg-black
                text-white
                flex
                items-center
                justify-center
                gap-2
              "
            >
              <ShoppingBag size={18} />
              Add To Cart
            </button>
          </div>
        </div>

        <div className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
            {product.category?.name ||
              product.category}
          </p>

          <Link to={`/product/${productId}`}>
            <h3 className="font-semibold mt-2 line-clamp-2 hover:text-[#D4AF37]">
              {product.name}
            </h3>
          </Link>

          <div className="mt-4">
            <p className="text-xl font-bold">
              ₹
              {Number(
                product.price || 0
              ).toLocaleString()}
            </p>

            <p className="text-xs text-gray-500">
              Inclusive of all taxes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;