import React from "react";
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-cream flex items-center justify-center">
      <div className="flex flex-col items-center">
        
        {/* Gold Ring Loader */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: "linear",
          }}
          className="w-16 h-16 rounded-full border-[5px] border-gold border-t-transparent"
        />

        {/* Brand */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
          }}
          className="heading text-2xl mt-5 text-black"
        >
          Madan Gold
        </motion.h2>

        {/* Text */}
        <p className="text-sm text-gray-500 mt-2 tracking-widest uppercase">
          Luxury Jewellery
        </p>
      </div>
    </div>
  );
};

export default Loader;