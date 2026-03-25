import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, "products", id);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const productData = {
            id: productSnap.id,
            ...productSnap.data(),
          };

          setProduct(productData);
          setSelectedImage(productData.image || "");
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleCheckAvailability = () => {
    if (!product) return;

    const inquiryParams = new URLSearchParams({
      source: "product-details",
      productId: product.id,
      productName: product.name || "",
      brand: product.brand || "",
      price: product.price ? `₱${Number(product.price).toLocaleString()}` : "",
      sizes: selectedSize ? String(selectedSize) : "No size selected",
    });

    navigate(`/contact?${inquiryParams.toString()}`);
  };

  if (loading) {
    return (
      <Layout>
        <section className="px-6 py-10 md:px-10 lg:px-16">
          <div className="mx-auto max-w-7xl border-4 border-black bg-white p-10">
            <h1 className="text-3xl font-black uppercase">Loading product...</h1>
          </div>
        </section>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <section className="px-6 py-10 md:px-10 lg:px-16">
          <div className="mx-auto max-w-7xl border-4 border-black bg-white p-10">
            <h1 className="text-3xl font-black uppercase">Product not found</h1>
            <Link
              to="/catalog"
              className="mt-4 inline-block border-2 border-black bg-white px-4 py-2 font-bold uppercase"
            >
              Back to Catalog
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="px-6 py-10 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="panel-shadow border-2 border-black bg-white p-6">
              <img
                src={`${selectedImage || product.image}?auto=format&fit=crop&w=900&q=80`}
                alt={product.name}
                className="h-[400px] w-full object-contain"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[product.image, ...(product.images || [])]
                .filter(Boolean)
                .filter((img, index, arr) => arr.indexOf(img) === index)
                .map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`border-2 p-2 ${
                      selectedImage === img
                        ? "border-[#ff0a7a] bg-[#ffe3f1]"
                        : "border-black bg-white"
                    }`}
                  >
                    <img
                      src={`${img}?auto=format&fit=crop&w=400&q=80`}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="h-[80px] w-full object-contain"
                    />
                  </button>
                ))}
            </div>
          </div>

          <div className="flex flex-col">
            <p className="section-kicker">{product.brand}</p>

            <h1 className="mt-2 text-4xl font-black uppercase md:text-5xl">
              {product.name}
            </h1>

            <p className="mt-4 text-2xl font-bold text-[#ff0a7a]">
              ₱{Number(product.price).toLocaleString()}
            </p>

            <p className="mt-6 text-gray-700 leading-relaxed">
              {product.description}
            </p>

            <div className="mt-8">
              <h3 className="mb-3 font-black uppercase">Select Size</h3>

              <div className="flex flex-wrap gap-3">
                {(product.sizes || []).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`border-2 px-4 py-2 font-bold transition ${
                      selectedSize === size
                        ? "border-black bg-[#ff0a7a] text-white shadow-[3px_3px_0_#000]"
                        : "border-black bg-white hover:-translate-y-0.5"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <p className="mt-3 text-sm font-medium text-gray-600">
                {selectedSize ? `Selected size: ${selectedSize}` : "No size selected yet"}
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={handleCheckAvailability}
                className="card-hover border-4 border-black bg-black px-6 py-3 font-bold uppercase text-white"
              >
                Check Availability
              </button>

              <Link
                to="/catalog"
                className="card-hover border-4 border-black bg-white px-6 py-3 font-bold uppercase"
              >
                Back
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}