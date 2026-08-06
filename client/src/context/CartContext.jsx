import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import toast from "react-hot-toast";

import * as CartAPI from "../api/cart.api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===========================
      LOAD CART
  =========================== */

  const loadCart = async () => {
    try {
      const { data } = await CartAPI.getCart();

      const items =
        data.data.items ||
        data.data.cart?.items ||
        [];

      setCart(items);
    } catch (err) {
      setCart([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      loadCart();
    } else {
      setLoading(false);
    }

    const savedWishlist =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    setWishlist(savedWishlist);
  }, []);

  /* ===========================
      SAVE WISHLIST
  =========================== */

  useEffect(() => {
    localStorage.setItem(
      "wishlist",
      JSON.stringify(wishlist)
    );
  }, [wishlist]);

  /* ===========================
      CART
  =========================== */

  const addToCart = async (
    product,
    qty = 1
  ) => {
    try {
      await CartAPI.addToCart(
        product._id,
        qty
      );

      await loadCart();

      toast.success("Added To Cart");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed To Add Cart"
      );
    }
  };

  const removeFromCart = async (
    productId
  ) => {
    try {
      await CartAPI.removeFromCart(
        productId
      );

      await loadCart();

      toast.success("Removed From Cart");
    } catch (err) {
      toast.error("Failed");
    }
  };

  const updateQty = async (
    productId,
    quantity
  ) => {
    try {
      await CartAPI.updateCart(
        productId,
        quantity
      );

      await loadCart();
    } catch (err) {
      toast.error("Failed");
    }
  };

  const clearCart = async () => {
    try {
      await CartAPI.clearCart();

      setCart([]);

      toast.success("Cart Cleared");
    } catch (err) {
      toast.error("Failed");
    }
  };

  /* ===========================
      WISHLIST
  =========================== */

  const toggleWishlist = (product) => {
    const exists = wishlist.find(
      (item) => item._id === product._id
    );

    if (exists) {
      setWishlist((prev) =>
        prev.filter(
          (item) => item._id !== product._id
        )
      );

      toast.success("Removed From Wishlist");

      return;
    }

    setWishlist((prev) => [
      ...prev,
      product,
    ]);

    toast.success("Added To Wishlist");
  };

  // Compatibility with ProductCard
  const addToWishlist = toggleWishlist;

  /* ===========================
      TOTALS
  =========================== */

  const cartCount = useMemo(() => {
    return cart.reduce(
      (sum, item) =>
        sum + (item.quantity || 1),
      0
    );
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce(
      (sum, item) =>
        sum +
        Number(item.price || 0) *
          (item.quantity || 1),
      0
    );
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        loading,

        cart,
        wishlist,

        addToCart,
        removeFromCart,
        updateQty,
        clearCart,

        toggleWishlist,
        addToWishlist,

        refreshCart: loadCart,

        cartCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () =>
  useContext(CartContext);