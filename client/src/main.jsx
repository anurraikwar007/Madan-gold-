import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";

import "./index.css";

import { CartProvider } from "./context/CartContext";
import { SearchProvider } from "./context/SearchContext";
import { ProductProvider } from "./context/ProductContext";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    <AuthProvider>

      <ProductProvider>

        <SearchProvider>

          <CartProvider>

            <App />

          </CartProvider>

        </SearchProvider>

      </ProductProvider>

    </AuthProvider>

  </React.StrictMode>
);