import {
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
} from "lucide-react";

import { useCart } from "../../context/CartContext";

const ProductInfo = ({ product }) => {
  const {
    addToCart,
    toggleWishlist,
    wishlist = [],
  } = useCart();

  const isWishlisted = wishlist.some(
    (item) =>
      (item._id || item.id) ===
      (product._id || product.id)
  );

  return (
    <div className="flex flex-col justify-center">
      <p
        className="
          text-xs
          uppercase
          tracking-[0.3em]
          text-[#D4AF37]
          font-semibold
        "
      >
        {product.metal || "Gold"} •{" "}
        {product.category?.name ||
          product.category}
      </p>

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

      <div className="mt-6">
        <p className="text-4xl font-bold">
          ₹
          {Number(
            product.price || 0
          ).toLocaleString()}
        </p>

        <p className="text-sm text-gray-500 mt-2">
          Inclusive of all taxes
        </p>
      </div>

      {/* DETAILS */}

      <div className="grid grid-cols-2 gap-4 mt-8">

        <div className="bg-white rounded-xl p-4">
          <p className="text-xs text-gray-500">
            Purity
          </p>

          <p className="font-semibold mt-1">
            {product.purity ||
              "22K Gold"}
          </p>
        </div>

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

        <div className="bg-white rounded-xl p-4">
          <p className="text-xs text-gray-500">
            Stock
          </p>

          <p className="font-semibold">
            {product.stock ??
              "Available"}
          </p>
        </div>

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

      <p
        className="
          text-gray-600
          leading-relaxed
          mt-8
        "
      >
        {product.description ||
          "Premium handcrafted jewellery made with certified gold."}
      </p>

      {/* BUTTONS */}

      <div className="flex gap-4 mt-10">

        <button
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
          "
        >
          <ShoppingBag size={20} />
          Add To Cart
        </button>

        <button
          onClick={() =>
            toggleWishlist(product)
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

        <div className="bg-white rounded-2xl p-5 flex gap-3 items-center">

          <Truck className="text-[#D4AF37]" />

          <div>
            <h4 className="font-semibold">
              Free Delivery
            </h4>

            <p className="text-sm text-gray-500">
              Across India
            </p>
          </div>

        </div>

        <div className="bg-white rounded-2xl p-5 flex gap-3 items-center">

          <ShieldCheck className="text-[#D4AF37]" />

          <div>
            <h4 className="font-semibold">
              BIS Certified
            </h4>

            <p className="text-sm text-gray-500">
              Genuine Jewellery
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ProductInfo;