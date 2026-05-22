import { Search } from "lucide-react";

import { useSearch } from "../../context/SearchContext";

const MobileSearchBar = () => {

  const { query, setQuery } = useSearch();

  return (
    <div
      className="
        lg:hidden
        sticky
        top-[78px]
        z-40
        px-4
        pt-3
        pb-2
        bg-[#FAF9F6]/90
        backdrop-blur-xl
      "
    >

      <div className="relative">

        {/* ICON */}
        <Search
          size={18}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-gray-400
          "
        />

        {/* INPUT */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search jewellery..."
          className="
            w-full
            h-[52px]
            rounded-full
            bg-white
            border
            border-black/5
            pl-12
            pr-4
            text-sm
            shadow-sm
          "
        />

      </div>

    </div>
  );
};

export default MobileSearchBar;