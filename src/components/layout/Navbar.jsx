import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function getNavLinkClass(isActive) {
  return `text-[11px] font-bold uppercase tracking-[0.24em] transition ${
    isActive ? "text-[#ff0a7a]" : "text-black hover:text-[#ff0a7a]"
  }`;
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-black bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8 lg:px-10">
        <Link
          to="/"
          onClick={closeMobile}
          className="text-2xl font-black uppercase leading-none"
        >
          Off The <span className="italic text-[#ff0a7a]">Grid</span>
        </Link>

        <nav className="hidden items-center gap-10 lg:flex">
          <NavLink
            to="/catalog"
            className={({ isActive }) => getNavLinkClass(isActive)}
          >
            Catalog
          </NavLink>

          <NavLink
            to="/updates"
            className={({ isActive }) => getNavLinkClass(isActive)}
          >
            Updates
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) => getNavLinkClass(isActive)}
          >
            Contact
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) => getNavLinkClass(isActive)}
          >
            About
          </NavLink>
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex h-11 w-11 items-center justify-center border-2 border-black bg-white lg:hidden"
          aria-label="Toggle menu"
        >
          <span className="text-lg font-black">{mobileOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t-2 border-black bg-white lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-4 md:px-8">
            <Link
              to="/catalog"
              onClick={closeMobile}
              className="border-b border-black px-1 py-4 text-sm font-black uppercase tracking-[0.2em] hover:text-[#ff0a7a]"
            >
              Catalog
            </Link>

            <Link
              to="/updates"
              onClick={closeMobile}
              className="border-b border-black px-1 py-4 text-sm font-black uppercase tracking-[0.2em] hover:text-[#ff0a7a]"
            >
              Updates
            </Link>

            <Link
              to="/contact"
              onClick={closeMobile}
              className="border-b border-black px-1 py-4 text-sm font-black uppercase tracking-[0.2em] hover:text-[#ff0a7a]"
            >
              Contact
            </Link>

            <Link
              to="/about"
              onClick={closeMobile}
              className="px-1 py-4 text-sm font-black uppercase tracking-[0.2em] hover:text-[#ff0a7a]"
            >
              About
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}