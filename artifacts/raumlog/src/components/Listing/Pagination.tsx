import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-8 py-8 border-t border-[#AECBE9]/20">
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#AECBE9]/40 text-xs font-bold text-[#2C5E8D] hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent uppercase tracking-wider"
      >
        <ChevronLeft className="w-4 h-4" /> Anterior
      </button>
      
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button 
            key={i} 
            onClick={() => onPageChange(i)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${currentPage === i ? "bg-[#2C5E8D] text-white shadow-sm" : "hover:bg-gray-50 text-gray-500"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      
      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#AECBE9]/40 text-xs font-bold text-[#2C5E8D] hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent uppercase tracking-wider"
      >
        Siguiente <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
