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
      <main className="pb-16">
        <section className="px-6 pt-10 md:px-10 lg:px-16">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="fade-up flex flex-col justify-center">
              <p className="section-kicker">System Protocol 01</p>

              <h1 className="big-title mt-5 text-6xl font-black uppercase md:text-7xl xl:text-[96px]">
                Neon
                <br />
                <span className="pink-accent">Velocity</span>
              </h1>

              <div className="panel-shadow soft-panel mt-8 max-w-xl border-2 border-black px-4 py-4">
                <p className="text-sm uppercase leading-6 tracking-wide text-gray-700">
                  Engineered with kinetic air technology for the urban marathon.
                  The future of culture starts at ground level.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/catalog"
                  className="card-hover border-4 border-black bg-[#ff0a7a] px-6 py-3 text-sm font-black uppercase text-white"
                >
                  Shop The Drop
                </Link>

                <Link
                  to="/updates"
                  className="card-hover border-4 border-black bg-white px-6 py-3 text-sm font-black uppercase text-black"
                >
                  Specifications
                </Link>
              </div>
            </div>

            <div className="feature-frame fade-up-delay-1 panel-shadow relative min-h-[360px] border-2 border-black p-8 md:min-h-[460px]">
              {featuredSneaker ? (
                <Link
                  to={`/product/${featuredSneaker.id}`}
                  className="flex h-full items-center justify-center"
                >
                  <div className="feature-rotated-card float-card w-full max-w-[360px] rotate-[-8deg] border-2 border-black bg-black p-4">
                    <img
                      src={`${featuredSneaker.image}?auto=format&fit=crop&w=1000&q=80`}
                      alt={featuredSneaker.name}
                      className="h-[240px] w-full object-contain md:h-[300px]"
                    />
                  </div>
                </Link>
              ) : (
                <div className="flex h-full items-center justify-center text-center font-black uppercase text-gray-500">
                  No featured sneaker selected yet
                </div>
              )}

              <div className="absolute bottom-4 right-4 border-2 border-black bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.25em]">
                Scroll
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14 border-y-2 border-black bg-white px-6 py-5 md:px-10 lg:px-16">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-4 text-3xl md:text-4xl">
            {brands.length === 0 ? (
              <div className="brand-strip-item">No Brands Yet</div>
            ) : (
              brands.map((brand) => (
                <Link
                  key={brand.id}
                  to={`/catalog?brand=${encodeURIComponent(brand.name)}`}
                  className="brand-strip-item hover:text-[#ff0a7a]"
                >
                  {brand.name}
                </Link>
              ))
            )}
          </div>
        </section>

        <section className="px-6 pt-16 md:px-10 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div className="panel-shadow inline-block border-2 border-black bg-white px-4 py-3">
                <p className="section-kicker">Collection.v2.04</p>
                <h2 className="mt-1 text-4xl font-black uppercase">
                  New Arrivals
                </h2>
              </div>

              <Link
                to="/catalog"
                className="card-hover border-2 border-black bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.2em]"
              >
                View All.exe →
              </Link>
            </div>

            <div className="grid gap-0 border-2 border-black bg-white sm:grid-cols-2 lg:grid-cols-4">
              {newArrivals.length === 0 ? (
                <div className="col-span-full p-8 text-center font-black uppercase">
                  No new arrivals yet
                </div>
              ) : (
                newArrivals.map((product, index) => (
                  <Link
                    to={`/product/${product.id}`}
                    key={product.id}
                    className={`border-b-2 border-r-2 border-black p-4 last:border-r-0 sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r-2 lg:[&:nth-child(4n)]:border-r-0 ${
                      index === 0
                        ? "fade-up"
                        : index === 1
                        ? "fade-up-delay-1"
                        : "fade-up-delay-2"
                    }`}
                  >
                    <div className="mb-4 flex items-start justify-between">
                      {product.tag ? (
                        <span className="hot-tag">{product.tag}</span>
                      ) : (
                        <span className="lime-tag">New Drop</span>
                      )}
                    </div>

                    <div className="border-2 border-black bg-[#efefef] p-4">
                      <img
                        src={`${product.image}?auto=format&fit=crop&w=600&q=80`}
                        alt={product.name}
                        className="h-[180px] w-full object-contain"
                      />
                    </div>

                    <div className="mt-4">
                      <p className="micro-label text-gray-500">
                        {product.brand}
                      </p>
                      <h3 className="mt-2 text-lg font-black uppercase">
                        {product.name}
                      </h3>
                      <p className="mt-2 font-bold text-[#ff0a7a]">
                        ₱{Number(product.price).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="px-6 pt-20 md:px-10 lg:px-16">
          <div className="mx-auto grid max-w-7xl grid-cols-1 border-2 border-black bg-white lg:grid-cols-[1fr_1fr]">
            <div className="min-h-[360px] border-b-2 border-black p-8 lg:border-b-0 lg:border-r-2">
              <div className="flex h-full flex-col justify-between">
                <div className="flex-1"></div>

                <div className="panel-shadow inline-block w-fit border-2 border-black bg-white px-5 py-5">
                  <h3 className="text-4xl font-black uppercase">The Lab Series</h3>
                  <p className="mt-2 section-kicker">Access Protocol</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 border-t-2 border-black lg:border-t-0">
              <div className="border-b-2 border-black p-8">
                <p className="section-kicker">Upcoming Data Drop</p>
                <h3 className="mt-3 text-5xl font-black uppercase">
                  Hyper-Sonic X
                </h3>

                <div className="mt-6 flex gap-3">
                  {["04", "12", "55"].map((num, i) => (
                    <div
                      key={num}
                      className={`border-2 border-black bg-white px-4 py-3 ${
                        i !== 2 ? "shadow-[3px_3px_0_#ff0a7a]" : ""
                      }`}
                    >
                      <div className="text-3xl font-black">{num}</div>
                      <div className="micro-label mt-1 text-gray-500">
                        {i === 0 ? "Days" : i === 1 ? "Hrs" : "Min"}
                      </div>
                    </div>
                  ))}
                </div>

                <button className="card-hover mt-6 border-2 border-black bg-black px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-white">
                  Secure_Notify
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3">
                <div className="flex min-h-[170px] items-end border-b-2 border-black bg-[#ff0a7a] p-6 text-white sm:border-b-0 sm:border-r-2">
                  <div>
                    <p className="text-3xl">◉</p>
                    <p className="mt-4 text-xl font-black uppercase">
                      Global
                      <br />
                      Network
                    </p>
                  </div>
                </div>

                <div className="flex min-h-[170px] items-end border-b-2 border-black p-6 sm:border-b-0 sm:border-r-2">
                  <div>
                    <p className="text-3xl">◎</p>
                    <p className="mt-4 text-xl font-black uppercase">
                      Verified
                      <br />
                      Authentic
                    </p>
                  </div>
                </div>

                <div className="flex min-h-[170px] items-end p-6">
                  <div>
                    <p className="text-3xl">▲</p>
                    <p className="mt-4 text-xl font-black uppercase">
                      Engineered
                      <br />
                      Motion
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pt-20 md:px-10 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-center justify-between gap-4">
              <h2 className="text-4xl font-black uppercase">Latest Updates</h2>

              <Link to="/updates" className="font-bold underline">
                View All Updates
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {updates.length === 0 ? (
                <div className="border-2 border-black bg-white p-8 font-black uppercase">
                  No updates yet
                </div>
              ) : (
                updates.map((item, index) => (
                  <Link
                    to="/updates"
                    key={item.id}
                    className={`card-hover border-2 border-black bg-white p-4 ${
                      index === 0
                        ? "fade-up"
                        : index === 1
                        ? "fade-up-delay-1"
                        : "fade-up-delay-2"
                    }`}
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="mb-4 h-48 w-full border-2 border-black object-cover"
                      />
                    )}

                    <p className="section-kicker">Update Feed</p>

                    <h3 className="mt-3 text-2xl font-black uppercase">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-gray-700">
                      {item.content}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>

        <footer className="mt-20 border-t-2 border-black bg-[#efefed] px-6 py-14 md:px-10 lg:px-16">
          <div className="mx-auto max-w-7xl text-center">
            <h2 className="text-5xl font-black uppercase">
              Off The <span className="pink-accent italic">Grid</span>
            </h2>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-[11px] font-bold uppercase tracking-[0.22em] text-gray-500">
              <span>Locations</span>
              <span>Contact</span>
              <span>Careers</span>
              <span>Terms</span>
              <span>Privacy</span>
            </div>

            <div className="mt-10 flex items-center justify-center gap-4">
              <span className="icon-chip">⌁</span>
              <span className="icon-chip">↗</span>
              <span className="icon-chip">◫</span>
            </div>

            <div className="mt-8 inline-block border-2 border-black bg-black px-4 py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white">
              © 2025 Off The Grid Monolith. Engineered For Culture.
            </div>
          </div>
        </footer>
      </main>
    </Layout>
  );
}