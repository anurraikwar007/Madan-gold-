import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";
import { ArrowUpRight, Gem, Sparkles } from "lucide-react";

import { getCategories } from "../../api/category.api";

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
    <section className="relative overflow-hidden bg-[#FBF8F5] py-16 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#DDAED3]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#C7A66A]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-9 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.32em] text-[#9A7445] sm:text-xs">
              <Gem size={14} strokeWidth={1.6} /> The Madan collection
            </p>
            <h2 className="mt-3 font-serif text-4xl font-medium tracking-[-0.04em] text-[#213C51] sm:text-5xl lg:text-6xl">
              Shop by Type<span className="text-[#B58B59]">.</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[#64717A] sm:text-base sm:leading-7">
              Find the piece that feels like you — timeless 925 silver jewellery for every day and every occasion.
            </p>
          </div>
          <Link to="/shop" className="group inline-flex w-fit items-center gap-2 rounded-full border border-[#213C51]/20 bg-white/70 px-5 py-3 text-sm font-semibold text-[#213C51] transition-all duration-300 hover:border-[#213C51] hover:bg-[#213C51] hover:text-white">
            Explore all jewellery <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category, index) => {
            const id = category?._id || category?.id;
            const name = String(category?.name || "").trim();
            const slug = category?.slug || name.toLowerCase();
            const image = typeof category?.image === "string"
              ? category.image
              : category?.image?.url || category?.image?.secure_url || category?.images?.[0]?.url || category?.images?.[0];
            if (!id || !name) return null;

            return (
              <Link
                key={id}
                to={`/shop?category=${encodeURIComponent(slug)}`}
                className="group relative isolate min-h-[210px] overflow-hidden rounded-[22px] border border-[#213C51]/10 bg-white shadow-[0_8px_30px_rgba(33,60,81,.04)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#B58B59]/50 hover:shadow-[0_24px_55px_rgba(33,60,81,.14)] sm:min-h-[270px] sm:rounded-[28px]"
              >
                {image ? (
                  <img src={image} alt={`${name} jewellery`} loading="lazy" decoding="async" className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className={`absolute inset-0 -z-20 bg-gradient-to-br ${index % 3 === 0 ? "from-[#E9D9C6] via-[#F8F1E8] to-[#D7C2AC]" : index % 3 === 1 ? "from-[#DCE5E8] via-[#F5F3EF] to-[#C6D4D8]" : "from-[#E8DCE5] via-[#FBF6F8] to-[#D9C6D3]"}`} />
                )}
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#132A3A]/90 via-[#132A3A]/10 to-transparent transition-opacity duration-500 group-hover:from-[#132A3A]/95" />
                {!image && <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/50 bg-white/45 text-[#213C51] backdrop-blur-sm sm:right-5 sm:top-5 sm:h-12 sm:w-12"><Sparkles size={19} strokeWidth={1.4} /></div>}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 sm:p-5">
                  <div>
                    <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/70 sm:text-[10px]">Discover collection</p>
                    <h3 className="font-serif text-xl font-medium text-white sm:text-2xl">{name}</h3>
                  </div>
                  <span className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/50 bg-white/10 text-white backdrop-blur-md transition-all duration-300 group-hover:border-[#E5C99C] group-hover:bg-[#E5C99C] group-hover:text-[#213C51] sm:h-10 sm:w-10"><ArrowUpRight size={17} /></span>
                </div>
                <span className="absolute left-4 top-4 rounded-full border border-white/50 bg-white/65 px-3 py-1 text-[9px] font-bold tracking-[0.16em] text-[#213C51] backdrop-blur-md sm:left-5 sm:top-5 sm:text-[10px]">{String(index + 1).padStart(2, "0")}</span>
              </Link>
            );
          })}
        </div>

        {error && <p className="mt-5 text-center text-sm text-red-500">{error}</p>}
      </div>
    </section>
  );
};

export default CategorySlider;