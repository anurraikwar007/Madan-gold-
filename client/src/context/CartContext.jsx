import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

import toast from "react-hot-toast";

import * as CartAPI from "../api/cart.api";
import * as WishlistAPI from "../api/wishlist.api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, loading: authLoading } =
    useAuth();

  /* ===========================
      LOAD CART
  =========================== */

  const loadCart = useCallback(async () => {
  try {
    const { data } = await CartAPI.getCart();

    const items =
      data?.data?.items ||
      data?.data?.cart?.items ||
      [];

    const normalizedItems = items.map((item) => {
      const product = item.product || {};

      return {
        ...item,

        id: product._id || item.product?._id,
        productId:
          product._id || item.product?._id,

        quantity: Number(item.quantity || 1),

        name:
          product.name ||
          item.name ||
          "Product",

        image:
          product.images?.[0]?.url ||
          product.image ||
          item.image ||
          "/placeholder.png",

        price: Number(item.price || 0),
      };
    });

    setCart(normalizedItems);
  } catch {
    setCart([]);
  }

  setLoading(false);
}, []);
   
        const loadWishlist = useCallback(async () => {
      try {
        const { data } =
          await WishlistAPI.getWishlist();

        const items =
          data?.data || [];

        const normalizedWishlist =
          items
            .map((item) => item.product)
            .filter(Boolean);

        setWishlist(normalizedWishlist);
      } catch {
        setWishlist([]);
      }
    }, []);

       useEffect(() => {
  let cancelled = false;

  const syncUserCart = async () => {
    if (authLoading) {
      return;
    }

    if (user?.role !== "Customer") {
      if (!cancelled) {
        setCart([]);
        setWishlist([]);
        setLoading(false);
      }

      return;
    }

    if (!cancelled) {
      setLoading(true);
    }

    try {
      await Promise.all([
        loadCart(),
        loadWishlist(),
      ]);
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  syncUserCart();

  return () => {
    cancelled = true;
  };
}, [
  user?._id,
  user?.role,
  authLoading,
  loadCart,
  loadWishlist,
]);

  /* ===========================
      SAVE WISHLIST
  =========================== */

 

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
    } catch {
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
    } catch  {
      toast.error("Failed");
    }
  };

  const clearCart = async () => {
    try {
      await CartAPI.clearCart();

      setCart([]);

      toast.success("Cart Cleared");
    } catch {
      toast.error("Failed");
    }
  };

  /* ===========================
      WISHLIST
  =========================== */

      const toggleWishlist = async (product) => {
      const productId =
        product?._id || product?.id;

      if (!productId) {
        toast.error("Invalid product.");
        return;
      }

      const exists = wishlist.some(
        (item) =>
          (item?._id || item?.id) === productId
      );

      try {
        if (exists) {
          await WishlistAPI.removeFromWishlist(
            productId
          );

          setWishlist((prev) =>
            prev.filter(
              (item) =>
                (item?._id || item?.id) !==
                productId
            )
          );

          toast.success("Removed From Wishlist");
          return;
        }

        const { data } =
          await WishlistAPI.addToWishlist(
            productId
          );

        const savedProduct =
          data?.data?.product
            ? data.data.product
            : product;

        setWishlist((prev) => [
          ...prev,
          savedProduct,
        ]);

        toast.success("Added To Wishlist");
      } catch (err) {
        if (err.response?.status === 409) {
          await loadWishlist();
          toast.success("Already in Wishlist");
          return;
        }

        toast.error(
          err.response?.data?.message ||
            "Wishlist update failed."
        );
      }
    };

    const removeFromWishlist = async (
      productId
    ) => {
      if (!productId) return;

      try {
        await WishlistAPI.removeFromWishlist(
          productId
        );

        setWishlist((prev) =>
          prev.filter(
            (item) =>
              (item?._id || item?.id) !== productId
          )
        );

        toast.success("Removed From Wishlist");
      } catch (err) {
        toast.error(
          err.response?.data?.message ||
            "Failed to remove from wishlist."
        );
      }
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
        removeFromWishlist,

        refreshCart: loadCart,
        refreshWishlist: loadWishlist,

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