/**
 * HeroSection — Sección principal de la página de inicio de RaumLog.
 *
 * Muestra una imagen de fondo con overlay, headline de marca,
 * propuesta de valor, estadísticas de confianza, y los dos CTA
 * principales: "Almacena" y "Gana como anfitrión".
 */
import { Link } from "react-router-dom";
import { MapPin, Shield, ArrowRight } from "lucide-react";

const STATS = [
  { icon: MapPin, label: "Ciudades", value: "2" },
  { icon: Shield, label: "Contratos digitales", value: "100%" },
];

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[88vh] flex items-center justify-start overflow-hidden"
      aria-label="Sección principal"
    >
      {/* ── Background ── */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=1600&q=80"
          alt="Bodega de almacenamiento moderna"
          className="w-full h-full object-cover"
          loading="eager"
        />
        {/* Gradient overlay — darker on left for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d2235]/85 via-[#1a3d5c]/70 to-[#2C5E8D]/30" />
        {/* Subtle bottom vignette */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0d2235]/50 to-transparent" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-2xl">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8A838] animate-pulse" />
            Medellín · Bogotá — Disponible ahora
          </div>

          {/* Headline */}
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.05] mb-6 uppercase tracking-tight">
            Almacena<br />
            <span className="text-[#AECBE9]">con confianza.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-white/75 text-lg sm:text-xl mb-10 font-sans leading-relaxed max-w-lg">
            Conectamos personas que necesitan espacio con vecinos que lo tienen disponible.
            Contratos digitales, pagos seguros y seguro ante incidentes.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-14">
            <Link
              to="/encuentra-tu-espacio"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2C5E8D] hover:bg-[#1a3d5c] text-white font-bold rounded-lg transition-all text-sm tracking-wider uppercase shadow-lg shadow-[#2C5E8D]/40 hover:shadow-[#2C5E8D]/60 hover:-translate-y-0.5"
            >
              Busca tu espacio
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/ofrece-tu-espacio"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/70 text-white hover:bg-white hover:text-[#2C5E8D] font-bold rounded-lg transition-all text-sm tracking-wider uppercase backdrop-blur-sm"
            >
              Gana como anfitrión
            </Link>
          </div>

          {/* Trust stats */}
          <div className="flex flex-wrap gap-6 sm:gap-10">
            {STATS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[#AECBE9]" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg leading-none">{value}</p>
                  <p className="text-white/60 text-xs mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40 hidden sm:flex">
        <span className="text-[10px] uppercase tracking-widest">Explorar</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
