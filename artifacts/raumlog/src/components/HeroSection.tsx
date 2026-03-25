import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[75vh] flex items-center justify-start overflow-hidden"
      aria-label="Sección principal"
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=1600&q=80"
          alt="Espacio de almacenamiento tipo bodega"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1a3d5c]/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6 uppercase tracking-wide">
            Almacena tus cosas<br />de forma segura
          </h1>
          <p className="text-[#AECBE9] text-lg sm:text-xl mb-10 font-sans leading-relaxed">
            Encuentra garajes, cuartos útiles y bodegas disponibles cerca de ti.
            Simple, seguro y completamente digital.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/encuentra-tu-espacio"
              className="inline-flex items-center justify-center px-8 py-3 bg-[#2C5E8D] hover:bg-[#1a3d5c] text-white font-semibold rounded transition-colors text-sm tracking-wider uppercase"
            >
              Almacena con RaumLog
            </Link>
            <Link
              to="/ofrece-tu-espacio"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-[#2C5E8D] font-semibold rounded transition-colors text-sm tracking-wider uppercase"
            >
              Gana con RaumLog
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
