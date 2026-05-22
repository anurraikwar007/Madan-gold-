import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const EmptyState = ({
  title = "Nothing Here",
  subtitle = "Looks like there's nothing to show right now.",
  buttonText = "Continue Shopping",
  buttonLink = "/shop",
}) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-md"
      >
        {/* Icon */}
        <div className="w-24 h-24 mx-auto rounded-full bg-gold/10 flex items-center justify-center mb-6">
          <ShoppingBag
            size={42}
            className="text-gold"
          />
        </div>

        {/* Title */}
        <h2 className="heading text-3xl font-bold mb-3">
          {title}
        </h2>

        {/* Subtitle */}
        <p className="text-gray-500 leading-relaxed mb-8">
          {subtitle}
        </p>

        {/* Button */}
        <Link
          to={buttonLink}
          className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-black text-white font-medium hover:bg-gold hover:text-black transition duration-300"
        >
          {buttonText}
        </Link>
      </motion.div>
    </div>
  );
};

export default EmptyState;