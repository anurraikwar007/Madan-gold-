import ProductCard from "./ProductCard";

const ProductGrid = ({ products = [] }) => {

  return (

    <div
      className="
        grid
        grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        gap-4
        md:gap-8
      "
    >

      {products.map((product) => (

        <ProductCard
          key={product.id}
          product={product}
        />

      ))}

    </div>

  );
};

export default ProductGrid;