import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { useProducts } from "../context/ProductContext";
import { getProductById } from "../api/product.api";

import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";

import ProductImageGallery from "../components/product/ProductImageGallery";
import ProductInfo from "../components/product/ProductInfo";
import ProductReviews from "../components/product/ProductReviews";
import RelatedProducts from "../components/product/RelatedProducts";

const ProductDetail = () => {
  const { id } = useParams();

  const { products } = useProducts();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadProduct = async () => {
      setLoading(true);
      setError("");

      try {
        // Always fetch the detail endpoint. The catalog is paginated and may
        // not contain the product (or all of its image data).
        const response = await getProductById(id);
        const data = response?.data?.data?.product || response?.data?.data;

        if (!data) throw new Error("Product not found.");

        if (!cancelled) setProduct(data);
      } catch (err) {
        // Keep a catalog fallback for older deployments.
        const fallback = products.find(
          (item) => String(item?._id || item?.id) === String(id)
        );

        if (!cancelled) {
          if (fallback) {
            setProduct(fallback);
          } else {
            setProduct(null);
            setError(err?.response?.data?.message || err?.message || "Product not found.");
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (id) loadProduct();
    else {
      setProduct(null);
      setLoading(false);
    }

    return () => { cancelled = true; };
  }, [id, products]);

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return (
      <EmptyState
        title="Product Not Found"
        subtitle={error || "The requested product does not exist."}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ProductReviews
          productId={product._id}
          averageRating={
            product.averageRating
          }
          totalReviews={
            product.totalReviews
          }
        />

        <RelatedProducts
          productId={product._id}
        />
      </div>
    </div>
  );
};

export default ProductDetail;