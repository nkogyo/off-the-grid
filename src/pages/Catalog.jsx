import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export default function Catalog() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(
    searchParams.get("brand") || "All"
  );
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, "products"));

      const data = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));

      setProducts(data);
    };

    fetchProducts();
  }, []);

  const brands = useMemo(() => {
    const allBrands = products
      .map((product) => product.brand)
      .filter(Boolean)
      .filter((brand, index, arr) => arr.indexOf(brand) === index);

    return ["All", ...allBrands];
  }, [products]);

  const sizes = useMemo(() => {
    const allSizes = products
      .flatMap((product) => (Array.isArray(product.sizes) ? product.sizes : []))
      .filter((size) => size !== null && size !== undefined)
      .filter((size, index, arr) => arr.indexOf(size) === index)
      .sort((a, b) => Number(a) - Number(b));

    return allSizes;
  }, [products]);

  useEffect(() => {
    const brandFromQuery = searchParams.get("brand");
    if (brandFromQuery) {
      setSelectedBrand(brandFromQuery);
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const brandMatch =
        selectedBrand === "All" || product.brand === selectedBrand;

      const sizeMatch =
        selectedSize === null ||
        (Array.isArray(product.sizes) && product.sizes.includes(selectedSize));

      return brandMatch && sizeMatch;
    });
  }, [products, selectedBrand, selectedSize]);

  return (
    <Layout>
      <main className="min-h-screen pt-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 pb-20 lg:flex-row">
          <aside className="panel-shadow w-full border-2 border-black bg-white p-6 lg:w-64">
            <h3 className="mb-4 font-black uppercase">Brands</h3>

            <div className="mb-6 flex flex-wrap gap-2">
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`border-2 border-black px-3 py-2 font-bold ${
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
                  className={`border-2 border-black px-3 py-2 font-bold ${
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
            <div className="panel-shadow mb-8 border-2 border-black bg-[#b60055] p-6 text-white">
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
                  className="card-hover border-2 border-black bg-white p-4"
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
                    ₱{Number(product.price).toLocaleString()}
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