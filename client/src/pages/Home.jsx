import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, MoveUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import Hero from "../components/home/Hero";
import MobileSearchBar from "../components/common/MobileSearchBar";
import GenderCategories from "../components/home/GenderCategories";
import BestSellerSlider from "../components/home/BestSellerSlider";
import CategorySlider from "../components/home/CategorySlider";

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
  const reduceMotion = useReducedMotion();

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
       <title>
            Madan Gold | 925 Silver Jewellery
          </title>

          <meta
            name="description"
            content="Shop premium 925 sterling silver jewellery including rings, necklaces, earrings, bracelets, bangles and more."
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
        {/* SHOP BY CATEGORY */}
        {/* ========================= */}

        <CategorySlider />

            {/* ========================= */}
      {/* PAPER EDITORIAL COLLECTION */}
      {/* ========================= */}
      <section className="relative overflow-hidden bg-[#213C51] py-20 sm:py-24 lg:py-28">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#DDAED3]/20 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[#6594B1]/20 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:46px_46px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[.82fr_1.18fr] lg:gap-16">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[.24em] text-[#DDAED3] backdrop-blur-md">
                <Sparkles size={13} /> The Madan Edit
              </span>
              <h2 className="mt-6 max-w-xl text-4xl font-semibold leading-[1.02] text-white sm:text-5xl lg:text-6xl">
                Jewellery, styled like a fashion story.
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-7 text-white/65 sm:text-base">
                Discover signature pieces through our editorial collections — clean silhouettes, everyday luxury and 925 silver made to be worn again and again.
              </p>
              <Link to="/shop" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#DDAED3] px-6 py-3.5 text-sm font-bold text-[#213C51] shadow-[0_12px_35px_rgba(221,174,211,.22)] transition-transform hover:-translate-y-1">
                Explore collection <ArrowRight size={17} />
              </Link>
            </div>

            <div className="relative mx-auto h-[470px] w-full max-w-[680px] [perspective:1400px] sm:h-[560px]">
              {[...categories].map((item, index) => {
                const reduce = reduceMotion;
                const rotations = [-7, 3, 8];
                const offsets = [0, 44, 88];
                return (
                  <motion.div
                    key={item.title}
                    initial={reduce ? false : { opacity: 0, y: 50, rotate: rotations[index] - 3 }}
                    whileInView={reduce ? undefined : { opacity: 1, y: 0, rotate: rotations[index] }}
                    viewport={{ once: true, amount: .35 }}
                    transition={{ duration: .75, delay: index * .12, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={reduce ? undefined : { y: -12, rotate: rotations[index] * .35, scale: 1.025 }}
                    className="absolute left-1/2 top-1/2 w-[76%] max-w-[470px] -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-[26px] border border-black/10 bg-[#f8f5ef] p-3 shadow-[0_30px_80px_rgba(0,0,0,.25)] sm:p-4"
                    style={{ zIndex: index + 1, marginLeft: offsets[index] - 44 }}
                  >
                    <div className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-[-2deg] rounded-sm bg-[#DDAED3]/75 shadow-sm" />
                    <div className="overflow-hidden rounded-[20px] bg-[#e9e5dc]">
                      <img src={item.image} alt={`${item.title} collection`} loading="lazy" decoding="async" className="h-[300px] w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-[370px]" />
                    </div>
                    <div className="flex items-end justify-between px-2 pb-2 pt-4 sm:px-3">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[.22em] text-[#6594B1]">Signature collection</p>
                        <h3 className="mt-1 text-2xl font-semibold text-[#213C51] sm:text-3xl">{item.title}</h3>
                      </div>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#213C51] text-white"><MoveUpRight size={17} /></span>
                    </div>
                  </motion.div>
                );
              })}
              <div className="absolute bottom-1 left-1/2 h-5 w-[70%] -translate-x-1/2 rounded-[50%] bg-black/30 blur-xl" />
            </div>
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