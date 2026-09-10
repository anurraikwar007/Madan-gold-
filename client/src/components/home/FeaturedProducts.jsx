import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import ProductCard from "../product/ProductCard";
import { getFeaturedProducts } from "../../api/product.api";

const FeaturedProducts = () => {
  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadFeatured =
      async () => {
        try {
          setLoading(true);

          const response =
            await getFeaturedProducts();

          const data =
            response?.data?.data;

          const items =
            Array.isArray(data?.products)
              ? data.products
              : Array.isArray(data)
                ? data
                : [];

          if (!cancelled) {
            setProducts(
              items.slice(0, 8)
            );
          }
        } catch (error) {
          console.error(
            "Featured products load failed:",
            error
          );

          if (!cancelled) {
            setProducts([]);
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      };

    loadFeatured();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-5">

        <div className="flex items-end justify-between gap-5 flex-wrap">

          <div>
            <span className="inline-flex px-5 py-2 rounded-full bg-[#F8D7E6] text-xs font-bold tracking-[0.25em] uppercase">
              Curated Collection
            </span>

            <h2 className="heading text-4xl md:text-5xl font-bold mt-5">
              Featured 925 Silver
            </h2>

            <p className="mt-3 text-gray-500 max-w-xl">
              Discover our handpicked sterling silver jewellery collection.
            </p>
          </div>

          <Link
            to="/shop"
            className="flex items-center gap-2 font-semibold hover:gap-3 transition-all"
          >
            View All
            <ArrowRight size={18} />
          </Link>

        </div>

        {loading ? (
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-7">
            {Array.from({ length: 8 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="aspect-[4/5] rounded-[28px] bg-gray-100 animate-pulse"
                />
              )
            )}
          </div>
        ) : products.length === 0 ? (
          <div className="mt-12 text-center py-16 text-gray-500">
            Featured products coming soon.
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-7">
            {products.map(
              (product) => (
                <ProductCard
                  key={
                    product._id ||
                    product.id
                  }
                  product={product}
                />
              )
            )}
          </div>
        )}

      </div>
    </section>
  );
};

export default FeaturedProducts;