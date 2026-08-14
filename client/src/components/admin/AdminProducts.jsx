import {
  useEffect,
  useState,
} from "react";

import {
  Pencil,
  Trash2,
  Plus,
  Search,
  ImagePlus,
} from "lucide-react";

import {
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
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
  const [products, setProducts] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [form, setForm] =
    useState(initialForm);

  const [editing, setEditing] =
    useState(null);

  const [open, setOpen] =
    useState(false);

  const [deleteId, setDeleteId] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [selectedFiles, setSelectedFiles] =
    useState([]);

  const load = async () => {
    setLoading(true);

    try {
      const [
        productsResponse,
        categoriesResponse,
      ] = await Promise.all([
        getAdminProducts({
          page: 1,
          limit: 100,
          search,
        }),
        getAdminCategories({
          page: 1,
          limit: 100,
        }),
      ]);

      const productData =
        productsResponse?.data?.data;

      const categoryData =
        categoriesResponse?.data?.data;

      setProducts(
        productData?.products || []
      );

      setCategories(
        categoryData?.categories || []
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

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
    setForm(initialForm);
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
        weight: Number(form.weight),
        price: Number(form.price),
        discountPrice:
          Number(form.discountPrice) || 0,
        makingCharges:
          Number(form.makingCharges) || 0,
        gst: Number(form.gst) || 0,
        featured: form.featured,
        bestseller: form.bestseller,
        isActive: form.isActive,

        inventory: {
          stock: Number(form.stock) || 0,
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

      setOpen(false);
      await load();
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

      setDeleteId(null);
      await load();
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
          variant="gold"
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
                load();
              }
            }}
            placeholder="Search products..."
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#B88A44]"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
              <tr>
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
              {products.map(
                (product) => (
                  <tr
                    key={product._id}
                    className="border-t border-slate-100"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 overflow-hidden rounded-xl bg-slate-100">
                          {product.images
                            ?.length ? (
                            <img
                              src={
                                product
                                  .images[0]
                                  ?.url
                              }
                              alt={
                                product.name
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-slate-400">
                              <ImagePlus
                                size={17}
                              />
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-800">
                            {product.name}
                          </p>

                          <p className="text-xs text-slate-400">
                            {product.purity}{" "}
                            •{" "}
                            {product.metal}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {product.category}
                    </td>

                    <td className="px-5 py-4 font-semibold">
                      ₹
                      {Number(
                        product.discountPrice ||
                          product.price ||
                          0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {product.inventory
                        ?.stock ?? 0}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          product.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {product.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            openEdit(
                              product
                            )
                          }
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        >
                          <Pencil
                            size={17}
                          />
                        </button>

                        <button
                          onClick={() =>
                            setDeleteId(
                              product._id
                            )
                          }
                          className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"
                        >
                          <Trash2
                            size={17}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}

              {!products.length &&
                !loading && (
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
          setOpen(false)
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
                    key={category._id}
                    value={
                      category.name
                    }
                  >
                    {category.name}
                  </option>
                )
              )}
            </AdminSelect>
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
            value={
              form.description
            }
            onChange={(e) =>
              updateField(
                "description",
                e.target.value
              )
            }
            required
          />

          <div className="grid gap-4 sm:grid-cols-3">
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
              <option>Gold</option>
              <option>Silver</option>
              <option>Platinum</option>
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
              <option>14K</option>
              <option>18K</option>
              <option>22K</option>
              <option>24K</option>
              <option>925 Silver</option>
              <option>950 Platinum</option>
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
              <option>Men</option>
              <option>Women</option>
              <option>Kids</option>
              <option>Unisex</option>
            </AdminSelect>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <AdminInput
              label="Weight (g)"
              type="number"
              step="0.01"
              value={form.weight}
              onChange={(e) =>
                updateField(
                  "weight",
                  e.target.value
                )
              }
              required
            />

            <AdminInput
              label="Price"
              type="number"
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
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <AdminInput
              label="GST %"
              type="number"
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
              value={form.stock}
              onChange={(e) =>
                updateField(
                  "stock",
                  e.target.value
                )
              }
              required
            />

            <AdminInput
              label="Available Stock"
              type="number"
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
              label="Low Stock Alert"
              type="number"
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

          <div className="grid gap-3 sm:grid-cols-3">
            <Toggle
              label="Active"
              checked={form.isActive}
              onChange={(value) =>
                updateField(
                  "isActive",
                  value
                )
              }
            />

            <Toggle
              label="Featured"
              checked={form.featured}
              onChange={(value) =>
                updateField(
                  "featured",
                  value
                )
              }
            />

            <Toggle
              label="Bestseller"
              checked={
                form.bestseller
              }
              onChange={(value) =>
                updateField(
                  "bestseller",
                  value
                )
              }
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Product Images
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFiles}
              className="mt-2 block w-full rounded-xl border border-dashed border-slate-300 p-4 text-sm"
            />

            {selectedFiles.length >
              0 && (
              <p className="mt-2 text-xs text-slate-400">
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
              placeholder="gold ring, jewellery, ring"
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

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <AdminButton
              variant="soft"
              onClick={() =>
                setOpen(false)
              }
            >
              Cancel
            </AdminButton>

            <AdminButton
              type="submit"
              variant="gold"
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
        onCancel={() =>
          setDeleteId(null)
        }
        onConfirm={remove}
        loading={saving}
        title="Delete Product?"
        message="Product soft-delete ho jayega aur customer side par available nahi rahega."
      />
    </AdminPage>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
      <span className="text-sm font-medium text-slate-700">
        {label}
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) =>
          onChange(
            e.target.checked
          )
        }
        className="h-4 w-4 accent-[#B88A44]"
      />
    </label>
  );
}