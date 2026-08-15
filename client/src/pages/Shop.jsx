import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ProductCard from "../components/product/ProductCard";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";

import { useProducts } from "../context/ProductContext";

const Shop = () => {
  const { products, loading } = useProducts();

  const [searchParams] = useSearchParams();

  const [selectedGender, setSelectedGender] =
    useState("all");

  const [selectedCategory, setSelectedCategory] =
    useState("all");

  useEffect(() => {
  const timer = setTimeout(() => {
    const gender = searchParams.get("gender");
    const category = searchParams.get("category");

    if (gender) {
      setSelectedGender(gender.toLowerCase());
    }

    if (category) {
      setSelectedCategory(category.toLowerCase());
    }
  }, 0);

  return () => clearTimeout(timer);
}, [searchParams]);
  const genders = [
    "all",
    ...new Set(
      products
        .map((p) => p.gender)
        .filter(Boolean)
        .map((g) => g.toLowerCase())
    ),
  ];

  const categories = [
    "all",
    ...new Set(
      products
        .map((p) =>
          typeof p.category === "object"
            ? p.category?.name
            : p.category
        )
        .filter(Boolean)
        .map((c) => c.toLowerCase())
    ),
  ];

  const filteredProducts =
    products.filter((product) => {
      const gender =
        product.gender?.toLowerCase();

      const category =
        (
          typeof product.category ===
          "object"
            ? product.category?.name
            : product.category
        )?.toLowerCase();

      const genderMatch =
        selectedGender === "all" ||
        gender === selectedGender;

      const categoryMatch =
        selectedCategory === "all" ||
        category === selectedCategory;

      return (
        genderMatch &&
        categoryMatch
      );
    });

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#FAF9F6] px-4 py-10">

      <div className="max-w-7xl mx-auto">

        <div className="mb-10">

          <h1 className="text-5xl font-bold">
            Shop Jewellery
          </h1>

          <p className="text-gray-500 mt-3">
            Explore our latest collection.
          </p>

        </div>

        {/* Gender */}

        <div className="flex gap-3 overflow-x-auto mb-5">

          {genders.map((gender) => (

            <button
              key={gender}
              onClick={() =>
                setSelectedGender(gender)
              }
              className={`px-5 h-11 rounded-full border ${
                selectedGender === gender
                  ? "bg-black text-white"
                  : "bg-white"
              }`}
            >
              {gender}
            </button>

          ))}

        </div>

        {/* Category */}

        <div className="flex gap-3 overflow-x-auto mb-10">

          {categories.map((category) => (

            <button
              key={category}
              onClick={() =>
                setSelectedCategory(
                  category
                )
              }
              className={`px-5 h-11 rounded-full border ${
                selectedCategory ===
                category
                  ? "bg-[#D4AF37]"
                  : "bg-white"
              }`}
            >
              {category}
            </button>

          ))}

        </div>

        {filteredProducts.length ===
        0 ? (
          <EmptyState
            title="No Products Found"
            subtitle="Try changing filters."
          />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

            {filteredProducts.map(
              (product) => (
                <ProductCard
                  key={
                    product._id
                  }
                  product={
                    product
                  }
                />
              )
            )}

          </div>
        )}

      </div>

    </div>
  );
};

export default Shop;