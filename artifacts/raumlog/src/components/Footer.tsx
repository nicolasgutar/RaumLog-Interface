import { Link } from "react-router-dom";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
    </svg>
  );
}


export default function Footer() {
  return (
    <footer className="bg-[#2C5E8D] text-white pt-10 pb-6 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo */}
          <div className="flex flex-col items-center md:items-start">
            <img
              src="/raumlog-logo-main.png"
              alt="RaumLog"
              className="h-32 w-auto object-contain mb-3"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <p className="text-[#AECBE9] text-sm text-center md:text-left max-w-xs mb-4">
              Conectamos espacios disponibles con personas que los necesitan.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/raumlog" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[#AECBE9] hover:text-white transition-colors">
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/company/raumlog" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-[#AECBE9] hover:text-white transition-colors">
                <LinkedInIcon className="w-5 h-5" />
              </a>
              <a href="https://www.tiktok.com/@raumlog" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-[#AECBE9] hover:text-white transition-colors">
                <TikTokIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Menú Rápido */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4 text-[#AECBE9] uppercase tracking-wide">
              Menú Rápido
            </h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-white hover:text-[#AECBE9] transition-colors text-sm">Inicio</Link></li>
              <li><Link to="/encuentra-tu-espacio" className="text-white hover:text-[#AECBE9] transition-colors text-sm">Encuentra tu espacio</Link></li>
              <li><Link to="/ofrece-tu-espacio" className="text-white hover:text-[#AECBE9] transition-colors text-sm">Ofrece tu espacio</Link></li>
              <li><Link to="/contacto" className="text-white hover:text-[#AECBE9] transition-colors text-sm">Contacto</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="text-center md:text-right">
            <h3 className="text-lg font-semibold mb-4 text-[#AECBE9] uppercase tracking-wide">
              Legal
            </h3>
            <ul className="space-y-2">
              <li><Link to="/terminos-y-condiciones" className="text-white hover:text-[#AECBE9] transition-colors text-sm">Términos y Condiciones</Link></li>
              <li><Link to="/politica-de-privacidad" className="text-white hover:text-[#AECBE9] transition-colors text-sm">Política de Privacidad</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#AECBE9]/30 pt-4 text-center text-[#AECBE9] text-xs">
          © {new Date().getFullYear()} RaumLog. Todos los derechos reservados.
        </div>
      </div>

    </footer>
  );
}
