import { Link } from "react-router-dom";
import {
  Gem,
  CircleDot,
  Sparkles,
  Heart,
  Crown,
  Star,
  Moon,
  Flower2,
  Diamond,
  Circle,
} from "lucide-react";

const categories = [
  {
    name: "Rings",
    icon: CircleDot,
  },
  {
    name: "Chains",
    icon: Sparkles,
  },
  {
    name: "Earrings",
    icon: Flower2,
  },
  {
    name: "Bracelets",
    icon: Circle,
  },
  {
    name: "Pendants",
    icon: Diamond,
  },
  {
    name: "Bangles",
    icon: Crown,
  },
  {
    name: "Anklets",
    icon: Moon,
  },
  {
    name: "Toe Rings",
    icon: Heart,
  },
];

const CategoryGrid = () => {
  return (
    <section className="bg-white py-20 sm:py-24">

      <div className="mx-auto max-w-7xl px-5">

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>

            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#6594B1]">
              Explore Jewellery
            </p>

            <h2 className="mt-3 text-4xl text-[#213C51] sm:text-5xl">
              Shop by type
            </h2>

          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#213C51]"
          >
            View all
            <span>→</span>
          </Link>

        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">

          {categories.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={`/shop?category=${encodeURIComponent(
                  item.name.toLowerCase()
                )}`}
                className="group flex flex-col items-center rounded-[24px] border border-[#213C51]/10 bg-[#EEEEEE]/50 p-5 text-center transition-all duration-400 hover:-translate-y-2 hover:border-[#DDAED3] hover:bg-white hover:shadow-[0_20px_50px_rgba(33,60,81,.10)]"
              >

                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#DDAED3] bg-white text-[#213C51] transition-all duration-400 group-hover:border-[#213C51] group-hover:bg-[#213C51] group-hover:text-[#DDAED3]">

                  <Icon
                    size={25}
                    strokeWidth={1.4}
                  />

                </div>

                <span className="mt-4 text-sm font-semibold text-[#213C51]">
                  {item.name}
                </span>

              </Link>
            );
          })}

        </div>

      </div>
    </section>
  );
};

export default CategoryGrid;