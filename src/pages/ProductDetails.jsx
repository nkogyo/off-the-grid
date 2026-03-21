import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import Layout from "../components/layout/Layout";
import { db } from "../firebase/config";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = {
            id: docSnap.id,
            ...docSnap.data(),
          };

          setProduct(data);
          setSelectedImage(data.image || "");
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="px-6 py-10 md:px-10 lg:px-16">
          <div className="mx-auto max-w-7xl border-4 border-black bg-white p-10 shadow-[6px_6px_0px_#000]">
            <h1 className="text-3xl font-black uppercase">Loading product...</h1>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="px-6 py-10 md:px-10 lg:px-16">
          <div className="mx-auto max-w-7xl border-4 border-black bg-white p-10 shadow-[6px_6px_0px_#000]">
            <h1 className="text-3xl font-black uppercase">Product not found</h1>
            <Link
              to="/catalog"
              className="mt-4 inline-block border-4 border-black bg-white px-6 py-3 font-bold hover:-translate-y-1 transition"
            >
              Back to catalog
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const displayImages = product.images?.length
    ? product.images
    : product.image
    ? [product.image]
    : [];

  const mainImage = selectedImage || displayImages[0] || "";

  return (
    <Layout>
      <section className="px-6 py-10 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="glow-pink border-4 border-black bg-white p-6">
              {mainImage ? (
                <img
                  src={`${mainImage}?auto=format&fit=crop&w=900&q=80`}
                  alt={product.name}
                  className="h-[400px] w-full object-contain"
                />
              ) : (
                <div className="flex h-[400px] items-center justify-center font-bold uppercase text-gray-500">
                  No image available
                </div>
              )}
            </div>

            {displayImages.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {displayImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`border-2 border-black bg-white p-2 transition ${
                      selectedImage === img ? "glow-pink" : "hover:-translate-y-1"
                    }`}
                  >
                    <img
                      src={`${img}?auto=format&fit=crop&w=400&q=80`}
                      alt={`${product.name} ${index + 1}`}
                      className="h-[80px] w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="glow-pink flex flex-col border-4 border-black bg-white p-8">
            <p className="text-sm font-bold uppercase tracking-widest text-gray-600">
              {product.brand}
            </p>

            <h1 className="mt-2 text-4xl font-black uppercase md:text-5xl">
              {product.name}
            </h1>

            <p className="mt-4 text-2xl font-bold text-[#b60055]">
              ₱{Number(product.price).toLocaleString()}
            </p>

            {product.tag && (
              <div className="mt-4 inline-block w-fit border-2 border-black bg-[#b60055] px-3 py-1 text-sm font-bold uppercase text-white">
                {product.tag}
              </div>
            )}

            <p className="mt-6 leading-relaxed text-gray-700">
              {product.description || "No description available."}
            </p>

            <div className="mt-8">
              <h3 className="mb-3 font-black uppercase">Select Size</h3>

              <div className="flex flex-wrap gap-3">
                {product.sizes?.length ? (
                  product.sizes.map((size) => (
                    <button
                      key={size}
                      className="border-2 border-black px-4 py-2 font-bold transition hover:bg-black hover:text-white"
                    >
                      {size}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500">No sizes available</p>
                )}
              </div>
            </div>

            <div className="mt-10 flex gap-4">
              <button className="border-4 border-black bg-black px-6 py-3 font-bold text-white transition hover:-translate-y-1">
                Check Availability
              </button>

              <Link
                to="/catalog"
                className="border-4 border-black bg-white px-6 py-3 font-bold transition hover:-translate-y-1"
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