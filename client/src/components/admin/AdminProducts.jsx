import {
   useCallback,
  useEffect,
  useState,
} from "react";

import {
  Pencil,
  Trash2,
  Plus,
  Search,
  ImagePlus,
  Eye,
  EyeOff,
  CheckSquare,
  Square,
} from "lucide-react";

import {
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  toggleAdminProduct,
  deleteAdminProduct,
  uploadAdminProductImages,
  getAdminCategories,
} from "../../api/admin.api";

import {
  AdminButton,
  AdminInput,
  AdminSelect,
  AdminTextarea,
  AdminModal,
  AdminConfirm,
  AdminPage,
  AdminToggle,
  AdminStatus,
  AdminCard,
} from "./AdminUI";

const initialForm = {
  name: "",
  description: "",
  shortDescription: "",
  category: "",
  metal: "Gold",
  purity: "22K",
  gender: "Unisex",
  weight: "",
  price: "",
  discountPrice: "0",
  makingCharges: "0",
  gst: "3",
  featured: false,
  bestseller: false,
  isActive: true,
  stock: "",
  reservedStock: "0",
  availableStock: "",
  lowStockThreshold: "5",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  images: [],
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [, setPage] = useState(1);
  

  const load = useCallback(async  (
  targetPage = 1
    ) => {
    setLoading(true);

    try {
      const [
        productsResponse,
        categoriesResponse,
      ] = await Promise.all([
        getAdminProducts({
          page: targetPage,
          limit: 100,
          search,
        }),

        getAdminCategories({
          page: 1,
          limit: 100,
          isActive: true,
        }),
      ]);

      const productData =
        productsResponse?.data?.data;

      const categoryData =
        categoriesResponse?.data?.data;

        setProducts(
          productData?.products || []
        );

        setPage(
            productData?.pagination?.page ||
            targetPage
          );

        

      setCategories(
        categoryData?.docs ||
          categoryData?.categories ||
          (Array.isArray(categoryData)
            ? categoryData
            : [])
      );
    } catch (error) {
      console.error(
        "Failed to load admin products/categories:",
        error
      );

      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  },[search]);

 useEffect(() => {
  const timer = setTimeout(() => {
    load();
  }, 0);

      return () => clearTimeout(timer);
    }, [load]);

  const updateField = (
    field,
    value
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const openCreate = () => {
    setEditing(null);
    setForm({
      ...initialForm,
      images: [],
    });
    setSelectedFiles([]);
    setOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);

    setForm({
      name: product.name || "",

      description:
        product.description || "",

      shortDescription:
        product.shortDescription || "",

      category:
        product.category || "",

      metal:
        product.metal || "Gold",

      purity:
        product.purity || "22K",

      gender:
        product.gender || "Unisex",

      weight:
        product.weight ?? "",

      price:
        product.price ?? "",

      discountPrice:
        product.discountPrice ?? 0,

      makingCharges:
        product.makingCharges ?? 0,

      gst:
        product.gst ?? 3,

      featured:
        !!product.featured,

      bestseller:
        !!product.bestseller,

      isActive:
        product.isActive !== false,

      stock:
        product.inventory?.stock ?? "",

      reservedStock:
        product.inventory?.reservedStock ??
        0,

      availableStock:
        product.inventory?.availableStock ??
        "",

      lowStockThreshold:
        product.inventory
          ?.lowStockThreshold ?? 5,

      seoTitle:
        product.seoTitle || "",

      seoDescription:
        product.seoDescription || "",

      seoKeywords:
        Array.isArray(
          product.seoKeywords
        )
          ? product.seoKeywords.join(", ")
          : "",

      images:
        product.images || [],
    });

    setSelectedFiles([]);
    setOpen(true);
  };

  const handleFiles = (event) => {
    setSelectedFiles(
      Array.from(
        event.target.files || []
      )
    );
  };

  const save = async (event) => {
    event.preventDefault();

    setSaving(true);

    try {
      let images = form.images || [];

      if (selectedFiles.length) {
        const uploadResponse =
          await uploadAdminProductImages(
            selectedFiles
          );

        const uploaded =
          uploadResponse?.data?.data ||
          [];

        images = [
          ...images,
          ...uploaded,
        ];
      }

      const payload = {
        name: form.name.trim(),

        description:
          form.description.trim(),

        shortDescription:
          form.shortDescription.trim(),

        category:
          form.category.trim(),

        metal: form.metal,

        purity: form.purity,

        gender: form.gender,

        weight:
          Number(form.weight) || 0,

        price:
          Number(form.price) || 0,

        discountPrice:
          Number(form.discountPrice) || 0,

        makingCharges:
          Number(form.makingCharges) || 0,

        gst:
          Number(form.gst) || 0,

        featured:
          form.featured,

        bestseller:
          form.bestseller,

        isActive:
          form.isActive,

        inventory: {
          stock:
            Number(form.stock) || 0,

          reservedStock:
            Number(
              form.reservedStock
            ) || 0,

          availableStock:
            form.availableStock === ""
              ? Number(form.stock) || 0
              : Number(
                  form.availableStock
                ),

          lowStockThreshold:
            Number(
              form.lowStockThreshold
            ) || 5,
        },

        images,

        seoTitle:
          form.seoTitle.trim(),

        seoDescription:
          form.seoDescription.trim(),

        seoKeywords:
          form.seoKeywords
            .split(",")
            .map((item) =>
              item.trim()
            )
            .filter(Boolean),
      };

      if (!payload.name) {
        throw new Error(
          "Product name is required."
        );
      }

      if (!payload.category) {
        throw new Error(
          "Please select a category."
        );
      }

      if (!payload.price) {
        throw new Error(
          "Product price is required."
        );
      }

      if (editing) {
        await updateAdminProduct(
          editing._id,
          payload
        );
      } else {
        await createAdminProduct(
          payload
        );
      }

      window.dispatchEvent(
        new Event("products-updated")
      );

      setOpen(false);
      setEditing(null);
      setForm(initialForm);
      setSelectedFiles([]);

      await load();
    } catch (error) {
      console.error(
        "Product save failed:",
        error
      );

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Product save failed."
      );
    } finally {
      setSaving(false);
    }
  };

    const remove = async () => {
      if (!deleteId) return;

      setSaving(true);

      try {
        await deleteAdminProduct(
          deleteId
        );

        window.dispatchEvent(
          new Event("products-updated")
        );

        setDeleteId(null);

        await load();
      } catch (error) {
        console.error(
          "Product delete failed:",
          error
        );

        alert(
          error?.response?.data?.message ||
            error?.message ||
            "Product delete failed."
        );
      } finally {
        setSaving(false);
      }
    };
    const toggleSelected = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter(
            (item) => item !== id
          )
        : [...prev, id]
    );
    };

    const toggleSelectAll = () => {
      if (
        selectedIds.length ===
        products.length
      ) {
        setSelectedIds([]);
        return;
      }

      setSelectedIds(
        products.map(
          (product) => product._id
        )
      );
    };

    const bulkUpdateStatus = async (
      targetStatus
    ) => {
      if (!selectedIds.length) return;

      setSaving(true);

      try {
        const selectedProducts =
          products.filter((product) =>
            selectedIds.includes(
              product._id
            )
          );

        const targets =
          selectedProducts.filter(
            (product) =>
              product.isActive !==
              targetStatus
          );

        await Promise.all(
          targets.map((product) =>
            toggleAdminProduct(
              product._id
            )
          )
        );

        setSelectedIds([]);

        await load();
      } catch (error) {
        console.error(
          "Product visibility update failed:",
          error
        );

        alert(
          error?.response?.data?.message ||
            "Unable to update visibility."
        );
      } finally {
        setSaving(false);
      }
    };

    const bulkDelete = async () => {
      if (!selectedIds.length) return;

      const confirmed = window.confirm(
        `Delete ${selectedIds.length} selected products?`
      );

      if (!confirmed) return;

      setSaving(true);

      try {
        await Promise.all(
          selectedIds.map((id) =>
            deleteAdminProduct(id)
          )
        );

        setSelectedIds([]);

        window.dispatchEvent(
          new Event("products-updated")
        );

        await load();
      } catch (error) {
        console.error(
          "Bulk product delete failed:",
          error
        );

        alert(
          error?.response?.data?.message ||
            error?.message ||
            "Bulk delete failed."
        );
      } finally {
        setSaving(false);
      }
    };
  return (
    <AdminPage
      title="Products"
      description="Manage jewellery products, inventory and SEO"
      action={
        <AdminButton
          variant="primary"
          onClick={openCreate}
        >
          <Plus size={17} />
          Add Product
        </AdminButton>
      }
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

           {selectedIds.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-violet-100 bg-violet-50/60 p-3">
              <span className="mr-2 text-sm font-semibold text-slate-700">
                  {selectedIds.length} selected
                </span>

                <AdminButton
                  variant="soft"
                  onClick={() =>
                    bulkUpdateStatus(true)
                  }
                >
                  Show
                </AdminButton>

                <AdminButton
                  variant="soft"
                  onClick={() =>
                    bulkUpdateStatus(false)
                  }
                >
                  Hide
                </AdminButton>

                <AdminButton
                  variant="danger"
                  onClick={bulkDelete}
                >
                  Delete
                </AdminButton>
              </div>
            )}

          <input
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            onKeyDown={(e) => {
              if (
                e.key === "Enter"
              ) {
                setPage(1);
                load(1);
              }
            }}
            placeholder="Search products..."
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#B88A44]"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full  min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                  <th className="w-12 px-5 py-4">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="text-[#8B6A48]"
                  >
                    {products.length > 0 &&
                    selectedIds.length ===
                      products.length ? (
                      <CheckSquare size={18} />
                    ) : (
                      <Square size={18} />
                    )}
                  </button>
                </th>

                <th className="px-5 py-4">
                  Product
                </th>

                <th className="px-5 py-4">
                  Category
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
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-10 text-center text-slate-400"
                  >
                    Loading products...
                  </td>
                </tr>
              ): products.length ? (
                products.map(
                  (product) => (
                    <tr
                      key={
                        product._id
                      }
                      className="border-t border-slate-100"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {product.images
                            ?.length ? (
                            <img
                              src={
                                typeof product.images[0] === "string"
                                  ? product.images[0]
                                  : product.images[0]?.url ||
                                    product.images[0]?.secure_url ||
                                    product.images[0]?.src ||
                                    ""
                              }
                              alt={product.name}
                              className="h-12 w-12 rounded-xl object-cover ring-1 ring-slate-200"
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                              <ImagePlus
                                size={18}
                              />
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-slate-800">
                              {
                                product.name
                              }
                            </p>

                            <p className="text-xs text-slate-400">
                              {product.gender ||
                                "Unisex"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {product.category ||
                          "—"}
                      </td>

                      <td className="px-5 py-4 font-semibold text-slate-800">
                        ₹
                        {Number(
                          product.price ||
                            0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {product.inventory
                          ?.availableStock ??
                          product.inventory
                            ?.stock ??
                          0}
                      </td>

                      
                       <td className="px-5 py-4">
                        <AdminToggle
                          checked={product.isActive !== false}
                          label
                          onChange={async () => {
                            try {
                              const response =
                                await toggleAdminProduct(product._id);

                              const updatedProduct =
                                response?.data?.data;

                              setProducts((prev) =>
                                prev.map((item) =>
                                  item._id === product._id
                                    ? {
                                        ...item,
                                        isActive:
                                          updatedProduct?.isActive ??
                                          !item.isActive,
                                      }
                                    : item
                                )
                              );

                              window.dispatchEvent(
                                new Event("products-updated")
                              );
                            } catch (error) {
                              console.error(
                                "Product visibility toggle failed:",
                                error
                              );

                              alert(
                                error?.response?.data?.message ||
                                  "Unable to update product visibility."
                              );
                            }
                          }}
                        />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <AdminButton
                            variant="soft"
                            onClick={() =>
                              openEdit(
                                product
                              )
                            }
                          >
                            <Pencil
                              size={15}
                            />
                          </AdminButton>

                          <AdminButton
                            variant="danger"
                            onClick={() =>
                              setDeleteId(
                                product._id
                              )
                            }
                          >
                            <Trash2
                              size={15}
                            />
                          </AdminButton>
                        </div>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center text-slate-400"
                  >
                    No products found.
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
          !saving && setOpen(false)
        }
        title={
          editing
            ? "Edit Product"
            : "Add Product"
        }
        width="max-w-5xl"
      >
        <form
          onSubmit={save}
          className="space-y-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <AdminInput
              label="Product Name"
              value={form.name}
              onChange={(e) =>
                updateField(
                  "name",
                  e.target.value
                )
              }
              required
            />

            <AdminSelect
              label="Category"
              value={form.category}
              onChange={(e) =>
                updateField(
                  "category",
                  e.target.value
                )
              }
              required
            >
              <option value="">
                Select category
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={
                      category._id
                    }
                    value={
                      category.name
                    }
                  >
                    {
                      category.name
                    }
                  </option>
                )
              )}
            </AdminSelect>

            <AdminSelect
              label="Gender"
              value={form.gender}
              onChange={(e) =>
                updateField(
                  "gender",
                  e.target.value
                )
              }
            >
              <option value="Unisex">
                Unisex
              </option>

              <option value="Men">
                Men
              </option>

              <option value="Women">
                Women
              </option>

              <option value="Kids">
                Kids
              </option>
            </AdminSelect>

            <AdminSelect
              label="Metal"
              value={form.metal}
              onChange={(e) =>
                updateField(
                  "metal",
                  e.target.value
                )
              }
            >
              <option value="Gold">
                Gold
              </option>

              <option value="Silver">
                Silver
              </option>

              <option value="Diamond">
                Diamond
              </option>

              <option value="Platinum">
                Platinum
              </option>
            </AdminSelect>

            <AdminSelect
              label="Purity"
              value={form.purity}
              onChange={(e) =>
                updateField(
                  "purity",
                  e.target.value
                )
              }
            >
              <option value="22K">
                22K
              </option>

              <option value="24K">
                24K
              </option>

              <option value="18K">
                18K
              </option>

              <option value="14K">
                14K
              </option>
            </AdminSelect>

            <AdminInput
              label="Weight"
              type="number"
              step="0.01"
              value={form.weight}
              onChange={(e) =>
                updateField(
                  "weight",
                  e.target.value
                )
              }
            />

            <AdminInput
              label="Price"
              type="number"
              min="0"
              value={form.price}
              onChange={(e) =>
                updateField(
                  "price",
                  e.target.value
                )
              }
              required
            />

            <AdminInput
              label="Discount Price"
              type="number"
              min="0"
              value={
                form.discountPrice
              }
              onChange={(e) =>
                updateField(
                  "discountPrice",
                  e.target.value
                )
              }
            />

            <AdminInput
              label="Making Charges"
              type="number"
              min="0"
              value={
                form.makingCharges
              }
              onChange={(e) =>
                updateField(
                  "makingCharges",
                  e.target.value
                )
              }
            />

            <AdminInput
              label="GST %"
              type="number"
              min="0"
              value={form.gst}
              onChange={(e) =>
                updateField(
                  "gst",
                  e.target.value
                )
              }
            />

            <AdminInput
              label="Stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) =>
                updateField(
                  "stock",
                  e.target.value
                )
              }
            />

            <AdminInput
              label="Available Stock"
              type="number"
              min="0"
              value={
                form.availableStock
              }
              onChange={(e) =>
                updateField(
                  "availableStock",
                  e.target.value
                )
              }
            />

            <AdminInput
              label="Low Stock Threshold"
              type="number"
              min="0"
              value={
                form.lowStockThreshold
              }
              onChange={(e) =>
                updateField(
                  "lowStockThreshold",
                  e.target.value
                )
              }
            />
          </div>

          <AdminTextarea
            label="Short Description"
            value={
              form.shortDescription
            }
            onChange={(e) =>
              updateField(
                "shortDescription",
                e.target.value
              )
            }
          />

          <AdminTextarea
            label="Description"
            value={form.description}
            onChange={(e) =>
              updateField(
                "description",
                e.target.value
              )
            }
          />

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Product Images
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={
                handleFiles
              }
              className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm"
            />

            {selectedFiles.length >
              0 && (
              <p className="mt-2 text-xs text-slate-500">
                {
                  selectedFiles.length
                }{" "}
                image(s) selected
              </p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <AdminInput
              label="SEO Title"
              value={form.seoTitle}
              onChange={(e) =>
                updateField(
                  "seoTitle",
                  e.target.value
                )
              }
            />

            <AdminInput
              label="SEO Keywords"
              placeholder="ring, gold ring, jewellery"
              value={
                form.seoKeywords
              }
              onChange={(e) =>
                updateField(
                  "seoKeywords",
                  e.target.value
                )
              }
            />
          </div>

          <AdminTextarea
            label="SEO Description"
            value={
              form.seoDescription
            }
            onChange={(e) =>
              updateField(
                "seoDescription",
                e.target.value
              )
            }
          />

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={
                  form.featured
                }
                onChange={(e) =>
                  updateField(
                    "featured",
                    e.target.checked
                  )
                }
              />
              Featured
            </label>

            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={
                  form.bestseller
                }
                onChange={(e) =>
                  updateField(
                    "bestseller",
                    e.target.checked
                  )
                }
              />
              Bestseller
            </label>

            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={
                  form.isActive
                }
                onChange={(e) =>
                  updateField(
                    "isActive",
                    e.target.checked
                  )
                }
              />
              Active
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <AdminButton
              variant="soft"
              type="button"
              onClick={() =>
                setOpen(false)
              }
              disabled={saving}
            >
              Cancel
            </AdminButton>

            <AdminButton
              variant="gold"
              type="submit"
              loading={saving}
            >
              {editing
                ? "Update Product"
                : "Create Product"}
            </AdminButton>
          </div>
        </form>
      </AdminModal>

      <AdminConfirm
        open={!!deleteId}
        loading={saving}
        onCancel={() =>
          !saving &&
          setDeleteId(null)
        }
        onConfirm={remove}
        title="Delete product?"
        message="This product will be removed from the active store catalogue."
      />
    </AdminPage>
  );
   
}