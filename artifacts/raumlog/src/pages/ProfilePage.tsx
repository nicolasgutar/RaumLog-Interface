import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth";
import { User, LogOut, Settings, LayoutDashboard, PlusCircle, Warehouse } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-[#AECBE9]/20 flex flex-col p-6 shadow-sm">
        <div className="mb-12 px-2">
           <img src="/raumlog-logo-main.png" alt="RaumLog" className="h-10 w-auto" />
        </div>

        <nav className="flex-1 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#2C5E8D]/5 text-[#2C5E8D] font-bold rounded-xl outline-none">
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 font-medium rounded-xl hover:bg-gray-50 transition-all">
                <PlusCircle className="w-5 h-5" />
                <span>Publicar Espacio</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 font-medium rounded-xl hover:bg-gray-50 transition-all">
                <Settings className="w-5 h-5" />
                <span>Ajustes</span>
            </button>
        </nav>

        <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 text-red-500/70 font-bold rounded-xl hover:bg-red-50 hover:text-red-50 transition-all outline-none"
        >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
          {/* Top Bar */}
          <header className="h-20 bg-white border-b border-[#AECBE9]/20 px-10 flex items-center justify-between">
              <h1 className="text-xl font-heading text-[#2C5E8D]">MI PERFIL</h1>
              <div className="flex items-center gap-4">
                   <div className="text-right">
                        <p className="text-sm font-bold text-[#2C5E8D]">{user?.name || user?.email}</p>
                        <p className="text-[10px] text-[#AECBE9] font-bold uppercase tracking-wider">{user?.role || 'Cliente'}</p>
                   </div>
                   <div className="w-10 h-10 rounded-full bg-[#2C5E8D]/10 flex items-center justify-center border border-[#2C5E8D]/20">
                        <User className="w-5 h-5 text-[#2C5E8D]" />
                   </div>
              </div>
          </header>

          <section className="p-10 flex-1">
               <div className="grid lg:grid-cols-3 gap-8">
                    {/* Welcome Card */}
                    <div className="lg:col-span-2 bg-[#2C5E8D] rounded-[2.5rem] p-10 text-white shadow-xl shadow-[#2C5E8D]/30 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/10 transition-all"></div>
                         <h2 className="text-4xl font-heading mb-4 relative z-10 transition-transform group-hover:translate-x-1">Hola, {user?.name?.split(' ')[0] || 'User'} 👋🏽</h2>
                         <p className="text-white/80 max-w-sm mb-8 relative z-10">Gestiona tus espacios y reservas desde un solo lugar de forma segura y eficiente.</p>
                         <button className="bg-white text-[#2C5E8D] font-bold px-8 py-3 rounded-full hover:shadow-lg hover:shadow-white/20 transition-all relative z-10">Explorar Dashborad</button>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white rounded-[2.5rem] border border-[#AECBE9]/30 p-10 shadow-sm flex flex-col items-center justify-center text-center">
                         <div className="w-16 h-16 rounded-3xl bg-[#AECBE9]/20 flex items-center justify-center mb-6">
                              <Warehouse className="w-8 h-8 text-[#2C5E8D]" />
                         </div>
                         <h4 className="text-4xl font-heading text-[#2C5E8D] mb-2 font-bold transition-transform hover:scale-105">0</h4>
                         <p className="text-sm text-gray-400 font-bold uppercase tracking-widest px-1">Espacios Publicados</p>
                    </div>
               </div>
          </section>
      </main>
    </div>
  );
}

