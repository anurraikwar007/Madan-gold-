import {
  createContext,
   useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import * as ProductAPI from "../api/product.api";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);

      const { data } =
        await ProductAPI.getProducts({
          page: 1,
          limit: 100,
        });

      const responseData =
        data?.data;

      const list =
        responseData?.products ||
        (Array.isArray(responseData)
          ? responseData
          : []);

      setProducts(list);
    } catch (err) {
      console.error(
        "Failed to load products:",
        err
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  },[]);

  useEffect(() => {
    loadProducts();

    const handleFocus = () => {
      loadProducts();
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
        refreshProducts: loadProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () =>
  useContext(ProductContext);