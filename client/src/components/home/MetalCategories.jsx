import { Link } from "react-router-dom";

import { metalCategories } from "../../data/categories";

const MetalCategories = () => {
  return (
    <section
      className="
        py-10
        sm:py-14
        overflow-hidden
      "
    >
      <div className="px-4 sm:px-6 mb-6">

        {/* TOP */}
        <div
          className="
            flex
            items-end
            justify-between
            gap-4
          "
        >
          <div>

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
              Luxury Collections
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
              Shop By Metal
            </h2>

          </div>

          <Link
            to="/shop"
            className="
              text-sm
              font-medium
              text-[#111111]
            "
          >
            View All
          </Link>

        </div>

      </div>

      {/* MOBILE SLIDER */}
      <div
        className="
          flex
          gap-4
          overflow-x-auto
          px-4
          sm:px-6
          scrollbar-hide
        "
      >
        {metalCategories.map((item) => (

          <Link
            key={item.id}
            to={`/shop?metal=${item.name}`}
            className="
              min-w-[240px]
              sm:min-w-[320px]
              h-[320px]
              sm:h-[420px]
              rounded-[2rem]
              overflow-hidden
              relative
              group
              flex-shrink-0
            "
          >
            {/* IMAGE */}
            <img
              src={item.image}
              alt={item.name}
              className="
                w-full
                h-full
                object-cover
                transition-all
                duration-700
                group-hover:scale-110
              "
            />

            {/* OVERLAY */}
            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black/70
                via-black/10
                to-transparent
              "
            />

            {/* CONTENT */}
            <div
              className="
                absolute
                bottom-7
                left-7
                right-7
                text-white
              "
            >
              <h3
                className="
                  heading
                  text-4xl
                  sm:text-5xl
                "
              >
                {item.name}
              </h3>

              <p className="mt-2 text-white/80 text-sm">
                Explore Collection
              </p>

            </div>

          </Link>

        ))}
      </div>
    </section>
  );
};

export default MetalCategories;