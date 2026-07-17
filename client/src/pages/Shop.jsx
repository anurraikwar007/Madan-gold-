import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import ProductCard from "../components/product/ProductCard";

import { useProducts } from "../context/ProductContext";


const genderFilters = [
  "all",
  "men",
  "women",
  "girls",
  "boys",
  "child",
  "unisex",
];


const categoryFilters = [
  "all",
  "rings",
  "chains",
  "earrings",
  "bracelets",
  "pendants",
  "anklets",
  "bangles",
  "toe rings",
  "nose pins",
];


const Shop = () => {


  const { products } = useProducts();


  const [searchParams] = useSearchParams();


  const [selectedGender, setSelectedGender] =
    useState("all");


  const [selectedCategory, setSelectedCategory] =
    useState("all");



  /*
    URL FILTER LOAD

    Example:

    /shop?gender=women

    /shop?category=rings

  */


  useEffect(() => {


    const gender =
      searchParams.get("gender");


    const category =
      searchParams.get("category");



    if (gender) {

      setSelectedGender(gender);

    }


    if (category) {

      setSelectedCategory(
        category.toLowerCase()
      );

    }


  }, [searchParams]);




  const filteredProducts =
    products.filter((item)=>{


      const genderMatch =
        selectedGender === "all"
          ? true
          : item.gender === selectedGender;



      const categoryMatch =
        selectedCategory === "all"
          ? true
          : item.category === selectedCategory;



      return (
        genderMatch &&
        categoryMatch
      );


    });



  return (

    <div
      className="
      min-h-screen
      bg-[#FAF9F6]
      px-4
      sm:px-6
      py-10
      sm:py-14
      "
    >


      <div className="max-w-7xl mx-auto">



        {/* HEADER */}

        <div className="mb-10">


          <p
            className="
            text-[#D4AF37]
            uppercase
            tracking-[0.3em]
            text-xs
            font-semibold
            "
          >
            92.5 Silver Collection
          </p>


          <h1
            className="
            text-4xl
            sm:text-6xl
            font-bold
            mt-4
            "
          >
            Shop Jewelry
          </h1>


        </div>





        {/* GENDER FILTER */}


        <div
          className="
          flex
          gap-3
          overflow-x-auto
          pb-2
          mb-6
          "
        >


          {genderFilters.map((gender)=>(


            <button

              key={gender}

              onClick={() =>
                setSelectedGender(gender)
              }


              className={`

              px-5
              h-[46px]
              rounded-full
              whitespace-nowrap
              border
              text-sm
              font-medium
              transition


              ${
                selectedGender === gender

                ?

                "bg-[#111111] text-white"

                :

                "bg-white border-black/10"

              }

              `}

            >


              {gender}



            </button>


          ))}


        </div>






        {/* PRODUCT CATEGORY FILTER */}



        <div
          className="
          flex
          gap-3
          overflow-x-auto
          pb-2
          mb-10
          "
        >


          {categoryFilters.map((category)=>(


            <button


              key={category}


              onClick={() =>
                setSelectedCategory(category)
              }


              className={`


              px-5

              h-[46px]

              rounded-full

              whitespace-nowrap

              border

              text-sm

              font-medium

              transition



              ${
                selectedCategory === category

                ?

                "bg-[#D4AF37] text-black border-[#D4AF37]"

                :

                "bg-white border-black/10"

              }


              `}


            >


              {category}



            </button>


          ))}


        </div>







        {/* PRODUCTS */}



        {
          filteredProducts.length > 0

          ?


          <div
            className="
            grid
            grid-cols-2
            lg:grid-cols-4
            gap-4
            sm:gap-6
            "
          >


            {
              filteredProducts.map((product)=>(


                <ProductCard

                  key={product.id}

                  product={product}

                />


              ))
            }



          </div>


          :


          <div
            className="
            py-24
            text-center
            "
          >


            <h3
              className="
              text-2xl
              font-bold
              "
            >
              No Products Found
            </h3>


            <p
              className="
              text-gray-500
              mt-3
              "
            >
              Try changing filters.
            </p>



          </div>


        }



      </div>


    </div>

  );

};


export default Shop;