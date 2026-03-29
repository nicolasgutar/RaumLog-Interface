import { Home, Package, Box, Car, Tv, MapPin } from "lucide-react";
import type { SpaceDTO } from "@workspace/api-zod";

interface SpaceCardProps {
  space: SpaceDTO;
  onClick: (space: SpaceDTO) => void;
}

function formatCOP(n: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
}

const CATEGORY_ICONS: Record<string, any> = {
  General: Box, Muebles: Home, Cajas: Package, Vehículos: Car, Electrodomésticos: Tv,
};

export function SpaceCard({ space, onClick }: SpaceCardProps) {
  const Icon = CATEGORY_ICONS[space.category] || Box;

  return (
    <div 
      className="bg-white rounded-xl overflow-hidden border border-[#AECBE9]/40 hover:shadow-md transition-shadow cursor-pointer group flex flex-col h-full"
      onClick={() => onClick(space)}
    >
      <div className="relative h-44 overflow-hidden">
        <img 
          src={space.images[0] || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80"} 
          alt={space.spaceType}
          className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-300" 
        />
        <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-[10px] font-bold text-[#2C5E8D] uppercase tracking-wider shadow-sm flex items-center gap-1">
          <Icon className="w-3 h-3" />
          {space.category}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="font-bold text-[#2C5E8D] text-lg leading-tight uppercase tracking-tight">{space.spaceType}</h3>
          <div className="text-right flex-shrink-0">
            <p className="text-[#2C5E8D] font-bold text-lg">{formatCOP(Number(space.priceMonthlyNum) || 0)}</p>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">/ mes</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
          <MapPin className="w-3.5 h-3.5" />
          <span className="uppercase tracking-tighter">{space.city} - {space.address}</span>
        </div>

        <p className="text-xs text-[#2C5E8D]/70 line-clamp-2 mb-4 leading-relaxed">
          {space.description}
        </p>
        
        <div className="mt-auto pt-4 border-t border-[#AECBE9]/20 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-[#2C5E8D]/40">
           <span>{space.accessType}</span>
           <span>{space.size}</span>
        </div>
      </div>
    </div>
  );
}
