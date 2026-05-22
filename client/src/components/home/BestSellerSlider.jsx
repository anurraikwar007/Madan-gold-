import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

import ProductCard from "../product/ProductCard";

import { useProducts } from "../../context/ProductContext";

const BestSellerSlider = () => {

  const { products, loading } = useProducts();

  return (
    <section
      className="
        py-12
        sm:py-16
      "
    >
      <div className="px-4 sm:px-6 mb-8">

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
          Most Loved
        </p>

        <div
          className="
            flex
            items-end
            justify-between
            mt-2
          "
        >
          <h2
            className="
              heading
              text-3xl
              sm:text-5xl
              text-[#111111]
            "
          >
            Best Sellers
          </h2>

        </div>

      </div>

      {/* LOADING */}
      {loading ? (

        <div
          className="
            px-4
            sm:px-6
            grid
            grid-cols-2
            md:grid-cols-4
            gap-4
          "
        >
          {[1,2,3,4].map((item) => (

            <div
              key={item}
              className="
                h-[320px]
                rounded-[2rem]
                bg-gray-200
                animate-pulse
              "
            />

          ))}
        </div>

      ) : (

        <div className="px-4 sm:px-6">

          <Swiper
            spaceBetween={16}
            slidesPerView={2.1}
            breakpoints={{
              640: {
                slidesPerView: 2.5,
              },

              768: {
                slidesPerView: 3,
              },

              1024: {
                slidesPerView: 4,
              },
            }}
          >

            {(products || []).slice(0, 10).map((product) => (

              <SwiperSlide key={product.id}>

                <ProductCard product={product} />

              </SwiperSlide>

            ))}

          </Swiper>

        </div>

      )}

    </section>
  );
};

export default BestSellerSlider;