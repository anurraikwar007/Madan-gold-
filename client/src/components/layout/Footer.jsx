import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
} from "react-icons/fa";

import {
  ArrowUpRight,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer mt-20">

      {/* TOP BRAND AREA */}
      <div className="mx-auto max-w-7xl px-5 sm:px-6">

        <div className="grid gap-14 border-b border-white/10 py-16 lg:grid-cols-[1.3fr_.7fr] lg:py-20">

          <div>

            <p className="accent-text text-sm tracking-[0.3em] uppercase">
              MADAN GOLD
            </p>

            <h2 className="mt-5 max-w-2xl text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              Jewellery made for
              <span className="text-[#DDAED3]">
                {" "}moments that matter.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
              Discover thoughtfully crafted jewellery
              designed to celebrate relationships,
              milestones and memories that last
              for generations.
            </p>

            <Link
              to="/shop"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#DDAED3]/50 px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#DDAED3] hover:text-[#213C51]"
            >
              Explore Collection
              <ArrowUpRight size={16} />
            </Link>

          </div>

          {/* CONTACT CARD */}
          <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-7 backdrop-blur-xl">

            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#DDAED3]">
              Get in touch
            </p>

            <h3 className="mt-4 text-2xl text-white">
              We're here for you.
            </h3>

            <div className="mt-8 space-y-5">

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DDAED3]/15 text-[#DDAED3]">
                  <Mail size={17} />
                </div>

                <div>
                  <p className="text-xs text-white/40">
                    Email
                  </p>
                  <p className="text-sm text-white/80">
                    support@madangold.com
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DDAED3]/15 text-[#DDAED3]">
                  <Phone size={17} />
                </div>

                <div>
                  <p className="text-xs text-white/40">
                    Phone
                  </p>
                  <p className="text-sm text-white/80">
                    +91 XXXXX XXXXX
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DDAED3]/15 text-[#DDAED3]">
                  <MapPin size={17} />
                </div>

                <div>
                  <p className="text-xs text-white/40">
                    Location
                  </p>
                  <p className="text-sm text-white/80">
                    India
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* LINKS */}
        <div className="grid grid-cols-2 gap-10 py-14 sm:grid-cols-4">

          <div>
            <h4 className="mb-5 text-base">
              Shop
            </h4>

            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/shop">
                  All Jewellery
                </Link>
              </li>

              <li>
                <Link to="/shop">
                  New Arrivals
                </Link>
              </li>

              <li>
                <Link to="/shop">
                  Best Sellers
                </Link>
              </li>

              <li>
                <Link to="/shop">
                  Collections
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-base">
              Jewellery
            </h4>

            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/shop">
                  Rings
                </Link>
              </li>

              <li>
                <Link to="/shop">
                  Earrings
                </Link>
              </li>

              <li>
                <Link to="/shop">
                  Necklaces
                </Link>
              </li>

              <li>
                <Link to="/shop">
                  Bracelets
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-base">
              Support
            </h4>

            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/orders">
                  My Orders
                </Link>
              </li>

              <li>
                <Link to="/profile">
                  My Account
                </Link>
              </li>

              <li>
                <Link to="/wishlist">
                  Wishlist
                </Link>
              </li>

              <li>
                <Link to="/cart">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-base">
              Follow
            </h4>

            <div className="flex gap-3">

              {[
                [FaInstagram, "Instagram"],
                [FaFacebookF, "Facebook"],
                [FaYoutube, "YouTube"],
              ].map(([Icon, label]) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/70 transition hover:border-[#DDAED3]/50 hover:bg-[#DDAED3] hover:text-[#213C51]"
                >
                  <Icon size={16} />
                </a>
              ))}

            </div>

            <p className="mt-5 max-w-[190px] text-xs leading-6 text-white/40">
              Follow us for new collections,
              launches and special offers.
            </p>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="flex flex-col gap-3 border-t border-white/10 py-7 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">

          <p>
            © 2026 Madan Gold. All rights reserved.
          </p>

          <p>
            Crafted with care in India.
          </p>

        </div>

      </div>
    </footer>
  );
};

export default Footer;