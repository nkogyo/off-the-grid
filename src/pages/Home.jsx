import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/config";

export default function Home() {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
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
        setUpdates(data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching updates:", error);
      }
    };

    fetchUpdates();
  }, []);

  return (
    <Layout>
      <section className="px-6 py-10 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="glow-green flex flex-col justify-center border-4 border-black bg-white p-8">
            <p className="mb-4 inline-block w-fit border-2 border-black bg-[#c1ff72] px-3 py-1 text-sm font-bold uppercase tracking-wide">
              New Drops Available
            </p>

            <h1 className="text-5xl font-black uppercase leading-none md:text-6xl lg:text-7xl">
              Step Into
              <br />
              Your Next
              <br />
              Pair
            </h1>

            <p className="mt-6 max-w-xl text-base font-medium leading-7 md:text-lg">
              Discover branded shoes and sneakers in one place. Browse new arrivals,
              featured pairs, and stylish everyday picks from your favorite labels.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/catalog"
                className="glow-hover border-4 border-black bg-black px-6 py-3 text-base font-bold text-white"
              >
                Shop Catalog
              </Link>

              <Link
                to="/about"
                className="glow-hover border-4 border-black bg-white px-6 py-3 text-base font-bold text-black"
              >
                About Store
              </Link>
            </div>
          </div>

          <div className="glow-orange relative flex min-h-[420px] items-center justify-center border-4 border-black bg-[#ff6b57] p-6">
            <div className="absolute left-4 top-4 border-2 border-black bg-white px-3 py-1 text-sm font-bold uppercase">
              Featured Sneaker
            </div>

            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80"
              alt="Featured sneaker"
              className="h-[320px] w-full max-w-[520px] object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.35)]"
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-10 md:px-10 lg:px-16">
        <div className="glow-pink mx-auto max-w-7xl border-4 border-black bg-white p-6">
          <h2 className="mb-6 text-2xl font-black uppercase">
            Featured Brands
          </h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {["Nike", "Adidas", "Puma", "New Balance"].map((brand) => (
              <div
                key={brand}
                className="glow-hover flex items-center justify-center border-4 border-black bg-white py-6 text-lg font-bold uppercase"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-10 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-black uppercase">
              New Arrivals
            </h2>

            <Link to="/catalog" className="font-bold underline">
              View All
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="glow-hover border-4 border-black bg-white p-4"
              >
                <img
                  src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=600&q=80"
                  alt="shoe"
                  className="mb-4 h-[180px] w-full object-contain"
                />

                <h3 className="text-lg font-black uppercase">
                  Sneaker Model {item}
                </h3>

                <p className="text-sm font-medium">
                  Brand Name
                </p>

                <p className="mt-2 font-bold text-[#b60055]">
                  ₱4,999
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-10 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-black uppercase">
              Latest Updates
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {updates.length === 0 ? (
              <div className="border-4 border-black bg-white p-6 font-bold uppercase">
                No updates yet
              </div>
            ) : (
              updates.map((item) => (
                <div
                  key={item.id}
                  className="glow-hover border-4 border-black bg-white p-4"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="mb-4 h-48 w-full border-2 border-black object-cover"
                    />
                  )}

                  <h3 className="text-xl font-black uppercase">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-700">
                    {item.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}