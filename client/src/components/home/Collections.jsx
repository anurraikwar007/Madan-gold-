import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const collections = [
  {
    id: 1,
    title: "Gold Rings",
    image:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1200&auto=format&fit=crop",
    link: "/shop/rings",
  },
  {
    id: 2,
    title: "Luxury Necklaces",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop",
    link: "/shop/necklaces",
  },
  {
    id: 3,
    title: "Wedding Collection",
    image:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1200&auto=format&fit=crop",
    link: "/shop/wedding",
  },
];

const Collections = () => {
  return (
    <section className="py-16 md:py-24 px-4 md:px-10 bg-white">
      {/* Heading */}
      <div className="text-center mb-12">
        <p className="text-gold uppercase tracking-[4px] text-sm font-semibold mb-3">
          Premium Collections
        </p>

        <h2 className="heading text-3xl md:text-5xl font-bold">
          Shop By Category
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {collections.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: index * 0.2,
            }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl luxury-shadow group h-[420px]"
          >
            {/* Image */}
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition duration-500" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white z-10">
              <h3 className="heading text-2xl md:text-3xl font-bold mb-4">
                {item.title}
              </h3>

              <Link
                to={item.link}
                className="inline-flex items-center gap-2 bg-gold text-black px-5 py-3 rounded-full font-semibold hover:scale-105 transition"
              >
                Explore
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Collections;