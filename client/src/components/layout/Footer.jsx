import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0f0f0f] text-white pt-20 pb-10 mt-20">

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* TOP */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 pb-16 border-b border-white/10">

          {/* LEFT */}
          <div>

            <p className="text-[#D4AF37] uppercase tracking-[0.25em] text-xs sm:text-sm font-medium">
              Madan Gold
            </p>

            <h2 className="heading text-4xl sm:text-5xl leading-[1] mt-5">
              Crafted To Shine For Generations
            </h2>

            <p className="text-white/60 mt-6 max-w-xl text-sm sm:text-base leading-relaxed">
              Discover timeless handcrafted jewelry designed with elegance,
              luxury, and unmatched craftsmanship.
            </p>

          </div>

          {/* RIGHT */}
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 sm:p-10">

            <p className="text-[#D4AF37] uppercase tracking-[0.25em] text-xs sm:text-sm font-medium">
              Newsletter
            </p>

            <h3 className="heading text-3xl sm:text-4xl mt-4">
              Join The Luxury Club
            </h3>

            <p className="text-white/60 mt-4 text-sm sm:text-base">
              Get exclusive launches & premium jewelry updates.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">

              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/10 border border-white/10 rounded-full px-6 py-4 outline-none text-white placeholder:text-white/40"
              />

              <button className="bg-[#D4AF37] hover:bg-[#c89b1f] text-black px-7 py-4 rounded-full font-semibold transition-all duration-300">
                Subscribe
              </button>

            </div>

          </div>

        </div>

        {/* LINKS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 py-16">

          {/* SHOP */}
          <div>

            <h4 className="text-white font-semibold text-lg mb-5">
              Shop
            </h4>

            <ul className="space-y-4 text-white/60 text-sm">
              <li><a href="#" className="hover:text-[#D4AF37]">Rings</a></li>
              <li><a href="#" className="hover:text-[#D4AF37]">Necklaces</a></li>
              <li><a href="#" className="hover:text-[#D4AF37]">Earrings</a></li>
              <li><a href="#" className="hover:text-[#D4AF37]">Bracelets</a></li>
            </ul>

          </div>

          {/* COMPANY */}
          <div>

            <h4 className="text-white font-semibold text-lg mb-5">
              Company
            </h4>

            <ul className="space-y-4 text-white/60 text-sm">
              <li><a href="#" className="hover:text-[#D4AF37]">About</a></li>
              <li><a href="#" className="hover:text-[#D4AF37]">Contact</a></li>
              <li><a href="#" className="hover:text-[#D4AF37]">Stores</a></li>
              <li><a href="#" className="hover:text-[#D4AF37]">Careers</a></li>
            </ul>

          </div>

          {/* SUPPORT */}
          <div>

            <h4 className="text-white font-semibold text-lg mb-5">
              Support
            </h4>

            <ul className="space-y-4 text-white/60 text-sm">
              <li><a href="#" className="hover:text-[#D4AF37]">Shipping</a></li>
              <li><a href="#" className="hover:text-[#D4AF37]">Returns</a></li>
              <li><a href="#" className="hover:text-[#D4AF37]">FAQs</a></li>
              <li><a href="#" className="hover:text-[#D4AF37]">Privacy</a></li>
            </ul>

          </div>

          {/* SOCIAL */}
          <div>

            <h4 className="text-white font-semibold text-lg mb-5">
              Follow Us
            </h4>

            <div className="flex gap-4">

              <a
                href="#"
                className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
              >
                <FaInstagram size={18} />
              </a>

              <a
                href="#"
                className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
              >
                <FaFacebookF size={18} />
              </a>

              <a
                href="#"
                className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
              >
                <FaYoutube size={18} />
              </a>

            </div>

          </div>

        </div>

        {/* BOTTOM */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-4 items-center justify-between text-white/40 text-sm">

          <p>
            © 2026 Madan Gold. All rights reserved.
          </p>

          <p>
            Designed for timeless luxury.
          </p>

        </div>

      </div>

    </footer>
  );
};

export default Footer;