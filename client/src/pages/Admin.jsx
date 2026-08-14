import { useEffect, useMemo, useState } from "react";

import {
  LayoutDashboard,
  Package,
  FolderTree,
  TicketPercent,
  ShoppingBag,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Menu,
  TrendingUp,
  Users,
  IndianRupee,
} from "lucide-react";

import {
  getAdminDashboard,
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  getAdminCoupons,
  createAdminCoupon,
  updateAdminCoupon,
  deleteAdminCoupon,
  getAdminOrders,
  updateAdminOrderStatus,
} from "../api/admin.api";

import { useAuth } from "../context/AuthContext";

const emptyProduct = {
  name: "",
  description: "",
  shortDescription: "",
  category: "",
  metal: "Gold",
  purity: "22K",
  gender: "Unisex",
  weight: "",
  price: "",
  discountPrice: "",
  makingCharges: "",
  gst: "3",
  stock: "",
  featured: false,
  bestseller: false,
  image: "",
};

const emptyCategory = {
  name: "",
  description: "",
  image: "",
  isActive: true,
  featured: false,
};

const emptyCoupon = {
  code: "",
  description: "",
  discountType: "percentage",
  discountValue: "",
  minOrderAmount: "",
  maxDiscountAmount: "",
  usageLimit: "",
  expiresAt: "",
};

const Admin = () => {
  const { user, logout } = useAuth();

  const [activeMenu, setActiveMenu] =
    useState("dashboard");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [dashboard, setDashboard] =
    useState(null);

  const [products, setProducts] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [coupons, setCoupons] =
    useState([]);

  const [orders, setOrders] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [showProductModal, setShowProductModal] =
    useState(false);

  const [showCategoryModal, setShowCategoryModal] =
    useState(false);

  const [showCouponModal, setShowCouponModal] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [editingCategory, setEditingCategory] =
    useState(null);

  const [editingCoupon, setEditingCoupon] =
    useState(null);

  const [productForm, setProductForm] =
    useState(emptyProduct);

  const [categoryForm, setCategoryForm] =
    useState(emptyCategory);

  const [couponForm, setCouponForm] =
    useState(emptyCoupon);

  const clearMessages = () => {
    setMessage("");
    setError("");
  };

  const showError = (err) => {
    setError(
      err?.response?.data?.message ||
        "Something went wrong."
    );
  };

  const extractList = (response, key) => {
    const data = response?.data?.data;

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.[key])) {
      return data[key];
    }

    return [];
  };

  const loadDashboard = async () => {
    try {
      const response =
        await getAdminDashboard();

      setDashboard(
        response?.data?.data || null
      );
    } catch (err) {
      showError(err);
    }
  };

  const loadProducts = async (
    searchValue = ""
  ) => {
    try {
      const response =
        await getAdminProducts({
          page: 1,
          limit: 100,
          search: searchValue,
        });

      const data =
        response?.data?.data;

      setProducts(
        Array.isArray(data?.products)
          ? data.products
          : []
      );
    } catch (err) {
      showError(err);
    }
  };

  const loadCategories = async () => {
    try {
      const response =
        await getAdminCategories({
          page: 1,
          limit: 100,
        });

      setCategories(
        extractList(
          response,
          "categories"
        )
      );
    } catch (err) {
      showError(err);
    }
  };

  const loadCoupons = async () => {
    try {
      const response =
        await getAdminCoupons({
          page: 1,
          limit: 100,
        });

      setCoupons(
        extractList(
          response,
          "coupons"
        )
      );
    } catch (err) {
      showError(err);
    }
  };

  const loadOrders = async () => {
    try {
      const response =
        await getAdminOrders({
          page: 1,
          limit: 100,
        });

      const data =
        response?.data?.data;

      setOrders(
        Array.isArray(data?.orders)
          ? data.orders
          : Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      showError(err);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      await Promise.all([
        loadDashboard(),
        loadProducts(),
        loadCategories(),
        loadCoupons(),
        loadOrders(),
      ]);

      setLoading(false);
    };

    load();
  }, []);

  const filteredProducts =
    useMemo(() => {
      const term =
        search.trim().toLowerCase();

      if (!term) {
        return products;
      }

      return products.filter(
        (product) =>
          product.name
            ?.toLowerCase()
            .includes(term) ||
          product.category
            ?.toLowerCase()
            .includes(term) ||
          product.metal
            ?.toLowerCase()
            .includes(term)
      );
    }, [products, search]);

  const overview =
    dashboard?.overview || {};

  const stats = {
    products:
      overview.products ??
      products.length,

    activeProducts:
      overview.activeProducts ?? 0,

    categories:
      overview.categories ??
      categories.length,

    customers:
      overview.customers ?? 0,

    orders:
      overview.orders ??
      orders.length,

    revenue:
      overview.revenue ?? 0,
  };

  const menu = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
    },
    {
      id: "categories",
      label: "Categories",
      icon: FolderTree,
    },
    {
      id: "coupons",
      label: "Coupons",
      icon: TicketPercent,
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingBag,
    },
  ];

  const changeMenu = (menuId) => {
    setActiveMenu(menuId);
    setSidebarOpen(false);
    clearMessages();
  };

  // ==========================================
  // PRODUCT
  // ==========================================

  const openAddProduct = () => {
    clearMessages();

    setEditingProduct(null);
    setProductForm({
      ...emptyProduct,
    });

    setShowProductModal(true);
  };

  const openEditProduct = (product) => {
    clearMessages();

    setEditingProduct(product);

    const primaryImage =
      product?.images?.find(
        (image) =>
          image?.isPrimary
      ) ||
      product?.images?.[0];

    setProductForm({
      name:
        product?.name || "",

      description:
        product?.description || "",

      shortDescription:
        product?.shortDescription || "",

      category:
        product?.category || "",

      metal:
        product?.metal || "Gold",

      purity:
        product?.purity || "22K",

      gender:
        product?.gender || "Unisex",

      weight:
        product?.weight ?? "",

      price:
        product?.price ?? "",

      discountPrice:
        product?.discountPrice ?? "",

      makingCharges:
        product?.makingCharges ?? "",

      gst:
        product?.gst ?? "3",

      stock:
        product?.inventory?.stock ??
        product?.inventory?.availableStock ??
        "",

      featured:
        Boolean(product?.featured),

      bestseller:
        Boolean(product?.bestseller),

      image:
        primaryImage?.url || "",
    });

    setShowProductModal(true);
  };

  const saveProduct = async (event) => {
    event.preventDefault();

    clearMessages();
    setLoading(true);

    try {
      const stock =
        Number(productForm.stock || 0);

      const payload = {
        name:
          productForm.name.trim(),

        description:
          productForm.description.trim(),

        shortDescription:
          productForm.shortDescription.trim(),

        category:
          productForm.category.trim(),

        metal:
          productForm.metal,

        purity:
          productForm.purity,

        gender:
          productForm.gender,

        weight:
          Number(productForm.weight),

        price:
          Number(productForm.price),

        discountPrice:
          Number(
            productForm.discountPrice || 0
          ),

        makingCharges:
          Number(
            productForm.makingCharges || 0
          ),

        gst:
          Number(productForm.gst || 3),

        featured:
          Boolean(productForm.featured),

        bestseller:
          Boolean(productForm.bestseller),

        isActive: true,

        inventory: {
          stock,
          reservedStock: 0,
          availableStock: stock,
          lowStockThreshold: 5,
        },

        images: productForm.image
          ? [
              {
                public_id:
                  editingProduct
                    ?.images?.[0]
                    ?.public_id ||
                  `external-${Date.now()}`,

                url:
                  productForm.image,

                alt:
                  productForm.name,

                isPrimary: true,
              },
            ]
          : [],

        seoTitle:
          productForm.name,

        seoDescription:
          productForm.description,

        seoKeywords: [
          productForm.name,
          productForm.category,
          productForm.metal,
        ],
      };

      if (editingProduct) {
        await updateAdminProduct(
          editingProduct._id ||
            editingProduct.id,
          payload
        );

        setMessage(
          "Product updated successfully."
        );
      } else {
        await createAdminProduct(
          payload
        );

        setMessage(
          "Product added successfully."
        );
      }

      setShowProductModal(false);
      setEditingProduct(null);
      setProductForm({
        ...emptyProduct,
      });

      await Promise.all([
        loadProducts(search),
        loadDashboard(),
      ]);
    } catch (err) {
      showError(err);
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (
    product
  ) => {
    const id =
      product?._id ||
      product?.id;

    if (!id) {
      return;
    }

    const confirmed =
      window.confirm(
        `Delete "${product.name}"?`
      );

    if (!confirmed) {
      return;
    }

    clearMessages();
    setLoading(true);

    try {
      await deleteAdminProduct(id);

      setMessage(
        "Product deleted successfully."
      );

      await Promise.all([
        loadProducts(search),
        loadDashboard(),
      ]);
    } catch (err) {
      showError(err);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CATEGORY
  // ==========================================

  const openAddCategory = () => {
    clearMessages();

    setEditingCategory(null);

    setCategoryForm({
      ...emptyCategory,
    });

    setShowCategoryModal(true);
  };

  const openEditCategory = (
    category
  ) => {
    clearMessages();

    setEditingCategory(category);

    setCategoryForm({
      name:
        category?.name || "",

      description:
        category?.description || "",

      image:
        category?.image || "",

      isActive:
        category?.isActive ?? true,

      featured:
        category?.featured ?? false,
    });

    setShowCategoryModal(true);
  };

  const saveCategory = async (
    event
  ) => {
    event.preventDefault();

    clearMessages();
    setLoading(true);

    try {
      const payload = {
        name:
          categoryForm.name.trim(),

        description:
          categoryForm.description.trim(),

        image:
          categoryForm.image.trim(),

        isActive:
          Boolean(categoryForm.isActive),

        featured:
          Boolean(categoryForm.featured),
      };

      if (editingCategory) {
        await updateAdminCategory(
          editingCategory._id ||
            editingCategory.id,
          payload
        );

        setMessage(
          "Category updated successfully."
        );
      } else {
        await createAdminCategory(
          payload
        );

        setMessage(
          "Category created successfully."
        );
      }

      setShowCategoryModal(false);

      setEditingCategory(null);

      setCategoryForm({
        ...emptyCategory,
      });

      await Promise.all([
        loadCategories(),
        loadDashboard(),
      ]);
    } catch (err) {
      showError(err);
    } finally {
      setLoading(false);
    }
  };

  const removeCategory = async (
    category
  ) => {
    const id =
      category?._id ||
      category?.id;

    if (!id) {
      return;
    }

    if (
      !window.confirm(
        `Delete "${category.name}"?`
      )
    ) {
      return;
    }

    clearMessages();
    setLoading(true);

    try {
      await deleteAdminCategory(id);

      setMessage(
        "Category deleted successfully."
      );

      await Promise.all([
        loadCategories(),
        loadDashboard(),
      ]);
    } catch (err) {
      showError(err);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // COUPON
  // ==========================================

  const openAddCoupon = () => {
    clearMessages();

    setEditingCoupon(null);

    setCouponForm({
      ...emptyCoupon,
    });

    setShowCouponModal(true);
  };

  const openEditCoupon = (
    coupon
  ) => {
    clearMessages();

    setEditingCoupon(coupon);

    let expiresAt = "";

    if (coupon?.expiresAt) {
      const date =
        new Date(coupon.expiresAt);

      if (!Number.isNaN(date.getTime())) {
        expiresAt =
          date.toISOString().slice(0, 16);
      }
    }

    setCouponForm({
      code:
        coupon?.code || "",

      description:
        coupon?.description || "",

      discountType:
        coupon?.discountType ||
        "percentage",

      discountValue:
        coupon?.discountValue ?? "",

      minOrderAmount:
        coupon?.minOrderAmount ?? "",

      maxDiscountAmount:
        coupon?.maxDiscountAmount ?? "",

      usageLimit:
        coupon?.usageLimit ?? "",

      expiresAt,
    });

    setShowCouponModal(true);
  };

  const saveCoupon = async (
    event
  ) => {
    event.preventDefault();

    clearMessages();
    setLoading(true);

    try {
      const payload = {
        code:
          couponForm.code
            .trim()
            .toUpperCase(),

        description:
          couponForm.description.trim(),

        discountType:
          couponForm.discountType,

        discountValue:
          Number(
            couponForm.discountValue
          ),

        minOrderAmount:
          Number(
            couponForm.minOrderAmount ||
              0
          ),

        maxDiscountAmount:
          Number(
            couponForm.maxDiscountAmount ||
              0
          ),

        usageLimit:
          Number(
            couponForm.usageLimit || 0
          ),

        expiresAt:
          couponForm.expiresAt
            ? new Date(
                couponForm.expiresAt
              ).toISOString()
            : undefined,
      };

      if (editingCoupon) {
        await updateAdminCoupon(
          editingCoupon._id ||
            editingCoupon.id,
          payload
        );

        setMessage(
          "Coupon updated successfully."
        );
      } else {
        await createAdminCoupon(
          payload
        );

        setMessage(
          "Coupon created successfully."
        );
      }

      setShowCouponModal(false);

      setEditingCoupon(null);

      setCouponForm({
        ...emptyCoupon,
      });

      await loadCoupons();
    } catch (err) {
      showError(err);
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = async (
    coupon
  ) => {
    const id =
      coupon?._id ||
      coupon?.id;

    if (!id) {
      return;
    }

    if (
      !window.confirm(
        `Delete coupon "${coupon.code}"?`
      )
    ) {
      return;
    }

    clearMessages();
    setLoading(true);

    try {
      await deleteAdminCoupon(id);

      setMessage(
        "Coupon deleted successfully."
      );

      await loadCoupons();
    } catch (err) {
      showError(err);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ORDER
  // ==========================================

  const updateOrderStatus = async (
    order,
    status
  ) => {
    clearMessages();

    try {
      await updateAdminOrderStatus(
        order?._id ||
          order?.id,
        status
      );

      setMessage(
        "Order status updated successfully."
      );

      await Promise.all([
        loadOrders(),
        loadDashboard(),
      ]);
    } catch (err) {
      showError(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff8fa] text-[#3d2630]">

      {/* MOBILE HEADER */}

      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-[#f1d4dd] px-4 py-3 flex items-center justify-between">

        <button
          type="button"
          onClick={() =>
            setSidebarOpen(true)
          }
          className="p-2 rounded-xl bg-[#fde8ef] text-[#b85c7a]"
        >
          <Menu size={21} />
        </button>

        <div className="font-semibold tracking-[0.15em] text-[#b85c7a]">
          MADAN GOLD
        </div>

        <div className="w-9" />

      </div>

      <div className="flex">

        {/* SIDEBAR */}

        <aside
          className={`
            fixed
            lg:sticky
            top-0
            left-0
            z-50
            h-screen
            w-[270px]
            bg-white
            border-r
            border-[#f1d4dd]
            transition-transform
            duration-300
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
          `}
        >

          <div className="h-full flex flex-col">

            <div className="px-6 py-7 border-b border-[#f5e2e7]">

              <p className="text-xs tracking-[0.3em] uppercase text-[#b85c7a]">
                MADAN GOLD
              </p>

              <h2 className="text-xl font-semibold mt-2">
                Admin Panel
              </h2>

            </div>

            <div className="flex-1 p-4 space-y-2">

              {menu.map((item) => {
                const Icon =
                  item.icon;

                const active =
                  activeMenu ===
                  item.id;

                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() =>
                      changeMenu(
                        item.id
                      )
                    }
                    className={`
                      w-full
                      flex
                      items-center
                      gap-3
                      px-4
                      py-3
                      rounded-2xl
                      text-sm
                      font-medium
                      transition
                      ${
                        active
                          ? "bg-[#f9dfe8] text-[#a84d6c]"
                          : "text-[#775964] hover:bg-[#fff1f5]"
                      }
                    `}
                  >
                    <Icon size={19} />
                    {item.label}
                  </button>
                );
              })}

            </div>

            <div className="p-4 border-t border-[#f5e2e7]">

              <div className="bg-[#fff5f7] rounded-2xl p-4 mb-3">

                <p className="text-xs text-[#a17b87]">
                  Signed in as
                </p>

                <p className="text-sm font-semibold truncate mt-1">
                  {user?.name ||
                    user?.email ||
                    "Admin"}
                </p>

              </div>

              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm text-[#b04463] hover:bg-[#fff0f3]"
              >
                <LogOut size={18} />
                Logout
              </button>

            </div>

          </div>

        </aside>

        {/* MOBILE OVERLAY */}

        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          />
        )}

        {/* MAIN */}

        <main className="flex-1 min-w-0">

          <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">

            {/* PAGE HEADER */}

            <div className="mb-7">

              <p className="text-sm text-[#a17b87]">
                Admin /{" "}
                <span className="text-[#b85c7a]">
                  {
                    menu.find(
                      (item) =>
                        item.id ===
                        activeMenu
                    )?.label
                  }
                </span>
              </p>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-2">

                <div>
                  <h1 className="text-2xl md:text-3xl font-semibold">
                    {
                      menu.find(
                        (item) =>
                          item.id ===
                          activeMenu
                      )?.label
                    }
                  </h1>

                  <p className="text-sm text-[#8d6d78] mt-1">
                    Manage your Madan Gold store
                  </p>
                </div>

                {loading && (
                  <div className="text-xs text-[#b85c7a]">
                    Updating...
                  </div>
                )}

              </div>

            </div>

            {/* MESSAGE */}

            {message && (
              <div className="mb-5 rounded-2xl bg-[#ecfdf3] border border-[#b9ebcd] px-4 py-3 text-sm text-[#22764a]">
                {message}
              </div>
            )}

            {error && (
              <div className="mb-5 rounded-2xl bg-[#fff0f3] border border-[#f3c5d2] px-4 py-3 text-sm text-[#b04463]">
                {error}
              </div>
            )}

            {/* ======================================
                DASHBOARD
            ====================================== */}

            {activeMenu ===
              "dashboard" && (
              <div className="space-y-6">

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                  <StatCard
                    title="Total Products"
                    value={
                      stats.products
                    }
                    icon={Package}
                  />

                  <StatCard
                    title="Categories"
                    value={
                      stats.categories
                    }
                    icon={FolderTree}
                  />

                  <StatCard
                    title="Orders"
                    value={
                      stats.orders
                    }
                    icon={ShoppingBag}
                  />

                  <StatCard
                    title="Revenue"
                    value={`₹${Number(
                      stats.revenue || 0
                    ).toLocaleString(
                      "en-IN"
                    )}`}
                    icon={IndianRupee}
                  />

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                  <MiniStat
                    label="Active Products"
                    value={
                      stats.activeProducts
                    }
                  />

                  <MiniStat
                    label="Customers"
                    value={
                      stats.customers
                    }
                  />

                  <MiniStat
                    label="Pending Orders"
                    value={
                      dashboard?.orders
                        ?.pending ?? 0
                    }
                  />

                  <MiniStat
                    label="Low Stock"
                    value={
                      dashboard?.inventory
                        ?.lowStock ?? 0
                    }
                  />

                </div>

                <div className="grid xl:grid-cols-2 gap-6">

                  <div className="bg-white border border-[#f1d4dd] rounded-3xl p-6">

                    <div className="flex items-center justify-between mb-5">

                      <div>
                        <h2 className="font-semibold">
                          Store Management
                        </h2>

                        <p className="text-xs text-[#a17b87] mt-1">
                          Quick actions
                        </p>
                      </div>

                      <TrendingUp
                        size={20}
                        className="text-[#b85c7a]"
                      />

                    </div>

                    <div className="grid grid-cols-2 gap-3">

                      <QuickButton
                        label="Add Product"
                        onClick={() => {
                          changeMenu(
                            "products"
                          );
                          openAddProduct();
                        }}
                      />

                      <QuickButton
                        label="Categories"
                        onClick={() =>
                          changeMenu(
                            "categories"
                          )
                        }
                      />

                      <QuickButton
                        label="Coupons"
                        onClick={() =>
                          changeMenu(
                            "coupons"
                          )
                        }
                      />

                      <QuickButton
                        label="Orders"
                        onClick={() =>
                          changeMenu(
                            "orders"
                          )
                        }
                      />

                    </div>

                  </div>

                  <div className="bg-white border border-[#f1d4dd] rounded-3xl p-6">

                    <div className="flex items-center justify-between mb-5">

                      <div>
                        <h2 className="font-semibold">
                          Recent Orders
                        </h2>

                        <p className="text-xs text-[#a17b87] mt-1">
                          Latest store activity
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          changeMenu(
                            "orders"
                          )
                        }
                        className="text-xs text-[#b85c7a] font-medium"
                      >
                        View all
                      </button>

                    </div>

                    {dashboard?.recentOrders
                      ?.length ? (
                      dashboard.recentOrders
                        .slice(0, 5)
                        .map((order) => (
                          <div
                            key={
                              order._id ||
                              order.id ||
                              order.orderNumber
                            }
                            className="flex items-center justify-between py-3 border-b last:border-b-0 border-[#f8e6eb]"
                          >
                            <div>
                              <p className="text-sm font-medium">
                                {order.orderNumber ||
                                  `#${String(
                                    order._id ||
                                      order.id
                                  ).slice(
                                    -8
                                  )}`}
                              </p>

                              <p className="text-xs text-[#a17b87] mt-1">
                                {order.orderStatus ||
                                  order.status ||
                                  "Pending"}
                              </p>
                            </div>

                            <p className="text-sm font-semibold">
                              ₹
                              {Number(
                                order.totalAmount ||
                                  order.total ||
                                  0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </p>
                          </div>
                        ))
                    ) : orders.length ? (
                      orders
                        .slice(0, 5)
                        .map((order) => (
                          <div
                            key={
                              order._id ||
                              order.id
                            }
                            className="flex items-center justify-between py-3 border-b last:border-b-0 border-[#f8e6eb]"
                          >
                            <div>
                              <p className="text-sm font-medium">
                                {order.orderNumber ||
                                  `#${String(
                                    order._id ||
                                      order.id
                                  ).slice(
                                    -8
                                  )}`}
                              </p>

                              <p className="text-xs text-[#a17b87] mt-1">
                                {order.orderStatus ||
                                  order.status ||
                                  "Pending"}
                              </p>
                            </div>

                            <p className="text-sm font-semibold">
                              ₹
                              {Number(
                                order.totalAmount ||
                                  order.total ||
                                  0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </p>
                          </div>
                        ))
                    ) : (
                      <p className="text-sm text-[#a17b87] py-6">
                        No orders found.
                      </p>
                    )}

                  </div>

                </div>

              </div>
            )}

            {/* ======================================
                PRODUCTS
            ====================================== */}

            {activeMenu ===
              "products" && (
              <div>

                <div className="flex flex-col md:flex-row gap-3 justify-between mb-5">

                  <div className="relative w-full md:max-w-sm">

                    <Search
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a17b87]"
                    />

                    <input
                      value={search}
                      onChange={(event) =>
                        setSearch(
                          event.target.value
                        )
                      }
                      onKeyDown={(event) => {
                        if (
                          event.key ===
                          "Enter"
                        ) {
                          loadProducts(
                            search
                          );
                        }
                      }}
                      placeholder="Search products..."
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#eccbd5] bg-white outline-none focus:border-[#c76b88] focus:ring-4 focus:ring-[#f8dce5]"
                    />

                  </div>

                  <button
                    type="button"
                    onClick={
                      openAddProduct
                    }
                    className="flex items-center justify-center gap-2 bg-[#b85c7a] text-white px-5 py-3 rounded-2xl font-medium hover:bg-[#a84d6c] transition"
                  >
                    <Plus size={18} />
                    Add Product
                  </button>

                </div>

                <div className="bg-white border border-[#f1d4dd] rounded-3xl overflow-hidden">

                  <div className="overflow-x-auto">

                    <table className="w-full min-w-[900px]">

                      <thead className="bg-[#fff5f7]">

                        <tr className="text-left text-xs uppercase tracking-wider text-[#92717d]">

                          <th className="px-5 py-4">
                            Product
                          </th>

                          <th className="px-5 py-4">
                            Metal
                          </th>

                          <th className="px-5 py-4">
                            Price
                          </th>

                          <th className="px-5 py-4">
                            Stock
                          </th>

                          <th className="px-5 py-4">
                            Status
                          </th>

                          <th className="px-5 py-4 text-right">
                            Actions
                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        {filteredProducts.map(
                          (product) => {
                            const primaryImage =
                              product?.images?.find(
                                (image) =>
                                  image?.isPrimary
                              ) ||
                              product?.images?.[0];

                            const stock =
                              product?.inventory
                                ?.availableStock ??
                              product?.inventory
                                ?.stock ??
                              0;

                            return (
                              <tr
                                key={
                                  product._id ||
                                  product.id
                                }
                                className="border-t border-[#f8e6eb]"
                              >

                                <td className="px-5 py-4">

                                  <div className="flex items-center gap-3">

                                    <div className="w-12 h-12 rounded-xl bg-[#fff1f5] overflow-hidden flex-shrink-0">

                                      {primaryImage?.url ? (
                                        <img
                                          src={
                                            primaryImage.url
                                          }
                                          alt={
                                            product.name
                                          }
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[#b85c7a]">
                                          <Package
                                            size={19}
                                          />
                                        </div>
                                      )}

                                    </div>

                                    <div>
                                      <p className="font-medium text-sm">
                                        {
                                          product.name
                                        }
                                      </p>

                                      <p className="text-xs text-[#a17b87] mt-1">
                                        {
                                          product.category
                                        }
                                      </p>
                                    </div>

                                  </div>

                                </td>

                                <td className="px-5 py-4 text-sm">
                                  {
                                    product.metal
                                  }{" "}
                                  {
                                    product.purity
                                  }
                                </td>

                                <td className="px-5 py-4 text-sm font-semibold">
                                  ₹
                                  {Number(
                                    product.price ||
                                      0
                                  ).toLocaleString(
                                    "en-IN"
                                  )}
                                </td>

                                <td className="px-5 py-4 text-sm">
                                  {stock}
                                </td>

                                <td className="px-5 py-4">

                                  <span
                                    className={`
                                      inline-flex
                                      px-3
                                      py-1
                                      rounded-full
                                      text-xs
                                      ${
                                        product.isActive ===
                                        false
                                          ? "bg-[#fff0f3] text-[#b04463]"
                                          : "bg-[#edf9f2] text-[#27784c]"
                                      }
                                    `}
                                  >
                                    {product.isActive ===
                                    false
                                      ? "Inactive"
                                      : "Active"}
                                  </span>

                                </td>

                                <td className="px-5 py-4">

                                  <div className="flex justify-end gap-2">

                                    <button
                                      type="button"
                                      onClick={() =>
                                        openEditProduct(
                                          product
                                        )
                                      }
                                      className="p-2.5 rounded-xl bg-[#fff1f5] text-[#b85c7a] hover:bg-[#f9dfe8]"
                                    >
                                      <Pencil
                                        size={16}
                                      />
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeProduct(
                                          product
                                        )
                                      }
                                      className="p-2.5 rounded-xl bg-[#fff0f3] text-[#b04463] hover:bg-[#fbdce4]"
                                    >
                                      <Trash2
                                        size={16}
                                      />
                                    </button>

                                  </div>

                                </td>

                              </tr>
                            );
                          }
                        )}

                      </tbody>

                    </table>

                  </div>

                  {!filteredProducts.length && (
                    <div className="py-16 text-center text-sm text-[#a17b87]">
                      No products found.
                    </div>
                  )}

                </div>

              </div>
            )}

            {/* ======================================
                CATEGORIES
            ====================================== */}

            {activeMenu ===
              "categories" && (
              <div>

                <div className="flex justify-end mb-5">

                  <button
                    type="button"
                    onClick={
                      openAddCategory
                    }
                    className="flex items-center gap-2 bg-[#b85c7a] text-white px-5 py-3 rounded-2xl font-medium hover:bg-[#a84d6c]"
                  >
                    <Plus size={18} />
                    Add Category
                  </button>

                </div>

                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">

                  {categories.map(
                    (category) => (
                      <div
                        key={
                          category._id ||
                          category.id
                        }
                        className="bg-white border border-[#f1d4dd] rounded-3xl p-5"
                      >

                        <div className="flex items-start justify-between gap-3">

                          <div className="min-w-0">

                            <h3 className="font-semibold truncate">
                              {
                                category.name
                              }
                            </h3>

                            <p className="text-sm text-[#987681] mt-1 line-clamp-2">
                              {
                                category.description ||
                                "No description"
                              }
                            </p>

                            <div className="flex gap-2 mt-3">

                              <span className="text-xs px-2.5 py-1 rounded-full bg-[#edf9f2] text-[#27784c]">
                                {category.isActive ===
                                false
                                  ? "Inactive"
                                  : "Active"}
                              </span>

                              {category.featured && (
                                <span className="text-xs px-2.5 py-1 rounded-full bg-[#fff1f5] text-[#b85c7a]">
                                  Featured
                                </span>
                              )}

                            </div>

                          </div>

                          <div className="flex gap-1 flex-shrink-0">

                            <button
                              type="button"
                              onClick={() =>
                                openEditCategory(
                                  category
                                )
                              }
                              className="p-2 rounded-xl bg-[#fff1f5] text-[#b85c7a]"
                            >
                              <Pencil
                                size={15}
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                removeCategory(
                                  category
                                )
                              }
                              className="p-2 rounded-xl bg-[#fff0f3] text-[#b04463]"
                            >
                              <Trash2
                                size={15}
                              />
                            </button>

                          </div>

                        </div>

                      </div>
                    )
                  )}

                </div>

                {!categories.length && (
                  <EmptyBox text="No categories found." />
                )}

              </div>
            )}

            {/* ======================================
                COUPONS
            ====================================== */}

            {activeMenu ===
              "coupons" && (
              <div>

                <div className="flex justify-end mb-5">

                  <button
                    type="button"
                    onClick={
                      openAddCoupon
                    }
                    className="flex items-center gap-2 bg-[#b85c7a] text-white px-5 py-3 rounded-2xl font-medium hover:bg-[#a84d6c]"
                  >
                    <Plus size={18} />
                    Add Coupon
                  </button>

                </div>

                <div className="bg-white border border-[#f1d4dd] rounded-3xl overflow-hidden">

                  <div className="overflow-x-auto">

                    <table className="w-full min-w-[850px]">

                      <thead className="bg-[#fff5f7]">

                        <tr className="text-left text-xs uppercase tracking-wider text-[#92717d]">

                          <th className="px-5 py-4">
                            Code
                          </th>

                          <th className="px-5 py-4">
                            Type
                          </th>

                          <th className="px-5 py-4">
                            Value
                          </th>

                          <th className="px-5 py-4">
                            Expiry
                          </th>

                          <th className="px-5 py-4 text-right">
                            Actions
                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        {coupons.map(
                          (coupon) => (
                            <tr
                              key={
                                coupon._id ||
                                coupon.id
                              }
                              className="border-t border-[#f8e6eb]"
                            >

                              <td className="px-5 py-4 font-semibold">
                                {
                                  coupon.code
                                }
                              </td>

                              <td className="px-5 py-4 text-sm">
                                {
                                  coupon.discountType
                                }
                              </td>

                              <td className="px-5 py-4 text-sm">
                                {coupon.discountType ===
                                "percentage"
                                  ? `${coupon.discountValue}%`
                                  : `₹${coupon.discountValue}`}
                              </td>

                              <td className="px-5 py-4 text-sm">
                                {coupon.expiresAt
                                  ? new Date(
                                      coupon.expiresAt
                                    ).toLocaleDateString(
                                      "en-IN"
                                    )
                                  : "-"}
                              </td>

                              <td className="px-5 py-4">

                                <div className="flex justify-end gap-2">

                                  <button
                                    type="button"
                                    onClick={() =>
                                      openEditCoupon(
                                        coupon
                                      )
                                    }
                                    className="p-2 rounded-xl bg-[#fff1f5] text-[#b85c7a]"
                                  >
                                    <Pencil
                                      size={15}
                                    />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeCoupon(
                                        coupon
                                      )
                                    }
                                    className="p-2 rounded-xl bg-[#fff0f3] text-[#b04463]"
                                  >
                                    <Trash2
                                      size={15}
                                    />
                                  </button>

                                </div>

                              </td>

                            </tr>
                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                  {!coupons.length && (
                    <EmptyBox text="No coupons found." />
                  )}

                </div>

              </div>
            )}

            {/* ======================================
                ORDERS
            ====================================== */}

            {activeMenu ===
              "orders" && (
              <div className="bg-white border border-[#f1d4dd] rounded-3xl overflow-hidden">

                <div className="overflow-x-auto">

                  <table className="w-full min-w-[900px]">

                    <thead className="bg-[#fff5f7]">

                      <tr className="text-left text-xs uppercase tracking-wider text-[#92717d]">

                        <th className="px-5 py-4">
                          Order
                        </th>

                        <th className="px-5 py-4">
                          Customer
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

                        <th className="px-5 py-4">
                          Update
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {orders.map(
                        (order) => (
                          <tr
                            key={
                              order._id ||
                              order.id
                            }
                            className="border-t border-[#f8e6eb]"
                          >

                            <td className="px-5 py-4 text-sm font-semibold">
                              {order.orderNumber ||
                                `#${String(
                                  order._id ||
                                    order.id
                                ).slice(
                                  -8
                                )}`}
                            </td>

                            <td className="px-5 py-4 text-sm">
                              {order.customer
                                ?.name ||
                                order.customer
                                  ?.email ||
                                "-"}
                            </td>

                            <td className="px-5 py-4 text-sm font-semibold">
                              ₹
                              {Number(
                                order.totalAmount ||
                                  0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </td>

                            <td className="px-5 py-4 text-sm">
                              {order.paymentStatus ||
                                "-"}
                            </td>

                            <td className="px-5 py-4 text-sm">
                              {order.orderStatus ||
                                "Pending"}
                            </td>

                            <td className="px-5 py-4">

                              <select
                                value={
                                  order.orderStatus ||
                                  "Pending"
                                }
                                onChange={(event) =>
                                  updateOrderStatus(
                                    order,
                                    event.target
                                      .value
                                  )
                                }
                                className="border border-[#eccbd5] rounded-xl px-3 py-2 text-sm bg-white outline-none focus:border-[#c76b88]"
                              >

                                <option value="Pending">
                                  Pending
                                </option>

                                <option value="Confirmed">
                                  Confirmed
                                </option>

                                <option value="Processing">
                                  Processing
                                </option>

                                <option value="Shipped">
                                  Shipped
                                </option>

                                <option value="Delivered">
                                  Delivered
                                </option>

                                <option value="Cancelled">
                                  Cancelled
                                </option>

                              </select>

                            </td>

                          </tr>
                        )
                      )}

                    </tbody>

                  </table>

                </div>

                {!orders.length && (
                  <EmptyBox text="No orders found." />
                )}

              </div>
            )}

          </div>

        </main>

      </div>

      {/* ==========================================
          PRODUCT MODAL
      ========================================== */}

      {showProductModal && (
        <Modal
          title={
            editingProduct
              ? "Edit Product"
              : "Add Product"
          }
          onClose={() =>
            setShowProductModal(
              false
            )
          }
        >

          <form
            onSubmit={saveProduct}
            className="space-y-5"
          >

            <div className="grid md:grid-cols-2 gap-4">

              <Field
                label="Product Name"
                required
                value={
                  productForm.name
                }
                onChange={(event) =>
                  setProductForm({
                    ...productForm,
                    name:
                      event.target.value,
                  })
                }
              />

              <Field
                label="Category"
                required
                value={
                  productForm.category
                }
                onChange={(event) =>
                  setProductForm({
                    ...productForm,
                    category:
                      event.target.value,
                  })
                }
              />

              <Field
                label="Weight (grams)"
                type="number"
                required
                value={
                  productForm.weight
                }
                onChange={(event) =>
                  setProductForm({
                    ...productForm,
                    weight:
                      event.target.value,
                  })
                }
              />

              <Field
                label="Price"
                type="number"
                required
                value={
                  productForm.price
                }
                onChange={(event) =>
                  setProductForm({
                    ...productForm,
                    price:
                      event.target.value,
                  })
                }
              />

              <Field
                label="Discount Price"
                type="number"
                value={
                  productForm.discountPrice
                }
                onChange={(event) =>
                  setProductForm({
                    ...productForm,
                    discountPrice:
                      event.target.value,
                  })
                }
              />

              <Field
                label="Making Charges"
                type="number"
                value={
                  productForm.makingCharges
                }
                onChange={(event) =>
                  setProductForm({
                    ...productForm,
                    makingCharges:
                      event.target.value,
                  })
                }
              />

              <Field
                label="GST %"
                type="number"
                value={
                  productForm.gst
                }
                onChange={(event) =>
                  setProductForm({
                    ...productForm,
                    gst:
                      event.target.value,
                  })
                }
              />

              <Field
                label="Stock"
                type="number"
                required
                value={
                  productForm.stock
                }
                onChange={(event) =>
                  setProductForm({
                    ...productForm,
                    stock:
                      event.target.value,
                  })
                }
              />

              <SelectField
                label="Metal"
                value={
                  productForm.metal
                }
                onChange={(event) =>
                  setProductForm({
                    ...productForm,
                    metal:
                      event.target.value,
                  })
                }
                options={[
                  "Gold",
                  "Silver",
                  "Platinum",
                ]}
              />

              <SelectField
                label="Purity"
                value={
                  productForm.purity
                }
                onChange={(event) =>
                  setProductForm({
                    ...productForm,
                    purity:
                      event.target.value,
                  })
                }
                options={[
                  "14K",
                  "18K",
                  "22K",
                  "24K",
                  "925 Silver",
                  "950 Platinum",
                ]}
              />

              <SelectField
                label="Gender"
                value={
                  productForm.gender
                }
                onChange={(event) =>
                  setProductForm({
                    ...productForm,
                    gender:
                      event.target.value,
                  })
                }
                options={[
                  "Men",
                  "Women",
                  "Kids",
                  "Unisex",
                ]}
              />

              <Field
                label="Image URL"
                value={
                  productForm.image
                }
                onChange={(event) =>
                  setProductForm({
                    ...productForm,
                    image:
                      event.target.value,
                  })
                }
              />

            </div>

            <Field
              label="Short Description"
              value={
                productForm.shortDescription
              }
              onChange={(event) =>
                setProductForm({
                  ...productForm,
                  shortDescription:
                    event.target.value,
                })
              }
            />

            <div>

              <label className="block text-sm font-medium mb-2">
                Description
              </label>

              <textarea
                rows="4"
                value={
                  productForm.description
                }
                onChange={(event) =>
                  setProductForm({
                    ...productForm,
                    description:
                      event.target.value,
                  })
                }
                className="w-full border border-[#eccbd5] rounded-2xl px-4 py-3 outline-none focus:border-[#c76b88] focus:ring-4 focus:ring-[#f8dce5]"
              />

            </div>

            <div className="flex flex-wrap gap-5">

              <Check
                label="Featured"
                checked={
                  productForm.featured
                }
                onChange={(event) =>
                  setProductForm({
                    ...productForm,
                    featured:
                      event.target.checked,
                  })
                }
              />

              <Check
                label="Bestseller"
                checked={
                  productForm.bestseller
                }
                onChange={(event) =>
                  setProductForm({
                    ...productForm,
                    bestseller:
                      event.target.checked,
                  })
                }
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#b85c7a] hover:bg-[#a84d6c] text-white rounded-2xl py-3.5 font-semibold transition disabled:opacity-60"
            >
              {loading
                ? "Saving..."
                : editingProduct
                ? "Update Product"
                : "Add Product"}
            </button>

          </form>

        </Modal>
      )}

      {/* ==========================================
          CATEGORY MODAL
      ========================================== */}

      {showCategoryModal && (
        <Modal
          title={
            editingCategory
              ? "Edit Category"
              : "Add Category"
          }
          onClose={() =>
            setShowCategoryModal(
              false
            )
          }
        >

          <form
            onSubmit={saveCategory}
            className="space-y-5"
          >

            <Field
              label="Category Name"
              required
              value={
                categoryForm.name
              }
              onChange={(event) =>
                setCategoryForm({
                  ...categoryForm,
                  name:
                    event.target.value,
                })
              }
            />

            <Field
              label="Image URL"
              value={
                categoryForm.image
              }
              onChange={(event) =>
                setCategoryForm({
                  ...categoryForm,
                  image:
                    event.target.value,
                })
              }
            />

            <div>

              <label className="block text-sm font-medium mb-2">
                Description
              </label>

              <textarea
                rows="4"
                value={
                  categoryForm.description
                }
                onChange={(event) =>
                  setCategoryForm({
                    ...categoryForm,
                    description:
                      event.target.value,
                  })
                }
                className="w-full border border-[#eccbd5] rounded-2xl px-4 py-3 outline-none focus:border-[#c76b88]"
              />

            </div>

            <div className="flex gap-5">

              <Check
                label="Active"
                checked={
                  categoryForm.isActive
                }
                onChange={(event) =>
                  setCategoryForm({
                    ...categoryForm,
                    isActive:
                      event.target.checked,
                  })
                }
              />

              <Check
                label="Featured"
                checked={
                  categoryForm.featured
                }
                onChange={(event) =>
                  setCategoryForm({
                    ...categoryForm,
                    featured:
                      event.target.checked,
                  })
                }
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#b85c7a] hover:bg-[#a84d6c] text-white rounded-2xl py-3.5 font-semibold disabled:opacity-60"
            >
              {loading
                ? "Saving..."
                : editingCategory
                ? "Update Category"
                : "Create Category"}
            </button>

          </form>

        </Modal>
      )}

      {/* ==========================================
          COUPON MODAL
      ========================================== */}

      {showCouponModal && (
        <Modal
          title={
            editingCoupon
              ? "Edit Coupon"
              : "Add Coupon"
          }
          onClose={() =>
            setShowCouponModal(
              false
            )
          }
        >

          <form
            onSubmit={saveCoupon}
            className="space-y-5"
          >

            <div className="grid md:grid-cols-2 gap-4">

              <Field
                label="Coupon Code"
                required
                value={
                  couponForm.code
                }
                onChange={(event) =>
                  setCouponForm({
                    ...couponForm,
                    code:
                      event.target.value.toUpperCase(),
                  })
                }
              />

              <SelectField
                label="Discount Type"
                value={
                  couponForm.discountType
                }
                onChange={(event) =>
                  setCouponForm({
                    ...couponForm,
                    discountType:
                      event.target.value,
                  })
                }
                options={[
                  "percentage",
                  "fixed",
                ]}
              />

              <Field
                label="Discount Value"
                type="number"
                required
                value={
                  couponForm.discountValue
                }
                onChange={(event) =>
                  setCouponForm({
                    ...couponForm,
                    discountValue:
                      event.target.value,
                  })
                }
              />

              <Field
                label="Minimum Order Amount"
                type="number"
                value={
                  couponForm.minOrderAmount
                }
                onChange={(event) =>
                  setCouponForm({
                    ...couponForm,
                    minOrderAmount:
                      event.target.value,
                  })
                }
              />

              <Field
                label="Maximum Discount"
                type="number"
                value={
                  couponForm.maxDiscountAmount
                }
                onChange={(event) =>
                  setCouponForm({
                    ...couponForm,
                    maxDiscountAmount:
                      event.target.value,
                  })
                }
              />

              <Field
                label="Usage Limit"
                type="number"
                value={
                  couponForm.usageLimit
                }
                onChange={(event) =>
                  setCouponForm({
                    ...couponForm,
                    usageLimit:
                      event.target.value,
                  })
                }
              />

              <Field
                label="Expiry"
                type="datetime-local"
                value={
                  couponForm.expiresAt
                }
                onChange={(event) =>
                  setCouponForm({
                    ...couponForm,
                    expiresAt:
                      event.target.value,
                  })
                }
              />

            </div>

            <Field
              label="Description"
              value={
                couponForm.description
              }
              onChange={(event) =>
                setCouponForm({
                  ...couponForm,
                  description:
                    event.target.value,
                })
              }
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#b85c7a] hover:bg-[#a84d6c] text-white rounded-2xl py-3.5 font-semibold disabled:opacity-60"
            >
              {loading
                ? "Saving..."
                : editingCoupon
                ? "Update Coupon"
                : "Create Coupon"}
            </button>

          </form>

        </Modal>
      )}

    </div>
  );
};

// ==========================================
// SMALL COMPONENTS
// ==========================================

const StatCard = ({
  title,
  value,
  icon: Icon,
}) => (
  <div className="bg-white border border-[#f1d4dd] rounded-3xl p-5">

    <div className="flex items-center justify-between">

      <div>

        <p className="text-sm text-[#92717d]">
          {title}
        </p>

        <p className="text-2xl font-semibold mt-2">
          {value}
        </p>

      </div>

      <div className="w-12 h-12 rounded-2xl bg-[#fde8ef] text-[#b85c7a] flex items-center justify-center">
        <Icon size={21} />
      </div>

    </div>

  </div>
);

const MiniStat = ({
  label,
  value,
}) => (
  <div className="bg-white border border-[#f1d4dd] rounded-3xl px-5 py-4">

    <p className="text-xs text-[#92717d]">
      {label}
    </p>

    <p className="text-xl font-semibold mt-1">
      {value}
    </p>

  </div>
);

const QuickButton = ({
  label,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="text-left rounded-2xl border border-[#f1d4dd] px-4 py-4 hover:bg-[#fff5f7] transition"
  >
    <p className="text-sm font-medium">
      {label}
    </p>
  </button>
);

const EmptyBox = ({
  text,
}) => (
  <div className="py-16 text-center text-sm text-[#a17b87]">
    {text}
  </div>
);

const Field = ({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}) => (
  <div>

    <label className="block text-sm font-medium mb-2">
      {label}

      {required && (
        <span className="text-[#b85c7a]">
          {" "}
          *
        </span>
      )}
    </label>

    <input
      type={type}
      required={required}
      value={value}
      onChange={onChange}
      className="w-full border border-[#eccbd5] bg-white rounded-2xl px-4 py-3 outline-none focus:border-[#c76b88] focus:ring-4 focus:ring-[#f8dce5]"
    />

  </div>
);

const SelectField = ({
  label,
  value,
  onChange,
  options,
}) => (
  <div>

    <label className="block text-sm font-medium mb-2">
      {label}
    </label>

    <select
      value={value}
      onChange={onChange}
      className="w-full border border-[#eccbd5] bg-white rounded-2xl px-4 py-3 outline-none focus:border-[#c76b88]"
    >

      {options.map(
        (option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        )
      )}

    </select>

  </div>
);

const Check = ({
  label,
  checked,
  onChange,
}) => (
  <label className="flex items-center gap-2 text-sm cursor-pointer">

    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="accent-[#b85c7a]"
    />

    {label}

  </label>
);

const Modal = ({
  title,
  onClose,
  children,
}) => (
  <div className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">

    <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-[30px] shadow-2xl">

      <div className="sticky top-0 z-10 bg-white border-b border-[#f1d4dd] px-6 py-5 flex items-center justify-between">

        <h2 className="text-xl font-semibold">
          {title}
        </h2>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl bg-[#fff1f5] text-[#b85c7a]"
        >
          <X size={18} />
        </button>

      </div>

      <div className="p-6">
        {children}
      </div>

    </div>

  </div>
);

export default Admin;