import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart } from "lucide-react";

interface HeaderProps {
  cartCount?: number;
}

const navLinks = [
  { label: "Inicio", to: "/" },
  { label: "Encuentra tu espacio", to: "/encuentra-tu-espacio" },
  { label: "Ofrece tu espacio", to: "/ofrece-tu-espacio" },
  { label: "Contacto", to: "/contacto" },
];

export default function Header({ cartCount = 0 }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 bg-white ${
          scrolled ? "shadow-md" : "shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo (40% desktop) */}
            <div className="flex-shrink-0 w-[40%] md:w-[35%]">
              <Link to="/" className="flex items-center">
                <img
                  src="/raumlog-logo.png"
                  alt="RaumLog"
                  className="h-10 md:h-12 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Desktop nav (40%) */}
            <nav className="hidden md:flex items-center justify-center gap-6 flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium transition-colors whitespace-nowrap ${
                    location.pathname === link.to
                      ? "text-[#2C5E8D] border-b-2 border-[#2C5E8D] pb-0.5"
                      : "text-[#2C5E8D] hover:text-[#1a3d5c]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side (20%) */}
            <div className="flex items-center justify-end gap-3 w-[20%]">
              {/* Cart */}
              <Link to="/mi-cuenta" className="relative p-2 text-[#2C5E8D] hover:text-[#1a3d5c] transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile hamburger */}
              <button
                className="md:hidden p-2 text-[#2C5E8D] hover:text-[#1a3d5c] transition-colors"
                onClick={() => setMenuOpen(true)}
                aria-label="Abrir menú"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile full-screen overlay menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col">
          <div className="flex items-center justify-between px-4 h-16">
            <Link to="/" className="flex items-center" onClick={() => setMenuOpen(false)}>
              <img src="/raumlog-logo.png" alt="RaumLog" className="h-10 w-auto object-contain" />
            </Link>
            <button
              className="p-2 text-[#2C5E8D]"
              onClick={() => setMenuOpen(false)}
              aria-label="Cerrar menú"
            >
              <X className="w-7 h-7" />
            </button>
          </div>
          <nav className="flex flex-col items-center justify-center flex-1 gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-2xl font-semibold transition-colors ${
                  location.pathname === link.to
                    ? "text-[#2C5E8D]"
                    : "text-[#1a3d5c] hover:text-[#2C5E8D]"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/mi-cuenta"
              className="text-2xl font-semibold text-[#1a3d5c] hover:text-[#2C5E8D] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Mi Cuenta
            </Link>
          </nav>
        </div>
      )}

      {/* Spacer for sticky header */}
      <div className="h-16 md:h-20" />
    </>
  );
}
