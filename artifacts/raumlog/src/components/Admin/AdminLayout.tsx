import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { 
  Users, 
  LayoutDashboard, 
  Warehouse, 
  LogOut, 
  ChevronLeft,
  ShieldCheck,
  Settings,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, isLoading } = useAuthStore();
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect if not admin after loading
  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user || !user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const menuItems = [
    { icon: Users, label: 'Usuarios', path: '/admin/users' },
    { icon: Warehouse, label: 'Espacios', path: '/admin/spaces' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 left-0 z-50">
        <div className="p-6 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight">RaumLog <span className="text-primary text-xs ml-1 px-1.5 py-0.5 bg-primary/10 rounded-full font-medium">Admin</span></span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
                  isActive 
                    ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400 group-hover:text-primary")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-all font-medium group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Ir al Marketplace
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium group"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {menuItems.find(m => m.path === location.pathname)?.label || 'Panel de Administración'}
            </h1>
            <p className="text-slate-500 mt-1">Gestión administrativa de RaumLog</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                   <Users className="w-4 h-4 text-primary" />
                </div>
                <div className="text-sm">
                   <p className="font-semibold text-slate-900 leading-none">{user.name || 'Admin'}</p>
                   <p className="text-slate-500 text-xs mt-0.5">{user.email}</p>
                </div>
             </div>
          </div>
        </header>

        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;
