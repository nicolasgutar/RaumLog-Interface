import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, MapPin, Filter } from "lucide-react";

const spaces = [
  {
    title: "Garaje en Zona Norte",
    type: "Garaje",
    size: "20 m²",
    price: "$150/mes",
    location: "Madrid, Zona Norte",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  },
  {
    title: "Cuarto Útil Centro",
    type: "Cuarto Útil",
    size: "8 m²",
    price: "$80/mes",
    location: "Madrid, Centro",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400&q=80",
  },
  {
    title: "Bodega Industrial",
    type: "Bodega",
    size: "50 m²",
    price: "$350/mes",
    location: "Madrid, Sur",
    image: "https://images.unsplash.com/photo-1558618047-3d9b42c24b5d?w=400&q=80",
  },
];

export default function FindSpace() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        {/* Hero */}
        <section className="bg-[#2C5E8D] py-14 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading text-4xl lg:text-5xl text-white mb-4 uppercase tracking-wide">
              Encuentra tu espacio
            </h1>
            <p className="text-[#AECBE9] text-lg mb-8">
              Miles de espacios disponibles cerca de ti
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <div className="flex-1 flex items-center bg-white rounded-lg px-4 gap-2">
                <MapPin className="w-5 h-5 text-[#2C5E8D] flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Ciudad o zona..."
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
                  <img src={space.image} alt={space.title} className="w-full h-48 object-cover" />
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs bg-[#AECBE9]/40 text-[#2C5E8D] px-2 py-1 rounded font-medium">
                        {space.type}
                      </span>
                      <span className="font-bold text-[#2C5E8D]">{space.price}</span>
                    </div>
                    <h3 className="font-semibold text-[#1a3d5c] text-lg mb-1">{space.title}</h3>
                    <p className="text-[#2C5E8D]/60 text-sm mb-1">{space.location}</p>
                    <p className="text-[#2C5E8D]/60 text-sm mb-4">{space.size}</p>
                    <button className="w-full py-2 bg-[#2C5E8D] hover:bg-[#1a3d5c] text-white font-semibold rounded-lg transition-colors text-sm">
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
