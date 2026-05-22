import { useState } from "react";

import { useParams } from "react-router-dom";

import { Heart, ShoppingBag, Truck, ShieldCheck } from "lucide-react";

import { useProducts } from "../context/ProductContext";

import { useCart } from "../context/CartContext";

const ProductDetail = () => {

  const { id } = useParams();

  const { products } = useProducts();

  const { addToCart, addToWishlist } = useCart();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  const [selectedImage, setSelectedImage] = useState(
    product?.image
  );

  if (!product) {

    return (
      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          text-xl
          font-semibold
        "
      >
        Product not found
      </div>
    );
  }

  return (
    <div
      className="
        bg-[#FAF9F6]
        min-h-screen
        py-10
        sm:py-16
        px-4
        sm:px-6
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-10
          lg:gap-16
        "
      >

        {/* ====================== */}
        {/* LEFT IMAGES */}
        {/* ====================== */}

        <div>

          {/* MAIN IMAGE */}
          <div
            className="
              overflow-hidden
              rounded-[2rem]
              bg-white
              border
              border-black/5
            "
          >

            <img
              src={selectedImage}
              alt={product.name}
              className="
                w-full
                aspect-[4/5]
                object-cover
                hover:scale-105
                transition-all
                duration-700
              "
            />

          </div>

          {/* THUMBNAILS */}
          <div
            className="
              flex
              gap-3
              mt-4
              overflow-x-auto
            "
          >

            {[product.image, product.hoverImage]
              .filter(Boolean)
              .map((img, index) => (

                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`
                    min-w-[90px]
                    rounded-2xl
                    overflow-hidden
                    border-2
                    ${
                      selectedImage === img
                        ? "border-[#D4AF37]"
                        : "border-transparent"
                    }
                  `}
                >

                  <img
                    src={img}
                    alt=""
                    className="
                      w-full
                      h-[100px]
                      object-cover
                    "
                  />

                </button>

            ))}

          </div>

        </div>

        {/* ====================== */}
        {/* RIGHT CONTENT */}
        {/* ====================== */}

        <div
          className="
            flex
            flex-col
            justify-center
          "
        >

          {/* CATEGORY */}
          <p
            className="
              text-xs
              uppercase
              tracking-[0.3em]
              text-[#D4AF37]
              font-semibold
            "
          >
            {product.metal} • {product.category}
          </p>

          {/* TITLE */}
          <h1
            className="
              text-3xl
              sm:text-5xl
              font-bold
              text-[#111111]
              mt-4
              leading-tight
            "
          >
            {product.name}
          </h1>

          {/* PRICE */}
          <div className="mt-6">

            <p
              className="
                text-4xl
                font-bold
                text-[#111111]
              "
            >
              ₹ {product.price.toLocaleString()}
            </p>

            <p
              className="
                text-sm
                text-gray-500
                mt-2
              "
            >
              Inclusive of all taxes
            </p>

          </div>

          {/* DESCRIPTION */}
          <div
            className="
              mt-8
              text-gray-600
              leading-relaxed
              space-y-4
            "
          >

            <p>
              Crafted with precision and timeless
              elegance, this luxury jewelry piece
              is designed for modern fashion lovers.
            </p>

            <p>
              Premium quality finish with refined
              detailing for a sophisticated look.
            </p>

          </div>

          {/* BUTTONS */}
          <div
            className="
              flex
              flex-col
              sm:flex-row
              gap-4
              mt-10
            "
          >

            {/* ADD TO CART */}
            <button
              onClick={() => addToCart(product)}
              className="
                flex-1
                h-[58px]
                rounded-full
                bg-[#111111]
                text-white
                font-semibold
                flex
                items-center
                justify-center
                gap-3
                hover:bg-[#D4AF37]
                hover:text-black
                transition-all
              "
            >

              <ShoppingBag size={20} />

              Add To Cart

            </button>

            {/* WISHLIST */}
            <button
              onClick={() => addToWishlist(product)}
              className="
                w-full
                sm:w-[58px]
                h-[58px]
                rounded-full
                border
                border-black/10
                bg-white
                flex
                items-center
                justify-center
                hover:bg-[#111111]
                hover:text-white
                transition-all
              "
            >

              <Heart size={20} />

            </button>

          </div>

          {/* FEATURES */}
          <div
            className="
              mt-12
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-4
            "
          >

            <div
              className="
                bg-white
                border
                border-black/5
                rounded-2xl
                p-5
                flex
                items-center
                gap-4
              "
            >

              <div
                className="
                  w-12
                  h-12
                  rounded-full
                  bg-[#D4AF37]/10
                  flex
                  items-center
                  justify-center
                "
              >
                <Truck size={20} />
              </div>

              <div>

                <h4 className="font-semibold">
                  Free Delivery
                </h4>

                <p className="text-sm text-gray-500">
                  Fast & secure shipping
                </p>

              </div>

            </div>

            <div
              className="
                bg-white
                border
                border-black/5
                rounded-2xl
                p-5
                flex
                items-center
                gap-4
              "
            >

              <div
                className="
                  w-12
                  h-12
                  rounded-full
                  bg-[#D4AF37]/10
                  flex
                  items-center
                  justify-center
                "
              >
                <ShieldCheck size={20} />
              </div>

              <div>

                <h4 className="font-semibold">
                  Certified Jewelry
                </h4>

                <p className="text-sm text-gray-500">
                  100% authenticity guarantee
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ProductDetail;