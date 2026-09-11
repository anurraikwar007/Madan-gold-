import { useEffect, useRef, useState } from "react";
import { Search, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useSearch } from "../../context/SearchContext";
import { getSearchSuggestions } from "../../api/product.api";

const MobileSearchBar = () => {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const { query, setQuery } = useSearch();
  const [suggestions, setSuggestions] = useState({ products: [], keywords: [] });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const value = query.trim();
    if (!value) {
      setSuggestions({ products: [], keywords: [] });
      setOpen(false);
      return undefined;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await getSearchSuggestions(value);
        const data = response?.data?.data || {};
        setSuggestions({
          products: Array.isArray(data.products) ? data.products : [],
          keywords: Array.isArray(data.suggestions) ? data.suggestions : [],
        });
        setOpen(true);
      } catch {
        setSuggestions({ products: [], keywords: [] });
        setOpen(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const handleSubmit = (value = query) => {
    const clean = String(value).trim();
    setOpen(false);
    navigate(clean ? `/shop?search=${encodeURIComponent(clean)}` : "/shop");
  };

  const total = suggestions.products.length + suggestions.keywords.length;

  return (
    <div className="lg:hidden sticky top-[78px] z-40 px-4 pt-3 pb-2 bg-[#FAFAFA]/90 backdrop-blur-xl" ref={wrapperRef}>
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#213C51] cursor-pointer z-10"
          onClick={() => handleSubmit()}
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
            if (e.key === "Escape") setOpen(false);
          }}
          placeholder="Search jewellery, rings, necklaces..."
          aria-label="Search 925 silver jewellery"
          className="w-full h-[52px] rounded-full bg-white border border-[#213C51]/10 pl-12 pr-4 text-sm text-[#213C51] shadow-[0_8px_30px_rgba(33,60,81,.06)] outline-none focus:border-[#DDAED3] focus:ring-4 focus:ring-[#DDAED3]/15"
        />

        {open && total > 0 && (
          <div className="absolute left-0 right-0 top-[calc(100%+8px)] overflow-hidden rounded-2xl border border-[#213C51]/10 bg-white shadow-[0_24px_60px_rgba(33,60,81,.16)] p-2">
            {suggestions.keywords.slice(0, 4).map((keyword) => (
              <button
                key={`keyword-${keyword}`}
                type="button"
                onClick={() => handleSubmit(keyword)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-[#EEEEEE]"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#DDAED3]/20 text-[#213C51]"><Sparkles size={15} /></span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-[#213C51]">{keyword}</span>
                <ArrowRight size={14} className="text-[#6594B1]" />
              </button>
            ))}

            {suggestions.products.slice(0, 5).map((product) => {
              const id = product?._id || product?.id;
              const image = typeof product?.images?.[0] === "string" ? product.images[0] : product?.images?.[0]?.url;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => { setOpen(false); navigate(id ? `/product/${id}` : `/shop?search=${encodeURIComponent(product.name || query)}`); }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-[#EEEEEE]"
                >
                  {image ? <img src={image} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" /> : <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#EEEEEE]"><Sparkles size={15} /></span>}
                  <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-[#213C51]">{product.name}</span><span className="block truncate text-[11px] text-slate-400">{product.category || "925 Silver Jewellery"}</span></span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileSearchBar;
