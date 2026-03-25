import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";

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
              className="h-24 w-auto object-contain mb-3"
              style={{ filter: "brightness(2.2)" }}
            />
            <p className="text-[#AECBE9] text-sm text-center md:text-left max-w-xs">
              Conectamos espacios disponibles con personas que los necesitan.
            </p>
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
              <li><a href="#" className="text-white hover:text-[#AECBE9] transition-colors text-sm">Términos y Condiciones</a></li>
              <li><a href="#" className="text-white hover:text-[#AECBE9] transition-colors text-sm">Política de Privacidad</a></li>
              <li><a href="#" className="text-white hover:text-[#AECBE9] transition-colors text-sm">Aviso Legal</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#AECBE9]/30 pt-4 text-center text-[#AECBE9] text-xs">
          © {new Date().getFullYear()} RaumLog. Todos los derechos reservados.
        </div>
      </div>

      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/1234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </footer>
  );
}
