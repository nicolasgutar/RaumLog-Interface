import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const slides = [
  {
    image: "/storage-garage.png",
    caption: "Tu Garaje",
    alt: "Garaje organizado con estantes, bicicleta y cajas etiquetadas",
  },
  {
    image: "/storage-organized.png",
    caption: "Un Cuarto Ordenado",
    alt: "Cuarto de almacenamiento moderno con cajas organizadas en estantes",
  },
  {
    image: "/storage-room.png",
    caption: "El Deposito Olvidado",
    alt: "Habitación con cajas de mudanza y artículos almacenados",
  },
];

export default function HostSection() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#D8CFC3]/30" aria-label="Para anfitriones">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text content */}
          <div className="flex-1 max-w-lg">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-[#2C5E8D] leading-tight mb-6 uppercase tracking-wide">
              ¿Tienes espacio libre en<br />casa o en tu negocio?
            </h2>
            <p className="text-[#2C5E8D]/80 text-base sm:text-lg leading-relaxed mb-8 font-sans">
              Ponlo a generar ingresos sin complicaciones. En RaumLog conectamos
              tu espacio disponible con personas que lo necesitan, de forma
              simple, segura y completamente digital. Tú decides cuándo, a
              quién y en qué condiciones. Sin contratos largos, sin burocracia,
              sin riesgos.
            </p>
            <Link
              to="/ofrece-tu-espacio"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-[#2C5E8D] text-[#2C5E8D] hover:bg-[#2C5E8D] hover:text-white font-semibold rounded transition-colors text-sm tracking-wider uppercase"
            >
              Regístralo hoy y empieza a ganar
            </Link>
          </div>

          {/* Image carousel */}
          <div className="flex-1 w-full max-w-lg relative">
            <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[4/3]">
              <img
                src={slides[current].image}
                alt={slides[current].alt}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 bg-[#2C5E8D]/85 text-white text-center py-3 text-sm font-semibold tracking-wide">
                {slides[current].caption}
              </div>

              {/* Arrows */}
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#2C5E8D] w-9 h-9 rounded-full flex items-center justify-center shadow transition-colors"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#2C5E8D] w-9 h-9 rounded-full flex items-center justify-center shadow transition-colors"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-3">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i === current ? "bg-[#2C5E8D]" : "bg-[#AECBE9]"
                  }`}
                  aria-label={`Ir a diapositiva ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
