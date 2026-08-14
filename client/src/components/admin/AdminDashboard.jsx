import {
  useEffect,
  useState,
} from "react";

import {
  IndianRupee,
  Package,
  ShoppingBag,
  Users,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

import {
  getAdminDashboard,
} from "../../api/admin.api";

import {
  getRevenueAnalytics,
} from "../../api/dashboard.api";

import AdminStatCard from "./AdminStatCard";
import {
  AdminButton,
  AdminPage,
} from "./AdminUI";

export default function AdminDashboard() {
  const [
    range,
    setRange,
  ] = useState("all");

  const [
    dashboard,
    setDashboard,
  ] = useState(null);

  const [
    revenue,
    setRevenue,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const [
        dashboardResponse,
        revenueResponse,
      ] = await Promise.all([
        getAdminDashboard(range),
        getRevenueAnalytics(range),
      ]);

      setDashboard(
        dashboardResponse?.data?.data ||
          null
      );

      const revenueData =
        revenueResponse?.data?.data;

      setRevenue(
        Array.isArray(revenueData)
          ? revenueData
          : revenueData?.data ||
            revenueData?.series ||
            []
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Dashboard data load nahi ho saka."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [range]);

  const overview =
    dashboard?.overview || {};

  const orders =
    dashboard?.orders || {};

  const inventory =
    dashboard?.inventory || {};

  return (
    <AdminPage
      title="Overview"
      description="Store performance and business overview"
      action={
        <div className="flex gap-2">
          {[
            ["all", "All Time"],
            ["today", "Today"],
            ["7d", "7 Days"],
            ["30d", "30 Days"],
          ].map(
            ([value, label]) => (
              <button
                key={value}
                onClick={() =>
                  setRange(value)
                }
                className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                  range === value
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-500 border border-slate-200"
                }`}
              >
                {label}
              </button>
            )
          )}

          <AdminButton
            variant="soft"
            onClick={load}
          >
            <RefreshCw
              size={15}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />
          </AdminButton>
        </div>
      }
    >
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          title="Revenue"
          value={`₹${Number(
            overview.revenue || 0
          ).toLocaleString("en-IN")}`}
          icon={IndianRupee}
          iconClass="bg-amber-50 text-[#B88A44]"
        />

        <AdminStatCard
          title="Orders"
          value={overview.orders || 0}
          icon={ShoppingBag}
          iconClass="bg-blue-50 text-blue-600"
        />

        <AdminStatCard
          title="Products"
          value={overview.products || 0}
          icon={Package}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <AdminStatCard
          title="Customers"
          value={overview.customers || 0}
          icon={Users}
          iconClass="bg-violet-50 text-violet-600"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">
                Revenue Overview
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Backend revenue analytics
              </p>
            </div>
          </div>

          <div className="mt-6 flex h-64 items-end gap-2 overflow-hidden">
            {revenue.length > 0 ? (
              revenue
                .slice(-14)
                .map(
                  (item, index) => {
                    const value =
                      Number(
                        item.revenue ??
                          item.totalRevenue ??
                          item.amount ??
                          0
                      );

                    const max =
                      Math.max(
                        ...revenue.map(
                          (x) =>
                            Number(
                              x.revenue ??
                                x.totalRevenue ??
                                x.amount ??
                                0
                            )
                        ),
                        1
                      );

                    return (
                      <div
                        key={index}
                        className="flex min-w-[20px] flex-1 flex-col justify-end"
                      >
                        <div
                          title={`₹${value.toLocaleString(
                            "en-IN"
                          )}`}
                          className="rounded-t-md bg-[#B88A44] transition hover:bg-[#9f7537]"
                          style={{
                            height: `${Math.max(
                              (value / max) *
                                220,
                              value
                                ? 8
                                : 2
                            )}px`,
                          }}
                        />
                      </div>
                    );
                  }
                )
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                No revenue data
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-slate-900">
            Order Status
          </h2>

          <div className="mt-6 space-y-4">
            <StatusRow
              label="Pending"
              value={orders.pending}
              className="bg-amber-500"
            />

            <StatusRow
              label="Completed"
              value={orders.completed}
              className="bg-emerald-500"
            />

            <StatusRow
              label="Cancelled"
              value={orders.cancelled}
              className="bg-rose-500"
            />

            <StatusRow
              label="Low Stock"
              value={inventory.lowStock}
              className="bg-orange-500"
              icon={
                <AlertTriangle
                  size={14}
                />
              }
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="font-bold text-slate-900">
            Recent Orders
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-6 py-3">
                  Order
                </th>
                <th className="px-6 py-3">
                  Customer
                </th>
                <th className="px-6 py-3">
                  Amount
                </th>
                <th className="px-6 py-3">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {(dashboard?.recentOrders ||
                []).map((order) => (
                <tr
                  key={order._id}
                  className="border-t border-slate-100"
                >
                  <td className="px-6 py-4 font-semibold text-slate-800">
                    {order.orderNumber ||
                      order._id?.slice(
                        -8
                      )}
                  </td>

                  <td className="px-6 py-4 text-slate-500">
                    {order.customer
                      ?.name ||
                      "Customer"}
                  </td>

                  <td className="px-6 py-4 font-semibold">
                    ₹
                    {Number(
                      order.totalAmount ||
                        0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {order.orderStatus ||
                        "Pending"}
                    </span>
                  </td>
                </tr>
              ))}

              {!dashboard?.recentOrders
                ?.length && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    No recent orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPage>
  );
}

function StatusRow({
  label,
  value,
  className,
  icon,
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <span
          className={`h-2.5 w-2.5 rounded-full ${className}`}
        />

        {icon}

        {label}
      </div>

      <strong className="text-slate-900">
        {value || 0}
      </strong>
    </div>
  );
}