import { Link } from "react-router-dom";

import { Heart, ShoppingBag, Trash2 } from "lucide-react";

import { useCart } from "../context/CartContext";

const Wishlist = () => {
  const {
    wishlist = [],
    addToCart,
    removeFromWishlist,
  } = useCart();

  return (
    <div
      className="
        min-h-screen
        bg-[#FAF9F6]
        px-4
        sm:px-6
        py-10
      "
    >
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">

          <p
            className="
              text-[#D4AF37]
              uppercase
              tracking-[0.3em]
              text-xs
              sm:text-sm
              font-medium
            "
          >
            Favorites
          </p>

          <h1
            className="
              heading
              text-4xl
              sm:text-6xl
              text-[#111111]
              mt-3
            "
          >
            Wishlist
          </h1>

        </div>

        {/* EMPTY */}
        {wishlist.length === 0 ? (

          <div
            className="
              bg-white
              rounded-[2rem]
              p-10
              text-center
              border
              border-black/5
            "
          >
            <div
              className="
                w-20
                h-20
                rounded-full
                bg-[#D4AF37]/10
                flex
                items-center
                justify-center
                mx-auto
                mb-6
              "
            >
              <Heart
                size={36}
                className="text-[#D4AF37]"
              />
            </div>

            <h2
              className="
                heading
                text-3xl
                text-[#111111]
              "
            >
              Your Wishlist Is Empty
            </h2>

            <p className="text-gray-500 mt-3">
              Save your favorite jewelry items here.
            </p>

            <Link
              to="/shop"
              className="
                inline-flex
                items-center
                justify-center
                mt-8
                px-8
                h-14
                rounded-full
                bg-[#111111]
                text-white
                font-medium
                hover:bg-black
                transition-all
              "
            >
              Continue Shopping
            </Link>

          </div>

        ) : (

          <>
            {/* GRID */}
            <div
              className="
                grid
                grid-cols-2
                lg:grid-cols-4
                gap-4
                sm:gap-6
              "
            >

              {wishlist.map((product) => (

                <div
                  key={product.id}
                  className="
                    group
                    bg-white
                    rounded-[2rem]
                    overflow-hidden
                    border
                    border-black/5
                    hover:shadow-xl
                    transition-all
                    duration-500
                  "
                >
                  {/* IMAGE */}
                  <Link
                    to={`/product/${product.id}`}
                    className="block relative"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="
                        w-full
                        aspect-[4/5]
                        object-cover
                        transition-transform
                        duration-700
                        group-hover:scale-105
                      "
                    />

                    {/* REMOVE */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeFromWishlist(product.id);
                      }}
                      className="
                        absolute
                        top-4
                        right-4
                        w-10
                        h-10
                        rounded-full
                        bg-white/90
                        flex
                        items-center
                        justify-center
                        backdrop-blur-xl
                      "
                    >
                      <Trash2
                        size={18}
                        className="text-red-500"
                      />
                    </button>

                  </Link>

                  {/* CONTENT */}
                  <div className="p-4 sm:p-5">

                    <h3
                      className="
                        text-sm
                        sm:text-base
                        font-semibold
                        text-[#111111]
                        line-clamp-1
                      "
                    >
                      {product.name}
                    </h3>

                    <p
                      className="
                        text-[#D4AF37]
                        font-bold
                        text-lg
                        mt-2
                      "
                    >
                      ₹{product.price}
                    </p>

                    {/* BTN */}
                    <button
                      onClick={() => addToCart(product)}
                      className="
                        w-full
                        mt-4
                        h-12
                        rounded-full
                        bg-[#111111]
                        text-white
                        text-sm
                        font-medium
                        flex
                        items-center
                        justify-center
                        gap-2
                        hover:bg-black
                        transition-all
                      "
                    >
                      <ShoppingBag size={16} />

                      Add To Cart
                    </button>

                  </div>

                </div>

              ))}

            </div>
          </>

        )}

      </div>
    </div>
  );
};

export default Wishlist;