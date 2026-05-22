import React from "react";
import { motion } from "framer-motion";

const SectionTitle = ({
  subtitle,
  title,
  center = true,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className={`mb-12 ${
        center ? "text-center" : ""
      }`}
    >
      {/* Subtitle */}
      {subtitle && (
        <p className="text-gold uppercase tracking-[4px] text-sm font-semibold mb-3">
          {subtitle}
        </p>
      )}

      {/* Title */}
      <h2 className="heading text-3xl md:text-5xl font-bold leading-tight">
        {title}
      </h2>
    </motion.div>
  );
};

export default SectionTitle;