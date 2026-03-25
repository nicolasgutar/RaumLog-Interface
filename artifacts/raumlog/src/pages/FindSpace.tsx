import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, MapPin, Filter, X, ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface Space {
  title: string;
  type: string;
  size: string;
  location: string;
  description: string;
  priceDaily: string;
  priceMonthly: string;
  priceAnnual: string;
  images: string[];
}

const spaces: Space[] = [
  {
    title: "Garaje en El Poblado",
    type: "Garaje",
    size: "20 m²",
    location: "Medellín, El Poblado",
    description: "Garaje amplio con portón eléctrico, buena iluminación y acceso seguro las 24 horas. Ideal para almacenar vehículos, muebles o mercancía.",
    priceDaily: "$35.000 COP",
    priceMonthly: "$650.000 COP",
    priceAnnual: "$6.500.000 COP",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
      "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=800&q=80",
    ],
  },
  {
    title: "Cuarto Útil en Laureles",
    type: "Cuarto Útil",
    size: "8 m²",
    location: "Medellín, Laureles",
    description: "Cuarto útil limpio y seco, con buena ventilación. Perfecto para guardar cajas, electrodomésticos o artículos del hogar de forma ordenada.",
    priceDaily: "$18.000 COP",
    priceMonthly: "$320.000 COP",
    priceAnnual: "$3.200.000 COP",
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1558618047-3d9b42c24b5d?w=800&q=80",
    ],
  },
  {
    title: "Bodega Industrial en Itagüí",
    type: "Bodega",
    size: "50 m²",
    location: "Itagüí, Medellín",
    description: "Bodega en zona industrial con fácil acceso vehicular, piso en concreto y techado completo. Ideal para negocios, almacenamiento de mercancía o archivo.",
    priceDaily: "$75.000 COP",
    priceMonthly: "$1.400.000 COP",
    priceAnnual: "$14.000.000 COP",
    images: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
      "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80",
      "https://images.unsplash.com/photo-1620801113793-1e8de77a1a2f?w=800&q=80",
    ],
  },
  {
    title: "Depósito en Envigado",
    type: "Depósito",
    size: "15 m²",
    location: "Envigado, Medellín",
    description: "Depósito en conjunto residencial cerrado, con vigilancia y cámaras de seguridad. Acceso con código personal, disponible todos los días.",
    priceDaily: "$25.000 COP",
    priceMonthly: "$480.000 COP",
    priceAnnual: "$4.800.000 COP",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80",
    ],
  },
  {
    title: "Garaje Doble en Bello",
    type: "Garaje",
    size: "35 m²",
    location: "Bello, Medellín",
    description: "Garaje doble con espacio para dos vehículos o gran capacidad de almacenamiento. Rejas de seguridad, iluminación LED y piso en baldosa.",
    priceDaily: "$55.000 COP",
    priceMonthly: "$1.000.000 COP",
    priceAnnual: "$10.000.000 COP",
    images: [
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
      "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=800&q=80",
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
    ],
  },
  {
    title: "Mini Bodega en Sabaneta",
    type: "Bodega",
    size: "12 m²",
    location: "Sabaneta, Medellín",
    description: "Mini bodega en zona comercial, seca y segura. Contrato flexible por días, meses o año. Acceso de lunes a sábado con aviso previo.",
    priceDaily: "$22.000 COP",
    priceMonthly: "$400.000 COP",
    priceAnnual: "$4.000.000 COP",
    images: [
      "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
      "https://images.unsplash.com/photo-1620801113793-1e8de77a1a2f?w=800&q=80",
    ],
  },
];

function SpaceModal({ space, onClose }: { space: Space; onClose: () => void }) {
  const [currentImg, setCurrentImg] = useState(0);

  const prev = () => setCurrentImg((i) => (i === 0 ? space.images.length - 1 : i - 1));
  const next = () => setCurrentImg((i) => (i === space.images.length - 1 ? 0 : i + 1));

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gallery */}
        <div className="relative aspect-video bg-gray-100 rounded-t-2xl overflow-hidden">
          <img
            src={space.images[currentImg]}
            alt={`${space.title} - foto ${currentImg + 1}`}
            className="w-full h-full object-cover"
          />
          {space.images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#2C5E8D] w-9 h-9 rounded-full flex items-center justify-center shadow transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#2C5E8D] w-9 h-9 rounded-full flex items-center justify-center shadow transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {space.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImg(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${i === currentImg ? "bg-white" : "bg-white/50"}`}
                  />
                ))}
              </div>
            </>
          )}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/80 hover:bg-white text-[#2C5E8D] w-9 h-9 rounded-full flex items-center justify-center shadow transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2 px-5 pt-4">
          {space.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrentImg(i)}
              className={`w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                i === currentImg ? "border-[#2C5E8D]" : "border-transparent"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Info */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <span className="text-xs bg-[#AECBE9]/40 text-[#2C5E8D] px-2 py-1 rounded font-medium">
                {space.type}
              </span>
              <h2 className="font-heading text-2xl text-[#1a3d5c] mt-2">{space.title}</h2>
              <p className="text-[#2C5E8D]/60 text-sm flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4" /> {space.location} &bull; {space.size}
              </p>
            </div>
          </div>

          <p className="text-[#2C5E8D]/80 text-sm mb-6 leading-relaxed">{space.description}</p>

          {/* Pricing */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-[#AECBE9]/20 rounded-xl p-4 text-center">
              <Calendar className="w-5 h-5 text-[#2C5E8D] mx-auto mb-1" />
              <p className="text-xs text-[#2C5E8D]/60 mb-1 font-medium uppercase tracking-wide">Precio Diario</p>
              <p className="font-bold text-[#2C5E8D] text-sm">{space.priceDaily}</p>
            </div>
            <div className="bg-[#2C5E8D]/10 rounded-xl p-4 text-center border-2 border-[#2C5E8D]/20">
              <Calendar className="w-5 h-5 text-[#2C5E8D] mx-auto mb-1" />
              <p className="text-xs text-[#2C5E8D]/60 mb-1 font-medium uppercase tracking-wide">Precio Mensual</p>
              <p className="font-bold text-[#2C5E8D] text-sm">{space.priceMonthly}</p>
            </div>
            <div className="bg-[#AECBE9]/20 rounded-xl p-4 text-center">
              <Calendar className="w-5 h-5 text-[#2C5E8D] mx-auto mb-1" />
              <p className="text-xs text-[#2C5E8D]/60 mb-1 font-medium uppercase tracking-wide">Precio Anual</p>
              <p className="font-bold text-[#2C5E8D] text-sm">{space.priceAnnual}</p>
            </div>
          </div>

          <a
            href={`https://api.whatsapp.com/send?phone=573054162141&text=Hola%2C+me+interesa+el+espacio+%22${encodeURIComponent(space.title)}%22`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 bg-[#2C5E8D] hover:bg-[#1a3d5c] text-white font-semibold rounded-lg transition-colors text-center text-sm tracking-wide"
          >
            Reservar este espacio
          </a>
        </div>
      </div>
    </div>
  );
}

export default function FindSpace() {
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {selectedSpace && (
        <SpaceModal space={selectedSpace} onClose={() => setSelectedSpace(null)} />
      )}
      <main className="flex-1 bg-gray-50">
        {/* Hero */}
        <section className="bg-[#2C5E8D] py-14 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading text-4xl lg:text-5xl text-white mb-4 uppercase tracking-wide">
              Encuentra tu espacio
            </h1>
            <p className="text-[#AECBE9] text-lg mb-8">
              Espacios disponibles en Medellín y el Área Metropolitana
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <div className="flex-1 flex items-center bg-white rounded-lg px-4 gap-2">
                <MapPin className="w-5 h-5 text-[#2C5E8D] flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Ciudad o barrio..."
                  className="flex-1 py-3 outline-none text-[#2C5E8D] placeholder-[#AECBE9]"
                />
              </div>
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-[#AECBE9] hover:bg-[#8ab5d9] text-[#2C5E8D] font-semibold rounded-lg transition-colors">
                <Search className="w-5 h-5" />
                Buscar
              </button>
            </div>
          </div>
        </section>

        {/* Listings */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading text-2xl text-[#2C5E8D] uppercase">Espacios disponibles</h2>
              <button className="flex items-center gap-2 text-[#2C5E8D] border border-[#AECBE9] px-4 py-2 rounded-lg hover:bg-[#AECBE9]/20 transition-colors text-sm">
                <Filter className="w-4 h-4" />
                Filtros
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {spaces.map((space, i) => (
                <article key={i} className="bg-white rounded-2xl shadow hover:shadow-md transition-shadow overflow-hidden">
                  <div className="relative">
                    <img src={space.images[0]} alt={space.title} className="w-full h-48 object-cover" />
                    <span className="absolute top-3 left-3 text-xs bg-white/90 text-[#2C5E8D] px-2 py-1 rounded font-medium shadow-sm">
                      {space.images.length} fotos
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs bg-[#AECBE9]/40 text-[#2C5E8D] px-2 py-1 rounded font-medium">
                        {space.type}
                      </span>
                      <span className="font-bold text-[#2C5E8D] text-sm">{space.priceMonthly}<span className="font-normal text-xs text-[#2C5E8D]/60">/mes</span></span>
                    </div>
                    <h3 className="font-semibold text-[#1a3d5c] text-lg mb-1">{space.title}</h3>
                    <p className="text-[#2C5E8D]/60 text-sm mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />{space.location}
                    </p>
                    <p className="text-[#2C5E8D]/60 text-sm mb-4">{space.size}</p>
                    <button
                      onClick={() => setSelectedSpace(space)}
                      className="w-full py-2 bg-[#2C5E8D] hover:bg-[#1a3d5c] text-white font-semibold rounded-lg transition-colors text-sm"
                    >
                      Ver detalles
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
