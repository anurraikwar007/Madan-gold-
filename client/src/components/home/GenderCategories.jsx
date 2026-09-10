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
    title: "Men",
    image: father,
    slug: "/shop?gender=men",
    label: "For Him",
  },
  {
    id: 2,
    title: "Women",
    image: mother,
    slug: "/shop?gender=women",
    label: "For Her",
  },
  {
    id: 3,
    title: "Girls",
    image: sister,
    slug: "/shop?gender=girls",
    label: "For Girls",
  },
  {
    id: 4,
    title: "Boys",
    image: brother,
    slug: "/shop?gender=boys",
    label: "For Boys",
  },
  {
    id: 5,
    title: "Child",
    image: kid,
    slug: "/shop?gender=child",
    label: "Little Ones",
  },
  {
    id: 6,
    title: "Unisex",
    image: unisex,
    slug: "/shop?gender=unisex",
    label: "For Everyone",
  },
];

const GenderCategories = () => {
  return (
    <section className="relative overflow-hidden bg-[#EEEEEE] py-20 sm:py-24">

      <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-[#DDAED3]/30 blur-[120px]" />

      <div className="absolute -bottom-40 -right-20 h-[420px] w-[420px] rounded-full bg-[#6594B1]/20 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-5">

        <div className="mx-auto max-w-2xl text-center">

          <span className="inline-flex rounded-full border border-[#DDAED3] bg-white px-5 py-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[#213C51]">
            Shop By Relation
          </span>

          <h2 className="mt-6 text-4xl text-[#213C51] sm:text-5xl">
            Jewellery for every
            <span className="text-[#6594B1]">
              {" "}relationship
            </span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#536878] sm:text-base">
            Find something meaningful for everyone
            who makes your world special.
          </p>

        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">

          {categories.map((item) => (
            <Link
              key={item.id}
              to={item.slug}
              className="group rounded-[28px] border border-[#213C51]/10 bg-white p-5 text-center shadow-[0_12px_35px_rgba(33,60,81,.06)] transition-all duration-500 hover:-translate-y-2 hover:border-[#DDAED3] hover:shadow-[0_25px_60px_rgba(33,60,81,.12)]"
            >

              <div className="mx-auto flex aspect-square max-w-[145px] items-center justify-center rounded-full bg-gradient-to-br from-[#DDAED3] via-white to-[#6594B1] p-[5px] transition-transform duration-500 group-hover:scale-105">

                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#EEEEEE]">

                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                </div>

              </div>

              <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6594B1]">
                {item.label}
              </p>

              <h3 className="mt-1 text-xl text-[#213C51]">
                {item.title}
              </h3>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#213C51] transition-all group-hover:gap-3">
                Explore
                <ArrowRight size={14} />
              </div>

            </Link>
          ))}

        </div>

      </div>
    </section>
  );
};

export default GenderCategories;