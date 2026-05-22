import { useState } from "react";

import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  PackageCheck,
} from "lucide-react";

import { useCart } from "../context/CartContext";

const Checkout = () => {

  const { cart } = useCart();

  /* ========================= */
  /* STATES */
  /* ========================= */

  const [orderPlaced, setOrderPlaced] =
    useState(false);

  const [paymentMethod, setPaymentMethod] =
    useState("cod");

  const [currentStep, setCurrentStep] =
    useState(1);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  /* ========================= */
  /* TOTAL */
  /* ========================= */

  const totalPrice = cart.reduce(
    (acc, item) =>
      acc +
      Number(item.price) *
        Number(item.quantity || 1),
    0
  );

  /* ========================= */
  /* INPUT */
  /* ========================= */

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ========================= */
  /* PLACE ORDER */
  /* ========================= */

  const handleSubmit = (e) => {

    e.preventDefault();

    setOrderPlaced(true);

    /* ORDER JUST PLACED */
    setCurrentStep(1);

    /* AUTO UPDATE */
    setTimeout(() => {
      setCurrentStep(2);
    }, 4000);

    setTimeout(() => {
      setCurrentStep(3);
    }, 8000);
  };

  /* ========================= */
  /* ORDER SUCCESS */
  /* ========================= */

  if (orderPlaced) {

    const steps = [
      {
        title: "Order Placed",
        icon: CheckCircle2,
      },

      {
        title: "Packed",
        icon: PackageCheck,
      },

      {
        title: "Shipped",
        icon: Truck,
      },

      {
        title: "Delivered",
        icon: ShieldCheck,
      },
    ];

    return (

      <div
        className="
          min-h-screen
          bg-[#FAF9F6]
          px-4
          py-10
          flex
          items-center
          justify-center
        "
      >

        <div
          className="
            w-full
            max-w-4xl
            bg-white
            rounded-[2rem]
            border
            border-black/5
            overflow-hidden
          "
        >

          {/* HEADER */}
          <div
            className="
              bg-[#111111]
              text-white
              px-6
              sm:px-10
              py-10
            "
          >

            <p
              className="
                uppercase
                tracking-[0.3em]
                text-xs
                text-[#D4AF37]
              "
            >
              Order Confirmed
            </p>

            <h1
              className="
                text-3xl
                sm:text-5xl
                font-bold
                mt-4
              "
            >
              Thank You For Shopping
            </h1>

            <p
              className="
                text-white/70
                mt-4
              "
            >
              Estimated delivery:
              3-5 business days
            </p>

          </div>

          {/* BODY */}
          <div
            className="
              px-6
              sm:px-10
              py-10
            "
          >

            {/* TRACKING */}
            <div
              className="
                relative
                flex
                justify-between
                items-center
                mb-16
              "
            >

              {/* BASE LINE */}
              <div
                className="
                  absolute
                  top-5
                  left-0
                  w-full
                  h-[3px]
                  bg-gray-200
                "
              />

              {/* ACTIVE LINE */}
              <div
                className="
                  absolute
                  top-5
                  left-0
                  h-[3px]
                  bg-[#D4AF37]
                  transition-all
                  duration-700
                "
                style={{
                  width:
                    currentStep === 1
                      ? "0%"
                      : currentStep === 2
                      ? "33%"
                      : currentStep === 3
                      ? "66%"
                      : "100%",
                }}
              />

              {steps.map((step, index) => {

                const Icon = step.icon;

                const active =
                  index <= currentStep;

                return (

                  <div
                    key={index}
                    className="
                      relative
                      z-10
                      flex
                      flex-col
                      items-center
                    "
                  >

                    <div
                      className={`
                        w-10
                        h-10
                        rounded-full
                        flex
                        items-center
                        justify-center
                        transition-all
                        duration-500
                        ${
                          active
                            ? "bg-[#D4AF37] text-black"
                            : "bg-gray-200 text-gray-500"
                        }
                      `}
                    >

                      <Icon size={18} />

                    </div>

                    <p
                      className="
                        text-[11px]
                        sm:text-sm
                        mt-3
                        font-medium
                        text-center
                      "
                    >
                      {step.title}
                    </p>

                  </div>

                );
              })}

            </div>

            {/* INFO */}
            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-3
                gap-5
              "
            >

              <div
                className="
                  bg-[#FAF9F6]
                  rounded-2xl
                  p-5
                "
              >

                <p className="text-sm text-gray-500">
                  Order ID
                </p>

                <h3
                  className="
                    text-xl
                    font-bold
                    mt-2
                  "
                >
                  MG2026#
                  {Math.floor(
                    Math.random() * 100000
                  )}
                </h3>

              </div>

              <div
                className="
                  bg-[#FAF9F6]
                  rounded-2xl
                  p-5
                "
              >

                <p className="text-sm text-gray-500">
                  Payment Method
                </p>

                <h3
                  className="
                    text-xl
                    font-bold
                    mt-2
                  "
                >
                  {paymentMethod === "cod"
                    ? "Cash On Delivery"
                    : "Card Payment"}
                </h3>

              </div>

              <div
                className="
                  bg-[#FAF9F6]
                  rounded-2xl
                  p-5
                "
              >

                <p className="text-sm text-gray-500">
                  Total Amount
                </p>

                <h3
                  className="
                    text-xl
                    font-bold
                    mt-2
                  "
                >
                  ₹ {totalPrice.toLocaleString()}
                </h3>

              </div>

            </div>

          </div>

        </div>

      </div>

    );
  }

  /* ========================= */
  /* CHECKOUT */
  /* ========================= */

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

      <div
        className="
          max-w-7xl
          mx-auto
          grid
          grid-cols-1
          lg:grid-cols-[1fr_420px]
          gap-8
        "
      >

        {/* LEFT */}
        <div
          className="
            bg-white
            border
            border-black/5
            rounded-[2rem]
            p-6
            sm:p-8
          "
        >

          <p
            className="
              text-[#D4AF37]
              uppercase
              tracking-[0.3em]
              text-xs
              font-semibold
            "
          >
            Secure Checkout
          </p>

          <h1
            className="
              text-4xl
              sm:text-5xl
              font-bold
              mt-4
            "
          >
            Delivery & Payment
          </h1>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-5"
          >

            {/* NAME */}
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="
                w-full
                h-[58px]
                rounded-2xl
                border
                border-black/10
                px-5
                outline-none
              "
            />

            {/* PHONE */}
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="
                w-full
                h-[58px]
                rounded-2xl
                border
                border-black/10
                px-5
                outline-none
              "
            />

            {/* EMAIL */}
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="
                w-full
                h-[58px]
                rounded-2xl
                border
                border-black/10
                px-5
                outline-none
              "
            />

            {/* ADDRESS */}
            <textarea
              name="address"
              placeholder="Full Address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="4"
              className="
                w-full
                rounded-2xl
                border
                border-black/10
                px-5
                py-4
                outline-none
                resize-none
              "
            />

            {/* CITY */}
            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-3
                gap-4
              "
            >

              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
                className="
                  w-full
                  h-[58px]
                  rounded-2xl
                  border
                  border-black/10
                  px-5
                  outline-none
                "
              />

              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                required
                className="
                  w-full
                  h-[58px]
                  rounded-2xl
                  border
                  border-black/10
                  px-5
                  outline-none
                "
              />

              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
                className="
                  w-full
                  h-[58px]
                  rounded-2xl
                  border
                  border-black/10
                  px-5
                  outline-none
                "
              />

            </div>

            {/* PAYMENT */}
            <div className="pt-5">

              <h3
                className="
                  text-xl
                  font-bold
                  mb-5
                "
              >
                Payment Method
              </h3>

              {/* COD */}
              <label
                className={`
                  flex
                  items-center
                  gap-4
                  border
                  rounded-2xl
                  p-5
                  cursor-pointer
                  transition-all
                  ${
                    paymentMethod === "cod"
                      ? "border-[#D4AF37] bg-[#D4AF37]/10"
                      : "border-black/10"
                  }
                `}
              >

                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() =>
                    setPaymentMethod("cod")
                  }
                />

                <div>

                  <h4 className="font-semibold">
                    Cash On Delivery
                  </h4>

                  <p className="text-sm text-gray-500">
                    Pay after receiving order
                  </p>

                </div>

              </label>

              {/* CARD */}
              <label
                className={`
                  flex
                  items-start
                  gap-4
                  border
                  rounded-2xl
                  p-5
                  mt-4
                  cursor-pointer
                  transition-all
                  ${
                    paymentMethod === "card"
                      ? "border-[#D4AF37] bg-[#D4AF37]/10"
                      : "border-black/10"
                  }
                `}
              >

                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "card"}
                  onChange={() =>
                    setPaymentMethod("card")
                  }
                />

                <div className="w-full">

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >

                    <CreditCard size={18} />

                    <h4 className="font-semibold">
                      Credit / Debit Card
                    </h4>

                  </div>

                  <p className="text-sm text-gray-500 mt-1">
                    Secure online payment
                  </p>

                  {paymentMethod === "card" && (

                    <div className="mt-5 space-y-4">

                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="Card Number"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        required
                        className="
                          w-full
                          h-[55px]
                          rounded-xl
                          border
                          border-black/10
                          px-4
                          outline-none
                        "
                      />

                      <input
                        type="text"
                        name="cardName"
                        placeholder="Card Holder Name"
                        value={formData.cardName}
                        onChange={handleChange}
                        required
                        className="
                          w-full
                          h-[55px]
                          rounded-xl
                          border
                          border-black/10
                          px-4
                          outline-none
                        "
                      />

                      <div
                        className="
                          grid
                          grid-cols-2
                          gap-4
                        "
                      >

                        <input
                          type="text"
                          name="expiry"
                          placeholder="MM/YY"
                          value={formData.expiry}
                          onChange={handleChange}
                          required
                          className="
                            w-full
                            h-[55px]
                            rounded-xl
                            border
                            border-black/10
                            px-4
                            outline-none
                          "
                        />

                        <input
                          type="password"
                          name="cvv"
                          placeholder="CVV"
                          value={formData.cvv}
                          onChange={handleChange}
                          required
                          className="
                            w-full
                            h-[55px]
                            rounded-xl
                            border
                            border-black/10
                            px-4
                            outline-none
                          "
                        />

                      </div>

                    </div>

                  )}

                </div>

              </label>

            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="
                w-full
                h-[60px]
                rounded-full
                bg-[#111111]
                text-white
                font-semibold
                text-lg
                mt-8
                hover:bg-[#D4AF37]
                hover:text-black
                transition-all
              "
            >
              Place Secure Order
            </button>

          </form>

        </div>

        {/* RIGHT */}
        <div>

          <div
            className="
              bg-white
              border
              border-black/5
              rounded-[2rem]
              p-6
              sticky
              top-28
            "
          >

            <h2
              className="
                text-2xl
                font-bold
              "
            >
              Order Summary
            </h2>

            <div
              className="
                mt-8
                space-y-5
              "
            >

              {cart.map((item) => (

                <div
                  key={item.id}
                  className="
                    flex
                    gap-4
                  "
                >

                  <div
                    className="
                      w-20
                      h-20
                      rounded-2xl
                      overflow-hidden
                    "
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                      className="
                        w-full
                        h-full
                        object-cover
                      "
                    />

                  </div>

                  <div className="flex-1">

                    <h4 className="font-semibold">
                      {item.name}
                    </h4>

                    <p
                      className="
                        text-sm
                        text-gray-500
                        mt-1
                      "
                    >
                      Qty:
                      {" "}
                      {item.quantity || 1}
                    </p>

                    <p
                      className="
                        font-bold
                        mt-2
                      "
                    >
                      ₹
                      {" "}
                      {Number(
                        item.price
                      ).toLocaleString()}
                    </p>

                  </div>

                </div>

              ))}

            </div>

            {/* TOTAL */}
            <div
              className="
                border-t
                border-black/10
                mt-8
                pt-6
                flex
                items-center
                justify-between
              "
            >

              <span
                className="
                  text-lg
                  font-semibold
                "
              >
                Total
              </span>

              <span
                className="
                  text-2xl
                  font-bold
                "
              >
                ₹ {totalPrice.toLocaleString()}
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Checkout;