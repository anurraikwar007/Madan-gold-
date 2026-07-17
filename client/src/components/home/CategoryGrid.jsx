import { Link } from "react-router-dom";

import { genderCategories } from "../../data/categories";


const CategoryGrid = () => {

  return (

    <section className="py-12 sm:py-16 px-4 sm:px-6">

      <div className="max-w-7xl mx-auto">


        <div className="mb-8 sm:mb-12">

          <p
            className="
            text-[#D4AF37]
            uppercase
            tracking-[0.25em]
            text-xs
            font-semibold
            "
          >
            Silver Collection
          </p>


          <h2
            className="
            heading
            text-3xl
            sm:text-5xl
            mt-2
            "
          >
            Shop By Collection
          </h2>

        </div>



        <div
          className="
          grid
          grid-cols-2
          lg:grid-cols-3
          gap-4
          sm:gap-6
          "
        >

          {genderCategories.map((item)=> (

            <Link

              key={item.id}

              to={`/shop?gender=${item.slug}`}

              className="
              group
              relative
              overflow-hidden
              rounded-[2rem]
              h-[240px]
              sm:h-[350px]
              "

            >

              <img

                src={item.image}

                alt={item.name}

                className="
                w-full
                h-full
                object-cover
                transition duration-700
                group-hover:scale-110
                "

              />


              <div
                className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black/70
                to-transparent
                "
              />


              <div
                className="
                absolute
                bottom-6
                left-6
                text-white
                "
              >

                <h3
                  className="
                  heading
                  text-3xl
                  "
                >
                  {item.name}
                </h3>


                <p className="text-white/80 text-sm">
                  Explore Collection
                </p>


              </div>


            </Link>

          ))}


        </div>


      </div>

    </section>

  );
};


export default CategoryGrid;