import { useParams } from "react-router-dom";

import { useProducts } from "../context/ProductContext";

import ProductImageGallery from "../components/product/ProductImageGallery";

import ProductInfo from "../components/product/ProductInfo";



const ProductDetail = () => {


  const { id } = useParams();


  const { products } = useProducts();



  const product =
    products.find(
      (item) => item.id === Number(id)
    );



  if (!product) {

    return (

      <div
        className="
        min-h-screen
        flex
        items-center
        justify-center
        text-xl
        font-semibold
        "
      >

        Product Not Found

      </div>

    );

  }





  return (

    <div
      className="
      min-h-screen
      bg-[#FAF9F6]
      py-10
      sm:py-16
      px-4
      sm:px-6
      "
    >


      <div
        className="
        max-w-7xl
        mx-auto
        grid
        grid-cols-1
        lg:grid-cols-2
        gap-10
        lg:gap-16
        "
      >



        {/* IMAGE SECTION */}

        <ProductImageGallery

          product={product}

        />




        {/* INFO SECTION */}

        <ProductInfo

          product={product}

        />



      </div>


    </div>

  );


};



export default ProductDetail;