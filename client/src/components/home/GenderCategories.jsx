import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import mother from "../../assets/category/mother.png";
import father from "../../assets/category/father.png";
import brother from "../../assets/category/brother.png";
import sister from "../../assets/category/sister.png";
import kid from "../../assets/category/kid.png";
import unisex from "../../assets/category/unisex.png";

const categories = [
  {
    id: 1,
    title: "Mother",
    image: mother,
    slug: "/shop?gender=mother",
  },
  {
    id: 2,
    title: "Father",
    image: father,
    slug: "/shop?gender=father",
  },
  {
    id: 3,
    title: "Brother",
    image: brother,
    slug: "/shop?gender=brother",
  },
  {
    id: 4,
    title: "Sister",
    image: sister,
    slug: "/shop?gender=sister",
  },
  {
    id: 5,
    title: "Kids",
    image: kid,
    slug: "/shop?gender=kids",
  },
  {
    id: 6,
    title: "Unisex",
    image: unisex,
    slug: "/shop?gender=unisex",
  },
];

const GenderCategories = () => {
  return (
    <section
      className="
      relative
      py-20
      overflow-hidden
      bg-gradient-to-b
      from-[#FFF5F8]
      via-[#FFF9FB]
      to-white
      "
    >

      {/* Background Glow */}

      <div
        className="
        absolute
        -top-40
        -left-32
        w-[450px]
        h-[450px]
        rounded-full
        bg-[#F8D7E6]/70
        blur-[130px]
        "
      />

      <div
        className="
        absolute
        -bottom-44
        right-0
        w-[420px]
        h-[420px]
        rounded-full
        bg-[#E9F0FF]
        blur-[130px]
        "
      />

      <div className="relative max-w-7xl mx-auto px-5">

        {/* Badge */}

        <div className="flex justify-center">

          <span
            className="
            px-5
            py-2

            rounded-full

            bg-gradient-to-r
            from-[#F8D7E6]
            to-[#FFEAF3]

            border
            border-pink-200

            text-[#2E5BBA]

            text-xs
            font-bold
            uppercase
            tracking-[0.25em]

            shadow-sm
            "
          >
            Shop By Relation
          </span>

        </div>

        {/* Heading */}

        <h2
          className="
          mt-6
          text-center

          heading

          text-3xl
          md:text-5xl

          font-bold

          text-[#1B1B1B]
          "
        >
          Jewellery For Every
          <span className="text-[#2E5BBA]"> Relationship</span>
        </h2>

        <p
          className="
          mt-4

          max-w-2xl

          mx-auto

          text-center

          text-gray-500

          leading-7
          "
        >
          Celebrate every special bond with handcrafted jewellery
          designed for every member of your family.
        </p>

        {/* Premium Cards */}

        <div
          className="
          mt-14

          grid
          grid-cols-2
          md:grid-cols-3
          xl:grid-cols-6

          gap-6
          "
        >
                    {categories.map((item) => (
            <Link
              key={item.id}
              to={item.slug}
              className="
              group
              relative

              overflow-hidden

              rounded-[28px]

              bg-white/90
              backdrop-blur-xl

              border
              border-pink-100

              p-6

              transition-all
              duration-500

              hover:-translate-y-3
              hover:border-[#2E5BBA]
              hover:shadow-[0_25px_60px_rgba(46,91,186,.14)]
              "
            >

              {/* Premium Glow */}

              <div
                className="
                absolute
                -top-24
                left-1/2
                -translate-x-1/2

                w-40
                h-40

                rounded-full

                bg-gradient-to-br
                from-[#F8D7E6]
                via-[#FFEAF3]
                to-[#EAF1FF]

                blur-3xl

                opacity-0

                transition-all
                duration-500

                group-hover:opacity-100
                "
              />

              {/* Icon Circle */}

              <div
                className="
                relative
                z-20

                mx-auto

                w-32
                h-32

                rounded-full

                bg-gradient-to-br
                from-[#FFEAF3]
                via-[#FFF5F8]
                to-[#F8D7E6]

                p-[6px]

                shadow-[0_15px_40px_rgba(248,215,230,.55)]

                transition-all
                duration-500

                group-hover:scale-110
                group-hover:rotate-3
                "
              >

                {/* White Circle */}

                <div
                  className="
                  w-full
                  h-full

                  rounded-full

                  bg-white

                  flex
                  items-center
                  justify-center

                  overflow-hidden
                  "
                >

                  <img
                    src={item.image}
                    alt={item.title}
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

              {/* Title */}

              <h3
                className="
                relative
                z-20

                mt-6

                text-center

                text-lg

                font-bold

                text-gray-900

                transition-colors
                duration-300

                group-hover:text-[#2E5BBA]
                "
              >
                {item.title}
              </h3>

              {/* Count */}

              <p
                className="
                relative
                z-20

                mt-2

                text-center

                text-sm

                text-gray-500
                "
              >
                {item.count}
              </p>

              {/* Explore */}

              <div
                className="
                relative
                z-20

                mt-5

                flex
                items-center
                justify-center
                gap-2

                text-[#2E5BBA]

                font-semibold
                text-sm

                transition-all
                duration-300

                group-hover:gap-3
                "
              >
                Explore

                <ArrowRight
                  size={16}
                  className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                  "
                />
              </div>
            </Link>
          ))}
                  </div>

      </div>

      {/* Bottom Decoration */}

      <div
        className="
        absolute
        bottom-0
        left-0

        w-full
        h-24

        bg-gradient-to-t
        from-[#FFF5F8]
        to-transparent

        pointer-events-none
        "
      />

    </section>
  );
};

export default GenderCategories;