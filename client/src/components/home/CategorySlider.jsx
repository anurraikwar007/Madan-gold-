import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  getCategories,
} from "../../api/category.api";

const CategorySlider = () => {
  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadCategories =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getCategories();

        const data =
          response?.data?.data;

        const list =
          Array.isArray(data)
            ? data
            : Array.isArray(
                data?.categories
              )
              ? data.categories
              : Array.isArray(
                  data?.docs
                )
                ? data.docs
                : [];

        const activeCategories =
          list.filter(
            (category) =>
              category &&
              category.isDeleted !== true &&
              category.isActive !== false
          );

        setCategories(
          activeCategories
        );
      } catch (err) {
        console.error(
          "Categories load failed:",
          err
        );

        setCategories([]);

        setError(
          "Unable to load categories."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  if (loading) {
    return (
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 h-8 w-64 animate-pulse rounded bg-gray-200" />

          <div className="flex gap-4 overflow-hidden">
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <div
                key={index}
                className="h-14 w-36 flex-shrink-0 animate-pulse rounded-full bg-gray-200"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!categories.length) {
    return null;
  }

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4">

        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6594B1]">
            Browse Jewellery
          </p>

          <h2 className="heading mt-3 text-3xl sm:text-5xl">
            Shop By Type
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500">
            Explore our 925 sterling silver jewellery
            collections.
          </p>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide md:flex-wrap md:justify-center">
          {categories.map((category) => {
            const id =
              category?._id ||
              category?.id;

            const name =
              String(
                category?.name || ""
              ).trim();

            const slug =
              category?.slug ||
              name.toLowerCase();

            if (!id || !name) {
              return null;
            }

            return (
              <Link
                key={id}
                to={`/shop?category=${encodeURIComponent(
                  slug
                )}`}
                className="group flex h-14 flex-shrink-0 items-center justify-center rounded-full border border-[#213C51]/15 bg-white px-7 font-medium text-[#213C51] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-[#213C51] hover:text-white hover:shadow-xl"
              >
                {name}
              </Link>
            );
          })}
        </div>

        {error && (
          <p className="mt-5 text-center text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    </section>
  );
};

export default CategorySlider;