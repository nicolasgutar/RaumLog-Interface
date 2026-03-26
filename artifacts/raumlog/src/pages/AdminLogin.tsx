import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "@/lib/api";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = await adminLogin(password);
      sessionStorage.setItem("adminToken", token);
      navigate("/admin/control");
    } catch {
      setError("Contraseña incorrecta. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#2C5E8D] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full bg-[#2C5E8D]/10 flex items-center justify-center mb-4">
            <Lock className="w-7 h-7 text-[#2C5E8D]" />
          </div>
          <h1 className="font-heading text-2xl text-[#2C5E8D] uppercase tracking-wide">
            Panel Administrador
          </h1>
          <p className="text-[#2C5E8D]/60 text-sm mt-1">RaumLog</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#2C5E8D] mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#AECBE9] rounded-lg px-4 py-2.5 text-[#2C5E8D] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30"
              placeholder="••••••••"
              required
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#2C5E8D] hover:bg-[#1a3d5c] disabled:opacity-60 text-white font-semibold rounded-lg transition-colors"
          >
            {loading ? "Entrando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
