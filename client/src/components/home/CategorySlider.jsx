import { Link } from "react-router-dom";

import { productCategories } from "../../data/categories";

const CategorySlider = () => {
  return (
    <section className="py-6 sm:py-10">

      <div className="px-4 sm:px-6 mb-5">

        <p
          className="
            text-[#D4AF37]
            uppercase
            tracking-[0.25em]
            text-[11px]
            sm:text-xs
            font-semibold
          "
        >
          Browse Jewelry
        </p>

        <h2
          className="
            heading
            text-3xl
            sm:text-5xl
            text-[#111111]
            mt-2
          "
        >
          Shop By Category
        </h2>

      </div>

      {/* CATEGORY PILLS */}
      <div
        className="
          flex
          gap-3
          overflow-x-auto
          px-4
          sm:px-6
          pb-2
          scrollbar-hide
        "
      >
        {productCategories.map((category, index) => (

          <Link
            key={index}
            to={`/shop?category=${category}`}
            className="
              whitespace-nowrap
              px-6
              h-14
              rounded-full
              border
              border-black/10
              bg-white
              flex
              items-center
              justify-center
              text-sm
              sm:text-base
              font-medium
              text-[#111111]
              hover:bg-[#111111]
              hover:text-white
              transition-all
              duration-300
              flex-shrink-0
            "
          >
            {category}
          </Link>

        ))}
      </div>

    </section>
  );
};

export default CategorySlider;