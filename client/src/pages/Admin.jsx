import { useState } from "react";

import { createAdminProduct } from "../api/product.api";

const initialProduct = {
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
  stock: "",
  featured: false,
  bestseller: false,
  image: "",
};

const Admin = () => {
  const [product, setProduct] =
    useState(initialProduct);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const addProduct = async () => {
    setMessage("");
    setError("");

    if (
      !product.name ||
      !product.description ||
      !product.category ||
      !product.weight ||
      !product.price ||
      !product.stock
    ) {
      setError(
        "Please fill all required fields."
      );
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: product.name,
        description:
          product.description,

        shortDescription:
          product.shortDescription,

        category:
          product.category,

        metal:
          product.metal,

        purity:
          product.purity,

        gender:
          product.gender,

        weight:
          Number(product.weight),

        price:
          Number(product.price),

        discountPrice:
          Number(product.discountPrice || 0),

        makingCharges:
          Number(product.makingCharges || 0),

        gst:
          Number(product.gst || 3),

        featured:
          product.featured,

        bestseller:
          product.bestseller,

        isActive: true,

        inventory: {
          stock:
            Number(product.stock),

          reservedStock: 0,

          availableStock:
            Number(product.stock),

          lowStockThreshold: 5,
        },

        images: product.image
          ? [
              {
                public_id:
                  `external-${Date.now()}`,

                url:
                  product.image,

                alt:
                  product.name,

                isPrimary: true,
              },
            ]
          : [],

        seoTitle:
          product.name,

        seoDescription:
          product.description,

        seoKeywords: [
          product.name,
          product.category,
          product.metal,
        ],
      };

      await createAdminProduct(
        payload
      );

      setMessage(
        "Product added successfully."
      );

      setProduct(initialProduct);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to add product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-10 px-4">

      <div className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-sm">

        <h1 className="text-3xl font-bold mb-8">
          Admin Panel
        </h1>

        {message && (
          <div className="mb-5 p-3 rounded-xl bg-green-100 text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-100 text-red-700">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">

          <input
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="Product Name *"
            className="border p-3 rounded-xl"
          />

          <input
            name="category"
            value={product.category}
            onChange={handleChange}
            placeholder="Category *"
            className="border p-3 rounded-xl"
          />

          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            placeholder="Description *"
            className="border p-3 rounded-xl md:col-span-2"
            rows="4"
          />

          <input
            name="shortDescription"
            value={product.shortDescription}
            onChange={handleChange}
            placeholder="Short Description"
            className="border p-3 rounded-xl"
          />

          <input
            name="weight"
            type="number"
            value={product.weight}
            onChange={handleChange}
            placeholder="Weight (grams) *"
            className="border p-3 rounded-xl"
          />

          <select
            name="metal"
            value={product.metal}
            onChange={handleChange}
            className="border p-3 rounded-xl"
          >
            <option value="Gold">
              Gold
            </option>
            <option value="Silver">
              Silver
            </option>
            <option value="Platinum">
              Platinum
            </option>
          </select>

          <select
            name="purity"
            value={product.purity}
            onChange={handleChange}
            className="border p-3 rounded-xl"
          >
            <option value="14K">14K</option>
            <option value="18K">18K</option>
            <option value="22K">22K</option>
            <option value="24K">24K</option>
            <option value="925 Silver">
              925 Silver
            </option>
            <option value="950 Platinum">
              950 Platinum
            </option>
          </select>

          <select
            name="gender"
            value={product.gender}
            onChange={handleChange}
            className="border p-3 rounded-xl"
          >
            <option value="Men">Men</option>
            <option value="Women">
              Women
            </option>
            <option value="Kids">Kids</option>
            <option value="Unisex">
              Unisex
            </option>
          </select>

          <input
            name="price"
            type="number"
            value={product.price}
            onChange={handleChange}
            placeholder="Price *"
            className="border p-3 rounded-xl"
          />

          <input
            name="discountPrice"
            type="number"
            value={product.discountPrice}
            onChange={handleChange}
            placeholder="Discount Price"
            className="border p-3 rounded-xl"
          />

          <input
            name="makingCharges"
            type="number"
            value={product.makingCharges}
            onChange={handleChange}
            placeholder="Making Charges"
            className="border p-3 rounded-xl"
          />

          <input
            name="gst"
            type="number"
            value={product.gst}
            onChange={handleChange}
            placeholder="GST %"
            className="border p-3 rounded-xl"
          />

          <input
            name="stock"
            type="number"
            value={product.stock}
            onChange={handleChange}
            placeholder="Stock *"
            className="border p-3 rounded-xl"
          />

          <input
            name="image"
            value={product.image}
            onChange={handleChange}
            placeholder="Image URL"
            className="border p-3 rounded-xl"
          />

        </div>

        <div className="flex gap-6 my-6">

          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              name="featured"
              checked={product.featured}
              onChange={handleChange}
            />
            Featured
          </label>

          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              name="bestseller"
              checked={product.bestseller}
              onChange={handleChange}
            />
            Bestseller
          </label>

        </div>

        <button
          onClick={addProduct}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-xl hover:bg-[#D4AF37] hover:text-black transition disabled:opacity-50"
        >
          {loading
            ? "Adding Product..."
            : "Add Product"}
        </button>

      </div>

    </div>
  );
};

export default Admin;