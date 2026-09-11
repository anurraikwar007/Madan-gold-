import {
  createContext,
   useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";

import * as ProductAPI from "../api/product.api";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const lastLoadedAt = useRef(0);

  const loadProducts =
  useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await ProductAPI.getProducts({
          page: 1,
          limit: 50,
        });

      const data =
        response?.data?.data;

      const list =
        Array.isArray(
          data?.products
        )
          ? data.products
          : Array.isArray(data)
            ? data
            : [];

      setProducts(list);
      lastLoadedAt.current = Date.now();
    } catch (err) {
      console.error(
        "Failed to load products:",
        err?.response?.data || err
      );
      
      setProducts([]);
      setError(err?.response?.data?.message || "Unable to load products right now.");

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();

    const handleFocus = () => {
      if (Date.now() - lastLoadedAt.current > 120000) {
        loadProducts();
      }
    };

    const handleProductsUpdated = () => {
      loadProducts();
    };

    window.addEventListener(
      "focus",
      handleFocus
    );

    window.addEventListener(
      "products-updated",
      handleProductsUpdated
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus
      );

      window.removeEventListener(
        "products-updated",
        handleProductsUpdated
      );
    };
  }, [loadProducts]);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        refreshProducts: loadProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () =>
  useContext(ProductContext);