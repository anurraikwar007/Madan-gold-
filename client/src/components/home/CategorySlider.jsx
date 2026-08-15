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

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);

      const response =
        await getCategories();

      const data =
        response?.data?.data;

      const list =
        data?.docs ||
        data?.categories ||
        (Array.isArray(data)
          ? data
          : []);

      setCategories(
        list.filter(
          (category) =>
            category?.isActive !==
            false
        )
      );
    } catch (error) {
      console.error(
        "Categories load failed:",
        error
      );

      setCategories([]);
    } finally {
      setLoading(false);
    }
  } ,[]);

  useEffect(() => {
  const timer = setTimeout(() => {
    loadCategories();
  }, 0);

  return () => clearTimeout(timer);
}, [loadCategories]);

 

  if (
    loading ||
    !categories.length
  ) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10 px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C9A227]">
            Browse Jewellery
          </p>

          <h2 className="heading mt-3 text-3xl sm:text-5xl">
            Shop By Type
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500">
            Explore every jewellery category crafted
            with premium quality.
          </p>
        </div>

        <div
          className="
            flex
            gap-4
            overflow-x-auto
            px-4
            pb-3
            scrollbar-hide
            md:flex-wrap
            md:justify-center
          "
        >
          {categories.map(
            (category) => {
              const name =
                category?.name || "";

              return (
                <Link
                  key={
                    category?._id ||
                    name
                  }
                  to={`/shop?category=${encodeURIComponent(
                    name.toLowerCase()
                  )}`}
                  className="
                    group
                    relative
                    flex
                    h-14
                    flex-shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#D4AF37]/30
                    bg-white
                    px-7
                    font-medium
                    text-[#111]
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:bg-gradient-to-r
                    hover:from-[#D4AF37]
                    hover:to-[#F6D365]
                    hover:text-black
                    hover:shadow-xl
                  "
                >
                  {name}
                </Link>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
};

export default CategorySlider;