import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";

const initialFormData = {
  name: "",
  brand: "",
  price: "",
  sizes: "",
  image: "",
  description: "",
  tag: "",
};

export default function AdminDashboard() {
  const [formData, setFormData] = useState(initialFormData);
  const [products, setProducts] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editingProductId, setEditingProductId] = useState(null);

  const fetchProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, "products"));
      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setMessage("Failed to load products.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingProductId(null);
  };

  const parseSizes = (sizesText) => {
    return sizesText
      .split(",")
      .map((size) => Number(size.trim()))
      .filter((size) => !Number.isNaN(size));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const trimmedName = formData.name.trim();
    const trimmedBrand = formData.brand.trim();
    const trimmedImage = formData.image.trim();
    const trimmedDescription = formData.description.trim();
    const trimmedTag = formData.tag.trim();

    if (
      !trimmedName ||
      !trimmedBrand ||
      !formData.price ||
      !formData.sizes.trim() ||
      !trimmedImage ||
      !trimmedDescription
    ) {
      setMessage("Please fill in all required fields.");
      return;
    }

    const parsedSizes = parseSizes(formData.sizes);

    if (parsedSizes.length === 0) {
      setMessage("Sizes must be valid numbers separated by commas.");
      return;
    }

    const payload = {
      name: trimmedName,
      brand: trimmedBrand,
      price: Number(formData.price),
      sizes: parsedSizes,
      image: trimmedImage,
      description: trimmedDescription,
      tag: trimmedTag,
    };

    try {
      setIsSaving(true);

      if (editingProductId) {
        await updateDoc(doc(db, "products", editingProductId), payload);
        setMessage("Product updated successfully.");
      } else {
        await addDoc(collection(db, "products"), payload);
        setMessage("Product saved successfully.");
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      setMessage("Failed to save product.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProductId(product.id);
    setFormData({
      name: product.name || "",
      brand: product.brand || "",
      price: product.price ?? "",
      sizes: Array.isArray(product.sizes) ? product.sizes.join(",") : "",
      image: product.image || "",
      description: product.description || "",
      tag: product.tag || "",
    });
    setMessage(`Editing "${product.name}"`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (productId, productName) => {
    const confirmed = window.confirm(
      `Delete "${productName}" from inventory?`
    );

    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "products", productId));
      setMessage("Product deleted successfully.");

      if (editingProductId === productId) {
        resetForm();
      }

      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      setMessage("Failed to delete product.");
    }
  };

  return (
    <Layout>
      <section className="px-6 py-10 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="glow-pink border-4 border-black bg-white p-6">
            <h2 className="text-2xl font-black uppercase">Admin Panel</h2>
            <p className="mt-2 text-sm font-medium text-gray-600">
              Manage products, updates, and store details.
            </p>

            <div className="mt-8 space-y-3">
              <div className="border-2 border-black bg-[#b60055] px-4 py-3 font-bold uppercase text-white">
                {editingProductId ? "Edit Product" : "Add Product"}
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

          <div className="space-y-8">
            <div className="glow-pink border-4 border-black bg-[#b60055] p-6 text-white">
              <h1 className="text-4xl font-black uppercase">Admin Dashboard</h1>
              <p className="mt-2 font-medium">
                Add, update, and manage sneaker products for the catalog.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="glow-pink border-4 border-black bg-white p-6">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <h2 className="text-2xl font-black uppercase">
                    {editingProductId ? "Edit Product" : "Add Product"}
                  </h2>

                  {editingProductId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="border-2 border-black bg-white px-4 py-2 text-sm font-black uppercase hover:-translate-y-0.5 transition"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

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

                  {message && (
                    <p className="text-sm font-bold text-[#b60055]">{message}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="border-4 border-black bg-black px-6 py-3 font-black uppercase text-white transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSaving
                      ? editingProductId
                        ? "Updating..."
                        : "Saving..."
                      : editingProductId
                      ? "Update Product"
                      : "Save Product"}
                  </button>
                </form>
              </div>

              <div className="glow-pink border-4 border-black bg-white p-6">
                <h2 className="mb-6 text-2xl font-black uppercase">
                  Inventory Preview
                </h2>

                <div className="space-y-4">
                  {products.length === 0 ? (
                    <p className="text-gray-600">No products yet.</p>
                  ) : (
                    products.map((product) => (
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
                              ₱{Number(product.price).toLocaleString()}
                            </p>
                          </div>

                          {product.tag && (
                            <span className="border-2 border-black bg-[#b60055] px-2 py-1 text-xs font-bold uppercase text-white">
                              {product.tag}
                            </span>
                          )}
                        </div>

                        <div className="mt-4 flex gap-3">
                          <button
                            type="button"
                            onClick={() => handleEdit(product)}
                            className="border-2 border-black bg-white px-4 py-2 text-sm font-black uppercase hover:-translate-y-0.5 transition"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(product.id, product.name)
                            }
                            className="border-2 border-black bg-black px-4 py-2 text-sm font-black uppercase text-white hover:-translate-y-0.5 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}