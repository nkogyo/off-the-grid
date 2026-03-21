import Layout from "../components/layout/Layout";

export default function About() {
  return (
    <Layout>
      <section className="px-6 py-10 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* HEADER */}
          <div className="border-4 border-black bg-[#c1ff72] p-8 shadow-[8px_8px_0px_#000]">
            <p className="mb-3 text-sm font-black uppercase tracking-[0.2em]">
              About The Store
            </p>
            <h1 className="text-4xl font-black uppercase leading-none md:text-6xl">
              Off The Grid
            </h1>
            <p className="mt-4 max-w-3xl text-base font-medium leading-7 md:text-lg">
              Off The Grid is a shoe and sneaker retailer focused on showcasing
              stylish, branded, and newly released footwear. The store highlights
              strong visual presentation, curated collections, and easy access to
              product information so customers can browse with confidence.
            </p>
          </div>

          {/* STORY + INFO */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0px_#000]">
              <h2 className="mb-4 text-2xl font-black uppercase">Our Story</h2>
              <p className="mb-4 leading-7 text-gray-700">
                What started as a simple sneaker retail concept grew into a
                product showcase platform where customers can explore different
                brands, compare styles, and keep up with new arrivals.
              </p>
              <p className="leading-7 text-gray-700">
                The goal of the platform is not only to display inventory, but
                also to help attract more buyers through a clean, bold, and
                visually engaging website experience.
              </p>
            </div>

            <div className="border-4 border-black bg-[#f8f3e8] p-8 shadow-[8px_8px_0px_#000]">
              <h2 className="mb-4 text-2xl font-black uppercase">
                Business Details
              </h2>

              <div className="space-y-4 text-base font-medium">
                <div>
                  <p className="text-sm font-black uppercase tracking-wider">
                    Store Name
                  </p>
                  <p>Off The Grid</p>
                </div>

                <div>
                  <p className="text-sm font-black uppercase tracking-wider">
                    Location
                  </p>
                  <p>Sample Address, City, Philippines</p>
                </div>

                <div>
                  <p className="text-sm font-black uppercase tracking-wider">
                    Store Hours
                  </p>
                  <p>Monday - Sunday | 9:00 AM - 8:00 PM</p>
                </div>

                <div>
                  <p className="text-sm font-black uppercase tracking-wider">
                    Contact Number
                  </p>
                  <p>0912 345 6789</p>
                </div>

                <div>
                  <p className="text-sm font-black uppercase tracking-wider">
                    Email
                  </p>
                  <p>offthegrid@email.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* HIGHLIGHTS */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_#000]">
              <h3 className="mb-3 text-xl font-black uppercase">
                Multiple Brands
              </h3>
              <p className="leading-7 text-gray-700">
                Browse shoes and sneakers from well-known local and global
                brands in one place.
              </p>
            </div>

            <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_#000]">
              <h3 className="mb-3 text-xl font-black uppercase">
                New Arrivals
              </h3>
              <p className="leading-7 text-gray-700">
                Stay updated with newly released and newly added products in the
                catalog.
              </p>
            </div>

            <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_#000]">
              <h3 className="mb-3 text-xl font-black uppercase">
                Easy Inquiry
              </h3>
              <p className="leading-7 text-gray-700">
                Customers can quickly view contact details and ask about
                availability or store visits.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}