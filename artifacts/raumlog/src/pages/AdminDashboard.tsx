import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchAdminSpaces, updateSpaceStatus, deleteSpace } from "@/lib/api";
import { CheckCircle, XCircle, Trash2, LogOut, RefreshCw, Clock, DollarSign, Shield } from "lucide-react";

type Space = {
  id: number;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  spaceType: string;
  city: string;
  address: string;
  description: string;
  priceMonthly: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

type Filter = "all" | "pending" | "approved" | "rejected";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  approved: "Aprobado",
  rejected: "Rechazado",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function AdminDashboard() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = sessionStorage.getItem("adminToken") || "";

  const load = useCallback(async () => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await fetchAdminSpaces(token);
      setSpaces(data);
    } catch {
      setError("Sesión expirada. Por favor ingresa de nuevo.");
      sessionStorage.removeItem("adminToken");
      navigate("/admin/login");
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleStatus(id: number, status: "approved" | "rejected") {
    try {
      await updateSpaceStatus(token, id, status);
      setSpaces((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status } : s))
      );
    } catch {
      alert("Error al actualizar el estado");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Eliminar este espacio definitivamente?")) return;
    try {
      await deleteSpace(token, id);
      setSpaces((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert("Error al eliminar");
    }
  }

  function logout() {
    sessionStorage.removeItem("adminToken");
    navigate("/admin/login");
  }

  const filtered = filter === "all" ? spaces : spaces.filter((s) => s.status === filter);

  const counts = {
    all: spaces.length,
    pending: spaces.filter((s) => s.status === "pending").length,
    approved: spaces.filter((s) => s.status === "approved").length,
    rejected: spaces.filter((s) => s.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-[#2C5E8D] text-white px-6 py-4 flex items-center justify-between shadow">
        <div>
          <h1 className="font-heading text-xl uppercase tracking-wide">Panel Administrador</h1>
          <p className="text-[#AECBE9] text-sm">RaumLog · Gestión de espacios</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/admin/finanzas"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600/80 hover:bg-green-600 text-sm font-semibold transition-colors"
          >
            <DollarSign className="w-4 h-4" /> Finanzas
          </Link>
          <Link
            to="/admin/control"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-sm font-semibold transition-colors"
          >
            <Shield className="w-4 h-4" /> Control Total
          </Link>
          <button
            onClick={load}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Salir
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {(["all", "pending", "approved", "rejected"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-xl p-4 text-left border-2 transition-all ${
                filter === f
                  ? "border-[#2C5E8D] bg-white shadow-md"
                  : "border-transparent bg-white hover:border-[#AECBE9] shadow"
              }`}
            >
              <p className="text-2xl font-bold text-[#2C5E8D]">{counts[f]}</p>
              <p className="text-sm text-[#2C5E8D]/70 capitalize">
                {f === "all" ? "Total" : STATUS_LABELS[f]}
              </p>
            </button>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["all", "pending", "approved", "rejected"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-[#2C5E8D] text-white"
                  : "bg-white text-[#2C5E8D] border border-[#AECBE9] hover:bg-[#AECBE9]/20"
              }`}
            >
              {f === "all" ? "Todos" : STATUS_LABELS[f]}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20 text-[#2C5E8D]/50">Cargando espacios...</div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-[#2C5E8D]/50">
            No hay espacios {filter !== "all" ? `con estado "${STATUS_LABELS[filter]}"` : "registrados"}.
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((space) => (
              <div key={space.id} className="bg-white rounded-2xl shadow p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h2 className="font-semibold text-[#2C5E8D] text-lg">{space.ownerName}</h2>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[space.status]}`}>
                        {space.status === "pending" && <Clock className="inline w-3 h-3 mr-1" />}
                        {STATUS_LABELS[space.status]}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-sm text-[#2C5E8D]/70">
                      <p><span className="font-medium text-[#2C5E8D]">Email:</span> {space.ownerEmail}</p>
                      <p><span className="font-medium text-[#2C5E8D]">Teléfono:</span> {space.ownerPhone || "—"}</p>
                      <p><span className="font-medium text-[#2C5E8D]">Tipo:</span> {space.spaceType}</p>
                      <p><span className="font-medium text-[#2C5E8D]">Ciudad:</span> {space.city}</p>
                      <p><span className="font-medium text-[#2C5E8D]">Dirección:</span> {space.address || "—"}</p>
                      <p><span className="font-medium text-[#2C5E8D]">Precio mensual:</span> {space.priceMonthly ? `$${space.priceMonthly}` : "—"}</p>
                    </div>
                    {space.description && (
                      <p className="mt-2 text-sm text-[#2C5E8D]/60 italic">"{space.description}"</p>
                    )}
                    <p className="mt-2 text-xs text-[#2C5E8D]/40">
                      Registrado: {new Date(space.createdAt).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })}
                    </p>
                  </div>

                  <div className="flex sm:flex-col gap-2 flex-shrink-0">
                    {space.status !== "approved" && (
                      <button
                        onClick={() => handleStatus(space.id, "approved")}
                        className="flex items-center gap-1.5 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-medium transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Aprobar
                      </button>
                    )}
                    {space.status !== "rejected" && (
                      <button
                        onClick={() => handleStatus(space.id, "rejected")}
                        className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-medium transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Rechazar
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(space.id)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
