import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useSearch } from "../../context/SearchContext";

const MobileSearchBar = () => {
  const navigate = useNavigate();

  const {
    query,
    setQuery,
  } = useSearch();

  const handleSubmit = () => {
    const value = query.trim();

    if (!value) {
      navigate("/shop");
      return;
    }

    navigate(
      `/shop?search=${encodeURIComponent(
        value
      )}`
    );
  };

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
        <Search
          size={18}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-gray-400
            cursor-pointer
          "
          onClick={handleSubmit}
        />

        <input
          type="text"
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
          placeholder="Search 925 silver jewellery..."
          aria-label="Search 925 silver jewellery"
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
            outline-none
          "
        />
      </div>
    </div>
  );
};

export default MobileSearchBar;