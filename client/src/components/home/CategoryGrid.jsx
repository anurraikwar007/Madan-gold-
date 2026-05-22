import { Link } from "react-router-dom";

const categories = [
  {
    title: "Rings",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop",
  },

  {
    title: "Earrings",
    image:
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=1200&auto=format&fit=crop",
  },

  {
    title: "Bracelets",
    image:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1200&auto=format&fit=crop",
  },

  {
    title: "Pendants",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop",
  },

  {
    title: "Mangalsutra",
    image:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1200&auto=format&fit=crop",
  },

  {
    title: "Silver Chains",
    image:
      "https://images.unsplash.com/photo-1611085583191-a3b181a88401?q=80&w=1200&auto=format&fit=crop",
  },
];

const CategoryGrid = () => {
  return (
    <section
      className="
        py-12
        sm:py-16
        px-4
        sm:px-6
      "
    >
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8 sm:mb-12">

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
            Trending Collections
          </p>

          <h2
            className="
              heading
              text-3xl
              sm:text-5xl
              text-[#111111]
              mt-2
            "
          >
            Explore Categories
          </h2>

        </div>

        {/* GRID */}
        <div
          className="
            grid
            grid-cols-2
            lg:grid-cols-3
            gap-4
            sm:gap-6
          "
        >
          {categories.map((item, index) => (

            <Link
              key={index}
              to={`/shop?category=${item.title}`}
              className="
                group
                relative
                overflow-hidden
                rounded-[2rem]
                h-[220px]
                sm:h-[320px]
              "
            >
              {/* IMAGE */}
              <img
                src={item.image}
                alt={item.title}
                className="
                  w-full
                  h-full
                  object-cover
                  transition-all
                  duration-700
                  group-hover:scale-110
                "
              />

              {/* OVERLAY */}
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

              {/* TEXT */}
              <div
                className="
                  absolute
                  bottom-5
                  left-5
                  text-white
                "
              >
                <h3
                  className="
                    heading
                    text-2xl
                    sm:text-4xl
                  "
                >
                  {item.title}
                </h3>

                <p
                  className="
                    text-white/80
                    text-xs
                    sm:text-sm
                    mt-1
                  "
                >
                  Explore Collection
                </p>

              </div>

            </Link>

          ))}
        </div>

      </div>
    </section>
  );
};

export default CategoryGrid;