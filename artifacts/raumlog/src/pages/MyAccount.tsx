import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { User, Lock, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

export default function MyAccount() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-[#AECBE9]/30 flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-[#2C5E8D]" />
              </div>
              <h1 className="font-heading text-3xl text-[#2C5E8D] uppercase tracking-wide">Mi Cuenta</h1>
              <p className="text-[#2C5E8D]/60 text-sm mt-1">Inicia sesión para continuar</p>
            </div>

            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Correo electrónico</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AECBE9]" />
                  <input
                    type="email"
                    className="w-full border border-[#AECBE9] rounded-lg pl-10 pr-4 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C5E8D] mb-1">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AECBE9]" />
                  <input
                    type="password"
                    className="w-full border border-[#AECBE9] rounded-lg pl-10 pr-4 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 bg-[#2C5E8D] hover:bg-[#1a3d5c] text-white font-semibold rounded-lg transition-colors tracking-wide">
                <LogIn className="w-5 h-5" />
                Iniciar sesión
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-[#2C5E8D]/70">
              ¿No tienes cuenta?{" "}
              <Link to="/ofrece-tu-espacio" className="text-[#2C5E8D] font-semibold hover:underline">
                Regístrate aquí
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
