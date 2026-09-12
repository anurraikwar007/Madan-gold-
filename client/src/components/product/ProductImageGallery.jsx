import { useMemo, useState } from "react";

const getImageUrl = (image) => {
  if (!image) return "";
  if (typeof image === "string") return image;
  return image.url || image.secure_url || image.src || "";
};

const ProductImageGallery = ({ product }) => {
  const images = useMemo(() => {
    const rawImages = [
      ...(Array.isArray(product?.images) ? product.images : []),
      product?.image,
      product?.hoverImage,
      ...(Array.isArray(product?.gallery) ? product.gallery : []),
    ];

    return [...new Set(rawImages.map(getImageUrl).filter(Boolean))];
  }, [product]);

  const [selectedImage, setSelectedImage] = useState("");

  const activeImage = images.includes(selectedImage) ? selectedImage : images[0] || "/placeholder.png";

  return (
    <div>
      <div className="rounded-[2rem] overflow-hidden bg-white border border-black/5">
        <img
          src={activeImage}
          alt={product?.name || "Product"}
          loading="eager"
          decoding="async"
          width="900"
          height="1125"
          onError={(event) => {
            if (event.currentTarget.src.endsWith("/placeholder.png")) return;
            event.currentTarget.src = "/placeholder.png";
          }}
          className="w-full aspect-[4/5] object-cover hover:scale-105 transition-all duration-700"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 mt-5 overflow-x-auto pb-1">
          {images.map((img, index) => (
            <button
              type="button"
              key={`${img}-${index}`}
              onClick={() => setSelectedImage(img)}
              aria-label={`View product image ${index + 1}`}
              className={`min-w-[85px] h-[100px] rounded-xl overflow-hidden border-2 ${activeImage === img ? "border-[#DDAED3]" : "border-transparent"}`}
            >
              <img
                src={img}
                alt=""
                loading="lazy"
                decoding="async"
                width="170"
                height="200"
                onError={(event) => { event.currentTarget.src = "/placeholder.png"; }}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
