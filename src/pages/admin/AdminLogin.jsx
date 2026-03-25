import { useState } from "react";
import { Navigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import {
  browserLocalPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase/config";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (auth.currentUser) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      setIsLoggingIn(true);

      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, email.trim(), password);

      window.location.href = "/admin";
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Invalid admin email or password.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <Layout>
      <section className="px-6 py-10 md:px-10 lg:px-16">
        <div className="mx-auto max-w-xl border-4 border-black bg-white p-8 shadow-[8px_8px_0px_#000]">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-[#b60055]">
            Private Access
          </p>

          <h1 className="text-4xl font-black uppercase">Admin Login</h1>

          <p className="mt-4 text-gray-700">
            Sign in with your admin account to manage products, store info, and updates.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-black uppercase">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-black px-4 py-3 outline-none"
                placeholder="Enter admin email"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black uppercase">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-black px-4 py-3 outline-none"
                placeholder="Enter password"
              />
            </div>

            {errorMessage && (
              <p className="text-sm font-bold text-[#b60055]">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="border-4 border-black bg-black px-6 py-3 font-black uppercase text-white transition hover:-translate-y-1 disabled:opacity-70"
            >
              {isLoggingIn ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
}