import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useSearchParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { db } from "../firebase/config";

const initialStoreInfo = {
  storeName: "Off The Grid",
  address: "Sample Address, City, Philippines",
  contactNumber: "0912 345 6789",
  email: "offthegrid@email.com",
  businessHours: "Monday - Sunday | 9:00 AM - 8:00 PM",
  facebook: "Off The Grid",
  instagram: "@offthegrid",
};

const initialForm = {
  name: "",
  email: "",
  message: "",
};

export default function Contact() {
  const [searchParams] = useSearchParams();
  const [storeInfo, setStoreInfo] = useState(initialStoreInfo);
  const [formData, setFormData] = useState(initialForm);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inquiryDetails = {
    source: searchParams.get("source") || "contact-page",
    productId: searchParams.get("productId") || "",
    productName: searchParams.get("productName") || "",
    brand: searchParams.get("brand") || "",
    price: searchParams.get("price") || "",
    sizes: searchParams.get("sizes") || "",
  };

  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        const storeRef = doc(db, "storeInfo", "main");
        const storeSnap = await getDoc(storeRef);

        if (storeSnap.exists()) {
          setStoreInfo((prev) => ({
            ...prev,
            ...storeSnap.data(),
          }));
        }
      } catch (error) {
        console.error("Error fetching store info:", error);
      }
    };

    fetchStoreInfo();
  }, []);

  useEffect(() => {
    if (inquiryDetails.productName) {
      setFormData((prev) => ({
        ...prev,
        message:
          prev.message ||
          `Hi, I would like to inquire about ${inquiryDetails.productName}${
            inquiryDetails.sizes ? ` in size ${inquiryDetails.sizes}` : ""
          }. Is it available?`,
      }));
    }
  }, [inquiryDetails.productName, inquiryDetails.sizes]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatusMessage("Please fill in all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/inquiries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            message: formData.message,
            source: inquiryDetails.source,
            productId: inquiryDetails.productId,
            productName: inquiryDetails.productName,
            brand: inquiryDetails.brand,
            price: inquiryDetails.price,
            sizes: inquiryDetails.sizes,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setStatusMessage(result.message || "Failed to submit inquiry.");
        return;
      }

      setStatusMessage("Inquiry submitted successfully.");
      setFormData(initialForm);
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      setStatusMessage("Could not connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="px-6 py-10 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="panel-shadow border-2 border-black bg-[#ff6a00] p-6 text-white">
            <h1 className="text-4xl font-black uppercase">Contact</h1>
            <p className="mt-2 font-medium">
              Reach out for availability, product questions, or store inquiries.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div className="panel-shadow border-2 border-black bg-white p-6">
              <h2 className="text-2xl font-black uppercase">Send Inquiry</h2>

              {inquiryDetails.productName && (
                <div className="mt-5 border-2 border-black bg-[#f8f3e8] p-4">
                  <p className="text-xs font-black uppercase text-gray-500">
                    Product Inquiry
                  </p>
                  <h3 className="mt-2 text-xl font-black uppercase">
                    {inquiryDetails.productName}
                  </h3>
                  <p className="mt-2 text-sm text-gray-700">
                    Brand: <span className="font-bold">{inquiryDetails.brand || "N/A"}</span>
                  </p>
                  <p className="text-sm text-gray-700">
                    Price: <span className="font-bold">{inquiryDetails.price || "N/A"}</span>
                  </p>
                  <p className="text-sm text-gray-700">
                    Selected Size: <span className="font-bold">{inquiryDetails.sizes || "N/A"}</span>
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
                <div>
                  <label className="mb-2 block text-sm font-black uppercase">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border-2 border-black px-4 py-3 outline-none"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black uppercase">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border-2 border-black px-4 py-3 outline-none"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black uppercase">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className="w-full border-2 border-black px-4 py-3 outline-none"
                    placeholder="Write your message"
                  ></textarea>
                </div>

                {statusMessage && (
                  <p className="text-sm font-bold text-[#b60055]">
                    {statusMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="border-4 border-black bg-black px-6 py-3 font-black uppercase text-white transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Submitting..." : "Send Inquiry"}
                </button>
              </form>
            </div>

            <div className="panel-shadow border-2 border-black bg-white p-6">
              <h2 className="text-2xl font-black uppercase">Store Info</h2>

              <div className="mt-6 space-y-5 text-gray-700">
                <div>
                  <p className="text-xs font-black uppercase text-gray-500">
                    Store Name
                  </p>
                  <p className="mt-1 font-bold">{storeInfo.storeName}</p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase text-gray-500">
                    Address
                  </p>
                  <p className="mt-1 font-bold">{storeInfo.address}</p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase text-gray-500">
                    Contact Number
                  </p>
                  <p className="mt-1 font-bold">{storeInfo.contactNumber}</p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase text-gray-500">
                    Email
                  </p>
                  <p className="mt-1 font-bold">{storeInfo.email}</p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase text-gray-500">
                    Business Hours
                  </p>
                  <p className="mt-1 font-bold">{storeInfo.businessHours}</p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase text-gray-500">
                    Facebook
                  </p>
                  <p className="mt-1 font-bold">{storeInfo.facebook}</p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase text-gray-500">
                    Instagram
                  </p>
                  <p className="mt-1 font-bold">{storeInfo.instagram}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}