import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const defaultAboutContent = {
  heroKicker: "About the Store",
  heroTitle: "Off The Grid",
  heroDescription:
    "Off The Grid is a shoe and sneaker retailer focused on showcasing stylish, branded, and newly released footwear. The store highlights strong visual presentation, curated collections, and easy access to product information so customers can browse with confidence.",

  storyTitle: "Our Story",
  storyParagraphOne:
    "What started as a simple sneaker retail concept grew into a product showcase platform where customers can explore different brands, compare styles, and keep up with new arrivals.",
  storyParagraphTwo:
    "The goal of the platform is not only to display inventory, but also to help attract more buyers through a clean, bold, and visually engaging website experience.",

  ownerTitle: "Owner",

  featureOneTitle: "Multiple Brands",
  featureOneDescription:
    "Browse shoes and sneakers from well-known local and global brands in one place.",

  featureTwoTitle: "New Arrivals",
  featureTwoDescription:
    "Stay updated with newly released and newly added products in the catalog.",

  featureThreeTitle: "Easy Inquiry",
  featureThreeDescription:
    "Customers can quickly view contact details and ask about availability or store visits.",
};

export default function About() {
  const [aboutContent, setAboutContent] = useState(defaultAboutContent);
  const [ownerImageUrl, setOwnerImageUrl] = useState("");

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const aboutRef = doc(db, "aboutContent", "main");
        const aboutSnap = await getDoc(aboutRef);

        if (aboutSnap.exists()) {
          setAboutContent((prev) => ({
            ...prev,
            ...aboutSnap.data(),
          }));
        }
      } catch (error) {
        console.error("Error fetching about content:", error);
      }
    };

    const fetchStoreInfo = async () => {
      try {
        const storeRef = doc(db, "storeInfo", "main");
        const storeSnap = await getDoc(storeRef);

        if (storeSnap.exists()) {
          const data = storeSnap.data();
          setOwnerImageUrl(data.ownerImageUrl || "");
        }
      } catch (error) {
        console.error("Error fetching store info:", error);
      }
    };

    fetchAboutContent();
    fetchStoreInfo();
  }, []);

  return (
    <Layout>
      <section className="px-6 py-10 md:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl space-y-5">
          {/* HERO */}
          <div className="panel-shadow border-2 border-black bg-[#b8f35c] p-6 md:p-8">
            <p className="section-kicker">{aboutContent.heroKicker}</p>
            <h1 className="mt-3 text-4xl font-black uppercase md:text-6xl">
              {aboutContent.heroTitle}
            </h1>
            <p className="mt-4 max-w-4xl text-base leading-8 text-gray-800">
              {aboutContent.heroDescription}
            </p>
          </div>

          {/* STORY + OWNER */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="panel-shadow border-2 border-black bg-white p-6">
              <h2 className="text-2xl font-black uppercase">
                {aboutContent.storyTitle}
              </h2>

              <div className="mt-5 space-y-5 text-base leading-8 text-gray-700">
                <p>{aboutContent.storyParagraphOne}</p>
                <p>{aboutContent.storyParagraphTwo}</p>
              </div>
            </div>

            <div className="panel-shadow border-2 border-black bg-white p-6">
              <h2 className="text-2xl font-black uppercase">
                {aboutContent.ownerTitle}
              </h2>

              <div className="mt-5 border-2 border-black bg-[#efefef] p-4">
                {ownerImageUrl ? (
                  <img
                    src={ownerImageUrl}
                    alt="Owner"
                    className="h-[300px] w-full object-cover md:h-[360px]"
                  />
                ) : (
                  <div className="flex h-[300px] items-center justify-center bg-[#efefef] text-center font-black uppercase text-gray-500 md:h-[360px]">
                    No owner image uploaded yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* BOTTOM CARDS */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="panel-shadow border-2 border-black bg-white p-5">
              <h3 className="text-xl font-black uppercase">
                {aboutContent.featureOneTitle}
              </h3>
              <p className="mt-4 text-sm leading-7 text-gray-700">
                {aboutContent.featureOneDescription}
              </p>
            </div>

            <div className="panel-shadow border-2 border-black bg-white p-5">
              <h3 className="text-xl font-black uppercase">
                {aboutContent.featureTwoTitle}
              </h3>
              <p className="mt-4 text-sm leading-7 text-gray-700">
                {aboutContent.featureTwoDescription}
              </p>
            </div>

            <div className="panel-shadow border-2 border-black bg-white p-5">
              <h3 className="text-xl font-black uppercase">
                {aboutContent.featureThreeTitle}
              </h3>
              <p className="mt-4 text-sm leading-7 text-gray-700">
                {aboutContent.featureThreeDescription}
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}