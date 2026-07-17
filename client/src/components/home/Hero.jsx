import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
} from "lucide-react";


const slides = [

  {
    title: "Crafted For",
    highlight: "Timeless Moments",
    desc:
      "Discover premium 925 silver jewellery designed with elegance and modern craftsmanship.",
    image:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1600&auto=format&fit=crop",
    tag: "New Silver Collection",
  },


  {
    title: "Jewellery That",
    highlight: "Defines You",
    desc:
      "Elegant designs created for everyday luxury and unforgettable occasions.",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1600&auto=format&fit=crop",
    tag: "Premium Designs",
  },


  {
    title: "Celebrate Your",
    highlight: "Special Moments",
    desc:
      "Explore handcrafted jewellery collections for men, women and kids.",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1600&auto=format&fit=crop",
    tag: "Festive Collection",
  },

];



const Hero = () => {


  const [active, setActive] = useState(0);


  useEffect(() => {

    const timer = setInterval(() => {

      setActive((prev) =>
        prev === slides.length - 1
          ? 0
          : prev + 1
      );

    },5000);


    return () => clearInterval(timer);


  },[]);



  const slide = slides[active];



  return (

    <section
      className="
      relative
      min-h-[600px]
      lg:min-h-[640px]
      overflow-hidden
      bg-gradient-to-br
      from-[#fffaf0]
      via-[#faf7ef]
      to-[#f3e7cf]
      "
    >


      {/* GOLD LIGHT */}

      <div
        className="
        absolute
        -top-20
        -right-20
        w-[350px]
        h-[350px]
        rounded-full
        bg-[#D4AF37]/20
        blur-[100px]
        "
      />



      <div
        className="
        max-w-7xl
        mx-auto
        px-5
        sm:px-8
        lg:px-10
        pt-24
        lg:pt-28
        "
      >



        <div
          className="
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-10
          items-center
          "
        >



          {/* LEFT */}


          <div>


            <div
              className="
              inline-flex
              items-center
              gap-2
              bg-white/80
              backdrop-blur
              border
              border-black/5
              rounded-full
              px-5
              py-2
              "
            >

              <Sparkles
                size={15}
                className="text-[#D4AF37]"
              />

              <span
                className="
                text-[11px]
                uppercase
                tracking-[0.25em]
                font-semibold
                "
              >

                {slide.tag}

              </span>

            </div>




            <h1
              className="
              mt-6
              text-4xl
              sm:text-5xl
              lg:text-6xl
              font-bold
              leading-[1.05]
              text-[#111]
              "
            >

              {slide.title}

              <br />

              <span
                className="
                text-[#D4AF37]
                italic
                "
              >

                {slide.highlight}

              </span>


            </h1>



            <p
              className="
              mt-5
              max-w-lg
              text-gray-600
              text-sm
              sm:text-base
              leading-relaxed
              "
            >

              {slide.desc}

            </p>




            <div
              className="
              flex
              flex-wrap
              gap-4
              mt-7
              "
            >


              <Link
                to="/shop"
                className="
                bg-[#111]
                text-white
                px-7
                py-3.5
                rounded-full
                flex
                items-center
                gap-3
                text-sm
                font-semibold
                hover:bg-[#D4AF37]
                hover:text-black
                transition
                "
              >

                Shop Collection

                <ArrowRight size={17}/>

              </Link>



              <Link
                to="/shop"
                className="
                bg-white
                border
                border-black/10
                px-7
                py-3.5
                rounded-full
                text-sm
                font-semibold
                "
              >

                Explore

              </Link>


            </div>




            {/* TRUST */}

            <div
              className="
              grid
              grid-cols-3
              gap-3
              mt-8
              "
            >


              <div
                className="
                bg-white
                rounded-2xl
                p-3
                shadow-sm
                "
              >

                <ShieldCheck
                  size={20}
                  className="text-[#D4AF37]"
                />

                <p className="text-xs mt-2 font-semibold">
                  Certified
                </p>

              </div>



              <div
                className="
                bg-white
                rounded-2xl
                p-3
                shadow-sm
                "
              >

                <Truck
                  size={20}
                  className="text-[#D4AF37]"
                />

                <p className="text-xs mt-2 font-semibold">
                  Delivery
                </p>

              </div>




              <div
                className="
                bg-white
                rounded-2xl
                p-3
                shadow-sm
                "
              >

                <Sparkles
                  size={20}
                  className="text-[#D4AF37]"
                />

                <p className="text-xs mt-2 font-semibold">
                  Premium
                </p>

              </div>


            </div>



          </div>






          {/* RIGHT IMAGE */}



          <div
            className="
            relative
            "
          >



            <div
              className="
              absolute
              inset-0
              bg-[#D4AF37]/20
              blur-[70px]
              rounded-full
              "
            />



            <div
              className="
              relative
              overflow-hidden
              rounded-[2.5rem]
              h-[400px]
              sm:h-[470px]
              lg:h-[500px]
              shadow-2xl
              "
            >

              <img
                key={slide.image}
                src={slide.image}
                alt="Jewellery"
                className="
                w-full
                h-full
                object-cover
                transition-all
                duration-[1500ms]
                scale-105
                "
              />


              <div
                className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black/50
                via-transparent
                "
              />



            </div>




            {/* FLOAT CARD */}



            <div
              className="
              absolute
              bottom-6
              left-5
              right-5
              bg-white/90
              backdrop-blur-xl
              rounded-3xl
              p-4
              shadow-xl
              "
            >

              <p
                className="
                text-xs
                text-gray-500
                "
              >
                Featured Collection
              </p>


              <h3
                className="
                text-lg
                font-bold
                mt-1
                "
              >
                925 Silver Jewellery
              </h3>


              <p
                className="
                text-[#D4AF37]
                font-semibold
                text-sm
                mt-1
                "
              >
                Luxury Everyday Wear
              </p>


            </div>


          </div>



        </div>


      </div>





      {/* DOTS */}


      <div
        className="
        absolute
        bottom-5
        left-1/2
        -translate-x-1/2
        flex
        gap-2
        "
      >

        {
          slides.map((_,i)=>(

            <button
              key={i}
              onClick={()=>setActive(i)}
              className={`
              h-2
              rounded-full
              transition-all
              ${
                active===i
                ?"w-9 bg-[#D4AF37]"
                :"w-3 bg-black/20"
              }
              `}
            />

          ))
        }


      </div>



    </section>

  );

};



export default Hero;