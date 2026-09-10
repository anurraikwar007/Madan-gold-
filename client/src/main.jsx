import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";

import "./index.css";

import { CartProvider } from "./context/CartContext";
import { SearchProvider } from "./context/SearchContext";
import { ProductProvider } from "./context/ProductContext";
import { AuthProvider } from "./context/AuthContext";
import { HelmetProvider } from "react-helmet-async";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <ProductProvider>
          <SearchProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </SearchProvider>
        </ProductProvider>
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>
);