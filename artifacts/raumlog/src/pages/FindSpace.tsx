import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, AlertCircle, Box, Filter } from "lucide-react";
import { useSpaces, type SpaceDTO, type SpacesQuery } from "@/hooks/useSpaces";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { SpaceCard } from "@/components/Listing/SpaceCard";
import { Pagination } from "@/components/Listing/Pagination";
import { FilterSidebar } from "@/components/Listing/FilterSidebar";
import { BookingModal } from "@/components/FindSpace/BookingModal";

export default function FindSpace() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [query, setQuery] = useState<SpacesQuery>({
    limit: 6,
    offset: 0,
  });

  // Guest restriction: Redirect if searching, filtering or paginating beyond page 1
  useEffect(() => {
    const isGuestAction = query.offset! > 0 || query.search || (query.category && query.category !== "General") || !!query.minPrice || !!query.maxPrice;
    if (!user && isGuestAction) {
      navigate("/auth?redirigir=/encuentra-tu-espacio", { replace: true });
    }
  }, [user, query.offset, query.search, query.category, query.minPrice, query.maxPrice, navigate]);

  const { data, loading, error } = useSpaces(query);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<SpaceDTO | null>(null);

  const updateQuery = (updates: Partial<SpacesQuery>) => {
    setQuery((prev: SpacesQuery) => ({
      ...prev,
      ...updates,
      offset: updates.offset !== undefined ? updates.offset : 0
    }));
  };

  useEffect(() => {
    if (data?.meta?.totalCount !== undefined && query.offset !== undefined && query.limit !== undefined) {
      const totalPages = Math.ceil(data.meta.totalCount / query.limit);
      const currentPage = Math.floor(query.offset / query.limit);
      if (currentPage >= totalPages && totalPages > 0) {
        const prevOffset = Math.max(0, (totalPages - 1) * query.limit);
        setQuery((prev: SpacesQuery) => ({ ...prev, offset: prevOffset }));
      }
    }
  }, [data, query.limit, query.offset]);

  const onSelectSpace = (space: SpaceDTO) => {
    if (!user) {
      navigate("/auth?redirigir=/encuentra-tu-espacio", { replace: true });
      return;
    }
    setSelectedSpace(space);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery({ search: searchTerm });
  };

  const currentPage = Math.floor((query.offset || 0) / (query.limit || 12));

  return (
    <div className="min-h-screen flex flex-col bg-white font-body">
      <Header />
      {selectedSpace && <BookingModal space={selectedSpace} onClose={() => setSelectedSpace(null)} />}

      <main className="flex-1">
        <section className="bg-[#2C5E8D] py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl text-white font-bold mb-8 uppercase tracking-wide leading-tight">
              Encuentra tu espacio ideal
            </h1>

            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  className="w-full bg-white border-none rounded-lg py-4 pl-12 pr-4 text-[#2C5E8D] placeholder-gray-400 font-medium outline-none shadow-lg"
                  placeholder="Ciudad, barrio o tipo de espacio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button type="submit" className="bg-[#E8A838] px-8 py-4 rounded-lg font-bold text-[#1a3d5c] shadow-lg hover:bg-orange-400 transition-all uppercase tracking-wide">BUSCAR</button>
            </form>
          </div>
        </section>

        <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-12">
            <div>
              <h2 className="text-2xl font-bold text-[#2C5E8D] uppercase tracking-wide">Espacios Disponibles</h2>
              <div className="h-1 w-16 bg-[#E8A838] mt-2 rounded-full" />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg border font-bold text-xs uppercase tracking-widest transition-all ${showFilters ? "bg-[#2C5E8D] text-white border-[#2C5E8D]" : "bg-white text-[#2C5E8D] border-[#AECBE9]/50 hover:bg-gray-50"}`}
            >
              <Filter className="w-4 h-4" />
              {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
            </button>
          </div>

          {showFilters && (
            <div className="mb-12">
              <FilterSidebar
                query={query as any}
                updateQuery={updateQuery}
                totalResults={data?.meta?.totalCount || 0}
              />
            </div>
          )}

          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-[#AECBE9]/30 border-t-[#2C5E8D] rounded-full animate-spin mb-4" />
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cargando resultados...</p>
            </div>
          ) : error ? (
            <div className="py-16 bg-red-50 rounded-2xl border border-red-100 p-10 text-center max-w-xl mx-auto">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-red-800 mb-1 uppercase tracking-tight">Error de Conexión</h3>
              <p className="text-red-600/70 text-sm leading-relaxed">{error.message}</p>
            </div>
          ) : data?.data.length === 0 ? (
            <div className="py-24 text-center border-2 border-dashed border-gray-200 rounded-2xl">
              <Box className="w-12 h-12 text-gray-300 mx-auto mb-4 opacity-40" />
              <h3 className="text-xl font-bold text-gray-400 mb-2 uppercase">No hay resultados</h3>
              <p className="text-gray-400 text-sm">Prueba ajustando los filtros o realizando otra búsqueda.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {data?.data.map((space: SpaceDTO) => (
                  <SpaceCard key={space.id} space={space} onClick={onSelectSpace} />
                ))}
              </div>

              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={data?.meta?.totalPages || 0}
                  onPageChange={(p) => updateQuery({ offset: p * (query.limit || 6) })}
                />
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
