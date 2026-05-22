import { useEffect, useRef } from "react";

import gsap from "gsap";

import { ArrowRight } from "lucide-react";

const images = [
  {
    id: 1,
    title: "Royal Ring",
    price: "₹24,999",
    image:
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1200&auto=format&fit=crop",
  },

  {
    id: 2,
    title: "Luxury Necklace",
    price: "₹89,999",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop",
  },

  {
    id: 3,
    title: "Diamond Earrings",
    price: "₹12,999",
    image:
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=1200&auto=format&fit=crop",
  },
];

const Hero = () => {
  const heroRef = useRef(null);

  const trackRef = useRef(null);

  useEffect(() => {

    /* ========================= */
    /* HERO TEXT REVEAL */
    /* ========================= */

    gsap.fromTo(
      ".hero-badge",
      {
        y: 40,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
      }
    );

    gsap.fromTo(
      ".hero-title",
      {
        y: 100,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        delay: 0.2,
        ease: "power4.out",
      }
    );

    gsap.fromTo(
      ".hero-subtitle",
      {
        y: 60,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 0.4,
      }
    );

    gsap.fromTo(
      ".hero-buttons",
      {
        y: 40,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 0.6,
      }
    );

    /* ========================= */
    /* AUTO SCROLL */
    /* ========================= */

    const track = trackRef.current;

    let position = 0;

    let animationFrame;

    const animate = () => {
      position -= 0.4;

      if (Math.abs(position) >= track.scrollWidth / 2) {
        position = 0;
      }

      track.style.transform = `translateX(${position}px)`;

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);

  }, []);

  return (
    <section
      ref={heroRef}
      className="
        relative
        overflow-hidden
        min-h-screen
        bg-[#FAF9F6]
        pt-32
        pb-32
      "
    >

      {/* GOLD BLUR */}
      <div
        className="
          absolute
          top-[-100px]
          left-1/2
          -translate-x-1/2
          w-[500px]
          h-[500px]
          bg-[#D4AF37]/20
          blur-[120px]
          rounded-full
          pointer-events-none
        "
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">

        {/* TOP TEXT */}
        <div className="text-center max-w-4xl mx-auto">

          <p
            className="
              hero-badge
              text-[#D4AF37]
              uppercase
              tracking-[0.35em]
              text-xs
              sm:text-sm
              font-medium
            "
          >
            Luxury Jewelry Collection
          </p>

          <h1
            className="
              hero-title
              heading
              text-5xl
              sm:text-6xl
              md:text-7xl
              lg:text-8xl
              leading-[0.95]
              text-[#111111]
              mt-6
            "
          >
            Jewelry
            <br />
            Crafted For
            <br />
            Modern Luxury
          </h1>

          <p
            className="
              hero-subtitle
              text-gray-600
              max-w-2xl
              mx-auto
              mt-8
              text-sm
              sm:text-lg
              leading-relaxed
            "
          >
            Discover handcrafted gold & diamond jewelry designed
            to elevate every moment with timeless elegance.
          </p>

          {/* BUTTONS */}
          <div
            className="
              hero-buttons
              flex
              flex-col
              sm:flex-row
              items-center
              justify-center
              gap-4
              mt-10
            "
          >

            <button
              className="
                bg-[#111111]
                hover:bg-[#D4AF37]
                hover:text-black
                text-white
                px-8
                py-4
                rounded-full
                transition-all
                duration-300
                flex
                items-center
                gap-2
                font-medium
                w-full
                sm:w-auto
                justify-center
              "
            >
              Shop Collection
              <ArrowRight size={18} />
            </button>

            <button
              className="
                border
                border-black/10
                hover:border-[#D4AF37]
                bg-white/70
                backdrop-blur-xl
                px-8
                py-4
                rounded-full
                transition-all
                duration-300
                font-medium
                w-full
                sm:w-auto
              "
            >
              Explore Luxury
            </button>

          </div>

        </div>

        {/* ========================= */}
        {/* HORIZONTAL LUXURY CARDS */}
        {/* ========================= */}

        <div className="relative mt-20 overflow-hidden">

          {/* LEFT FADE */}
          <div
            className="
              absolute
              left-0
              top-0
              w-24
              h-full
              z-20
              bg-gradient-to-r
              from-[#FAF9F6]
              to-transparent
              pointer-events-none
            "
          />

          {/* RIGHT FADE */}
          <div
            className="
              absolute
              right-0
              top-0
              w-24
              h-full
              z-20
              bg-gradient-to-l
              from-[#FAF9F6]
              to-transparent
              pointer-events-none
            "
          />

          {/* TRACK */}
          <div
            ref={trackRef}
            className="
              flex
              gap-6
              w-max
              will-change-transform
            "
          >

            {[...images, ...images].map((item, index) => (
              <div
                key={index}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[2rem]
                  shrink-0
                  w-[280px]
                  sm:w-[340px]
                  md:w-[420px]
                  h-[420px]
                  sm:h-[500px]
                  bg-black
                  cursor-pointer
                "
              >

                {/* IMAGE */}
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
                    md:grayscale
                    md:group-hover:grayscale-0
                    md:group-hover:scale-110
                  "
                />

                {/* OVERLAY */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/80
                    via-black/10
                    to-transparent
                  "
                />

                {/* CONTENT */}
                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    w-full
                    p-6
                    sm:p-8
                    translate-y-6
                    opacity-0
                    group-hover:translate-y-0
                    group-hover:opacity-100
                    transition-all
                    duration-500
                  "
                >

                  <p
                    className="
                      text-[#D4AF37]
                      uppercase
                      tracking-[0.3em]
                      text-xs
                    "
                  >
                    Premium Collection
                  </p>

                  <h3
                    className="
                      heading
                      text-3xl
                      sm:text-4xl
                      text-white
                      mt-3
                    "
                  >
                    {item.title}
                  </h3>

                  <div className="flex items-center justify-between mt-5">

                    <p className="text-white text-lg">
                      {item.price}
                    </p>

                    <button
                      className="
                        bg-[#D4AF37]
                        text-black
                        px-5
                        py-3
                        rounded-full
                        font-medium
                        hover:scale-105
                        transition-all
                      "
                    >
                      View
                    </button>

                  </div>

                </div>

              </div>
            ))}

          </div>

        </div>

      </div>

    </section>
  );
};

export default Hero;