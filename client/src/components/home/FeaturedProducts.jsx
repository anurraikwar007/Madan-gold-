import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const tabs = [
  "All",
  "Rings",
  "Chains",
  "Earrings",
  "Bracelets",
  "Pendants",
];

const FeaturedProducts = () => {

  const [activeTab, setActiveTab] = useState("All");

  return (

    <section
      className="
      py-20
      bg-gradient-to-b
      from-white
      via-[#FFF9FB]
      to-[#FFF5F8]
      "
    >

      <div className="max-w-7xl mx-auto px-5">

        {/* Header */}

        <div className="flex items-end justify-between flex-wrap gap-5">

          <div>

            <span
              className="
              inline-flex
              px-5
              py-2

              rounded-full

              bg-[#F8D7E6]

              text-[#2E5BBA]

              text-xs
              font-bold
              tracking-[0.25em]
              uppercase
              "
            >
              New Collection
            </span>

            <h2
              className="
              heading
              text-4xl
              md:text-5xl
              font-bold
              mt-5
              "
            >
              Trending Jewellery
            </h2>

            <p
              className="
              mt-3
              text-gray-500
              max-w-xl
              "
            >
              Discover premium handcrafted jewellery
              designed for every occasion.
            </p>

          </div>

          <Link
            to="/shop"
            className="
            flex
            items-center
            gap-2

            text-[#2E5BBA]

            font-semibold

            hover:gap-3

            transition-all
            "
          >
            View All

            <ArrowRight size={18} />

          </Link>

        </div>

        {/* Category Tabs */}

        <div
          className="
          flex
          flex-wrap
          gap-3

          mt-10
          "
        >

          {tabs.map((tab) => (

            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
              px-6
              py-3

              rounded-full

              text-sm
              font-semibold

              transition-all

              ${
                activeTab === tab
                  ? "bg-[#2E5BBA] text-white shadow-lg"
                  : "bg-white border border-pink-100 text-gray-700 hover:border-[#2E5BBA] hover:text-[#2E5BBA]"
              }
              `}
            >
              {tab}
            </button>

          ))}

        </div>

        {/* Product Grid */}

        <div
          className="
          mt-12

          grid
          grid-cols-2
          md:grid-cols-3
          xl:grid-cols-4

          gap-7
          "
        >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (

            <div
              key={item}
              className="
              group
              relative

              overflow-hidden

              rounded-[28px]

              bg-white

              border
              border-pink-100

              shadow-sm

              transition-all
              duration-500

              hover:-translate-y-2
              hover:shadow-[0_20px_50px_rgba(46,91,186,.12)]
              "
                 >

              {/* Discount Badge */}

              <span
                className="
                absolute
                top-4
                left-4
                z-20

                px-3
                py-1

                rounded-full

                bg-[#FFEAF3]

                text-[#E11D48]

                text-xs
                font-bold
                "
              >
                25% OFF
              </span>

              {/* Wishlist */}

              <button
                className="
                absolute
                top-4
                right-4
                z-20

                w-10
                h-10

                rounded-full

                bg-white/90

                backdrop-blur

                flex
                items-center
                justify-center

                shadow

                hover:bg-[#2E5BBA]
                hover:text-white

                transition-all
                "
              >
                ♡
              </button>

              {/* Product Image */}

              <div
                className="
                relative

                overflow-hidden

                h-[270px]

                bg-gradient-to-b
                from-[#FFF5F8]
                to-white
                "
              >

                <img
                  src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1200&auto=format&fit=crop"
                  alt="Product"

                  className="
                  w-full
                  h-full

                  object-cover

                  transition-transform
                  duration-700

                  group-hover:scale-110
                  "
                />

              </div>

              {/* Product Details */}

              <div className="p-5">

                {/* Rating */}

                <div
                  className="
                  flex
                  items-center
                  gap-2

                  text-sm
                  "
                >

                  <span className="text-yellow-500">
                    ★★★★★
                  </span>

                  <span className="text-gray-500">
                    (124)
                  </span>

                </div>

                {/* Product Name */}

                <h3
                  className="
                  mt-3

                  text-lg

                  font-semibold

                  text-gray-900

                  group-hover:text-[#2E5BBA]

                  transition-colors
                  "
                >
                  Premium Silver Ring
                </h3>

                {/* Category */}

                <p
                  className="
                  mt-1

                  text-sm

                  text-gray-500
                  "
                >
                  925 Sterling Silver
                </p>

                {/* Price */}

                <div
                  className="
                  flex
                  items-center
                  gap-3

                  mt-4
                  "
                >

                  <span
                    className="
                    text-2xl

                    font-bold

                    text-[#2E5BBA]
                    "
                  >
                    ₹2,499
                  </span>

                  <span
                    className="
                    text-gray-400

                    line-through
                    "
                  >
                    ₹3,499
                  </span>

                </div>

                {/* Add To Cart */}

                <button
                  className="
                  mt-5

                  w-full

                  rounded-full

                  py-3

                  bg-[#2E5BBA]

                  text-white

                  font-semibold

                  transition-all

                  hover:bg-[#244a97]
                  "
                >
                  Add To Cart
                </button>

              </div>

            </div>

          ))}
                  </div>

        {/* Bottom CTA */}

        <div className="mt-16 flex justify-center">

          <Link
            to="/shop"
            className="
            group

            inline-flex
            items-center
            gap-3

            rounded-full

            bg-gradient-to-r
            from-[#2E5BBA]
            to-[#4F7DE8]

            px-8
            py-4

            text-white

            font-semibold

            shadow-lg

            transition-all
            duration-300

            hover:shadow-[0_20px_40px_rgba(46,91,186,.30)]
            hover:scale-105
            "
          >
            Explore Complete Collection

            <ArrowRight
              size={20}
              className="
              transition-transform
              duration-300
              group-hover:translate-x-1
              "
            />

          </Link>

        </div>

      </div>

    </section>

  );

};

export default FeaturedProducts;