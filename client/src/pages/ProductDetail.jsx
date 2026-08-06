import { useParams } from "react-router-dom";
import { useEffect } from "react";

import { useProducts } from "../context/ProductContext";

import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";

import ProductImageGallery from "../components/product/ProductImageGallery";
import ProductInfo from "../components/product/ProductInfo";

const ProductDetail = () => {
  const { id } = useParams();

  const {
    products,
    loading,
    refreshProducts,
  } = useProducts();

  useEffect(() => {
    if (products.length === 0) {
      refreshProducts?.();
    }
  }, []);

  if (loading) {
    return <Loader />;
  }

  const product = products.find(
    (item) => item._id === id
  );

  if (!product) {
    return (
      <EmptyState
        title="Product Not Found"
        subtitle="The requested product does not exist."
      />
    );
  }

  return (
    <div
      className="
        min-h-screen
        bg-[#FAF9F6]
        py-10
        px-4
        sm:px-6
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          grid
          lg:grid-cols-2
          gap-10
          lg:gap-16
        "
      >
        <ProductImageGallery
          product={product}
        />

        <ProductInfo
          product={product}
        />
      </div>
    </div>
  );
};

export default ProductDetail;