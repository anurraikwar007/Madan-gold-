import { useState } from "react";

import ProductCard from "../components/product/ProductCard";

import { useProducts } from "../context/ProductContext";

const metalFilters = [
  "all",
  "gold",
  "silver",
  "platinum",
];

const categoryFilters = [
  "all",
  "rings",
  "chains",
  "earrings",
  "anklets",
];

const Shop = () => {

  const { products } = useProducts();

  const [selectedMetal, setSelectedMetal] =
    useState("all");

  const [selectedCategory, setSelectedCategory] =
    useState("all");

  /* FILTER PRODUCTS */
  const filteredProducts = products.filter((item) => {

    const metalMatch =
      selectedMetal === "all"
        ? true
        : item.metal === selectedMetal;

    const categoryMatch =
      selectedCategory === "all"
        ? true
        : item.category === selectedCategory;

    return metalMatch && categoryMatch;
  });

  return (
    <div
      className="
        min-h-screen
        bg-[#FAF9F6]
        px-4
        sm:px-6
        py-10
        sm:py-14
      "
    >

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">

          <p
            className="
              text-[#D4AF37]
              uppercase
              tracking-[0.3em]
              text-xs
              font-semibold
            "
          >
            Luxury Collection
          </p>

          <h1
            className="
              text-4xl
              sm:text-6xl
              font-bold
              text-[#111111]
              mt-4
            "
          >
            Shop Jewelry
          </h1>

        </div>

        {/* METAL FILTERS */}
        <div
          className="
            flex
            gap-3
            overflow-x-auto
            pb-2
            mb-6
          "
        >

          {metalFilters.map((metal) => (

            <button
              key={metal}
              onClick={() => setSelectedMetal(metal)}
              className={`
                px-5
                h-[46px]
                rounded-full
                whitespace-nowrap
                border
                text-sm
                font-medium
                transition-all
                ${
                  selectedMetal === metal
                    ? "bg-[#111111] text-white border-[#111111]"
                    : "bg-white border-black/10"
                }
              `}
            >

              {metal}

            </button>

          ))}

        </div>

        {/* CATEGORY FILTERS */}
        <div
          className="
            flex
            gap-3
            overflow-x-auto
            pb-2
            mb-10
          "
        >

          {categoryFilters.map((category) => (

            <button
              key={category}
              onClick={() =>
                setSelectedCategory(category)
              }
              className={`
                px-5
                h-[46px]
                rounded-full
                whitespace-nowrap
                border
                text-sm
                font-medium
                transition-all
                ${
                  selectedCategory === category
                    ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                    : "bg-white border-black/10"
                }
              `}
            >

              {category}

            </button>

          ))}

        </div>

        {/* PRODUCT GRID */}
        {filteredProducts.length > 0 ? (

          <div
            className="
              grid
              grid-cols-2
              lg:grid-cols-4
              gap-4
              sm:gap-6
            "
          >

            {filteredProducts.map((product) => (

              <ProductCard
                key={product.id}
                product={product}
              />

            ))}

          </div>

        ) : (

          <div
            className="
              py-24
              text-center
            "
          >

            <h3
              className="
                text-2xl
                font-bold
                text-[#111111]
              "
            >
              No Products Found
            </h3>

            <p
              className="
                text-gray-500
                mt-3
              "
            >
              Try changing filters.
            </p>

          </div>

        )}

      </div>

    </div>
  );
};

export default Shop;