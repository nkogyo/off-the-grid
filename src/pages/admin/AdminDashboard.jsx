import { useState } from "react";
import Layout from "../../components/layout/Layout";

const sampleProducts = [
  {
    id: "1",
    name: "Air Max Pulse",
    brand: "Nike",
    price: 8995,
    tag: "Hot Drop",
  },
  {
    id: "2",
    name: "Samba OG",
    brand: "Adidas",
    price: 6795,
    tag: "Classic",
  },
  {
    id: "3",
    name: "RS-X",
    brand: "Puma",
    price: 5995,
    tag: "New",
  },
];

export default function AdminDashboard() {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    sizes: "",
    image: "",
    description: "",
    tag: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Product form data:", formData);
    alert("UI only for now. CRUD connection comes next.");
  };

  return (
    <Layout>
      <section className="px-6 py-10 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          {/* SIDEBAR */}
          <aside className="glow-pink border-4 border-black bg-white p-6">
            <h2 className="text-2xl font-black uppercase">Admin Panel</h2>
            <p className="mt-2 text-sm font-medium text-gray-600">
              Manage products, updates, and store details.
            </p>

            <div className="mt-8 space-y-3">
              <div className="border-2 border-black bg-[#b60055] px-4 py-3 font-bold uppercase text-white">
                Add Product
              </div>
              <div className="border-2 border-black bg-white px-4 py-3 font-bold uppercase">
                Inventory
              </div>
              <div className="border-2 border-black bg-white px-4 py-3 font-bold uppercase">
                Store Info
              </div>
              <div className="border-2 border-black bg-white px-4 py-3 font-bold uppercase">
                Updates
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <div className="space-y-8">
            {/* HEADER */}
            <div className="glow-pink border-4 border-black bg-[#b60055] p-6 text-white">
              <h1 className="text-4xl font-black uppercase">Admin Dashboard</h1>
              <p className="mt-2 font-medium">
                Add and manage sneaker products for the catalog.
              </p>
            </div>

            {/* FORM + PREVIEW */}
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.1fr_0.9fr]">
              {/* ADD PRODUCT FORM */}
              <div className="glow-pink border-4 border-black bg-white p-6">
                <h2 className="mb-6 text-2xl font-black uppercase">
                  Add Product
                </h2>

                <form onSubmit={handleSubmit} className="grid gap-5">
                  <div>
                    <label className="mb-2 block text-sm font-black uppercase">
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border-2 border-black px-4 py-3 outline-none"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-black uppercase">
                        Brand
                      </label>
                      <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        className="w-full border-2 border-black px-4 py-3 outline-none"
                        placeholder="Nike, Adidas, Puma..."
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-black uppercase">
                        Price
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full border-2 border-black px-4 py-3 outline-none"
                        placeholder="8995"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-black uppercase">
                      Sizes
                    </label>
                    <input
                      type="text"
                      name="sizes"
                      value={formData.sizes}
                      onChange={handleChange}
                      className="w-full border-2 border-black px-4 py-3 outline-none"
                      placeholder="Example: 7,8,9,10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-black uppercase">
                      Image URL
                    </label>
                    <input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      className="w-full border-2 border-black px-4 py-3 outline-none"
                      placeholder="Paste product image URL"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-black uppercase">
                      Tag
                    </label>
                    <input
                      type="text"
                      name="tag"
                      value={formData.tag}
                      onChange={handleChange}
                      className="w-full border-2 border-black px-4 py-3 outline-none"
                      placeholder="Hot Drop, New, Limited"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-black uppercase">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="5"
                      className="w-full border-2 border-black px-4 py-3 outline-none"
                      placeholder="Write product description"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="border-4 border-black bg-black px-6 py-3 font-black uppercase text-white transition hover:-translate-y-1"
                  >
                    Save Product
                  </button>
                </form>
              </div>

              {/* INVENTORY PREVIEW */}
              <div className="glow-pink border-4 border-black bg-white p-6">
                <h2 className="mb-6 text-2xl font-black uppercase">
                  Inventory Preview
                </h2>

                <div className="space-y-4">
                  {sampleProducts.map((product) => (
                    <div
                      key={product.id}
                      className="border-2 border-black bg-[#f8f3e8] p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-black uppercase">
                            {product.name}
                          </h3>
                          <p className="text-sm font-medium text-gray-600">
                            {product.brand}
                          </p>
                          <p className="mt-2 font-bold text-[#b60055]">
                            ₱{product.price.toLocaleString()}
                          </p>
                        </div>

                        <span className="border-2 border-black bg-[#b60055] px-2 py-1 text-xs font-bold uppercase text-white">
                          {product.tag}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}