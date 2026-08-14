import { useEffect, useState } from "react";
import {
  Eye,
  Search,
  RefreshCw,
} from "lucide-react";

import {
  getAdminOrders,
  getAdminOrder,
  updateAdminOrderStatus,
} from "../../api/admin.api";

import {
  AdminButton,
  AdminSelect,
  AdminModal,
  AdminPage,
} from "./AdminUI";

const orderStatuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrders() {
  const [orders, setOrders] =
    useState([]);

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [updatingId, setUpdatingId] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const load = async () => {
    setLoading(true);

    try {
      const response =
        await getAdminOrders({
          page: 1,
          limit: 100,
          search,
          status,
        });

      const data =
        response?.data?.data;

      setOrders(
        data?.orders ||
          (Array.isArray(data)
            ? data
            : [])
      );
    } catch (error) {
      console.error(
        "Orders load failed:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [status]);

  const viewOrder = async (id) => {
    try {
      const response =
        await getAdminOrder(id);

      const data =
        response?.data?.data;

      setSelectedOrder(
        data?.order || data
      );

      setOpen(true);
    } catch (error) {
      console.error(
        "Order details failed:",
        error
      );
    }
  };

  const changeStatus = async (
    id,
    nextStatus
  ) => {
    setUpdatingId(id);

    try {
      await updateAdminOrderStatus(
        id,
        nextStatus
      );

      await load();

      if (
        selectedOrder?._id === id
      ) {
        const response =
          await getAdminOrder(id);

        const data =
          response?.data?.data;

        setSelectedOrder(
          data?.order || data
        );
      }
    } catch (error) {
      console.error(
        "Order status update failed:",
        error
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const customerName = (order) =>
    order?.customer?.name ||
    order?.user?.name ||
    order?.shippingAddress
      ?.name ||
    "Customer";

  const customerEmail = (order) =>
    order?.customer?.email ||
    order?.user?.email ||
    "—";

  const orderTotal = (order) =>
    Number(
      order?.totalAmount ??
        order?.total ??
        order?.grandTotal ??
        0
    );

  return (
    <AdminPage
      title="Orders"
      description="Manage customer orders and fulfilment"
      action={
        <AdminButton
          variant="soft"
          onClick={load}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />
          Refresh
        </AdminButton>
      }
    >
      <div className="grid gap-4 md:grid-cols-[1fr_220px_auto]">
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                load();
              }
            }}
            placeholder="Search order/customer..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#B88A44]"
          />
        </div>

        <AdminSelect
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >
          <option value="">
            All Statuses
          </option>

          {orderStatuses.map(
            (item) => (
              <option
                key={item}
                value={item}
              >
                {formatStatus(item)}
              </option>
            )
          )}
        </AdminSelect>

        <AdminButton
          variant="soft"
          onClick={load}
        >
          Apply
        </AdminButton>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-5 py-4">
                  Order
                </th>

                <th className="px-5 py-4">
                  Customer
                </th>

                <th className="px-5 py-4">
                  Date
                </th>

                <th className="px-5 py-4">
                  Amount
                </th>

                <th className="px-5 py-4">
                  Payment
                </th>

                <th className="px-5 py-4">
                  Status
                </th>

                <th className="px-5 py-4 text-right">
                  View
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t border-slate-100"
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">
                      {order.orderNumber ||
                        order._id?.slice(
                          -10
                        )}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-700">
                      {customerName(
                        order
                      )}
                    </p>

                    <p className="text-xs text-slate-400">
                      {customerEmail(
                        order
                      )}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-slate-500">
                    {order.createdAt
                      ? new Date(
                          order.createdAt
                        ).toLocaleDateString(
                          "en-IN"
                        )
                      : "—"}
                  </td>

                  <td className="px-5 py-4 font-bold text-slate-800">
                    ₹
                    {orderTotal(
                      order
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <div className="text-xs">
                      <p className="font-medium text-slate-600">
                        {order.paymentMethod ||
                          "—"}
                      </p>

                      <p
                        className={`mt-1 ${
                          String(
                            order.paymentStatus ||
                              ""
                          ).toLowerCase() ===
                          "paid"
                            ? "text-emerald-600"
                            : "text-amber-600"
                        }`}
                      >
                        {order.paymentStatus ||
                          "Pending"}
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <AdminSelect
                      value={
                        order.orderStatus ||
                        "pending"
                      }
                      disabled={
                        updatingId ===
                        order._id
                      }
                      onChange={(e) =>
                        changeStatus(
                          order._id,
                          e.target.value
                        )
                      }
                    >
                      {orderStatuses.map(
                        (item) => (
                          <option
                            key={item}
                            value={item}
                          >
                            {formatStatus(
                              item
                            )}
                          </option>
                        )
                      )}
                    </AdminSelect>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() =>
                        viewOrder(
                          order._id
                        )
                      }
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}

              {!orders.length &&
                !loading && (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-12 text-center text-slate-400"
                    >
                      No orders found.
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </div>

      <AdminModal
        open={open}
        onClose={() =>
          setOpen(false)
        }
        title="Order Details"
        width="max-w-4xl"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <InfoCard
                label="Order Number"
                value={
                  selectedOrder.orderNumber ||
                  selectedOrder._id
                }
              />

              <InfoCard
                label="Customer"
                value={customerName(
                  selectedOrder
                )}
              />

              <InfoCard
                label="Total"
                value={`₹${orderTotal(
                  selectedOrder
                ).toLocaleString(
                  "en-IN"
                )}`}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-4">
                <h3 className="font-bold text-slate-800">
                  Customer
                </h3>

                <div className="mt-3 space-y-2 text-sm text-slate-500">
                  <p>
                    Name:{" "}
                    {customerName(
                      selectedOrder
                    )}
                  </p>

                  <p>
                    Email:{" "}
                    {customerEmail(
                      selectedOrder
                    )}
                  </p>

                  <p>
                    Phone:{" "}
                    {selectedOrder
                      ?.customer
                      ?.phone ||
                      selectedOrder
                        ?.user
                        ?.phone ||
                      "—"}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <h3 className="font-bold text-slate-800">
                  Shipping Address
                </h3>

                <div className="mt-3 text-sm leading-6 text-slate-500">
                  <Address
                    address={
                      selectedOrder.shippingAddress
                    }
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200">
              <div className="border-b border-slate-200 px-4 py-3">
                <h3 className="font-bold text-slate-800">
                  Order Items
                </h3>
              </div>

              <div className="divide-y divide-slate-100">
                {(
                  selectedOrder.items ||
                  []
                ).map(
                  (item, index) => (
                    <div
                      key={
                        item._id ||
                        index
                      }
                      className="flex items-center justify-between gap-4 px-4 py-4"
                    >
                      <div>
                        <p className="font-semibold text-slate-800">
                          {item.product
                            ?.name ||
                            item.name ||
                            "Product"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Qty:{" "}
                          {item.quantity ||
                            1}
                        </p>
                      </div>

                      <p className="font-semibold text-slate-800">
                        ₹
                        {Number(
                          item.total ||
                            item.price ||
                            0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>
                  )
                )}

                {!selectedOrder
                  .items?.length && (
                  <div className="px-4 py-8 text-center text-sm text-slate-400">
                    No item details
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-slate-50 p-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Order Status
                </p>

                <p className="mt-1 font-bold text-slate-800">
                  {formatStatus(
                    selectedOrder.orderStatus ||
                      "pending"
                  )}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <AdminSelect
                  value={
                    selectedOrder.orderStatus ||
                    "pending"
                  }
                  disabled={
                    updatingId ===
                    selectedOrder._id
                  }
                  onChange={(e) =>
                    changeStatus(
                      selectedOrder._id,
                      e.target.value
                    )
                  }
                >
                  {orderStatuses.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {formatStatus(
                          item
                        )}
                      </option>
                    )
                  )}
                </AdminSelect>
              </div>
            </div>
          </div>
        )}
      </AdminModal>
    </AdminPage>
  );
}

function formatStatus(status) {
  return String(status || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}

function InfoCard({
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate font-bold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function Address({ address }) {
  if (!address) {
    return <span>—</span>;
  }

  return (
    <>
      {address.name && (
        <div>{address.name}</div>
      )}

      {address.addressLine1 && (
        <div>
          {address.addressLine1}
        </div>
      )}

      {address.addressLine2 && (
        <div>
          {address.addressLine2}
        </div>
      )}

      <div>
        {[
          address.city,
          address.state,
          address.postalCode ||
            address.pincode,
        ]
          .filter(Boolean)
          .join(", ")}
      </div>

      {address.country && (
        <div>{address.country}</div>
      )}

      {address.phone && (
        <div>
          Phone: {address.phone}
        </div>
      )}
    </>
  );
}