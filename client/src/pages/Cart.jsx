import { Link } from "react-router-dom";

import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

import { useCart } from "../context/CartContext";

const Cart = () => {
  const {
    cart,
    removeFromCart,
    updateQty,
    subtotal,
    cartCount,
  } = useCart();

  const shipping = subtotal > 5000 ? 0 : 199;

  const tax = Math.floor(subtotal * 0.03);

  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-28 pb-20 px-4">

      <div className="max-w-7xl mx-auto">

        {/* PAGE HEADER */}
        <div className="mb-10">

          <p className="text-[#D4AF37] uppercase tracking-[0.25em] text-xs font-medium">
            Shopping Cart
          </p>

          <h1 className="heading text-4xl sm:text-5xl mt-4">
            Your Luxury Cart
          </h1>

          <p className="text-gray-500 mt-3">
            {cartCount} item{cartCount !== 1 ? "s" : ""} added in your cart
          </p>

        </div>

        {/* EMPTY */}
        {cart.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-10 sm:p-16 text-center luxury-shadow">

            <div className="w-24 h-24 mx-auto rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
              <ShoppingBag size={34} />
            </div>

            <h2 className="heading text-3xl mt-8">
              Your Cart Is Empty
            </h2>

            <p className="text-gray-500 mt-4 max-w-md mx-auto">
              Explore premium handcrafted jewellery collections
              and add your favorite pieces.
            </p>

            <Link to="/shop">
              <button
                className="
                  mt-8
                  bg-black
                  hover:bg-[#D4AF37]
                  hover:text-black
                  text-white
                  px-8
                  py-4
                  rounded-full
                  transition-all
                  duration-300
                  inline-flex
                  items-center
                  gap-2
                "
              >
                Continue Shopping
                <ArrowRight size={18} />
              </button>
            </Link>

          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

            {/* LEFT */}
            <div className="xl:col-span-2 space-y-5">

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="
                    bg-white
                    rounded-[2rem]
                    p-5
                    sm:p-6
                    flex
                    flex-col
                    sm:flex-row
                    gap-5
                    luxury-shadow
                  "
                >

                  {/* IMAGE */}
                  <div className="relative shrink-0">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="
                        w-full
                        sm:w-[160px]
                        h-[220px]
                        sm:h-[160px]
                        object-cover
                        rounded-[1.5rem]
                      "
                    />

                  </div>

                  {/* INFO */}
                  <div className="flex-1 flex flex-col justify-between">

                    <div>

                      <p className="text-[#D4AF37] uppercase tracking-widest text-xs">
                        Premium Jewellery
                      </p>

                      <h2 className="text-xl font-semibold mt-2">
                        {item.name}
                      </h2>

                      <p className="text-2xl font-bold mt-4">
                        ₹{Number(item.price).toLocaleString()}
                      </p>

                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center justify-between mt-6">

                      {/* QTY */}
                      <div className="flex items-center gap-3">

                        <button
                          onClick={() =>
                            updateQty(item.id, "dec")
                          }
                          className="
                            w-10
                            h-10
                            rounded-full
                            border
                            border-black/10
                            flex
                            items-center
                            justify-center
                            hover:bg-black
                            hover:text-white
                            transition
                          "
                        >
                          <Minus size={16} />
                        </button>

                        <span className="font-semibold min-w-[20px] text-center">
                          {item.qty}
                        </span>

                        <button
                          onClick={() =>
                            updateQty(item.id, "inc")
                          }
                          className="
                            w-10
                            h-10
                            rounded-full
                            border
                            border-black/10
                            flex
                            items-center
                            justify-center
                            hover:bg-black
                            hover:text-white
                            transition
                          "
                        >
                          <Plus size={16} />
                        </button>

                      </div>

                      {/* REMOVE */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="
                          text-red-500
                          hover:bg-red-50
                          w-11
                          h-11
                          rounded-full
                          flex
                          items-center
                          justify-center
                          transition
                        "
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </div>

                </div>
              ))}

            </div>

            {/* RIGHT SUMMARY */}
            <div
              className="
                bg-white
                rounded-[2rem]
                p-6
                sm:p-8
                h-fit
                sticky
                top-28
                luxury-shadow
              "
            >

              <h2 className="heading text-3xl">
                Order Summary
              </h2>

              {/* PRICE DETAILS */}
              <div className="mt-8 space-y-5">

                <div className="flex items-center justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <span>Shipping</span>

                  <span>
                    {shipping === 0
                      ? "Free"
                      : `₹${shipping}`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <span>Luxury Tax</span>

                  <span>
                    ₹{tax.toLocaleString()}
                  </span>
                </div>

                <div className="border-t border-black/10 pt-5 flex items-center justify-between">

                  <span className="text-lg font-semibold">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-[#D4AF37]">
                    ₹{total.toLocaleString()}
                  </span>

                </div>

              </div>

              {/* CHECKOUT */}
              <Link to="/checkout">

                <button
                  className="
                    mt-8
                    w-full
                    bg-black
                    hover:bg-[#D4AF37]
                    hover:text-black
                    text-white
                    py-4
                    rounded-full
                    flex
                    items-center
                    justify-center
                    gap-2
                    transition-all
                    duration-300
                    font-medium
                  "
                >
                  <ShoppingBag size={18} />
                  Proceed To Checkout
                </button>

              </Link>

              {/* SAFE */}
              <div className="mt-6 text-sm text-gray-500 leading-relaxed">

                Secure checkout experience with future-ready
                payment integration support for Razorpay,
                Stripe & Cashfree.

              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default Cart;