import { Link } from "react-router-dom";

import Hero from "../components/home/Hero";

import ProductCard from "../components/product/ProductCard";

import Loader from "../components/common/Loader";

import EmptyState from "../components/common/EmptyState";

import { useProducts } from "../context/ProductContext";

import MetalCategories from "../components/home/MetalCategories";

import CategorySlider from "../components/home/CategorySlider";

import CategoryGrid from "../components/home/CategoryGrid";

import BestSellerSlider from "../components/home/BestSellerSlider";

import MobileSearchBar from "../components/common/MobileSearchBar";

import {
  ShieldCheck,
  Truck,
  Gem,
  ArrowRight,
} from "lucide-react";

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

  return (
    <div className="overflow-hidden bg-[#FAF9F6]">

      {/* HERO */}
      <Hero />
       
       <MobileSearchBar />

       {/* SHOP BY METAL */}
        <MetalCategories />

        <CategorySlider />

        <CategoryGrid />
       
       <BestSellerSlider />

      {/* ========================= */}
      {/* FEATURES */}
      {/* ========================= */}

      <section className="px-4 sm:px-6 py-10">

        <div
          className="
            max-w-7xl
            mx-auto
            grid
            grid-cols-2
            lg:grid-cols-4
            gap-4
          "
        >

          <div className="bg-white rounded-3xl p-5 luxury-shadow">
            <ShieldCheck className="text-[#D4AF37]" size={28} />
            <h3 className="font-semibold mt-4">
              Hallmarked Gold
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Certified premium jewelry.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-5 luxury-shadow">
            <Truck className="text-[#D4AF37]" size={28} />
            <h3 className="font-semibold mt-4">
              Free Shipping
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Fast delivery across India.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-5 luxury-shadow">
            <Gem className="text-[#D4AF37]" size={28} />
            <h3 className="font-semibold mt-4">
              Luxury Design
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Handcrafted elegant pieces.
            </p>
          </div>

          <div className="bg-[#111111] text-white rounded-3xl p-5">
            <h3 className="font-semibold">
              New Wedding Collection
            </h3>

            <p className="text-sm text-white/70 mt-2">
              Discover latest bridal jewelry.
            </p>

            <Link
              to="/shop"
              className="
                inline-flex
                items-center
                gap-2
                mt-4
                text-[#D4AF37]
                text-sm
              "
            >
              Explore
              <ArrowRight size={16} />
            </Link>
          </div>

        </div>

      </section>

      {/* ========================= */}
      {/* CATEGORY */}
      {/* ========================= */}

      <section className="py-14 sm:py-20 px-4 sm:px-6">

        <div className="max-w-7xl mx-auto">

          <div className="mb-10">

            <p
              className="
                text-[#D4AF37]
                uppercase
                tracking-[0.3em]
                text-xs
                font-medium
              "
            >
              Collections
            </p>

            <h2
              className="
                heading
                text-4xl
                sm:text-5xl
                mt-3
              "
            >
              Shop By Category
            </h2>

          </div>

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-6
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
                  rounded-[2rem]
                  h-[320px]
                  sm:h-[420px]
                "
              >

                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="
                    w-full
                    h-full
                    object-cover
                    transition-all
                    duration-700
                    group-hover:scale-110
                  "
                />

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

                <div
                  className="
                    absolute
                    bottom-8
                    left-8
                    text-white
                  "
                >

                  <h3
                    className="
                      heading
                      text-3xl
                      sm:text-4xl
                    "
                  >
                    {item.title}
                  </h3>

                  <p className="text-white/80 mt-2 text-sm">
                    Explore Collection
                  </p>

                </div>

              </Link>

            ))}

          </div>

        </div>

      </section>

      {/* ========================= */}
      {/* PRODUCTS */}
      {/* ========================= */}

      <section className="py-14 sm:py-20 px-4 sm:px-6">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-14">

            <p
              className="
                text-[#D4AF37]
                uppercase
                tracking-[0.3em]
                text-xs
                font-medium
              "
            >
              Best Sellers
            </p>

            <h2
              className="
                heading
                text-4xl
                sm:text-6xl
                mt-4
              "
            >
              Featured Jewelry
            </h2>

            <p
              className="
                text-gray-500
                mt-5
                max-w-2xl
                mx-auto
                text-sm
                sm:text-base
              "
            >
              Timeless handcrafted jewelry designed
              for modern luxury lovers.
            </p>

          </div>

          {/* LOADING */}
          {loading ? (

            <Loader />

          ) : products.length === 0 ? (

            <EmptyState
              title="No Products Found"
              subtitle="Please add products in ProductContext."
            />

          ) : (

            <div
              className="
                grid
                grid-cols-2
                lg:grid-cols-4
                gap-4
                sm:gap-6
              "
            >

              {products.map((product) => (

                <ProductCard
                  key={product.id}
                  product={product}
                />

              ))}

            </div>

          )}

        </div>

      </section>

      {/* ========================= */}
      {/* TRUST */}
      {/* ========================= */}

      <section className="px-4 sm:px-6 pb-20">

        <div
          className="
            max-w-7xl
            mx-auto
            bg-[#111111]
            rounded-[2.5rem]
            overflow-hidden
            relative
          "
        >

          <div
            className="
              absolute
              top-0
              left-1/2
              -translate-x-1/2
              w-[500px]
              h-[500px]
              bg-[#D4AF37]/20
              blur-[120px]
              rounded-full
            "
          />

          <div
            className="
              relative
              z-10
              grid
              grid-cols-1
              md:grid-cols-3
              gap-10
              px-8
              sm:px-12
              py-16
              text-center
            "
          >

            <div>

              <h3
                className="
                  heading
                  text-5xl
                  text-[#D4AF37]
                "
              >
                100%
              </h3>

              <p className="text-white/70 mt-4">
                Certified Gold Jewelry
              </p>

            </div>

            <div>

              <h3
                className="
                  heading
                  text-5xl
                  text-[#D4AF37]
                "
              >
                50K+
              </h3>

              <p className="text-white/70 mt-4">
                Happy Customers
              </p>

            </div>

            <div>

              <h3
                className="
                  heading
                  text-5xl
                  text-[#D4AF37]
                "
              >
                25+
              </h3>

              <p className="text-white/70 mt-4">
                Years Of Craftsmanship
              </p>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Home;