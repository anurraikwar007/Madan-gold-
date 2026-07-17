import { useState } from "react";


const ProductImageGallery = ({ product }) => {


  const images = [
    product.image,
    product.hoverImage,
    ...(product.gallery || [])
  ].filter(Boolean);



  const [selectedImage,setSelectedImage] =
    useState(images[0]);



  return (

    <div>


      {/* MAIN IMAGE */}

      <div
        className="
        rounded-[2rem]
        overflow-hidden
        bg-white
        border
        border-black/5
        "
      >

        <img

          src={selectedImage}

          alt={product.name}

          className="
          w-full
          aspect-[4/5]
          object-cover
          hover:scale-105
          transition-all
          duration-700
          "

        />


      </div>





      {/* THUMBNAILS */}


      <div
        className="
        flex
        gap-3
        mt-5
        overflow-x-auto
        "
      >

        {
          images.map((img,index)=>(


            <button

              key={index}

              onClick={()=>setSelectedImage(img)}

              className={`
              
              min-w-[85px]
              h-[100px]
              rounded-xl
              overflow-hidden
              border-2

              ${
                selectedImage === img
                ?
                "border-[#D4AF37]"
                :
                "border-transparent"
              }

              `}

            >

              <img

                src={img}

                alt=""

                className="
                w-full
                h-full
                object-cover
                "

              />


            </button>


          ))
        }


      </div>



    </div>

  );

};


export default ProductImageGallery;