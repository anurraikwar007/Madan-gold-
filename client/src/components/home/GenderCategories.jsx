import { Link } from "react-router-dom";

import men from "../../assets/images/gender/men.webp";
import women from "../../assets/images/gender/women.webp";
import girls from "../../assets/images/gender/girls.webp";
import boys from "../../assets/images/gender/boys.webp";
import kids from "../../assets/images/gender/kids.webp";
import unisex from "../../assets/images/gender/unisex.webp";

const genders = [
  {
    name: "Men",
    slug: "men",
    image: men,
  },
  {
    name: "Women",
    slug: "women",
    image: women,
  },
  {
    name: "Girls",
    slug: "girls",
    image: girls,
  },
  {
    name: "Boys",
    slug: "boys",
    image: boys,
  },
  {
    name: "Kids",
    slug: "kids",
    image: kids,
  },
  {
    name: "Unisex",
    slug: "unisex",
    image: unisex,
  },
];

const GenderCategories = () => {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="text-center mb-10">

          <p className="text-[#C9A227] uppercase tracking-[0.35em] text-xs font-semibold">
            Collections
          </p>

          <h2 className="heading text-3xl sm:text-5xl mt-3">
            Shop By Gender
          </h2>

          <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm">
            Discover handcrafted 925 sterling silver jewellery
            designed for everyone.
          </p>

        </div>

        {/* GRID */}

        <div
          className="
            flex
            overflow-x-auto
            gap-5
            pb-3
            scrollbar-hide

            md:grid
            md:grid-cols-6
            md:gap-7
          "
        >
          {genders.map((item) => (
            <Link
              key={item.slug}
              to={`/shop?gender=${item.slug}`}
              className="
                group
                flex
                flex-col
                items-center
                min-w-[110px]
                md:min-w-0
              "
            >
              {/* GOLD RING */}

              <div
                className="
                  p-[3px]
                  rounded-full

                  bg-gradient-to-br
                  from-[#FFF7D6]
                  via-[#D4AF37]
                  to-[#8B6B15]

                  shadow-lg

                  transition-all
                  duration-500

                  group-hover:scale-105
                "
              >
                {/* IMAGE */}

                <div
                  className="
                    w-[88px]
                    h-[88px]

                    sm:w-[96px]
                    sm:h-[96px]

                    md:w-[120px]
                    md:h-[120px]

                    rounded-full
                    overflow-hidden

                    bg-white
                  "
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="
                      w-full
                      h-full
                      object-cover

                      transition-all
                      duration-500

                      group-hover:scale-110
                    "
                  />
                </div>
              </div>

              <h3 className="mt-4 text-[15px] font-semibold text-[#111]">
                {item.name}
              </h3>

              <span className="text-xs text-gray-500 mt-1">
                Explore →
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default GenderCategories;