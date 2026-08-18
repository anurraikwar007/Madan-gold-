import {
  useEffect,
  useState,
} from "react";

import {
  AlertTriangle,
 
  BarChart3,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Package,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  getAdminDashboard,
} from "../../api/admin.api";

import {
  getDashboardAnalytics,
  getRevenueAnalytics,
  getSalesTrend,
  getDailyRevenue,
} from "../../api/dashboard.api";

import AdminStatCard from "./AdminStatCard";

import {
  AdminButton,
  AdminPage,
} from "./AdminUI";

/* =========================================================
   CONSTANTS
========================================================= */

const RANGE_OPTIONS = [
  ["all", "All Time"],
  ["today", "Today"],
  ["week", "7 Days"],
  ["month", "30 Days"],
  ["year", "This Year"],
];

const STATUS_COLORS = {
  Pending: "#F59E0B",
  Delivered: "#10B981",
  Cancelled: "#EF4444",
  Shipped: "#3B82F6",
  Processing: "#8B5CF6",
  Returned: "#F97316",
};

const CHART_TOOLTIP_STYLE = {
  borderRadius: 12,
  border: "1px solid #E2E8F0",
  boxShadow:
    "0 10px 30px rgba(15, 23, 42, 0.10)",
};

/* =========================================================
   HELPERS
========================================================= */

function getResponseData(response) {
  return (
    response?.data?.data ??
    response?.data ??
    null
  );
}

function toNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function formatCurrency(value) {
  return `₹${toNumber(value).toLocaleString(
    "en-IN"
  )}`;
}

function formatCompactCurrency(value) {
  const number = toNumber(value);

  if (number >= 10000000) {
    return `₹${(number / 10000000).toFixed(1)}Cr`;
  }

  if (number >= 100000) {
    return `₹${(number / 100000).toFixed(1)}L`;
  }

  if (number >= 1000) {
    return `₹${(number / 1000).toFixed(1)}K`;
  }

  return `₹${number}`;
}

function formatDate(date) {
  if (!date) {
    return "—";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function formatShortDate(item) {
  const id = item?._id;

  if (
    id &&
    typeof id === "object" &&
    id.day &&
    id.month
  ) {
    return `${String(id.day).padStart(
      2,
      "0"
    )}/${String(id.month).padStart(
      2,
      "0"
    )}`;
  }

  if (item?.date) {
    const date = new Date(item.date);

    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
        }
      );
    }
  }

  return "—";
}

function getOrderStatus(order) {
  return (
    order?.orderStatus ||
    order?.status ||
    "Pending"
  );
}

function getOrderAmount(order) {
  return toNumber(
    order?.totalAmount ??
      order?.grandTotal ??
      order?.amount
  );
}

function getCustomerName(order) {
  return (
    order?.customer?.name ||
    order?.customerName ||
    "Guest Customer"
  );
}

function normalizeSalesTrend(data) {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((item) => ({
    label: formatShortDate(item),
    revenue: toNumber(item?.revenue),
    orders: toNumber(item?.orders),
  }));
}

function normalizeDailyRevenue(data) {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((item) => ({
    label: formatShortDate(item),
    revenue: toNumber(item?.revenue),
  }));
}

function normalizeMonthlySales(data) {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((item) => {
    const id = item?._id;

    let label = item?.label || item?.month;

    if (
      !label &&
      id &&
      typeof id === "object"
    ) {
      if (id.month) {
        label = `M${id.month}`;
      }
    }

    return {
      label: label || "—",
      revenue: toNumber(
        item?.revenue ??
          item?.totalRevenue ??
          item?.sales ??
          item?.total
      ),
      orders: toNumber(
        item?.orders ??
          item?.totalOrders ??
          item?.count
      ),
    };
  });
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function AdminDashboard() {
  const [range, setRange] =
    useState("all");

  const [dashboard, setDashboard] =
    useState(null);

  const [revenueAnalytics, setRevenueAnalytics] =
    useState(null);

  const [salesTrend, setSalesTrend] =
    useState([]);

  const [dailyRevenue, setDailyRevenue] =
    useState([]);

  const [monthlySales, setMonthlySales] =
    useState([]);

  const [topProducts, setTopProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [refreshKey, setRefreshKey] =
    useState(0);

  /* =======================================================
     LOAD DASHBOARD
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const [
          dashboardResponse,
          revenueResponse,
          salesResponse,
          dailyRevenueResponse,
          analyticsResponse,
        ] = await Promise.all([
          getAdminDashboard(range),

          getRevenueAnalytics(range),

          getSalesTrend(range),

          getDailyRevenue(range),

          getDashboardAnalytics(),
        ]);

        if (!mounted) {
          return;
        }

        const dashboardData =
          getResponseData(
            dashboardResponse
          ) || {};

        const revenueData =
          getResponseData(
            revenueResponse
          ) || {};

        const salesData =
          getResponseData(
            salesResponse
          ) || [];

        const dailyData =
          getResponseData(
            dailyRevenueResponse
          ) || [];

        const analyticsData =
          getResponseData(
            analyticsResponse
          ) || {};

        setDashboard(
          dashboardData
        );

        setRevenueAnalytics(
          revenueData
        );

        setSalesTrend(
          normalizeSalesTrend(
            salesData
          )
        );

        setDailyRevenue(
          normalizeDailyRevenue(
            dailyData
          )
        );

        setMonthlySales(
          normalizeMonthlySales(
            analyticsData?.monthlySales
          )
        );

        setTopProducts(
          Array.isArray(
            analyticsData?.topProducts
          )
            ? analyticsData.topProducts
            : []
        );
      } catch (err) {
        console.error(
          "Admin dashboard load failed:",
          err
        );

        if (!mounted) {
          return;
        }

        setError(
          err?.response?.data?.message ||
            "Dashboard data load nahi ho saka."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadDashboard();

    return () => {
      mounted = false;
    };
  }, [range, refreshKey]);

  /* =======================================================
     DATA
  ======================================================= */

  const overview =
    dashboard?.overview || {};

  const orders =
    dashboard?.orders || {};

  const inventory =
    dashboard?.inventory || {};

  const recentOrders =
    Array.isArray(
      dashboard?.recentOrders
    )
      ? dashboard.recentOrders
      : [];

  const lowStockProducts =
    Array.isArray(
      dashboard?.lowStockProducts
    )
      ? dashboard.lowStockProducts
      : [];

  const totalRevenue =
    toNumber(
      revenueAnalytics?.totalRevenue ??
        overview?.revenue
    );

  const totalOrders =
    toNumber(
      revenueAnalytics?.totalOrders ??
        overview?.orders
    );

  const averageOrderValue =
    toNumber(
      revenueAnalytics?.averageOrderValue
    );

  const totalCustomers =
    toNumber(
      overview?.customers
    );

  const totalProducts =
    toNumber(
      overview?.products
    );

  const pendingOrders =
    toNumber(
      orders?.pending
    );

  const completedOrders =
    toNumber(
      orders?.completed
    );

  const cancelledOrders =
    toNumber(
      orders?.cancelled
    );

  const lowStockCount =
    toNumber(
      inventory?.lowStock
    );

  const deliveredPercentage =
    totalOrders > 0
      ? (
          (completedOrders /
            totalOrders) *
          100
        ).toFixed(1)
      : "0.0";

  const pendingPercentage =
    totalOrders > 0
      ? (
          (pendingOrders /
            totalOrders) *
          100
        ).toFixed(1)
      : "0.0";

  const cancelledPercentage =
    totalOrders > 0
      ? (
          (cancelledOrders /
            totalOrders) *
          100
        ).toFixed(1)
      : "0.0";

  const statusData = [
    {
      name: "Pending",
      value: pendingOrders,
    },
    {
      name: "Delivered",
      value: completedOrders,
    },
    {
      name: "Cancelled",
      value: cancelledOrders,
    },
  ].filter(
    (item) => item.value > 0
  );

  const revenueChartData =
    dailyRevenue.length > 0
      ? dailyRevenue
      : salesTrend.map(
          (item) => ({
            label: item.label,
            revenue: item.revenue,
          })
        );

  const orderTrendData =
    salesTrend.map(
      (item) => ({
        label: item.label,
        orders: item.orders,
        revenue: item.revenue,
      })
    );

  const monthlyChartData =
    monthlySales.length > 0
      ? monthlySales
      : salesTrend;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <AdminPage
      title="Business Dashboard"
      description="Store performance, orders, revenue and inventory overview"
      action={
        <div className="flex flex-wrap items-center gap-2">
          {RANGE_OPTIONS.map(
            ([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setRange(value)
                }
                className={`rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                  range === value
                    ? "bg-slate-900 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            )
          )}

          <AdminButton
            variant="soft"
            onClick={() =>
              setRefreshKey(
                (value) =>
                  value + 1
              )
            }
            disabled={loading}
            className="px-3"
          >
            <RefreshCw
              size={16}
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
      {/* ===================================================
          ERROR
      =================================================== */}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700">
          <AlertTriangle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <div className="flex-1">
            <p className="font-semibold">
              Dashboard data load failed
            </p>

            <p className="mt-1">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setRefreshKey(
                (value) =>
                  value + 1
              )
            }
            className="font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* ===================================================
          LOADING
      =================================================== */}

      {loading && !dashboard ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* ================================================
              KPI CARDS
          ================================================= */}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <AdminStatCard
                title="Total Revenue"
                value={formatCompactCurrency(totalRevenue)}
                note={
                  averageOrderValue > 0
                    ? `Avg order ${formatCurrency(averageOrderValue)}`
                    : "Paid & delivered orders"
                }
                icon={IndianRupee}
                iconClass="bg-violet-50 text-violet-600"
              />

              <AdminStatCard
                title="Total Orders"
                value={totalOrders.toLocaleString("en-IN")}
                note={`${deliveredPercentage}% delivered`}
                icon={ShoppingBag}
                iconClass="bg-blue-50 text-blue-600"
              />

              <AdminStatCard
                title="Customers"
                value={totalCustomers.toLocaleString("en-IN")}
                note="Registered customers"
                icon={Users}
                iconClass="bg-cyan-50 text-cyan-600"
              />

              <AdminStatCard
                title="Products"
                value={totalProducts.toLocaleString("en-IN")}
                note={
                  lowStockCount > 0
                    ? `${lowStockCount} low stock`
                    : "Inventory healthy"
                }
                icon={Package}
                iconClass={
                  lowStockCount > 0
                    ? "bg-rose-50 text-rose-600"
                    : "bg-emerald-50 text-emerald-600"
                }
              />
            </div>

          {/* ================================================
              SECONDARY KPI
          ================================================= */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MiniMetric
              icon={Clock3}
              title="Pending Orders"
              value={pendingOrders}
              percentage={`${pendingPercentage}%`}
              iconClass="bg-violet-50 text-violet-600"
            />

            <MiniMetric
              icon={CheckCircle2}
              title="Delivered Orders"
              value={completedOrders}
              percentage={`${deliveredPercentage}%`}
              iconClass="bg-emerald-50 text-emerald-600"
            />

            <MiniMetric
              icon={XCircle}
              title="Cancelled Orders"
              value={cancelledOrders}
              percentage={`${cancelledPercentage}%`}
              iconClass="bg-rose-50 text-rose-600"
            />

            <MiniMetric
              icon={AlertTriangle}
              title="Low Stock"
              value={lowStockCount}
              percentage={
                lowStockCount > 0
                  ? "Action required"
                  : "Healthy"
              }
              iconClass={
                lowStockCount > 0
                  ? "bg-orange-50 text-orange-600"
                  : "bg-emerald-50 text-emerald-600"
              }
            />
          </div>

          {/* ================================================
              REVENUE + ORDER STATUS
          ================================================= */}

          <div className="grid gap-6 xl:grid-cols-3">
            <DashboardCard
              title="Revenue Overview"
              subtitle="Paid & delivered order revenue"
              className="xl:col-span-2"
              headerRight={
                <div className="text-right">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Total
                  </p>

                  <p className="mt-0.5 text-lg font-bold text-slate-900">
                    {formatCurrency(
                      totalRevenue
                    )}
                  </p>
                </div>
              }
            >
              {revenueChartData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueChartData}>
                        <defs>
                          <linearGradient
                            id="revenueGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#6366F1"
                              stopOpacity={0.28}
                            />
                            <stop
                              offset="100%"
                              stopColor="#6366F1"
                              stopOpacity={0.02}
                            />
                          </linearGradient>
                        </defs>

                        <CartesianGrid
                          strokeDasharray="4 8"
                          stroke="#E2E8F0"
                          vertical={false}
                        />

                        <XAxis
                          dataKey="label"
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fill: "#94A3B8",
                            fontSize: 11,
                          }}
                        />

                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fill: "#94A3B8",
                            fontSize: 11,
                          }}
                          tickFormatter={formatCompactCurrency}
                        />

                        <Tooltip
                          contentStyle={{
                            background: "#ffffff",
                            border: "1px solid #E2E8F0",
                            borderRadius: 16,
                            boxShadow:
                              "0 18px 50px rgba(15,23,42,.10)",
                          }}
                        />

                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#6366F1"
                          strokeWidth={3}
                          fill="url(#revenueGradient)"
                          dot={false}
                          activeDot={{
                            r: 6,
                            strokeWidth: 3,
                            stroke: "#ffffff",
                          }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
              ) : (
                <EmptyChart
                  icon={IndianRupee}
                  title="No revenue data yet"
                  description="Revenue will appear after paid and delivered orders are available."
                />
              )}
            </DashboardCard>

            <DashboardCard
              title="Order Summary"
              subtitle="Current order distribution"
            >
              {statusData.length > 0 ? (
                <>
                  <div className="relative">
                    <ResponsiveContainer
                      width="100%"
                      height={230}
                    >
{/*                       <PieChart>
                        <Pie
                          data={statusData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={58}
                          outerRadius={88}
                          paddingAngle={4}
                        >
                          {statusData.map(
                            (
                              item
                            ) => (
                              <Cell
                                key={
                                  item.name
                                }
                                fill={
                                  STATUS_COLORS[
                                    item.name
                                  ] ||
                                  "#64748B"
                                }
                              />
                            )
                          )}
                        </Pie>

                        <Tooltip
                          contentStyle={
                            CHART_TOOLTIP_STYLE
                          }
                        />
                      </PieChart> */}
                    </ResponsiveContainer>

                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-slate-900">
                          {totalOrders}
                        </p>

                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          Orders
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {statusData.map(
                      (item) => (
                        <div
                          key={
                            item.name
                          }
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{
                                backgroundColor:
                                  STATUS_COLORS[
                                    item.name
                                  ] ||
                                  "#64748B",
                              }}
                            />

                            <span className="text-sm text-slate-600">
                              {item.name}
                            </span>
                          </div>

                          <span className="text-sm font-bold text-slate-900">
                            {item.value}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </>
              ) : (
                <EmptyChart
                  icon={ShoppingBag}
                  title="No orders yet"
                  description="Order status distribution will appear here."
                />
              )}
            </DashboardCard>
          </div>

          {/* ================================================
              SALES TREND
          ================================================= */}

          <DashboardCard
            title="Sales & Orders Trend"
            subtitle="Daily sales performance for selected period"
            headerRight={
              <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#6366F1]" />
                  Revenue
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  Orders
                </div>
              </div>
            }
          >
            {orderTrendData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height={330}
              >
                {/* <BarChart
                  data={orderTrendData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E2E8F0"
                  />

                  <XAxis
                    dataKey="label"
                    tick={{
                      fontSize: 10,
                      fill: "#94A3B8",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    yAxisId="revenue"
                    orientation="left"
                    tick={{
                      fontSize: 10,
                      fill: "#94A3B8",
                    }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={
                      formatCompactCurrency
                    }
                  />

                  <YAxis
                    yAxisId="orders"
                    orientation="right"
                    tick={{
                      fontSize: 10,
                      fill: "#94A3B8",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    contentStyle={
                      CHART_TOOLTIP_STYLE
                    }
                    formatter={(
                      value,
                      name
                    ) => {
                      if (
                        name ===
                        "Revenue"
                      ) {
                        return [
                          formatCurrency(
                            value
                          ),
                          name,
                        ];
                      }

                      return [
                        value,
                        name,
                      ];
                    }}
                  />

                  <Legend />

                  <Bar
                    yAxisId="revenue"
                    dataKey="revenue"
                    name="Revenue"
                    fill="#6366F1"
                    radius={[
                      5,
                      5,
                      0,
                      0,
                    ]}
                    maxBarSize={32}
                  />

                  <Bar
                    yAxisId="orders"
                    dataKey="orders"
                    name="Orders"
                    fill="#3B82F6"
                    radius={[
                      5,
                      5,
                      0,
                      0,
                    ]}
                    maxBarSize={18}
                  />
                </BarChart> */}
              </ResponsiveContainer>
            ) : (
              <EmptyChart
                icon={BarChart3}
                title="No sales trend data"
                description="Sales and order trends will appear here."
              />
            )}
          </DashboardCard>

          {/* ================================================
              MONTHLY SALES + TOP PRODUCTS
          ================================================= */}

          <div className="grid gap-6 xl:grid-cols-2">
            <DashboardCard
              title="Monthly Sales"
              subtitle="Sales performance by month"
            >
              {monthlyChartData.length > 0 ? (
                <ResponsiveContainer
                  width="100%"
                  height={300}
                >
                  {/* <BarChart
                    data={monthlyChartData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E2E8F0"
                    />

                    <XAxis
                      dataKey="label"
                      tick={{
                        fontSize: 10,
                        fill: "#94A3B8",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      tick={{
                        fontSize: 10,
                        fill: "#94A3B8",
                      }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={
                        formatCompactCurrency
                      }
                    />

                    <Tooltip
                      contentStyle={
                        CHART_TOOLTIP_STYLE
                      }
                      formatter={(
                        value
                      ) => [
                        formatCurrency(
                          value
                        ),
                        "Sales",
                      ]}
                    />

                    <Bar
                      dataKey="revenue"
                      name="Sales"
                      fill="#6366F1"
                      radius={[
                        6,
                        6,
                        0,
                        0,
                      ]}
                      maxBarSize={42}
                    />
                  </BarChart> */}
                </ResponsiveContainer>
              ) : (
                <EmptyChart
                  icon={TrendingUp}
                  title="No monthly sales"
                  description="Monthly sales data will appear here."
                />
              )}
            </DashboardCard>

            <DashboardCard
              title="Top Selling Products"
              subtitle="Best performing products"
            >
              {topProducts.length > 0 ? (
                <div className="space-y-3">
                  {topProducts
                    .slice(0, 6)
                    .map(
                      (
                        product,
                        index
                      ) => (
                        <div
                          key={
                            product?._id ||
                            index
                          }
                          className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-bold text-slate-500 shadow-sm">
                            #
                            {index +
                              1}
                          </div>

                          {product?.thumbnail ? (
                            <img
                              src={
                                product.thumbnail
                              }
                              alt={
                                product?.name ||
                                "Product"
                              }
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-slate-300">
                              <Package
                                size={18}
                              />
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-800">
                              {product?.name ||
                                "Unnamed Product"}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {toNumber(
                                product?.totalSold
                              )}{" "}
                              units sold
                            </p>
                          </div>

                          <TrendingUp
                            size={17}
                            className="text-emerald-500"
                          />
                        </div>
                      )
                    )}
                </div>
              ) : (
                <EmptyChart
                  icon={Package}
                  title="No product sales yet"
                  description="Top selling products will appear after orders are completed."
                />
              )}
            </DashboardCard>
          </div>

          {/* ================================================
              RECENT ORDERS + LOW STOCK
          ================================================= */}

          <div className="grid gap-6 xl:grid-cols-3">
            <DashboardCard
              title="Recent Orders"
              subtitle="Latest customer orders"
              className="xl:col-span-2"
            >
              {recentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="px-2 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                          Order
                        </th>

                        <th className="px-2 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                          Customer
                        </th>

                        <th className="px-2 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                          Date
                        </th>

                        <th className="px-2 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                          Amount
                        </th>

                        <th className="px-2 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {recentOrders
                        .slice(0, 8)
                        .map(
                          (
                            order,
                            index
                          ) => {
                            const status =
                              getOrderStatus(
                                order
                              );

                            return (
                              <tr
                                key={
                                  order?._id ||
                                  index
                                }
                                className="border-b border-slate-50 last:border-0"
                              >
                                <td className="px-2 py-4">
                                  <p className="text-sm font-bold text-slate-800">
                                    {order?.orderNumber ||
                                      order?._id?.slice(
                                        -8
                                      ) ||
                                      "—"}
                                  </p>
                                </td>

                                <td className="px-2 py-4">
                                  <p className="text-sm font-medium text-slate-700">
                                    {getCustomerName(
                                      order
                                    )}
                                  </p>

                                  {order
                                    ?.customer
                                    ?.email && (
                                    <p className="mt-0.5 text-xs text-slate-400">
                                      {
                                        order
                                          .customer
                                          .email
                                      }
                                    </p>
                                  )}
                                </td>

                                <td className="px-2 py-4 text-sm text-slate-500">
                                  {formatDate(
                                    order?.createdAt
                                  )}
                                </td>

                                <td className="px-2 py-4 text-sm font-bold text-slate-800">
                                  {formatCurrency(
                                    getOrderAmount(
                                      order
                                    )
                                  )}
                                </td>

                                <td className="px-2 py-4">
                                  <StatusBadge
                                    status={
                                      status
                                    }
                                  />
                                </td>
                              </tr>
                            );
                          }
                        )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyChart
                  icon={ShoppingBag}
                  title="No recent orders"
                  description="Recent customer orders will appear here."
                />
              )}
            </DashboardCard>

            <DashboardCard
              title="Low Stock Alerts"
              subtitle="Products requiring attention"
              headerRight={
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    lowStockProducts.length > 0
                      ? "bg-rose-50 text-rose-600"
                      : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  {lowStockProducts.length}{" "}
                  items
                </span>
              }
            >
              {lowStockProducts.length > 0 ? (
                <div className="space-y-3">
                  {lowStockProducts
                    .slice(0, 6)
                    .map(
                      (
                        product,
                        index
                      ) => {
                        const available =
                          toNumber(
                            product
                              ?.inventory
                              ?.availableStock
                          );

                        return (
                          <div
                            key={
                              product?._id ||
                              index
                            }
                            className="rounded-xl border border-slate-100 bg-slate-50/70 p-3"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                                <AlertTriangle
                                  size={17}
                                />
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-slate-800">
                                  {product?.name ||
                                    "Unnamed Product"}
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                  Only{" "}
                                  <span className="font-bold text-rose-600">
                                    {available}
                                  </span>{" "}
                                  units available
                                </p>
                              </div>
                            </div>

                            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                              <div
                                className="h-full rounded-full bg-orange-500"
                                style={{
                                  width: `${Math.min(
                                    Math.max(
                                      available *
                                        10,
                                      4
                                    ),
                                    100
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        );
                      }
                    )}
                </div>
              ) : (
                <EmptyChart
                  icon={CheckCircle2}
                  title="Inventory looks healthy"
                  description="There are currently no low-stock products."
                />
              )}
            </DashboardCard>
          </div>

          {/* ================================================
              BUSINESS SUMMARY
          ================================================= */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#6366F1]/10 text-[#6366F1]">
                    <BarChart3
                      size={18}
                    />
                  </div>

                  <h2 className="font-bold text-slate-900">
                    Business Snapshot
                  </h2>
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  Quick performance summary for the selected period.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <SnapshotItem
                  label="Revenue"
                  value={formatCompactCurrency(
                    totalRevenue
                  )}
                />

                <SnapshotItem
                  label="Orders"
                  value={totalOrders}
                />

                <SnapshotItem
                  label="Avg Order"
                  value={formatCompactCurrency(
                    averageOrderValue
                  )}
                />

                <SnapshotItem
                  label="Delivered"
                  value={`${deliveredPercentage}%`}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </AdminPage>
  );
}

/* =========================================================
   DASHBOARD CARD
========================================================= */

function DashboardCard({
  title,
  subtitle,
  children,
  className = "",
  headerRight,
}) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-xs text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        {headerRight}
      </div>

      {children}
    </section>
  );
}

/* =========================================================
   MINI METRIC
========================================================= */

function MiniMetric({
  icon: Icon,
  title,
  value,
  percentage,
  iconClass,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-slate-400">
            {title}
          </p>

          <div className="mt-1 flex items-end justify-between gap-2">
            <p className="text-xl font-bold text-slate-900">
              {value}
            </p>

            <span className="text-[10px] font-semibold text-slate-400">
              {percentage}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  status,
}) {
  const normalized =
    String(status)
      .toLowerCase();

  let classes =
    "bg-slate-100 text-slate-600";

  if (
    normalized.includes(
      "pending"
    )
  ) {
    classes =
      "bg-amber-50 text-amber-700";
  } else if (
    normalized.includes(
      "deliver"
    ) ||
    normalized.includes(
      "complete"
    )
  ) {
    classes =
      "bg-emerald-50 text-emerald-700";
  } else if (
    normalized.includes(
      "cancel"
    ) ||
    normalized.includes(
      "reject"
    )
  ) {
    classes =
      "bg-rose-50 text-rose-700";
  } else if (
    normalized.includes(
      "ship"
    )
  ) {
    classes =
      "bg-blue-50 text-blue-700";
  } else if (
    normalized.includes(
      "process"
    )
  ) {
    classes =
      "bg-violet-50 text-violet-700";
  }

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${classes}`}
    >
      {status}
    </span>
  );
}

/* =========================================================
   EMPTY CHART
========================================================= */

function EmptyChart({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Icon size={22} />
      </div>

      <p className="mt-4 text-sm font-bold text-slate-600">
        {title}
      </p>

      <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   SNAPSHOT
========================================================= */

function SnapshotItem({
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-slate-50 px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   SKELETON
========================================================= */

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({
          length: 4,
        }).map(
          (_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl bg-slate-100"
            />
          )
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="h-[390px] animate-pulse rounded-2xl bg-slate-100 xl:col-span-2" />

        <div className="h-[390px] animate-pulse rounded-2xl bg-slate-100" />
      </div>

      <div className="h-[420px] animate-pulse rounded-2xl bg-slate-100" />

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-[380px] animate-pulse rounded-2xl bg-slate-100" />

        <div className="h-[380px] animate-pulse rounded-2xl bg-slate-100" />
      </div>
    </div>
  );
}