import { useState } from "react";

const Admin = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    material: "",
    image: "",
  });

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const addProduct = () => {
    if (!product.name || !product.price) {
      alert("Fill required fields");
      return;
    }

    const old =
      JSON.parse(localStorage.getItem("products")) || [];

    const newProduct = {
      ...product,
      id: Date.now(),
      price: Number(product.price),
    };

    localStorage.setItem(
      "products",
      JSON.stringify([newProduct, ...old])
    );

    alert("Product Added 🚀");

    setProduct({
      name: "",
      price: "",
      material: "",
      image: "",
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-28 px-4">

      <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl">

        <h1 className="text-2xl font-bold mb-6">
          Admin Panel 🧠
        </h1>

        <div className="space-y-4">

          <input
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full border p-3 rounded-xl"
          />

          <input
            name="price"
            value={product.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full border p-3 rounded-xl"
          />

          <input
            name="material"
            value={product.material}
            onChange={handleChange}
            placeholder="Material"
            className="w-full border p-3 rounded-xl"
          />

          <input
            name="image"
            value={product.image}
            onChange={handleChange}
            placeholder="Image URL"
            className="w-full border p-3 rounded-xl"
          />

          <button
            onClick={addProduct}
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-[#D4AF37] hover:text-black transition"
          >
            Add Product
          </button>

        </div>

      </div>

    </div>
  );
};

export default Admin;