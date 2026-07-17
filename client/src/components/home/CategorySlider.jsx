import { Link } from "react-router-dom";
import { productCategories } from "../../data/categories";

const CategorySlider = () => {
  return (
    <section className="py-12 sm:py-16">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="text-center mb-10 px-4">

          <p className="text-[#C9A227] uppercase tracking-[0.35em] text-xs font-semibold">
            Browse Jewellery
          </p>

          <h2 className="heading text-3xl sm:text-5xl mt-3">
            Shop By Type
          </h2>

          <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm">
            Explore every jewellery category crafted
            with premium 925 sterling silver.
          </p>

        </div>

        {/* CATEGORY */}

        <div
          className="
            flex
            gap-4
            overflow-x-auto
            scrollbar-hide
            px-4
            pb-3

            md:flex-wrap
            md:justify-center
          "
        >

          {productCategories.map((category, index) => (

            <Link
              key={index}
              to={`/shop?category=${category.toLowerCase()}`}
              className="
                group
                relative

                flex-shrink-0

                px-7
                h-14

                rounded-full

                border
                border-[#D4AF37]/30

                bg-white

                flex
                items-center
                justify-center

                font-medium
                text-[#111]

                shadow-sm

                transition-all
                duration-300

                hover:bg-gradient-to-r
                hover:from-[#D4AF37]
                hover:to-[#F6D365]

                hover:text-black

                hover:shadow-xl
                hover:-translate-y-1
              "
            >

              {category}

            </Link>

          ))}

        </div>

      </div>

    </section>
  );
};

export default CategorySlider;