import { useParams, Link } from "react-router-dom";
import Layout from "../components/layout/Layout";

/* SAME MOCK DATA (for now — later from Firebase) */
const allProducts = [
  {
    id: 1,
    name: 'Air Max Pulse "Cyanide"',
    brand: "Nike",
    price: 8995,
    sizes: [7, 8, 9, 10],
    description:
      "A bold everyday sneaker with responsive cushioning and standout design.",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
    ],
  },
  {
    id: 2,
    name: 'Samba OG "Core Black"',
    brand: "Adidas",
    price: 6795,
    sizes: [7.5, 8, 8.5, 9],
    description:
      "A classic silhouette that blends heritage style with modern comfort.",
    images: [
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    ],
  },
  {
    id: 3,
    name: 'RS-X "Neon Static"',
    brand: "Puma",
    price: 5995,
    sizes: [8, 9, 10, 11],
    description:
      "Chunky retro-inspired sneaker with vibrant neon accents.",
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
    ],
  },
];

export default function ProductDetails() {
  const { id } = useParams();

  const product = allProducts.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <Layout>
        <div className="p-10">
          <h1 className="text-3xl font-black">Product not found</h1>
          <Link to="/catalog" className="underline mt-4 inline-block">
            Back to catalog
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="px-6 py-10 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* LEFT - IMAGE GALLERY */}
          <div className="space-y-4">
            <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_#000]">
              <img
                src={`${product.images[0]}?auto=format&fit=crop&w=900&q=80`}
                alt={product.name}
                className="w-full h-[400px] object-contain"
              />
            </div>

            {/* THUMBNAILS */}
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((img, index) => (
                <div
                  key={index}
                  className="border-2 border-black p-2 bg-white"
                >
                  <img
                    src={`${img}?auto=format&fit=crop&w=400&q=80`}
                    alt=""
                    className="h-[80px] w-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT - DETAILS */}
          <div className="flex flex-col">

            <p className="text-sm font-bold uppercase tracking-widest text-gray-600">
              {product.brand}
            </p>

            <h1 className="text-4xl md:text-5xl font-black uppercase mt-2">
              {product.name}
            </h1>

            <p className="text-2xl font-bold mt-4">
              ₱{product.price.toLocaleString()}
            </p>

            <p className="mt-6 text-gray-700 leading-relaxed">
              {product.description}
            </p>

            {/* SIZE SELECTOR */}
            <div className="mt-8">
              <h3 className="font-black uppercase mb-3">
                Select Size
              </h3>

              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className="border-2 border-black px-4 py-2 font-bold hover:bg-black hover:text-white transition"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-10 flex gap-4">
              <button className="border-4 border-black bg-black text-white px-6 py-3 font-bold hover:-translate-y-1 transition">
                Check Availability
              </button>

              <Link
                to="/catalog"
                className="border-4 border-black bg-white px-6 py-3 font-bold hover:-translate-y-1 transition"
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