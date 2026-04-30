import { X, Search, Filter } from "lucide-react";
import type { SpacesQuery } from "@workspace/api-zod";

interface FilterSidebarProps {
  query: SpacesQuery;
  updateQuery: (newQuery: Partial<SpacesQuery>) => void;
  totalResults: number;
}

const ALL_CATEGORIES = ["General", "Muebles", "Cajas", "Vehículos", "Electrodomésticos"];
const ALL_ACCESS = ["24/7", "Con cita", "Solo entrega"];
const ACCESS_LABELS: Record<string, string> = {
  "24/7": "Acceso 24/7",
  "Con cita": "Acceso con citas programadas",
  "Solo entrega": "Solo entrega",
};

export function FilterSidebar({ query, updateQuery, totalResults }: FilterSidebarProps) {
  const activeCount = 
    (query.category ? 1 : 0) + 
    (query.accessType ? 1 : 0) + 
    (query.minPrice !== undefined || query.maxPrice !== undefined ? 1 : 0);

  return (
    <div className="bg-white rounded-xl border border-[#AECBE9]/30 p-8 shadow-md">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-[#2C5E8D] leading-tight flex items-center gap-2 uppercase tracking-wide">
            <Filter className="w-5 h-5 text-gray-300" /> Refinar búsqueda
          </h2>
          <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-semibold">{totalResults} Espacios Disponibles</p>
        </div>
        {activeCount > 0 && (
          <button 
            onClick={() => updateQuery({ category: undefined, accessType: undefined, minPrice: undefined, maxPrice: undefined })}
            className="text-[10px] font-bold text-red-400 hover:text-red-500 transition-colors flex items-center gap-1 uppercase tracking-widest"
          >
            <X className="w-3 h-3" /> Limpiar Todo
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-4">Filtrar por Categoría</label>
          <div className="flex flex-wrap gap-2">
            {["Todos", ...ALL_CATEGORIES].map(c => {
               const isSelected = (c === "Todos" && !query.category) || (query.category === c);
               return (
                <button 
                  key={c} 
                  onClick={() => updateQuery({ category: c === "Todos" ? undefined : c as any })}
                  className={`px-4 py-2 rounded text-[10px] font-bold transition-all border ${isSelected ? "bg-[#2C5E8D] text-white border-[#2C5E8D]" : "bg-white text-gray-500 border-gray-100 hover:bg-gray-50 uppercase"}`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        <div>
           <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-4">Tipo de Acceso</label>
           <div className="flex flex-wrap gap-2">
            {["Todos", ...ALL_ACCESS].map(a => {
               const isSelected = (a === "Todos" && !query.accessType) || (query.accessType === a);
               const label = a === "Todos" ? "Todos" : (ACCESS_LABELS[a] || a);
               return (
                <button 
                  key={a} 
                  onClick={() => updateQuery({ accessType: a === "Todos" ? undefined : a as any })}
                  className={`px-4 py-2 rounded text-[10px] font-bold transition-all border ${isSelected ? "bg-[#2C5E8D] text-white border-[#2C5E8D]" : "bg-white text-gray-500 border-gray-100 hover:bg-gray-50 uppercase"}`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
           <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-4">Rango de Precio Mensual</label>
           <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-300">$</span>
                <input 
                  type="number" 
                  placeholder="Min" 
                  className="w-full bg-white border border-[#AECBE9] rounded-lg py-2.5 pl-6 pr-3 text-xs focus:ring-2 focus:ring-[#2C5E8D]/10 outline-none transition-all"
                  value={query.minPrice || ""}
                  onChange={(e) => updateQuery({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
              <div className="w-2 h-px bg-gray-200" />
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-300">$</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  className="w-full bg-white border border-[#AECBE9] rounded-lg py-2.5 pl-6 pr-3 text-xs focus:ring-2 focus:ring-[#2C5E8D]/10 outline-none transition-all"
                  value={query.maxPrice || ""}
                  onChange={(e) => updateQuery({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
