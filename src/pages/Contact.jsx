import Layout from "../components/layout/Layout";

export default function Contact() {
  return (
    <Layout>
      <section className="px-6 py-10 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* HEADER */}
          <div className="border-4 border-black bg-[#ff6b57] p-8 shadow-[8px_8px_0px_#000]">
            <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-white">
              Get In Touch
            </p>
            <h1 className="text-4xl font-black uppercase leading-none text-white md:text-6xl">
              Contact Us
            </h1>
            <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-white md:text-lg">
              For product inquiries, stock availability, or store visits, you
              can contact Off The Grid through the information below or send a
              message directly using the form.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* CONTACT FORM */}
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

            {/* CONTACT INFO */}
            <div className="space-y-6">
              <div className="border-4 border-black bg-[#f8f3e8] p-8 shadow-[8px_8px_0px_#000]">
                <h2 className="mb-6 text-2xl font-black uppercase">
                  Store Information
                </h2>

                <div className="space-y-4 text-base font-medium">
                  <div>
                    <p className="text-sm font-black uppercase tracking-wider">
                      Address
                    </p>
                    <p>Sample Address, City, Philippines</p>
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

                  <div>
                    <p className="text-sm font-black uppercase tracking-wider">
                      Business Hours
                    </p>
                    <p>Monday - Sunday | 9:00 AM - 8:00 PM</p>
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
                  <p>Facebook: Off The Grid</p>
                  <p>Instagram: @offthegrid</p>
                  <p>TikTok: @offthegridkicks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}