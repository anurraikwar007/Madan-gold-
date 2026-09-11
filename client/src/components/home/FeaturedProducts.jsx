import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import ProductCard from "../product/ProductCard";
import { getFeaturedProducts } from "../../api/product.api";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await getFeaturedProducts();
        const data = response?.data?.data;
        const items = Array.isArray(data?.products) ? data.products : Array.isArray(data) ? data : [];
        if (!cancelled) setProducts(items.slice(0, 8));
      } catch (error) { console.error("Featured products load failed:", error); if (!cancelled) setProducts([]); }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#EEEEEE] py-20 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute -right-28 top-10 h-72 w-72 rounded-full bg-[#DDAED3]/35 blur-3xl" />
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="mb-12 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#213C51]/10 bg-white/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[.22em] text-[#213C51]"><Sparkles size={13} className="text-[#6594B1]"/> Editor's selection</div>
            <h2 className="font-heading text-4xl font-semibold tracking-tight text-[#213C51] sm:text-5xl lg:text-6xl">Pieces worth<br/><span className="text-[#6594B1]">keeping forever.</span></h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">A refined edit of 925 silver jewellery designed to move effortlessly from everyday moments to celebrations.</p>
          </div>
          <Link to="/shop" className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#213C51] px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-[#213C51]/15 transition hover:-translate-y-0.5 hover:bg-[#172D3E]">Explore collection <ArrowUpRight size={17} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/></Link>
        </div>
        {loading ? <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">{Array.from({length:8}).map((_,i)=><div key={i} className="aspect-[.78] animate-pulse rounded-[24px] bg-white"/>)}</div> : products.length ? <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">{products.map((product,index)=><motion.div key={product._id || product.id} initial={{opacity:0,y:25}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-60px"}} transition={{duration:.45,delay:index*.04}}><ProductCard product={product}/></motion.div>)}</div> : <div className="rounded-3xl bg-white p-12 text-center text-slate-500">Featured pieces are being curated. Check back soon.</div>}
      </div>
    </section>
  );
};
export default FeaturedProducts;
