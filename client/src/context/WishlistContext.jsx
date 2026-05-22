import { useCart } from "../context/CartContext";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";

const Wishlist = () => {
  const { wishlist, toggleWishlist, addToCart } = useCart();

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-28 px-4">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          My Wishlist ❤️
        </h1>

        {/* EMPTY STATE */}
        {wishlist.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            No items in wishlist
          </div>
        )}

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition"
            >

              {/* IMAGE */}
              <div className="relative">

                <img
                  src={item.image}
                  className="w-full h-40 object-cover"
                />

                {/* REMOVE */}
                <button
                  onClick={() => toggleWishlist(item)}
                  className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center"
                >
                  <Trash2 size={14} />
                </button>

              </div>

              {/* CONTENT */}
              <div className="p-4">

                <h3 className="font-semibold text-sm">
                  {item.name}
                </h3>

                <p className="text-[#D4AF37] font-bold mt-1">
                  ₹{item.price}
                </p>

                {/* ACTIONS */}
                <button
                  onClick={() =>
                    addToCart({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      image: item.image,
                    })
                  }
                  className="mt-3 w-full bg-black text-white py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-[#D4AF37] hover:text-black transition"
                >
                  <ShoppingBag size={16} />
                  Add to Cart
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
};

export default Wishlist;