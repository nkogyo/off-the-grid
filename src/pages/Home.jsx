import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase/config";

export default function Home() {
  const [updates, setUpdates] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [brands, setBrands] = useState([]);
  const [featuredSneaker, setFeaturedSneaker] = useState(null);

  useEffect(() => {
    const fetchUpdates = async () => {
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
    };

    const fetchNewArrivals = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      const data = snapshot.docs
        .map((item) => ({
          id: item.id,
          ...item.data(),
        }))
        .filter((product) => product.isNewArrival)
        .slice(0, 4);

      setNewArrivals(data);
    };

    const fetchBrands = async () => {
      const snapshot = await getDocs(collection(db, "brands"));
      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));
      setBrands(data);
    };

    const fetchFeaturedSneaker = async () => {
      const featuredRef = doc(db, "featuredProduct", "main");
      const featuredSnap = await getDoc(featuredRef);

      if (!featuredSnap.exists()) {
        setFeaturedSneaker(null);
        return;
      }

      const productId = featuredSnap.data().productId;

      if (!productId) {
        setFeaturedSneaker(null);
        return;
      }

      const productRef = doc(db, "products", productId);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        setFeaturedSneaker({
          id: productSnap.id,
          ...productSnap.data(),
        });
      } else {
        setFeaturedSneaker(null);
      }
    };

    fetchUpdates();
    fetchNewArrivals();
    fetchBrands();
    fetchFeaturedSneaker();
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
              Discover branded shoes and sneakers in one place. Browse new
              arrivals, featured pairs, and stylish everyday picks from your
              favorite labels.
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

          <div className="glow-orange relative min-h-[420px] border-4 border-black bg-[#ff6b57] p-6">
            <div className="absolute left-4 top-4 z-10 border-2 border-black bg-white px-3 py-1 text-sm font-bold uppercase">
              Featured Sneaker
            </div>

            {featuredSneaker ? (
              <Link
                to={`/product/${featuredSneaker.id}`}
                className="flex h-full min-h-[420px] items-center justify-center"
              >
                <img
                  src={`${featuredSneaker.image}?auto=format&fit=crop&w=1000&q=80`}
                  alt={featuredSneaker.name}
                  className="h-[320px] w-full max-w-[520px] object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.35)] transition duration-300 hover:rotate-1 hover:scale-105"
                />
              </Link>
            ) : (
              <div className="flex min-h-[420px] items-center justify-center text-center font-black uppercase text-white">
                No featured sneaker selected yet
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="px-6 py-10 md:px-10 lg:px-16">
        <div className="glow-pink mx-auto max-w-7xl border-4 border-black bg-white p-6">
          <h2 className="mb-6 text-2xl font-black uppercase">
            Featured Brands
          </h2>

          <div className="flex flex-wrap justify-center gap-4">
            {brands.length === 0 ? (
              <div className="border-4 border-black bg-white px-5 py-2 font-black uppercase">
                No brands yet
              </div>
            ) : (
              brands.map((brand) => (
                <Link
                  key={brand.id}
                  to={`/catalog?brand=${encodeURIComponent(brand.name)}`}
                  className="glow-hover border-2 border-black px-5 py-2 font-black uppercase transition hover:bg-black hover:text-white"
                >
                  {brand.name}
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="px-6 py-10 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-black uppercase">New Arrivals</h2>

            <Link to="/catalog" className="font-bold underline">
              View All
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {newArrivals.length === 0 ? (
              <div className="border-4 border-black bg-white p-6 font-bold uppercase">
                No new arrivals yet
              </div>
            ) : (
              newArrivals.map((product) => (
                <Link
                  to={`/product/${product.id}`}
                  key={product.id}
                  className="glow-hover border-4 border-black bg-white p-4"
                >
                  <div className="relative mb-4 border-2 border-black bg-[#f8f3e8] p-4">
                    <div className="absolute right-0 top-0 border-b-2 border-l-2 border-black bg-[#c1ff72] px-2 py-1 text-xs font-black uppercase">
                      New
                    </div>

                    <img
                      src={`${product.image}?auto=format&fit=crop&w=600&q=80`}
                      alt={product.name}
                      className="h-[180px] w-full object-contain"
                    />
                  </div>

                  <h3 className="text-lg font-black uppercase">
                    {product.name}
                  </h3>

                  <p className="text-sm font-medium">{product.brand}</p>

                  <p className="mt-2 font-bold text-[#b60055]">
                    ₱{Number(product.price).toLocaleString()}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="px-6 py-10 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-black uppercase">Latest Updates</h2>

            <Link to="/updates" className="font-bold underline">
              View All Updates
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {updates.length === 0 ? (
              <div className="border-4 border-black bg-white p-6 font-bold uppercase">
                No updates yet
              </div>
            ) : (
              updates.map((item) => (
                <Link
                  to="/updates"
                  key={item.id}
                  className="glow-hover block border-4 border-black bg-white p-4"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="mb-4 h-48 w-full border-2 border-black object-cover"
                    />
                  )}

                  <h3 className="text-xl font-black uppercase">{item.title}</h3>

                  <p className="mt-3 text-sm leading-6 text-gray-700">
                    {item.content}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}