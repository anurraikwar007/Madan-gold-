import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  getRelatedProducts,
} from "../../api/product.api";

export default function RelatedProducts({
  productId,
}) {
  const [products, setProducts] =
    useState([]);

  useEffect(() => {
    let mounted = true;

    getRelatedProducts(productId)
      .then((response) => {
        const data =
          response?.data?.data;

        const list =
          data?.products ||
          data?.docs ||
          (Array.isArray(data)
            ? data
            : []);

        if (mounted) {
          setProducts(list);
        }
      })
      .catch(() => {
        if (mounted) {
          setProducts([]);
        }
      });

    return () => {
      mounted = false;
    };
  }, [productId]);

  if (!products.length) {
    return null;
  }

  return (
    <section className="mt-20">
      <p className="text-xs uppercase tracking-[0.3em] text-[#B88A44]">
        You May Also Like
      </p>

      <h2 className="mt-2 text-3xl sm:text-4xl">
        Complete the look
      </h2>

      <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">
        {products
          .slice(0, 4)
          .map((item) => (
            <Link
              key={item._id}
              to={`/product/${item._id}`}
              className="
                group
                overflow-hidden
                rounded-3xl
                bg-white
                border
                border-[#eee4d5]
                shadow-[0_15px_45px_rgba(40,25,20,.06)]
              "
            >
              <div className="aspect-square overflow-hidden bg-[#faf7f2]">
                <img
                  src={
                    item.images?.[0]?.url ||
                    item.images?.[0] ||
                    "/placeholder-product.png"
                  }
                  alt={item.name}
                  loading="lazy"
                  className="
                    h-full
                    w-full
                    object-cover
                    transition
                    duration-700
                    group-hover:scale-105
                  "
                />
              </div>

              <div className="p-4">
                <p className="truncate text-sm font-semibold">
                  {item.name}
                </p>

                <p className="mt-2 font-bold text-[#9A6D32]">
                  ₹
                  {Number(
                    item.price || 0
                  ).toLocaleString("en-IN")}
                </p>
              </div>
            </Link>
          ))}
      </div>
    </section>
  );
}