import { useEffect, useState } from "react";

import {
  PackageCheck,
  ChevronRight,
  CalendarDays,
  CreditCard,
} from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const data =
      JSON.parse(localStorage.getItem("orders")) || [];

    setOrders(data);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-28 pb-20 px-4">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">

          <p className="text-[#D4AF37] uppercase tracking-[0.25em] text-xs font-medium">
            Purchase History
          </p>

          <h1 className="heading text-4xl sm:text-5xl mt-4">
            My Orders
          </h1>

          <p className="text-gray-500 mt-3">
            Track all your premium jewellery purchases
          </p>

        </div>

        {/* EMPTY */}
        {orders.length === 0 && (
          <div className="bg-white rounded-[2rem] p-14 text-center luxury-shadow">

            <div className="w-24 h-24 mx-auto rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
              <PackageCheck size={34} />
            </div>

            <h2 className="heading text-3xl mt-8">
              No Orders Yet
            </h2>

            <p className="text-gray-500 mt-4">
              Your placed orders will appear here.
            </p>

          </div>
        )}

        {/* ORDERS */}
        <div className="space-y-8">

          {orders.map((order) => (
            <div
              key={order.id}
              className="
                bg-white
                rounded-[2rem]
                p-6
                sm:p-8
                luxury-shadow
              "
            >

              {/* TOP */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 border-b border-black/5 pb-6">

                <div>

                  <p className="text-xs uppercase tracking-widest text-[#D4AF37]">
                    Order ID
                  </p>

                  <h2 className="font-semibold text-xl mt-2">
                    {order.id}
                  </h2>

                </div>

                <div className="flex flex-wrap gap-5 text-sm text-gray-500">

                  <div className="flex items-center gap-2">
                    <CalendarDays size={16} />
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-2 uppercase">
                    <CreditCard size={16} />
                    {order.paymentMethod}
                  </div>

                </div>

              </div>

              {/* ITEMS */}
              <div className="mt-8 space-y-5">

                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="
                      flex
                      flex-col
                      sm:flex-row
                      sm:items-center
                      gap-4
                    "
                  >

                    {/* IMAGE */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="
                        w-full
                        sm:w-24
                        h-52
                        sm:h-24
                        object-cover
                        rounded-2xl
                      "
                    />

                    {/* INFO */}
                    <div className="flex-1">

                      <h3 className="font-semibold text-lg">
                        {item.name}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Quantity : {item.qty}
                      </p>

                    </div>

                    {/* PRICE */}
                    <div className="text-xl font-bold text-[#D4AF37]">
                      ₹
                      {(
                        item.price * item.qty
                      ).toLocaleString()}
                    </div>

                  </div>
                ))}

              </div>

              {/* FOOTER */}
              <div className="mt-8 pt-6 border-t border-black/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

                {/* STATUS */}
                <div className="flex items-center gap-3">

                  <div className="w-3 h-3 rounded-full bg-green-500" />

                  <p className="font-medium">
                    Order Confirmed
                  </p>

                </div>

                {/* TOTAL */}
                <div className="flex items-center gap-4">

                  <p className="text-gray-500">
                    Total
                  </p>

                  <h3 className="text-3xl font-bold text-[#D4AF37]">
                    ₹
                    {order.pricing?.total?.toLocaleString()}
                  </h3>

                </div>

              </div>

              {/* ADDRESS */}
              <div className="mt-6 bg-[#FAF9F6] rounded-2xl p-5">

                <p className="text-xs uppercase tracking-widest text-[#D4AF37]">
                  Delivery Address
                </p>

                <p className="mt-3 text-gray-700 leading-relaxed">
                  {order.address?.name},
                  {" "}
                  {order.address?.address},
                  {" "}
                  {order.address?.city},
                  {" "}
                  {order.address?.state}
                  {" - "}
                  {order.address?.pincode}
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
};

export default Orders;