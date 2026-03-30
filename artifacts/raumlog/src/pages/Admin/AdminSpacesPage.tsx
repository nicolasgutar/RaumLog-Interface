import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { useAuthStore } from '@/store/authStore';
import { fetchAdminSpacesV2, toggleSpaceVisibility, adminDeleteSpace } from '@/lib/api';
import { 
  Search, 
  MapPin, 
  Eye, 
  EyeOff, 
  Trash2, 
  ChevronRight,
  Warehouse,
  DollarSign,
  User as UserIcon,
  Layers,
  Calendar,
  Info,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AdminSpace {
  id: number;
  ownerId: string;
  spaceType: string;
  city: string;
  address: string;
  description: string;
  priceMonthly: string;
  isVisible: boolean;
  published: boolean;
  createdAt: string;
  ownerName?: string;
  ownerEmail?: string;
}

const AdminSpacesPage: React.FC = () => {
  const { idToken } = useAuthStore();
  const [spaces, setSpaces] = useState<AdminSpace[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<AdminSpace | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const loadSpaces = async () => {
    if (!idToken) return;
    setLoading(true);
    try {
      const data = await fetchAdminSpacesV2(idToken, page);
      const spaceList = data.data || [];
      setSpaces(spaceList);
      setTotal(data.meta?.totalCount || 0);
      
      if (spaceList.length > 0 && !selectedSpace) {
        setSelectedSpace(spaceList[0]);
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al cargar espacios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpaces();
  }, [page, idToken]);

  const handleToggleVisibility = async (spaceId: number, currentStatus: boolean) => {
    if (!idToken) return;
    try {
      await toggleSpaceVisibility(idToken, spaceId, !currentStatus);
      toast.success(!currentStatus ? 'Espacio visible' : 'Espacio oculto');
      setSpaces(prev => prev.map(s => s.id === spaceId ? { ...s, isVisible: !currentStatus } : s));
      if (selectedSpace?.id === spaceId) {
        setSelectedSpace(prev => prev ? { ...prev, isVisible: !currentStatus } : null);
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al actualizar visibilidad');
    }
  };

  const handleDelete = async (spaceId: number) => {
    if (!idToken) return;
    if (!window.confirm('¿Estás seguro de que deseas eliminar este espacio? Esta acción no se puede deshacer y fallará si hay reservas activas.')) return;
    
    try {
      await adminDeleteSpace(idToken, spaceId);
      toast.success('Espacio eliminado con éxito');
      setSpaces(prev => prev.filter(s => s.id !== spaceId));
      if (selectedSpace?.id === spaceId) {
        setSelectedSpace(null);
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al eliminar el espacio');
    }
  };

  return (
    <AdminLayout>
      <div className="flex gap-6 h-[calc(100vh-14rem)]">
        {/* Left Column: List */}
        <div className="w-1/3 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Warehouse className="w-4 h-4 text-primary" /> Inventario de Espacios
            </h3>
            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">{total} TOTAL</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-4 animate-pulse flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-100 rounded w-2/3"></div>
                    <div className="h-2 bg-slate-50 rounded w-1/3"></div>
                  </div>
                </div>
              ))
            ) : (!spaces || spaces.length === 0) ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <Warehouse className="w-12 h-12 mb-3 opacity-20" />
                <p className="font-medium">No hay espacios registrados</p>
              </div>
            ) : (
              spaces.map((space) => (
                <button
                  key={space.id}
                  onClick={() => setSelectedSpace(space)}
                  className={cn(
                    "w-full flex items-center gap-4 p-3 rounded-xl transition-all text-left",
                    selectedSpace?.id === space.id 
                      ? "bg-primary/5 border border-primary/10" 
                      : "hover:bg-slate-50 border border-transparent"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 overflow-hidden relative",
                    selectedSpace?.id === space.id ? "bg-primary text-white shadow-sm" : "bg-slate-100 text-slate-400"
                  )}>
                    {/* Placeholder or small image */}
                    < Warehouse className="w-6 h-6" />
                    {!space.isVisible && (
                        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                            <EyeOff className="w-4 h-4 text-white" />
                        </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <p className={cn(
                        "font-bold text-sm truncate",
                        selectedSpace?.id === space.id ? "text-primary" : "text-slate-900"
                        )}>{space.spaceType}</p>
                        {!space.isVisible && (
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded leading-none shrink-0 uppercase tracking-tighter">Oculto</span>
                        )}
                    </div>
                    <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-300" /> {space.city} · {space.address}
                    </p>
                  </div>
                  <ChevronRight className={cn(
                    "w-4 h-4 transition-transform",
                    selectedSpace?.id === space.id ? "text-primary translate-x-1" : "text-slate-300"
                  )} />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-w-0">
          {selectedSpace ? (
            <>
              <div className="p-8 border-b border-slate-100 flex justify-between items-start bg-slate-50/50 relative">
                <div className="flex gap-6 items-center">
                   <div className="w-24 h-24 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex items-center justify-center">
                      <Warehouse className="w-12 h-12 text-primary/40" />
                   </div>
                   <div>
                     <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-slate-900">{selectedSpace.spaceType}</h2>
                        <span className={cn(
                            "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                            selectedSpace.isVisible 
                                ? "bg-green-100 text-green-700" 
                                : "bg-slate-200 text-slate-600"
                        )}>
                            {selectedSpace.isVisible ? 'Público' : 'Privado/Oculto'}
                        </span>
                     </div>
                     <p className="text-slate-500 flex items-center gap-1.5 mt-1 font-medium italic">
                        <Info className="w-4 h-4" /> {selectedSpace.city}, {selectedSpace.address}
                     </p>
                   </div>
                </div>
                
                <div className="flex gap-2">
                   <button
                    onClick={() => handleToggleVisibility(selectedSpace.id, selectedSpace.isVisible)}
                    className={cn(
                        "px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2",
                        selectedSpace.isVisible 
                        ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        : "bg-primary text-white hover:bg-primary/90"
                    )}
                    >
                    {selectedSpace.isVisible ? (
                        <> <EyeOff className="w-4 h-4" /> Ocultar </>
                    ) : (
                        <> <Eye className="w-4 h-4" /> Hacer Visible </>
                    )}
                   </button>
                   <button
                    onClick={() => handleDelete(selectedSpace.id)}
                    className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all border border-red-100"
                    title="Eliminar Espacio"
                    >
                    <Trash2 className="w-5 h-5" />
                   </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm transition-all hover:bg-slate-100/50">
                    <DollarSign className="w-5 h-5 text-primary mb-3" />
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Precio Mensual</p>
                    <p className="text-xl font-black text-slate-900 mt-1">${selectedSpace.priceMonthly}</p>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm transition-all hover:bg-slate-100/50">
                    <Layers className="w-5 h-5 text-primary mb-3" />
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Estado Registro</p>
                    <p className="text-xl font-black text-slate-900 mt-1">
                      {selectedSpace.published ? 'Publicado' : 'Draft'}
                    </p>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm transition-all hover:bg-slate-100/50">
                    <Calendar className="w-5 h-5 text-primary mb-3" />
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Fecha Creación</p>
                    <p className="text-xl font-black text-slate-900 mt-1">
                      {new Date(selectedSpace.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                   <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Propietario del Espacio</h3>
                   <div className="p-6 bg-white border border-slate-200 rounded-2xl flex items-center gap-5">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                         {selectedSpace.ownerName?.charAt(0) || <UserIcon className="w-6 h-6" />}
                      </div>
                      <div>
                         <p className="font-bold text-slate-900">{selectedSpace.ownerName || 'Propietario desconocido'}</p>
                         <p className="text-sm text-slate-500">{selectedSpace.ownerEmail || 'Email no disponible'}</p>
                      </div>
                      <button className="ml-auto p-2.5 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all text-primary font-bold text-sm flex items-center gap-2">
                         Ver Perfil <ExternalLink className="w-4 h-4" />
                      </button>
                   </div>
                </div>

                <div>
                   <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Descripción Detallada</h3>
                   <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 relative">
                      <div className="absolute top-4 left-4 text-primary opacity-20">
                         <Info className="w-12 h-12" />
                      </div>
                      <p className="text-slate-700 leading-relaxed font-medium relative z-10 pl-2">
                        {selectedSpace.description || 'Este espacio aún no tiene una descripción detallada cargada.'}
                      </p>
                   </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Warehouse className="w-10 h-10 opacity-20" />
              </div>
              <h3 className="text-lg font-bold text-slate-600">Gestión de Inventario</h3>
              <p className="max-w-xs mt-2 text-sm">Selecciona un espacio de la lista para ver sus detalles, ajustar su visibilidad o gestionar su permanencia en la plataforma.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSpacesPage;
