import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../../firebase/config";

const initialFormData = {
  name: "",
  brand: "",
  price: "",
  sizes: "",
  image: "",
  description: "",
  tag: "",
  isNewArrival: false,
};

const initialStoreInfo = {
  storeName: "Off The Grid",
  address: "Sample Address, City, Philippines",
  contactNumber: "0912 345 6789",
  email: "offthegrid@email.com",
  businessHours: "Monday - Sunday | 9:00 AM - 8:00 PM",
  facebook: "Off The Grid",
  instagram: "@offthegrid",
  ownerImageUrl: "",
};

const initialUpdateForm = {
  title: "",
  content: "",
  image: "",
};

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("add-product");

  const [formData, setFormData] = useState(initialFormData);
  const [products, setProducts] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editingProductId, setEditingProductId] = useState(null);

  const [storeInfo, setStoreInfo] = useState(initialStoreInfo);
  const [storeMessage, setStoreMessage] = useState("");
  const [isSavingStoreInfo, setIsSavingStoreInfo] = useState(false);

  const [updateForm, setUpdateForm] = useState(initialUpdateForm);
  const [updates, setUpdates] = useState([]);
  const [updatesMessage, setUpdatesMessage] = useState("");
  const [isSavingUpdate, setIsSavingUpdate] = useState(false);

  const [brands, setBrands] = useState([]);
  const [brandName, setBrandName] = useState("");
  const [brandMessage, setBrandMessage] = useState("");
  const [isSavingBrand, setIsSavingBrand] = useState(false);

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

  const fetchStoreInfo = async () => {
    try {
      setStoreMessage("");
      const storeRef = doc(db, "storeInfo", "main");
      const storeSnap = await getDoc(storeRef);

      if (storeSnap.exists()) {
        setStoreInfo((prev) => ({
          ...prev,
          ...storeSnap.data(),
        }));
      } else {
        await setDoc(storeRef, initialStoreInfo);
        setStoreInfo(initialStoreInfo);
      }
    } catch (error) {
      console.error("Error fetching store info:", error);
      setStoreMessage(`Failed to load store information: ${error.message}`);
    }
  };

  const fetchUpdates = async () => {
    try {
      const updatesQuery = query(
        collection(db, "updates"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(updatesQuery);
      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));
      setUpdates(data);
    } catch (error) {
      console.error("Error fetching updates:", error);
      setUpdatesMessage("Failed to load updates.");
    }
  };

  const fetchBrands = async () => {
    try {
      const snapshot = await getDocs(collection(db, "brands"));
      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));
      setBrands(data);
    } catch (error) {
      console.error("Error fetching brands:", error);
      setBrandMessage("Failed to load brands.");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchStoreInfo();
    fetchUpdates();
    fetchBrands();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
      isNewArrival: Boolean(formData.isNewArrival),
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
      setActiveSection("inventory");
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
      isNewArrival: Boolean(product.isNewArrival),
    });
    setMessage(`Editing "${product.name}"`);
    setActiveSection("add-product");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (productId, productName) => {
    const confirmed = window.confirm(`Delete "${productName}" from inventory?`);
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

  const handleToggleNewArrival = async (product) => {
    try {
      await updateDoc(doc(db, "products", product.id), {
        isNewArrival: !Boolean(product.isNewArrival),
      });
      fetchProducts();
    } catch (error) {
      console.error("Error toggling new arrival:", error);
      setMessage("Failed to update new arrival status.");
    }
  };

  const handleStoreInfoChange = (e) => {
    const { name, value } = e.target;
    setStoreInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStoreInfoSubmit = async (e) => {
    e.preventDefault();
    setStoreMessage("");

    try {
      setIsSavingStoreInfo(true);

      const payload = {
        storeName: storeInfo.storeName.trim(),
        address: storeInfo.address.trim(),
        contactNumber: storeInfo.contactNumber.trim(),
        email: storeInfo.email.trim(),
        businessHours: storeInfo.businessHours.trim(),
        facebook: storeInfo.facebook.trim(),
        instagram: storeInfo.instagram.trim(),
        ownerImageUrl: storeInfo.ownerImageUrl.trim(),
      };

      await setDoc(doc(db, "storeInfo", "main"), payload);
      setStoreInfo(payload);
      setStoreMessage("Store information saved successfully.");
    } catch (error) {
      console.error("Error saving store info:", error);
      setStoreMessage(`Failed to save store information: ${error.message}`);
    } finally {
      setIsSavingStoreInfo(false);
    }
  };

  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdatesMessage("");

    const trimmedTitle = updateForm.title.trim();
    const trimmedContent = updateForm.content.trim();
    const trimmedImage = updateForm.image.trim();

    if (!trimmedTitle || !trimmedContent) {
      setUpdatesMessage("Please fill in the update title and content.");
      return;
    }

    try {
      setIsSavingUpdate(true);

      await addDoc(collection(db, "updates"), {
        title: trimmedTitle,
        content: trimmedContent,
        image: trimmedImage,
        createdAt: Date.now(),
      });

      setUpdateForm(initialUpdateForm);
      setUpdatesMessage("Update posted successfully.");
      fetchUpdates();
    } catch (error) {
      console.error("Error posting update:", error);
      setUpdatesMessage("Failed to post update.");
    } finally {
      setIsSavingUpdate(false);
    }
  };

  const handleDeleteUpdate = async (updateId, updateTitle) => {
    const confirmed = window.confirm(`Delete update "${updateTitle}"?`);
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "updates", updateId));
      setUpdatesMessage("Update deleted successfully.");
      fetchUpdates();
    } catch (error) {
      console.error("Error deleting update:", error);
      setUpdatesMessage("Failed to delete update.");
    }
  };

  const handleBrandSubmit = async (e) => {
    e.preventDefault();
    setBrandMessage("");

    const trimmedName = brandName.trim();

    if (!trimmedName) {
      setBrandMessage("Please enter a brand name.");
      return;
    }

    const alreadyExists = brands.some(
      (brand) => brand.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (alreadyExists) {
      setBrandMessage("That brand already exists.");
      return;
    }

    try {
      setIsSavingBrand(true);
      await addDoc(collection(db, "brands"), {
        name: trimmedName,
      });
      setBrandName("");
      setBrandMessage("Brand added successfully.");
      fetchBrands();
    } catch (error) {
      console.error("Error adding brand:", error);
      setBrandMessage("Failed to add brand.");
    } finally {
      setIsSavingBrand(false);
    }
  };

  const handleDeleteBrand = async (brandId, brandNameValue) => {
    const confirmed = window.confirm(`Delete brand "${brandNameValue}"?`);
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "brands", brandId));
      setBrandMessage("Brand deleted successfully.");
      fetchBrands();
    } catch (error) {
      console.error("Error deleting brand:", error);
      setBrandMessage("Failed to delete brand.");
    }
  };

  const renderSidebarButton = (id, label) => {
    const isActive = activeSection === id;

    return (
      <button
        type="button"
        onClick={() => setActiveSection(id)}
        className={`w-full border-2 border-black px-4 py-3 text-left font-bold uppercase transition ${
          isActive ? "bg-[#b60055] text-white" : "bg-white hover:-translate-y-0.5"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <Layout>
      <section className="px-6 py-10 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="glow-pink border-4 border-black bg-white p-6">
            <h2 className="text-2xl font-black uppercase">Admin Panel</h2>
            <p className="mt-2 text-sm font-medium text-gray-600">
              Manage products, updates, store details, and brands.
            </p>

            <div className="mt-8 space-y-3">
              {renderSidebarButton("add-product", "Add Product")}
              {renderSidebarButton("inventory", "Inventory")}
              {renderSidebarButton("store-info", "Store Info")}
              {renderSidebarButton("updates", "Updates")}
              {renderSidebarButton("brands", "Brands")}
            </div>
          </aside>

          <div className="space-y-8">
            <div className="glow-pink border-4 border-black bg-[#b60055] p-6 text-white">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-4xl font-black uppercase">
                    Admin Dashboard
                  </h1>
                  <p className="mt-2 font-medium">
                    Manage products, inventory, store details, updates, and brands.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-fit border-2 border-black bg-white px-4 py-2 font-black uppercase text-black hover:-translate-y-0.5 transition"
                >
                  Logout
                </button>
              </div>
            </div>

            {activeSection === "add-product" && (
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

                  <label className="flex items-center gap-3 border-2 border-black bg-[#f8f3e8] px-4 py-3 font-black uppercase">
                    <input
                      type="checkbox"
                      name="isNewArrival"
                      checked={formData.isNewArrival}
                      onChange={handleChange}
                      className="h-4 w-4"
                    />
                    Mark as New Arrival
                  </label>

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
            )}

            {activeSection === "inventory" && (
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
                            <div className="mb-2 flex flex-wrap gap-2">
                              {product.tag && (
                                <span className="border-2 border-black bg-[#b60055] px-2 py-1 text-xs font-bold uppercase text-white">
                                  {product.tag}
                                </span>
                              )}
                              {product.isNewArrival && (
                                <span className="border-2 border-black bg-[#c1ff72] px-2 py-1 text-xs font-bold uppercase text-black">
                                  New Arrival
                                </span>
                              )}
                            </div>

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
                        </div>

                        <div className="mt-4 flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => handleEdit(product)}
                            className="border-2 border-black bg-white px-4 py-2 text-sm font-black uppercase hover:-translate-y-0.5 transition"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(product.id, product.name)}
                            className="border-2 border-black bg-black px-4 py-2 text-sm font-black uppercase text-white hover:-translate-y-0.5 transition"
                          >
                            Delete
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleNewArrival(product)}
                            className="border-2 border-black bg-white px-4 py-2 text-sm font-black uppercase hover:-translate-y-0.5 transition"
                          >
                            {product.isNewArrival
                              ? "Remove from New Arrivals"
                              : "Mark as New Arrival"}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeSection === "store-info" && (
              <div className="glow-pink border-4 border-black bg-white p-6">
                <h2 className="mb-6 text-2xl font-black uppercase">Store Info</h2>

                <form onSubmit={handleStoreInfoSubmit} className="grid gap-5">
                  <div>
                    <label className="mb-2 block text-sm font-black uppercase">
                      Store Name
                    </label>
                    <input
                      type="text"
                      name="storeName"
                      value={storeInfo.storeName}
                      onChange={handleStoreInfoChange}
                      className="w-full border-2 border-black px-4 py-3 outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-black uppercase">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={storeInfo.address}
                      onChange={handleStoreInfoChange}
                      className="w-full border-2 border-black px-4 py-3 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-black uppercase">
                        Contact Number
                      </label>
                      <input
                        type="text"
                        name="contactNumber"
                        value={storeInfo.contactNumber}
                        onChange={handleStoreInfoChange}
                        className="w-full border-2 border-black px-4 py-3 outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-black uppercase">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={storeInfo.email}
                        onChange={handleStoreInfoChange}
                        className="w-full border-2 border-black px-4 py-3 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-black uppercase">
                      Business Hours
                    </label>
                    <input
                      type="text"
                      name="businessHours"
                      value={storeInfo.businessHours}
                      onChange={handleStoreInfoChange}
                      className="w-full border-2 border-black px-4 py-3 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-black uppercase">
                        Facebook
                      </label>
                      <input
                        type="text"
                        name="facebook"
                        value={storeInfo.facebook}
                        onChange={handleStoreInfoChange}
                        className="w-full border-2 border-black px-4 py-3 outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-black uppercase">
                        Instagram
                      </label>
                      <input
                        type="text"
                        name="instagram"
                        value={storeInfo.instagram}
                        onChange={handleStoreInfoChange}
                        className="w-full border-2 border-black px-4 py-3 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-black uppercase">
                      Owner Image URL
                    </label>
                    <input
                      type="text"
                      name="ownerImageUrl"
                      value={storeInfo.ownerImageUrl}
                      onChange={handleStoreInfoChange}
                      className="w-full border-2 border-black px-4 py-3 outline-none"
                      placeholder="Paste image URL for owner picture"
                    />
                  </div>

                  {storeInfo.ownerImageUrl && (
                    <div>
                      <p className="mb-2 text-sm font-black uppercase">
                        Image Preview
                      </p>
                      <img
                        src={storeInfo.ownerImageUrl}
                        alt="Owner preview"
                        className="h-56 w-full max-w-sm border-2 border-black object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  {storeMessage && (
                    <p className="text-sm font-bold text-[#b60055]">
                      {storeMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSavingStoreInfo}
                    className="border-4 border-black bg-black px-6 py-3 font-black uppercase text-white transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSavingStoreInfo ? "Saving..." : "Save Store Info"}
                  </button>
                </form>
              </div>
            )}

            {activeSection === "updates" && (
              <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_1fr]">
                <div className="glow-pink border-4 border-black bg-white p-6">
                  <h2 className="mb-6 text-2xl font-black uppercase">
                    Post Update
                  </h2>

                  <form onSubmit={handleUpdateSubmit} className="grid gap-5">
                    <div>
                      <label className="mb-2 block text-sm font-black uppercase">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={updateForm.title}
                        onChange={handleUpdateFormChange}
                        className="w-full border-2 border-black px-4 py-3 outline-none"
                        placeholder="Enter update title"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-black uppercase">
                        Content
                      </label>
                      <textarea
                        name="content"
                        value={updateForm.content}
                        onChange={handleUpdateFormChange}
                        rows="5"
                        className="w-full border-2 border-black px-4 py-3 outline-none"
                        placeholder="Write your update"
                      ></textarea>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-black uppercase">
                        Image URL
                      </label>
                      <input
                        type="text"
                        name="image"
                        value={updateForm.image}
                        onChange={handleUpdateFormChange}
                        className="w-full border-2 border-black px-4 py-3 outline-none"
                        placeholder="Optional image URL"
                      />
                    </div>

                    {updatesMessage && (
                      <p className="text-sm font-bold text-[#b60055]">
                        {updatesMessage}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isSavingUpdate}
                      className="border-4 border-black bg-black px-6 py-3 font-black uppercase text-white transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSavingUpdate ? "Posting..." : "Post Update"}
                    </button>
                  </form>
                </div>

                <div className="glow-pink border-4 border-black bg-white p-6">
                  <h2 className="mb-6 text-2xl font-black uppercase">
                    Recent Updates
                  </h2>

                  <div className="space-y-4">
                    {updates.length === 0 ? (
                      <p className="text-gray-600">No updates yet.</p>
                    ) : (
                      updates.map((item) => (
                        <div
                          key={item.id}
                          className="border-2 border-black bg-[#f8f3e8] p-4"
                        >
                          <h3 className="text-lg font-black uppercase">
                            {item.title}
                          </h3>
                          <p className="mt-2 text-gray-700">{item.content}</p>
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="mt-4 h-40 w-full border-2 border-black object-cover"
                            />
                          )}

                          <div className="mt-4">
                            <button
                              type="button"
                              onClick={() => handleDeleteUpdate(item.id, item.title)}
                              className="border-2 border-black bg-black px-4 py-2 text-sm font-black uppercase text-white hover:-translate-y-0.5 transition"
                            >
                              Delete Update
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeSection === "brands" && (
              <div className="glow-pink border-4 border-black bg-white p-6">
                <h2 className="mb-6 text-2xl font-black uppercase">
                  Manage Brands
                </h2>

                <form onSubmit={handleBrandSubmit} className="mb-6 flex flex-col gap-4 md:flex-row">
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Enter brand name (Nike, Adidas...)"
                    className="flex-1 border-2 border-black px-4 py-3 outline-none"
                  />

                  <button
                    type="submit"
                    disabled={isSavingBrand}
                    className="border-4 border-black bg-black px-6 py-3 font-black uppercase text-white transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSavingBrand ? "Adding..." : "Add Brand"}
                  </button>
                </form>

                {brandMessage && (
                  <p className="mb-4 text-sm font-bold text-[#b60055]">
                    {brandMessage}
                  </p>
                )}

                <div className="flex flex-wrap gap-3">
                  {brands.length === 0 ? (
                    <p className="text-gray-600">No brands yet.</p>
                  ) : (
                    brands.map((brand) => (
                      <div
                        key={brand.id}
                        className="flex items-center gap-2 border-2 border-black bg-[#f8f3e8] px-4 py-2"
                      >
                        <span className="font-bold uppercase">{brand.name}</span>

                        <button
                          type="button"
                          onClick={() => handleDeleteBrand(brand.id, brand.name)}
                          className="border border-black bg-black px-2 py-1 text-xs font-bold uppercase text-white"
                        >
                          X
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}