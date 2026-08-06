import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import Hero from "../components/home/Hero";
import MobileSearchBar from "../components/common/MobileSearchBar";
import GenderCategories from "../components/home/GenderCategories";
import BestSellerSlider from "../components/home/BestSellerSlider";

import ProductCard from "../components/product/ProductCard";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";

import { useProducts } from "../context/ProductContext";

const categories = [
  {
    title: "Rings",
    image:
      "https://images.unsplash.com/photo-1603561596112-db7f3f9b4f79?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Necklaces",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Bracelets",
    image:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1200&auto=format&fit=crop",
  },
];

const Home = () => {
  const { products = [], loading } = useProducts();

  const featuredProducts = products.filter(
    (p) => p.featured
  );

  const displayProducts =
    featuredProducts.length > 0
      ? featuredProducts.slice(0, 8)
      : products.slice(0, 8);

  return (
    <div
      className="
      min-h-screen
      bg-gradient-to-b
      from-[#FFF5F8]
      via-[#FFF9FC]
      to-white
      "
    >
      <Helmet>
        <title>Madan Gold | Luxury Jewellery</title>

        <meta
          name="description"
          content="Premium Gold & Silver Jewellery"
        />
      </Helmet>

      {/* Hero */}

      <Hero />

      {/* Mobile Search */}

      <div className="relative z-20">
        <MobileSearchBar />
      </div>

      {/* Gender */}

      <GenderCategories />

      {/* Featured Products Slider */}

      <BestSellerSlider />
            {/* ========================= */}
      {/* PREMIUM COLLECTIONS */}
      {/* ========================= */}

      <section className="py-16 lg:py-20">

        <div className="max-w-7xl mx-auto px-5">

          {/* Heading */}

          <div className="flex items-end justify-between flex-wrap gap-5 mb-10">

            <div>

              <span
                className="
                inline-flex
                items-center

                rounded-full

                bg-[#FFEAF3]

                px-5
                py-2

                text-xs
                font-semibold

                uppercase

                tracking-[0.25em]

                text-[#2E5BBA]
                "
              >
                Featured Collections
              </span>

              <h2
                className="
                heading

                mt-5

                text-4xl
                lg:text-5xl

                font-bold
                "
              >
                Curated Jewellery
              </h2>

              <p
                className="
                mt-4

                max-w-xl

                text-gray-500
                "
              >
                Elegant jewellery collections crafted
                for everyday luxury and timeless beauty.
              </p>

            </div>

            <Link
              to="/shop"
              className="
              inline-flex

              items-center

              gap-2

              font-semibold

              text-[#2E5BBA]

              hover:gap-3

              transition-all
              "
            >
              View All

              <ArrowRight size={18} />

            </Link>

          </div>

          {/* Cards */}

          <div
            className="
            grid

            gap-7

            md:grid-cols-3
            "
          >

            {categories.map((item, index) => (

              <Link
                key={index}
                to="/shop"
                className="
                group

                relative

                overflow-hidden

                rounded-[36px]

                h-[430px]

                shadow-lg

                transition-all
                duration-500

                hover:-translate-y-2

                hover:shadow-[0_20px_50px_rgba(0,0,0,.12)]
                "
              >

                <img
                  src={item.image}
                  alt={item.title}
                  className="
                  h-full
                  w-full

                  object-cover

                  duration-700

                  group-hover:scale-110
                  "
                />

                {/* Overlay */}

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

                {/* Bottom Card */}

                <div
                  className="
                  absolute

                  left-5
                  right-5
                  bottom-5

                  rounded-[24px]

                  bg-white/15

                  backdrop-blur-xl

                  border

                  border-white/20

                  p-5
                  "
                >

                  <p
                    className="
                    text-xs

                    uppercase

                    tracking-[0.2em]

                    text-white/80
                    "
                  >
                    Premium Collection
                  </p>

                  <h3
                    className="
                    heading

                    mt-2

                    text-3xl

                    text-white
                    "
                  >
                    {item.title}
                  </h3>

                  <div
                    className="
                    mt-5

                    inline-flex

                    items-center

                    gap-2

                    font-semibold

                    text-white

                    group-hover:gap-3

                    transition-all
                    "
                  >

                    Shop Now

                    <ArrowRight size={18} />

                  </div>

                </div>

              </Link>

            ))}

          </div>

        </div>

      </section>
            {/* ========================= */}
      {/* TRENDING PRODUCTS */}
      {/* ========================= */}

      <section className="py-20 bg-gradient-to-b from-white to-[#FFF7FA]">

        <div className="max-w-7xl mx-auto px-5">

          {/* Heading */}

          <div className="flex items-end justify-between flex-wrap gap-5 mb-12">

            <div>

              <span
                className="
                inline-flex
                items-center

                rounded-full

                bg-[#FFEAF3]

                px-5
                py-2

                text-xs
                font-semibold

                tracking-[0.25em]

                uppercase

                text-[#2E5BBA]
                "
              >
                Best Sellers
              </span>

              <h2
                className="
                heading

                mt-5

                text-4xl
                lg:text-5xl

                font-bold
                "
              >
                Trending Jewellery
              </h2>

              <p
                className="
                mt-4

                max-w-xl

                text-gray-500
                "
              >
                Handpicked jewellery loved by thousands of customers.
              </p>

            </div>

            <Link
              to="/shop"
              className="
              inline-flex

              items-center

              gap-2

              font-semibold

              text-[#2E5BBA]

              hover:gap-3

              transition-all
              "
            >

              View All

              <ArrowRight size={18} />

            </Link>

          </div>

          {/* Products */}

          {loading ? (

            <Loader />

          ) : products.length === 0 ? (

            <EmptyState
              title="No Products Found"
              subtitle="Products will appear here."
            />

          ) : (

            <div
              className="
              grid

              grid-cols-2
              md:grid-cols-3
              xl:grid-cols-4

              gap-6
              "
            >

              {displayProducts.map((product) => (

                <div
                  key={product._id}
                  className="
                  transition-all
                  duration-300

                  hover:-translate-y-2
                  "
                >

                  <ProductCard
                    product={product}
                  />

                </div>

              ))}

            </div>

          )}

          {/* Bottom Button */}

          <div className="flex justify-center mt-14">

            <Link
              to="/shop"
              className="
              px-8
              py-4

              rounded-full

              bg-[#2E5BBA]

              text-white

              font-semibold

              shadow-lg

              transition-all

              hover:bg-[#20489D]
              hover:scale-105
              "
            >

              Explore Complete Collection

            </Link>

          </div>

        </div>

      </section>
            {/* ========================= */}
      {/* MORE TO EXPLORE */}
      {/* ========================= */}

      <section className="py-20 bg-white">

        <div className="max-w-7xl mx-auto px-5">

          <div className="text-center mb-12">

            <span
              className="
              inline-flex
              items-center

              rounded-full

              bg-[#FFEAF3]

              px-5
              py-2

              text-xs
              font-semibold

              tracking-[0.25em]

              uppercase

              text-[#2E5BBA]
              "
            >
              Explore More
            </span>

            <h2
              className="
              heading

              mt-5

              text-4xl
              lg:text-5xl
              "
            >
              More Jewellery
            </h2>

            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              Continue discovering our latest collections and timeless
              handcrafted jewellery.
            </p>

          </div>

          {loading ? (

            <Loader />

          ) : (

            <div
              className="
              grid

              grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4

              gap-6
              "
            >

              {products.map((product) => (

                <div
                  key={product._id}
                  className="
                  transition-all
                  duration-300

                  hover:-translate-y-2
                  "
                >
                  <ProductCard product={product} />
                </div>

              ))}

            </div>

          )}

        </div>

      </section>

    </div>
  );
};

export default Home;