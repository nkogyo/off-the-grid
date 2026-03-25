import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/config";

export default function Updates() {
  const [updates, setUpdates] = useState([]);

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
      setUpdates(data);
    };

    fetchUpdates();
  }, []);

  return (
    <Layout>
      <section className="px-6 py-10 md:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 border-4 border-black bg-[#b60055] p-8 text-white">
            <p className="mb-3 text-sm font-black uppercase tracking-[0.2em]">
              News And Announcements
            </p>
            <h1 className="text-4xl font-black uppercase md:text-6xl">
              Latest Updates
            </h1>
            <p className="mt-4 max-w-3xl text-base font-medium leading-7 md:text-lg">
              Stay updated with new sneaker drops, latest catalog additions, and
              store announcements from Off The Grid.
            </p>
          </div>

          <div className="space-y-8">
            {updates.length === 0 ? (
              <div className="border-4 border-black bg-white p-8">
                <h2 className="text-2xl font-black uppercase">
                  No updates yet
                </h2>
              </div>
            ) : (
              updates.map((item) => (
                <article
                  key={item.id}
                  className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_#000]"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="mb-6 h-[260px] w-full border-2 border-black object-cover"
                    />
                  )}

                  <h2 className="text-2xl font-black uppercase md:text-3xl">
                    {item.title}
                  </h2>

                  <p className="mt-4 text-base leading-7 text-gray-700">
                    {item.content}
                  </p>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}