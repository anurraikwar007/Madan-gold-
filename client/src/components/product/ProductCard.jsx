import { useState } from "react";

import { Heart, ShoppingBag, Eye } from "lucide-react";

import { Link } from "react-router-dom";

import { useCart } from "../../context/CartContext";

const ProductCard = ({ product }) => {

  const [hovered, setHovered] = useState(false);

  const { addToCart, addToWishlist, wishlist } = useCart();

  const isWishlisted = wishlist?.some(
    (item) => item.id === product.id
  );

  return (
    <div
      className="
        group
        relative
      "
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >

      {/* CARD */}
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

        {/* IMAGE AREA */}
        <div
          className="
            relative
            overflow-hidden
            aspect-[4/5]
            bg-[#F4F1EA]
          "
        >

          {/* PRODUCT IMAGE */}
          <img
            src={
              hovered && product.hoverImage
                ? product.hoverImage
                : product.image
            }
            alt={product.name}
            className="
              w-full
              h-full
              object-cover
              transition-all
              duration-700
              group-hover:scale-105
            "
            loading="lazy"
          />

          {/* TOP BADGES */}
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

              <span
                className="
                  bg-[#D4AF37]
                  text-black
                  text-[10px]
                  px-3
                  py-1
                  rounded-full
                  font-semibold
                  tracking-wide
                "
              >
                NEW
              </span>

            )}

            {product.bestseller && (

              <span
                className="
                  bg-black
                  text-white
                  text-[10px]
                  px-3
                  py-1
                  rounded-full
                  font-semibold
                  tracking-wide
                "
              >
                BESTSELLER
              </span>

            )}

          </div>

          {/* RIGHT ACTIONS */}
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
              duration-500
            "
          >

            {/* WISHLIST */}
            <button
              onClick={() => addToWishlist(product)}
              className="
                w-10
                h-10
                rounded-full
                bg-white/90
                backdrop-blur-xl
                flex
                items-center
                justify-center
                shadow-md
              "
            >
              <Heart
                size={18}
                fill={isWishlisted ? "black" : "transparent"}
              />
            </button>

            {/* QUICK VIEW */}
            <Link
              to={`/product/${product.id}`}
              className="
                w-10
                h-10
                rounded-full
                bg-white/90
                backdrop-blur-xl
                flex
                items-center
                justify-center
                shadow-md
              "
            >
              <Eye size={18} />
            </Link>

          </div>

          {/* ADD TO CART */}
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
              duration-500
            "
          >

            <button
              onClick={() => addToCart(product)}
              className="
                w-full
                h-[52px]
                rounded-full
                bg-[#111111]
                text-white
                flex
                items-center
                justify-center
                gap-2
                font-medium
                hover:bg-[#D4AF37]
                hover:text-black
                transition-all
              "
            >

              <ShoppingBag size={18} />

              Add To Cart

            </button>

          </div>

        </div>

        {/* CONTENT */}
        <div className="p-4 sm:p-5">

          {/* CATEGORY */}
          <p
            className="
              text-[11px]
              uppercase
              tracking-[0.2em]
              text-[#D4AF37]
              font-semibold
              mb-2
            "
          >
            {product.metal} • {product.category}
          </p>

          {/* TITLE */}
          <Link
            to={`/product/${product.id}`}
          >
            <h3
              className="
                text-[15px]
                sm:text-base
                font-semibold
                text-[#111111]
                leading-snug
                line-clamp-2
                hover:text-[#D4AF37]
                transition-all
              "
            >
              {product.name}
            </h3>
          </Link>

          {/* PRICE */}
          <div
            className="
              flex
              items-center
              justify-between
              mt-4
            "
          >

            <div>

              <p
                className="
                  text-lg
                  sm:text-xl
                  font-bold
                  text-[#111111]
                "
              >
                ₹ {product.price.toLocaleString()}
              </p>

              <p
                className="
                  text-xs
                  text-gray-500
                  mt-1
                "
              >
                Inclusive of all taxes
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ProductCard;