import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import * as ProductAPI from "../api/product.api";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const { data } = await ProductAPI.getProducts();

      const list =
        data.data.products ||
        data.data ||
        [];

      setProducts(list);
    } catch (err) {
      console.error(err);

      setProducts([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

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