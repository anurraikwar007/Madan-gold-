import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import coupon1 from "../../assets/coupon/coupon1.webp";
import coupon2 from "../../assets/coupon/coupon2.webp";
import Coupon3 from "../../assets/coupon/Coupon3.webp";
import Coupon4 from "../../assets/coupon/Coupon4.webp";

const slides = [
  {
    id: 1,
    image: coupon1,
    alt: "Luxury Coupon 1",
  },
  {
    id: 2,
    image: coupon2,
    alt: "Luxury Coupon 2",
  },
  {
    id: 3,
    image: Coupon3,
    alt: "Luxury Coupon 3",
  },
  {
    id: 4,
    image: Coupon4,
    alt: "Luxury Coupon 4",
  },
];

const Hero = () => {
  const [active, setActive] = useState(0);

  /* ==========================
        AUTO SLIDER
  ========================== */

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  /* ==========================
        NEXT
  ========================== */

  const nextSlide = () => {
    setActive((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    );
  };

  /* ==========================
        PREVIOUS
  ========================== */

  const prevSlide = () => {
    setActive((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  return (
    <section
      className="
      relative
      w-full
      overflow-hidden
      bg-gradient-to-b
      from-[#FFF5F8]
      via-[#FFF9FB]
      to-white
      "
    >

      {/* Pink Glow */}

      <div
        className="
        absolute
        -top-32
        -left-24
        w-[420px]
        h-[420px]
        rounded-full
        bg-pink-200/40
        blur-[120px]
        pointer-events-none
        "
      />

      {/* Blue Glow */}

      <div
        className="
        absolute
        top-10
        right-0
        w-[320px]
        h-[320px]
        rounded-full
        bg-blue-200/20
        blur-[120px]
        pointer-events-none
        "
      />

      <div className="relative w-full">

        {/* Slider */}

        <div
          className="
          relative
          overflow-hidden
          rounded-b-[26px]
          shadow-[0_25px_60px_rgba(46,91,186,.10)]
          border-b
          border-pink-100
          "
        >

          {/* Height */}

          <div
            className="
            relative
            h-[180px]
            sm:h-[250px]
            md:h-[300px]
            lg:h-[360px]
            xl:h-[410px]
            "
          >

            {slides.map((slide, index) => (
              <img
                key={slide.id}
                src={slide.image}
                alt={slide.alt}
                className={`
                absolute
                inset-0
                w-full
                h-full
                object-cover
                transition-all
                duration-[1200ms]
                ${
                  active === index
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-105"
                }
                `}
              />
            ))}

            {/* Premium Overlay */}

            <div
              className="
              absolute
              inset-0
              bg-gradient-to-r
              from-black/5
              via-transparent
              to-black/10
              "
            />

                        {/* Left Arrow */}

            <button
              onClick={prevSlide}
              className="
              absolute
              left-4
              sm:left-6
              top-1/2
              -translate-y-1/2
              z-30

              w-11
              h-11
              lg:w-12
              lg:h-12

              rounded-full
              bg-white/85
              backdrop-blur-xl

              border
              border-white/70

              flex
              items-center
              justify-center

              shadow-xl

              hover:bg-[#2E5BBA]
              hover:text-white
              hover:scale-110

              transition-all
              duration-300
              "
            >
              <ChevronLeft size={22} />
            </button>

            {/* Right Arrow */}

            <button
              onClick={nextSlide}
              className="
              absolute
              right-4
              sm:right-6
              top-1/2
              -translate-y-1/2
              z-30

              w-11
              h-11
              lg:w-12
              lg:h-12

              rounded-full
              bg-white/85
              backdrop-blur-xl

              border
              border-white/70

              flex
              items-center
              justify-center

              shadow-xl

              hover:bg-[#2E5BBA]
              hover:text-white
              hover:scale-110

              transition-all
              duration-300
              "
            >
              <ChevronRight size={22} />
            </button>

            {/* Bottom Blur */}

            <div
              className="
              absolute
              bottom-0
              left-0
              w-full
              h-20
              bg-gradient-to-t
              from-black/20
              to-transparent
              "
            />

            {/* Dots */}

            <div
              className="
              absolute
              bottom-6
              left-1/2
              -translate-x-1/2
              z-30

              flex
              items-center
              gap-3

              px-4
              py-2

              rounded-full

              bg-white/60
              backdrop-blur-xl

              border
              border-white/60

              shadow-lg
              "
            >
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActive(index)}
                  className={`
                  transition-all
                  duration-300
                  rounded-full
                  ${
                    active === index
                      ? "w-8 h-2 bg-[#2E5BBA]"
                      : "w-2 h-2 bg-white"
                  }
                  `}
                />
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;