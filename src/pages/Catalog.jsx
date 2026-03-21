import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

const brands = ["All", "Nike", "Adidas", "Puma"];
const sizes = [7, 8, 9, 10, 11];

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedSize, setSelectedSize] = useState(null);

  // ✅ FETCH FROM FIREBASE
  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, "products"));

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(data);
    };

    fetchProducts();
  }, []);

  // ✅ FILTER
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const brandMatch =
        selectedBrand === "All" || product.brand === selectedBrand;

      const sizeMatch =
        selectedSize === null || product.sizes.includes(selectedSize);

      return brandMatch && sizeMatch;
    });
  }, [products, selectedBrand, selectedSize]);

  return (
    <Layout>
      <main className="min-h-screen pt-10">
        <div className="mx-auto flex max-w-7xl gap-8 px-6 pb-20">
          <aside className="glow-pink hidden w-64 border-4 border-black bg-white p-6 lg:block">
            <h3 className="mb-4 font-black uppercase">Brands</h3>

            <div className="mb-6 flex flex-wrap gap-2">
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-3 py-2 border-2 border-black font-bold ${
                    selectedBrand === brand
                      ? "bg-[#b60055] text-white"
                      : "bg-white"
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>

            <h3 className="mb-4 font-black uppercase">Sizes</h3>

            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() =>
                    setSelectedSize(selectedSize === size ? null : size)
                  }
                  className={`px-3 py-2 border-2 border-black font-bold ${
                    selectedSize === size
                      ? "bg-[#b60055] text-white"
                      : "bg-white"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </aside>

          <section className="flex-1">
            <div className="glow-pink mb-8 border-4 border-black bg-[#b60055] p-6 text-white">
              <h1 className="text-4xl font-black uppercase">Catalog</h1>
              <p className="mt-2 font-medium">
                {filteredProducts.length} products found
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <Link
                  to={`/product/${product.id}`}
                  key={product.id}
                  className="glow-hover border-4 border-black bg-white p-4"
                >
                  <div className="relative border-2 border-black bg-[#f8f3e8] p-4">
                    {product.tag && (
                      <div className="absolute right-0 top-0 border-b-2 border-l-2 border-black bg-[#b60055] px-2 py-1 text-xs font-bold text-white">
                        {product.tag}
                      </div>
                    )}

                    <img
                      src={`${product.image}?auto=format&fit=crop&w=600&q=80`}
                      alt={product.name}
                      className="h-[200px] w-full object-contain"
                    />
                  </div>

                  <h2 className="mt-4 text-lg font-black uppercase">
                    {product.name}
                  </h2>

                  <p className="text-sm font-medium text-gray-600">
                    {product.brand}
                  </p>

                  <p className="mt-2 font-bold text-[#b60055]">
                    ₱{product.price.toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}