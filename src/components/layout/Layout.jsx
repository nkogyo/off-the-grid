import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />
      {children}
    </div>
  );
}