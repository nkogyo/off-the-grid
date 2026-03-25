import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const defaultStoreInfo = {
  storeName: "Off The Grid",
  address: "Sample Address, City, Philippines",
  contactNumber: "0912 345 6789",
  email: "offthegrid@email.com",
  businessHours: "Monday - Sunday | 9:00 AM - 8:00 PM",
  facebook: "Off The Grid",
  instagram: "@offthegrid",
};

export default function Contact() {
  const [storeInfo, setStoreInfo] = useState(defaultStoreInfo);

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
        } else {
          await setDoc(storeRef, defaultStoreInfo);
          setStoreInfo(defaultStoreInfo);
        }
      } catch (error) {
        console.error("Error fetching store info:", error);
      }
    };

    fetchStoreInfo();
  }, []);

  return (
    <Layout>
      <section className="px-6 py-10 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="border-4 border-black bg-[#ff6b57] p-8 shadow-[8px_8px_0px_#000]">
            <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-white">
              Get In Touch
            </p>
            <h1 className="text-4xl font-black uppercase leading-none text-white md:text-6xl">
              Contact Us
            </h1>
            <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-white md:text-lg">
              For product inquiries, stock availability, or store visits, you
              can contact {storeInfo.storeName} through the information below or
              send a message directly using the form.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0px_#000]">
              <h2 className="mb-6 text-2xl font-black uppercase">
                Send a Message
              </h2>

              <form className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-black uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full border-4 border-black px-4 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full border-4 border-black px-4 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black uppercase tracking-wider">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Enter subject"
                    className="w-full border-4 border-black px-4 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black uppercase tracking-wider">
                    Message
                  </label>
                  <textarea
                    rows="6"
                    placeholder="Write your message"
                    className="w-full border-4 border-black px-4 py-3 outline-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="border-4 border-black bg-black px-6 py-3 font-black uppercase text-white transition hover:-translate-y-1"
                >
                  Send Inquiry
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0px_#000]">
                <h2 className="mb-6 text-2xl font-black uppercase">
                  Store Information
                </h2>

                <div className="space-y-4 text-base font-medium">
                  <div>
                    <p className="text-sm font-black uppercase tracking-wider">
                      Address
                    </p>
                    <p>{storeInfo.address}</p>
                  </div>

                  <div>
                    <p className="text-sm font-black uppercase tracking-wider">
                      Contact Number
                    </p>
                    <p>{storeInfo.contactNumber}</p>
                  </div>

                  <div>
                    <p className="text-sm font-black uppercase tracking-wider">
                      Email
                    </p>
                    <p>{storeInfo.email}</p>
                  </div>

                  <div>
                    <p className="text-sm font-black uppercase tracking-wider">
                      Business Hours
                    </p>
                    <p>{storeInfo.businessHours}</p>
                  </div>
                </div>
              </div>

              <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0px_#000]">
                <h2 className="mb-6 text-2xl font-black uppercase">
                  Follow Updates
                </h2>
                <p className="mb-4 leading-7 text-gray-700">
                  Follow the store for updates on newly added products, featured
                  drops, and new sneaker releases.
                </p>

                <div className="space-y-3 font-bold">
                  <p>Facebook: {storeInfo.facebook}</p>
                  <p>Instagram: {storeInfo.instagram}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}