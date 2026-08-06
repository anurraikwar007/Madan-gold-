import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import coupon1 from "../../assets/coupon/coupon1.webp";
import coupon2 from "../../assets/coupon/coupon2.webp";
import coupon3 from "../../assets/coupon/coupon3.webp";
import coupon3 from "../../assets/coupon/coupon4.webp";


const slides = [
  {
    id: 1,
    image: coupon1,
    alt: "Coupon 1",
  },
  {
    id: 2,
    image: coupon2,
    alt: "Coupon 2",
  },
  {
    id: 3,
    image: coupon3,
    alt: "Coupon 3",
  },
  {
    id: 4,
    image: coupon4,
    alt: "Coupon 4",
  }
];

const Hero = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setActive((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setActive((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  return (
    <section className="w-full bg-[#FFF5F8]">

      {/* Announcement Bar */}

      

      <div className="w-120px px-0 py-0">
      <div className="relative overflow-hidden shadow-lg">
<div className="relative h-[170px] sm:h-[250px] lg:h-[380px] xl:h-[420px]">
            {slides.map((slide, index) => (
              <img
                key={slide.id}
                src={slide.image}
                alt={slide.alt}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                  active === index
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              />
            ))}

            {/* Left Arrow */}

            <button
              onClick={prevSlide}
              className="absolute left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg hover:bg-[#2E5BBA] hover:text-white transition-all"
            >
              <ChevronLeft size={22} />
            </button>

            {/* Right Arrow */}

            <button
              onClick={nextSlide}
              className="absolute right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg hover:bg-[#2E5BBA] hover:text-white transition-all"
            >
              <ChevronRight size={22} />
            </button>
                        {/* Dots */}

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActive(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    active === index
                      ? "w-8 bg-[#2E5BBA]"
                      : "w-2 bg-white/70"
                  }`}
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