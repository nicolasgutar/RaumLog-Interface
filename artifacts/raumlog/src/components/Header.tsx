import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Warehouse, Package, ChevronDown } from "lucide-react";
import { useStore } from "@/store/useStore";

const navLinks = [
  { label: "Inicio", to: "/" },
  { label: "Encuentra tu espacio", to: "/encuentra-tu-espacio" },
  { label: "Ofrece tu espacio", to: "/ofrece-tu-espacio" },
  { label: "Contacto", to: "/contacto" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropRef = useRef<HTMLDivElement>(null);

  const { authUser, clearAuth } = useStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setDropOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleLogout() {
    clearAuth();
    setDropOpen(false);
    navigate("/");
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 bg-white ${
          scrolled ? "shadow-md" : "shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24 md:h-28">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img
                  src="/raumlog-logo-main.png"
                  alt="RaumLog"
                  className="h-20 md:h-28 w-auto object-contain scale-125 origin-left"
                />
              </Link>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center justify-end gap-6 flex-1 pr-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-semibold transition-colors whitespace-nowrap ${
                    location.pathname === link.to
                      ? "text-[#2C5E8D] border-b-2 border-[#2C5E8D] pb-0.5"
                      : "text-[#2C5E8D] hover:text-[#1a3d5c]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center justify-end gap-3 w-[20%]">
              {authUser ? (
                <div className="relative" ref={dropRef}>
                  <button
                    onClick={() => setDropOpen((v) => !v)}
                    className="flex items-center gap-1.5 text-[#2C5E8D] hover:text-[#1a3d5c] transition-colors"
                    aria-label="Mi cuenta"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#2C5E8D] text-white flex items-center justify-center text-sm font-bold">
                      {authUser.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden lg:inline text-sm font-semibold max-w-[100px] truncate">
                      {authUser.name.split(" ")[0]}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform hidden lg:block ${dropOpen ? "rotate-180" : ""}`} />
                  </button>

                  {dropOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                      <div className="px-4 py-2.5 border-b border-gray-100">
                        <p className="font-semibold text-[#1a3d5c] text-sm truncate">{authUser.name}</p>
                        <p className="text-[#2C5E8D]/50 text-xs truncate">{authUser.email}</p>
                        <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          authUser.role === "host"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}>
                          {authUser.role === "host" ? "Anfitrión" : "Cliente"}
                        </span>
                      </div>
                      {authUser.role === "host" && (
                        <Link
                          to="/dashboard/host"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#2C5E8D] hover:bg-gray-50 transition-colors"
                        >
                          <Warehouse className="w-4 h-4" />
                          Mi panel de anfitrión
                        </Link>
                      )}
                      {authUser.role === "guest" && (
                        <Link
                          to="/encuentra-tu-espacio"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#2C5E8D] hover:bg-gray-50 transition-colors"
                        >
                          <Package className="w-4 h-4" />
                          Buscar espacio
                        </Link>
                      )}
                      <Link
                        to="/mi-cuenta"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#2C5E8D] hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Mi perfil
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/mi-cuenta"
                  className="flex items-center gap-1.5 p-2 text-[#2C5E8D] hover:text-[#1a3d5c] transition-colors"
                  aria-label="Mi Cuenta"
                >
                  <User className="w-6 h-6" />
                  <span className="hidden lg:inline text-sm font-semibold">Mi Cuenta</span>
                </Link>
              )}

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

      {/* Mobile full-screen overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col">
          <div className="flex items-center justify-between px-4 h-20">
            <Link to="/" className="flex items-center" onClick={() => setMenuOpen(false)}>
              <img src="/raumlog-logo-main.png" alt="RaumLog" className="h-20 w-auto object-contain" />
            </Link>
            <button
              className="p-2 text-[#2C5E8D] hover:text-[#1a3d5c]"
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
                className="text-2xl font-semibold text-[#2C5E8D] hover:text-[#1a3d5c] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {authUser ? (
              <>
                {authUser.role === "host" && (
                  <Link to="/dashboard/host" className="text-2xl font-semibold text-[#2C5E8D]" onClick={() => setMenuOpen(false)}>
                    Mi panel
                  </Link>
                )}
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="text-2xl font-semibold text-red-500 hover:text-red-700 transition-colors"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link
                to="/mi-cuenta"
                className="text-2xl font-semibold text-[#2C5E8D] hover:text-[#1a3d5c] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Mi Cuenta
              </Link>
            )}
          </nav>
        </div>
      )}

      {/* Spacer for sticky header */}
      <div className="h-24 md:h-28" />
    </>
  );
}
