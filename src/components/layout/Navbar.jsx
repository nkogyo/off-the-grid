import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full sticky top-0 z-50 bg-white border-b-4 border-black">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* LOGO */}
        <Link to="/" className="text-2xl font-black tracking-tight">
          OFF THE GRID
        </Link>

        {/* LINKS */}
        <div className="flex gap-6 text-lg font-semibold">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/catalog" className="hover:underline">Catalog</Link>
          <Link to="/about" className="hover:underline">About</Link>
          <Link to="/contact" className="hover:underline">Contact</Link>
        </div>

      </div>
    </nav>
  );
}