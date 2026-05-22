import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  /* ========================= */
  /* LOCAL STORAGE LOAD */
  /* ========================= */

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");

    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");

    return saved ? JSON.parse(saved) : [];
  });

  /* ========================= */
  /* SAVE TO STORAGE */
  /* ========================= */

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  /* ========================= */
  /* ADD TO CART */
  /* ========================= */

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        toast.success("Quantity Updated");

        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                qty: (item.qty || 1) + (product.qty || 1),
              }
            : item
        );
      }

      toast.success("Added To Cart");

      return [
        ...prev,
        {
          ...product,
          qty: product.qty || 1,
        },
      ];
    });
  };

  /* ========================= */
  /* REMOVE FROM CART */
  /* ========================= */

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));

    toast.success("Removed From Cart");
  };

  /* ========================= */
  /* UPDATE QUANTITY */
  /* ========================= */

  const updateQty = (id, type) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const currentQty = item.qty || 1;

        const updatedQty =
          type === "inc"
            ? currentQty + 1
            : currentQty - 1;

        return {
          ...item,
          qty: updatedQty < 1 ? 1 : updatedQty,
        };
      })
    );
  };

  /* ========================= */
  /* CLEAR CART */
  /* ========================= */

  const clearCart = () => {
    setCart([]);
  };

  /* ========================= */
  /* WISHLIST */
  /* ========================= */

  const toggleWishlist = (product) => {
    const exists = wishlist.find((item) => item.id === product.id);

    if (exists) {
      setWishlist((prev) =>
        prev.filter((item) => item.id !== product.id)
      );

      toast.success("Removed From Wishlist");

      return;
    }

    setWishlist((prev) => [...prev, product]);

    toast.success("Added To Wishlist");
  };

  /* ========================= */
  /* TOTALS */
  /* ========================= */

  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => {
      return acc + (item.qty || 1);
    }, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      return acc + Number(item.price) * (item.qty || 1);
    }, 0);
  }, [cart]);

  /* ========================= */
  /* CONTEXT VALUE */
  /* ========================= */

  const value = {
    cart,
    wishlist,

    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    toggleWishlist,

    cartCount,
    subtotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);