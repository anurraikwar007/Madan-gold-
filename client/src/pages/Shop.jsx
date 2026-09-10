import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useSearchParams } from "react-router-dom";

import ProductCard from "../components/product/ProductCard";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";

import { getProducts } from "../api/product.api";
import { getCategories } from "../api/category.api";
import { useSearch } from "../context/SearchContext";

const Shop = () => {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const { query } = useSearch();

  const [products, setProducts] =
    useState([]);

  const [pagination, setPagination] =
    useState({
      total: 0,
      page: 1,
      limit: 24,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    });

  const [loading, setLoading] =
    useState(true);

     const [error, setError] =
    useState("");

  const [categoryList, setCategoryList] =
    useState([]);

  const [sort, setSort] =
    useState(
      searchParams.get("sort") || "newest"
    );

  const [minPrice, setMinPrice] =
    useState(
      searchParams.get("minPrice") || ""
    );

  const [maxPrice, setMaxPrice] =
    useState(
      searchParams.get("maxPrice") || ""
    );

  const [selectedGender, setSelectedGender] =
    useState(
      searchParams.get("gender") ||
        "all"
    );

  const [selectedCategory, setSelectedCategory] =
    useState(
      searchParams.get("category") ||
        "all"
    );

      
  const currentPage = Math.max(
    Number(searchParams.get("page")) || 1,
    1
  );

  const searchQuery =
    searchParams.get("search") ??
    query ??
    "";

  useEffect(() => {
    const rawGender =
  searchParams.get("gender") ||
  "all";

const genderMap = {
  men: "Men",
  women: "Women",
  kids: "Kids",
  unisex: "Unisex",
  all: "all",
};

const gender =
  genderMap[
    rawGender.toLowerCase()
  ] || "all";

    const category =
      searchParams.get("category") ||
      "all";

    setSelectedGender(
      gender.toLowerCase()
    );

      setSelectedCategory(category);

  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const params = {
          page: currentPage,
          limit: 24,
        };

        const cleanSearch =
          searchQuery.trim();

        if (cleanSearch) {
          params.search = cleanSearch;
        }

            if (
              selectedGender &&
              selectedGender !== "all"
            ) {
              const genderMap = {
      men: "Men",
      women: "Women",
      kids: "Kids",
      unisex: "Unisex",
    };

    params.gender =
      genderMap[
        selectedGender.toLowerCase()
      ] || selectedGender;
        }

       if (
      selectedCategory &&
      selectedCategory !== "all"
    ) {
    const selectedCategoryData =
     categoryList.find(
      (item) =>
        item?._id === selectedCategory ||
        item?.slug === selectedCategory ||
        item?.name?.toLowerCase() ===
          selectedCategory.toLowerCase()
    );

  params.category =
    selectedCategoryData?.name ||
    selectedCategory;
  }

        const response =
          await getProducts(params);

        if (cancelled) return;

        const data =
          response?.data?.data;

        setProducts(
          Array.isArray(
            data?.products
          )
            ? data.products
            : []
        );

        setPagination(
          data?.pagination || {
            total: 0,
            page: currentPage,
            limit: 24,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          }
        );
      } catch (err) {
        if (cancelled) return;

        console.error(
          "Shop products load failed:",
          err
        );

        setProducts([]);
        setError(
          "Unable to load products. Please try again."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [
    currentPage,
    searchQuery,
    selectedGender,
    selectedCategory,
  ]);

  const genders = useMemo(() => {
    return [
      "all",
      "men",
      "women",
      "kids",
      "unisex",
    ];
  }, []);

    useEffect(() => {
    let cancelled = false;

    const loadCategories = async () => {
      try {
        const response =
          await getCategories();

        if (cancelled) return;

        const data =
          response?.data?.data;

        const categories =
          Array.isArray(data)
            ? data
            : Array.isArray(data?.categories)
              ? data.categories
              : [];

        setCategoryList(
          categories.filter(
            (category) =>
              category?.isActive !== false
          )
        );
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Categories load failed:",
            error
          );

          setCategoryList([]);
        }
      }
    };

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
  return [
    {
      _id: "all",
      slug: "all",
      name: "All Categories",
    },
    ...categoryList,
   ];
  }, [categoryList]);

  const updateFilters = ({
    gender = selectedGender,
    category = selectedCategory,
  }) => {
    const nextParams =
      new URLSearchParams(
        searchParams
      );

    if (
      gender &&
      gender !== "all"
    ) {
      nextParams.set(
        "gender",
        gender
      );
    } else {
      nextParams.delete("gender");
    }

    if (
      category &&
      category !== "all"
    ) {
      nextParams.set(
        "category",
        category
      );
    } else {
      nextParams.delete("category");
    }

    nextParams.delete("page");

    if (searchQuery.trim()) {
      nextParams.set(
        "search",
        searchQuery.trim()
      );
    } else {
      nextParams.delete("search");
    }

    setSearchParams(nextParams);
  };

  const goToPage = (page) => {
    const nextParams =
      new URLSearchParams(
        searchParams
      );

    if (page <= 1) {
      nextParams.delete("page");
    } else {
      nextParams.set(
        "page",
        String(page)
      );
    }

    setSearchParams(nextParams);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] px-4 py-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="mb-10">
          <h1 className="text-5xl font-bold">
            {searchQuery.trim()
              ? `Search: ${searchQuery}`
              : "Shop 925 Silver Jewellery"}
          </h1>

          <p className="text-gray-500 mt-3">
            Explore our 92.5 sterling silver
            jewellery collection.
          </p>

          {pagination.total > 0 && (
            <p className="text-sm text-gray-400 mt-2">
              {pagination.total} products
            </p>
          )}
        </div>

        {/* Gender */}

        <div className="flex gap-3 overflow-x-auto mb-5 pb-2">
          {genders.map((gender) => (
            <button
              key={gender}
              type="button"
              onClick={() => {
                setSelectedGender(
                  gender
                );

                updateFilters({
                  gender,
                  category:
                    selectedCategory,
                });
              }}
              className={`px-5 h-11 rounded-full border whitespace-nowrap ${
                selectedGender === gender
                  ? "bg-black text-white"
                  : "bg-white"
              }`}
            >
              {gender === "all"
                ? "All"
                : gender}
            </button>
          ))}
        </div>

        {/* Category */}

        {categories.length > 1 && (
          <div className="flex gap-3 overflow-x-auto mb-10 pb-2">
            {categories.map((category) => (
              <button
                key={category._id}
                type="button"
               onClick={() => {
                const categoryValue =
                  category._id === "all"
                    ? "all"
                    : category.slug ||
                      category.name
                        ?.toLowerCase();

                  setSelectedCategory(
                    categoryValue
                  );

                  updateFilters({
                    gender: selectedGender,
                    category: categoryValue,
                  });
                }}
                className={`px-5 h-11 rounded-full border whitespace-nowrap ${
                  selectedCategory ===
                  (category._id === "all"
                    ? "all"
                    : category.slug ||
                      category.name?.toLowerCase())
                    ? "bg-[#D4AF37]"
                    : "bg-white"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}

        {/* Error */}

        {error && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            {error}
          </div>
        )}

        {/* Products */}

        {products.length === 0 ? (
          <EmptyState
            title="No Products Found"
            subtitle={
              searchQuery.trim()
                ? "Try another search or change your filters."
                : "Try changing your filters."
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(
                (product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                )
              )}
            </div>

            {/* Pagination */}

            {pagination.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-3">

                <button
                  type="button"
                  disabled={
                    !pagination.hasPrevPage
                  }
                  onClick={() =>
                    goToPage(
                      currentPage - 1
                    )
                  }
                  className="px-5 h-11 rounded-full border bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <span className="px-4 text-sm text-gray-500">
                  Page {pagination.page}{" "}
                  of{" "}
                  {pagination.totalPages}
                </span>

                <button
                  type="button"
                  disabled={
                    !pagination.hasNextPage
                  }
                  onClick={() =>
                    goToPage(
                      currentPage + 1
                    )
                  }
                  className="px-5 h-11 rounded-full border bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>

              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default Shop;