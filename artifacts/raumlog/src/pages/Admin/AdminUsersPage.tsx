import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { useAuthStore } from '@/store/authStore';
import { fetchAdminUsers, verifyHost, fetchAdminUserDetails } from '@/lib/api';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  FileText,
  ExternalLink,
  ChevronRight,
  User as UserIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AdminUser {
  id: number;
  uid: string;
  email: string;
  name: string;
  phone: string;
  type: string;
  isVerified: boolean;
  isOnboardingComplete: boolean;
  createdAt: string;
  kyc?: {
    cedulaData: string;
    cedulaFilename: string;
    rutData: string;
    rutFilename: string;
    status: string;
  } | null;
}

const AdminUsersPage: React.FC = () => {
  const { idToken } = useAuthStore();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const loadUsers = async () => {
    if (!idToken) return;
    setLoading(true);
    try {
      const data = await fetchAdminUsers(idToken, page, search, sort, order);
      const userList = data.data || [];
      setUsers(userList);
      setTotal(data.meta?.totalCount || 0);
      
      if (userList.length > 0 && !selectedUser) {
        setSelectedUser(userList[0]);
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, sort, order, idToken]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadUsers();
  };

  const handleSelectUser = async (user: AdminUser) => {
    if (!idToken) return;
    try {
      const details = await fetchAdminUserDetails(idToken, user.uid);
      setSelectedUser(details.user);
    } catch (err: any) {
      toast.error(err.message || 'Error al cargar detalles del usuario');
      setSelectedUser(user); // Fallback to list data
    }
  };

  const handleToggleVerify = async (userUid: string, currentStatus: boolean) => {
    if (!idToken) return;
    try {
      await verifyHost(idToken, userUid, !currentStatus);
      toast.success(currentStatus ? 'Usuario desverificado' : 'Usuario verificado con éxito');
      setUsers(prev => prev.map(u => u.uid === userUid ? { ...u, isVerified: !currentStatus } : u));
      if (selectedUser?.uid === userUid) {
        setSelectedUser(prev => prev ? { ...prev, isVerified: !currentStatus } : null);
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al actualizar verificación');
    }
  };

  return (
    <AdminLayout>
      <div className="flex gap-6 h-[calc(100vh-14rem)]">
        {/* Left Column: List */}
        <div className="w-1/3 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
            
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
               <span>{total} Usuarios</span>
               <div className="flex items-center gap-2">
                 <select 
                    className="bg-transparent border-none p-0 focus:ring-0 cursor-pointer hover:text-primary transition-colors text-xs font-bold"
                    value={`${sort}-${order}`}
                    onChange={(e) => {
                      const [newSort, newOrder] = e.target.value.split('-');
                      setSort(newSort);
                      setOrder(newOrder as 'asc' | 'desc');
                    }}
                 >
                   <option value="name-asc">Nombre (A-Z)</option>
                   <option value="name-desc">Nombre (Z-A)</option>
                   <option value="createdAt-desc">Más recientes</option>
                   <option value="createdAt-asc">Más antiguos</option>
                 </select>
               </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 animate-pulse flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                    <div className="h-2 bg-slate-50 rounded w-1/3"></div>
                  </div>
                </div>
              ))
            ) : (!users || users.length === 0) ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <Search className="w-12 h-12 mb-3 opacity-20" />
                <p className="font-medium">No se encontraron usuarios</p>
                <p className="text-sm">Prueba con otros términos de búsqueda</p>
              </div>
            ) : (
              users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group",
                    selectedUser?.id === user.id 
                      ? "bg-primary/5 border border-primary/10" 
                      : "hover:bg-slate-50 border border-transparent"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0",
                    selectedUser?.id === user.id ? "bg-primary text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                  )}>
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-semibold text-sm truncate",
                      selectedUser?.id === user.id ? "text-primary" : "text-slate-900"
                    )}>{user.name || 'Sin nombre'}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  {user.isVerified && (
                    <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
                  )}
                  <ChevronRight className={cn(
                    "w-4 h-4 transition-transform",
                    selectedUser?.id === user.id ? "text-primary translate-x-1" : "text-slate-300"
                  )} />
                </button>
              ))
            )}
          </div>
          
          {/* Pagination bar could go here */}
        </div>

        {/* Right Column: Details */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-w-0">
          {selectedUser ? (
            <>
              <div className="p-8 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                <div className="flex gap-5 items-center">
                  <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-3xl font-bold text-primary">
                    {selectedUser.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{selectedUser.name || 'Usuario sin nombre'}</h2>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                        {selectedUser.type}
                      </span>
                      {selectedUser.isVerified ? (
                        <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Verificado
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold uppercase tracking-wider">
                          Pendiente de Verificación
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleToggleVerify(selectedUser.uid, selectedUser.isVerified)}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2",
                    selectedUser.isVerified 
                      ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      : "bg-primary text-white hover:bg-primary-dark hover:shadow-primary/20"
                  )}
                >
                  {selectedUser.isVerified ? (
                    <> <XCircle className="w-4 h-4" /> Quitar Verificación </>
                  ) : (
                    <> <CheckCircle2 className="w-4 h-4" /> Verificar Usuario </>
                  )}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                {/* Contact Info */}
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Información de Contacto</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-primary">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Email</p>
                        <p className="text-sm font-semibold text-slate-900">{selectedUser.email}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-primary">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Teléfono</p>
                        <p className="text-sm font-semibold text-slate-900">{selectedUser.phone || 'No registrado'}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-primary">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Miembro desde</p>
                        <p className="text-sm font-semibold text-slate-900">
                          {new Date(selectedUser.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-primary">
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">User ID</p>
                        <p className="text-sm font-mono text-slate-900 leading-none mt-1">{selectedUser.uid.substring(0, 12)}...</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* KYC / Documents */}
                <div>
                   <div className="flex items-center justify-between mb-4">
                     <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Documentos y Verificación</h3>
                     {selectedUser.kyc ? (
                        <span className={cn(
                            "text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter",
                            selectedUser.kyc.status === 'approved' ? 'bg-green-100 text-green-700' : 
                            selectedUser.kyc.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        )}>
                            KYC {selectedUser.kyc.status}
                        </span>
                     ) : (
                        <span className="text-[10px] font-black bg-slate-100 text-slate-400 px-2 py-0.5 rounded uppercase tracking-tighter">Sin Documentos</span>
                     )}
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      {/* Cedula */}
                      <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                        <div className="bg-slate-50 p-3 flex items-center justify-between border-b border-slate-100">
                          <span className="text-xs font-bold text-slate-700 truncate">Documento Identidad</span>
                          {selectedUser.kyc?.cedulaData && (
                            <a href={selectedUser.kyc.cedulaData} target="_blank" rel="noreferrer" className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                <ExternalLink className="w-3 h-3 text-primary" />
                            </a>
                          )}
                        </div>
                        <div className="aspect-[4/3] bg-slate-100 flex items-center justify-center p-2">
                           {selectedUser.kyc?.cedulaData ? (
                             selectedUser.kyc.cedulaData.includes('pdf') || selectedUser.kyc.cedulaData.includes('application/pdf') ? (
                               <iframe src={selectedUser.kyc.cedulaData} className="w-full h-full rounded" title="cedula-preview" />
                             ) : (
                               <img src={selectedUser.kyc.cedulaData} className="w-full h-full object-contain rounded" alt="cedula-preview" />
                             )
                           ) : (
                             <FileText className="w-8 h-8 text-slate-300 opacity-50" />
                           )}
                        </div>
                      </div>

                      {/* RUT */}
                      <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                        <div className="bg-slate-50 p-3 flex items-center justify-between border-b border-slate-100">
                          <span className="text-xs font-bold text-slate-700 truncate">RUT / Recibo</span>
                          {selectedUser.kyc?.rutData && (
                            <a href={selectedUser.kyc.rutData} target="_blank" rel="noreferrer" className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                <ExternalLink className="w-3 h-3 text-primary" />
                            </a>
                          )}
                        </div>
                        <div className="aspect-[4/3] bg-slate-100 flex items-center justify-center p-2">
                           {selectedUser.kyc?.rutData ? (
                             selectedUser.kyc.rutData.includes('pdf') || selectedUser.kyc.rutData.includes('application/pdf') ? (
                               <iframe src={selectedUser.kyc.rutData} className="w-full h-full rounded" title="rut-preview" />
                             ) : (
                               <img src={selectedUser.kyc.rutData} className="w-full h-full object-contain rounded" alt="rut-preview" />
                             )
                           ) : (
                             <FileText className="w-8 h-8 text-slate-300 opacity-50" />
                           )}
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <UserIcon className="w-10 h-10 opacity-20" />
              </div>
              <h3 className="text-lg font-bold text-slate-600">Selecciona un usuario</h3>
              <p className="max-w-xs mt-2 text-sm">Elige un usuario de la lista de la izquierda para ver su perfil completo y gestionar su estado.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsersPage;
