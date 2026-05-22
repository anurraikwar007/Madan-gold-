import { createContext, useContext, useState } from "react";

import { products as initialProducts } from "../data/products";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {

  const [products] = useState(initialProducts);

  const [loading] = useState(false);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);