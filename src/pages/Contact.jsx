import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useSearchParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { db } from "../firebase/config";

export default function Contact() {
  const [searchParams] = useSearchParams();

  const [storeInfo, setStoreInfo] = useState({
    storeName: "Off The Grid",
    email: "",
    contactNumber: "",
    address: "",
    businessHours: "",
    facebook: "",
    instagram: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loadingStoreInfo, setLoadingStoreInfo] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        setLoadingStoreInfo(true);
        const storeRef = doc(db, "storeInfo", "main");
        const storeSnap = await getDoc(storeRef);

        if (storeSnap.exists()) {
          const data = storeSnap.data();

          setStoreInfo((prev) => ({
            ...prev,
            ...data,
            // fallback support in case older docs used different field names
            contactNumber:
              data.contactNumber || data.phone || prev.contactNumber,
            businessHours:
              data.businessHours || data.hours || prev.businessHours,
          }));
        }
      } catch (error) {
        console.error("Error fetching store info:", error);
      } finally {
        setLoadingStoreInfo(false);
      }
    };

    fetchStoreInfo();
  }, []);

  useEffect(() => {
    const productName = searchParams.get("productName") || "";
    const brand = searchParams.get("brand") || "";
    const sizes = searchParams.get("sizes") || "";
    const price = searchParams.get("price") || "";

    if (productName || brand || sizes || price) {
      const generatedMessage = `Hi! I want to check the availability of this sneaker:

Product: ${productName || "N/A"}
Brand: ${brand || "N/A"}
Price: ${price || "N/A"}
Sizes Listed: ${sizes || "N/A"}

Please let me know if this is currently available.`;

      setFormData((prev) => ({
        ...prev,
        message: prev.message?.trim() ? prev.message : generatedMessage,
      }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await addDoc(collection(db, "contactMessages"), {
        ...formData,
        source: searchParams.get("source") || "contact-page",
        productId: searchParams.get("productId") || "",
        productName: searchParams.get("productName") || "",
        brand: searchParams.get("brand") || "",
        sizes: searchParams.get("sizes") || "",
        price: searchParams.get("price") || "",
        createdAt: serverTimestamp(),
      });

      setSuccessMessage("Your message has been sent successfully.");
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setErrorMessage("Something went wrong while sending your message.");
    } finally {
      setSubmitting(false);
    }
  };

  const inquiryProductName = searchParams.get("productName") || "";
  const inquiryBrand = searchParams.get("brand") || "";
  const inquirySizes = searchParams.get("sizes") || "";
  const inquiryPrice = searchParams.get("price") || "";

  return (
    <Layout>
      <section className="px-6 py-10 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="border-4 border-black bg-[#ff6b57] p-8 text-white shadow-[8px_8px_0px_#000]">
            <p className="mb-3 text-sm font-black uppercase tracking-[0.2em]">
              Get In Touch
            </p>
            <h1 className="text-4xl font-black uppercase leading-none md:text-6xl">
              Contact Us
            </h1>
            <p className="mt-4 max-w-3xl text-base font-medium leading-7 md:text-lg">
              Have a sneaker inquiry, availability check, or store question?
              Send a message to {storeInfo.storeName || "Off The Grid"} and
              we’ll get back to you.
            </p>
          </div>

          {(inquiryProductName || inquiryBrand || inquirySizes || inquiryPrice) && (
            <div className="glow-pink border-4 border-black bg-white p-6 shadow-[8px_8px_0px_#000]">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#b60055]">
                Availability Inquiry
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="border-2 border-black bg-[#f8f3e8] p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-500">
                    Product
                  </p>
                  <p className="mt-2 text-sm font-bold text-black">
                    {inquiryProductName || "N/A"}
                  </p>
                </div>

                <div className="border-2 border-black bg-[#f8f3e8] p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-500">
                    Brand
                  </p>
                  <p className="mt-2 text-sm font-bold text-black">
                    {inquiryBrand || "N/A"}
                  </p>
                </div>

                <div className="border-2 border-black bg-[#f8f3e8] p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-500">
                    Price
                  </p>
                  <p className="mt-2 text-sm font-bold text-black">
                    {inquiryPrice || "N/A"}
                  </p>
                </div>

                <div className="border-2 border-black bg-[#f8f3e8] p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-500">
                    Sizes
                  </p>
                  <p className="mt-2 text-sm font-bold text-black">
                    {inquirySizes || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="glow-pink border-4 border-black bg-white p-8 shadow-[8px_8px_0px_#000]">
              <h2 className="mb-6 text-2xl font-black uppercase">
                Send a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-black uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full border-4 border-black px-4 py-3 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full border-4 border-black px-4 py-3 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black uppercase tracking-wider">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="8"
                    placeholder="Write your message"
                    className="w-full border-4 border-black px-4 py-3 outline-none"
                    required
                  ></textarea>
                </div>

                {successMessage && (
                  <div className="border-2 border-black bg-[#c1ff72] px-4 py-3 font-bold text-black">
                    {successMessage}
                  </div>
                )}

                {errorMessage && (
                  <div className="border-2 border-black bg-[#ffb3b3] px-4 py-3 font-bold text-black">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="border-4 border-black bg-black px-6 py-3 font-black uppercase text-white transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? "Sending..." : "Send Inquiry"}
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="glow-pink border-4 border-black bg-white p-8 shadow-[8px_8px_0px_#000]">
                <h2 className="mb-6 text-2xl font-black uppercase">
                  Store Information
                </h2>

                {loadingStoreInfo ? (
                  <div className="space-y-4">
                    <div className="h-5 w-2/3 animate-pulse bg-gray-200" />
                    <div className="h-5 w-1/2 animate-pulse bg-gray-200" />
                    <div className="h-5 w-3/4 animate-pulse bg-gray-200" />
                    <div className="h-5 w-2/5 animate-pulse bg-gray-200" />
                  </div>
                ) : (
                  <div className="space-y-4 text-base font-medium">
                    <div>
                      <p className="text-sm font-black uppercase tracking-wider">
                        Store Name
                      </p>
                      <p>{storeInfo.storeName || "Off The Grid"}</p>
                    </div>

                    <div>
                      <p className="text-sm font-black uppercase tracking-wider">
                        Email
                      </p>
                      <p>{storeInfo.email || "Not set yet"}</p>
                    </div>

                    <div>
                      <p className="text-sm font-black uppercase tracking-wider">
                        Contact Number
                      </p>
                      <p>{storeInfo.contactNumber || "Not set yet"}</p>
                    </div>

                    <div>
                      <p className="text-sm font-black uppercase tracking-wider">
                        Address
                      </p>
                      <p>{storeInfo.address || "Not set yet"}</p>
                    </div>

                    <div>
                      <p className="text-sm font-black uppercase tracking-wider">
                        Business Hours
                      </p>
                      <p>{storeInfo.businessHours || "Not set yet"}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="glow-pink border-4 border-black bg-white p-8 shadow-[8px_8px_0px_#000]">
                <h2 className="mb-6 text-2xl font-black uppercase">
                  Follow Updates
                </h2>

                <p className="mb-4 leading-7 text-gray-700">
                  Follow the store for updates on newly added products, featured
                  drops, and sneaker releases.
                </p>

                <div className="space-y-3 font-bold">
                  <p>Facebook: {storeInfo.facebook || "Not set yet"}</p>
                  <p>Instagram: {storeInfo.instagram || "Not set yet"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}