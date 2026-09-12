import { useState } from "react";

import {
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
} from "lucide-react";

import { useCart } from "../../context/CartContext";

const ProductInfo = ({ product }) => {
  const [wishlistBusy, setWishlistBusy] = useState(false);
  const {
    addToCart,
    toggleWishlist,
    wishlist = [],
  } = useCart();

  const isWishlisted = wishlist.some(
    (item) =>
      String(item._id || item.id) ===
      String(product._id || product.id)
  );

  const basePrice =
    Number(product.price) || 0;

  const discountPrice =
    Number(product.discountPrice) || 0;

  const finalPrice =
    Number(product.finalPrice) ||
    (
      discountPrice > 0 &&
      discountPrice < basePrice
        ? discountPrice
        : basePrice
    );

  const discountPercentage =
    basePrice > finalPrice
      ? Math.round(
          ((basePrice - finalPrice) /
            basePrice) *
            100
        )
      : 0;

  const availableStock =
    Number(
      product.inventory?.availableStock ??
        product.availableStock ??
        product.inventory?.stock ??
        0
    );

  const isOutOfStock =
    availableStock <= 0;

  return (
    <div className="flex flex-col justify-center">

      {/* CATEGORY / METAL */}

      <p
        className="
          text-xs
          uppercase
          tracking-[0.3em]
          text-[#D4AF37]
          font-semibold
        "
      >
        {product.metal || "Silver"} •{" "}
        {product.category?.name ||
          product.category ||
          "Jewellery"}
      </p>

      {/* PRODUCT NAME */}

      <h1
        className="
          text-3xl
          sm:text-5xl
          font-bold
          mt-4
          leading-tight
        "
      >
        {product.name}
      </h1>

      {/* PRICE */}

      <div className="mt-6">

        <div className="flex items-end gap-3 flex-wrap">

          <p className="text-4xl font-bold">
            ₹
            {finalPrice.toLocaleString(
              "en-IN"
            )}
          </p>

          {discountPercentage > 0 && (
            <>
              <p className="text-lg text-gray-400 line-through">
                ₹
                {basePrice.toLocaleString(
                  "en-IN"
                )}
              </p>

              <span className="text-sm font-semibold text-green-600">
                {discountPercentage}% OFF
              </span>
            </>
          )}

        </div>

        <p className="text-sm text-gray-500 mt-2">
          Inclusive of all applicable taxes
        </p>

        {Number(product.makingCharges) > 0 && (
          <p className="text-xs text-gray-400 mt-1">
            Making charges are included in the
            checkout calculation.
          </p>
        )}

      </div>

      {/* DETAILS */}

      <div className="grid grid-cols-2 gap-4 mt-8">

        {/* PURITY */}

        <div className="bg-white rounded-xl p-4">

          <p className="text-xs text-gray-500">
            Purity
          </p>

          <p className="font-semibold mt-1">
            {product.purity ||
              "925 Silver"}
          </p>

        </div>

        {/* WEIGHT */}

        <div className="bg-white rounded-xl p-4">

          <p className="text-xs text-gray-500">
            Weight
          </p>

          <p className="font-semibold mt-1">
            {product.weight
              ? `${product.weight} g`
              : "Available"}
          </p>

        </div>

        {/* STOCK */}

        <div className="bg-white rounded-xl p-4">

          <p className="text-xs text-gray-500">
            Stock
          </p>

          <p
            className={`font-semibold ${
              isOutOfStock
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {isOutOfStock
              ? "Out of Stock"
              : `${availableStock} Available`}
          </p>

        </div>

        {/* GENDER */}

        <div className="bg-white rounded-xl p-4">

          <p className="text-xs text-gray-500">
            Designed For
          </p>

          <p className="font-semibold capitalize">
            {product.gender ||
              "Unisex"}
          </p>

        </div>

      </div>

      {/* DESCRIPTION */}

      <p
        className="
          text-gray-600
          leading-relaxed
          mt-8
        "
      >
        {product.description ||
          "Premium handcrafted jewellery made with certified 925 sterling silver."}
      </p>

      {/* BUTTONS */}

      <div className="flex gap-4 mt-10">

        <button
          type="button"
          disabled={isOutOfStock}
          onClick={() =>
            addToCart(product)
          }
          className="
            flex-1
            h-14
            rounded-full
            bg-black
            text-white
            flex
            items-center
            justify-center
            gap-2
            hover:bg-[#D4AF37]
            hover:text-black
            transition
            disabled:opacity-40
            disabled:cursor-not-allowed
            disabled:hover:bg-black
            disabled:hover:text-white
          "
        >
          <ShoppingBag size={20} />

          {isOutOfStock
            ? "Out of Stock"
            : "Add To Cart"}
        </button>

        <button
          type="button"
          onClick={async () => {
            if (wishlistBusy) return;
            setWishlistBusy(true);
            try { await toggleWishlist(product); } finally { setWishlistBusy(false); }
          }}
          disabled={wishlistBusy}
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          className="
            w-14
            h-14
            rounded-full
            bg-white
            border
            flex
            items-center
            justify-center
          "
        >
          <Heart
            size={20}
            fill={
              isWishlisted
                ? "black"
                : "transparent"
            }
          />
        </button>

      </div>

      {/* TRUST */}

      <div className="grid sm:grid-cols-2 gap-4 mt-10">

        {/* DELIVERY */}

        <div className="bg-white rounded-2xl p-5 flex gap-3 items-center">

          <Truck className="text-[#D4AF37]" />

          <div>
            <h4 className="font-semibold">
            Delivery Across India
          </h4>

          <p className="text-sm text-gray-500">
            Free above ₹10,000
          </p>
          </div>

        </div>

        {/* CERTIFICATION */}

        <div className="bg-white rounded-2xl p-5 flex gap-3 items-center">

          <ShieldCheck className="text-[#D4AF37]" />

          <div>
            <h4 className="font-semibold">
              925 Silver
            </h4>

            <p className="text-sm text-gray-500">
              Genuine Sterling Silver
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ProductInfo;