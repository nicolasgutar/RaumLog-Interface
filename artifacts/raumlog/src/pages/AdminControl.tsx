import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchAdminSpaces, updateSpaceStatus, publishSpace, deleteSpace,
  fetchAdminReservations, fetchAdminKyc, updateKycStatus,
} from "@/lib/api";
import {
  Globe, EyeOff, CheckCircle, XCircle, Trash2, LogOut,
  RefreshCw, FileText, Users, Home, CreditCard,
} from "lucide-react";

type Space = {
  id: number; ownerName: string; ownerEmail: string; ownerPhone: string;
  spaceType: string; city: string; address: string; description: string;
  priceMonthly: string; status: string; published: boolean; createdAt: string;
};
type Reservation = {
  id: number; spaceTitle: string; guestName: string; guestEmail: string;
  checkIn: string; checkOut: string; days: number; totalPrice: string;
  status: string; createdAt: string;
};
type KycSubmission = {
  id: number; hostName: string; hostEmail: string; hostPhone: string;
  cedulaFilename: string; rutFilename: string; status: string; createdAt: string;
};

type Tab = "spaces" | "reservations" | "kyc";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  paid: "bg-blue-100 text-blue-700",
};

export default function AdminControl() {
  const [tab, setTab] = useState<Tab>("spaces");
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [kyc, setKyc] = useState<KycSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("adminToken") || "";

  const load = useCallback(async () => {
    if (!token) { navigate("/admin/login"); return; }
    setLoading(true);
    try {
      const [s, r, k] = await Promise.all([
        fetchAdminSpaces(token),
        fetchAdminReservations(token),
        fetchAdminKyc(token),
      ]);
      setSpaces(s);
      setReservations(r);
      setKyc(k);
    } catch {
      sessionStorage.removeItem("adminToken");
      navigate("/admin/login");
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => { load(); }, [load]);

  async function handlePublish(id: number, pub: boolean) {
    await publishSpace(token, id, pub);
    setSpaces((prev) => prev.map((s) => s.id === id ? { ...s, published: pub } : s));
  }

  async function handleSpaceStatus(id: number, status: "approved" | "rejected") {
    await updateSpaceStatus(token, id, status);
    setSpaces((prev) => prev.map((s) => s.id === id ? { ...s, status } : s));
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Eliminar este espacio definitivamente?")) return;
    await deleteSpace(token, id);
    setSpaces((prev) => prev.filter((s) => s.id !== id));
  }

  async function handleKycStatus(id: number, status: "approved" | "rejected") {
    await updateKycStatus(token, id, status);
    setKyc((prev) => prev.map((k) => k.id === id ? { ...k, status } : k));
  }

  function logout() {
    sessionStorage.removeItem("adminToken");
    navigate("/admin/login");
  }

  const tabs: [Tab, string, React.ComponentType<any>][] = [
    ["spaces", "Espacios", Home],
    ["reservations", "Reservas", CreditCard],
    ["kyc", "KYC / Documentos", FileText],
  ];

  const formatCOP = (n: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-[#2C5E8D] text-white px-6 py-4 flex items-center justify-between shadow">
        <div>
          <h1 className="font-heading text-xl uppercase tracking-wide">SuperAdmin · Control Total</h1>
          <p className="text-[#AECBE9] text-sm">RaumLog · Panel de Control</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => navigate("/admin")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm transition-colors">
            Panel básico
          </button>
          <button onClick={load} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm transition-colors">
            <RefreshCw className="w-4 h-4" /> Actualizar
          </button>
          <button onClick={logout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm transition-colors">
            <LogOut className="w-4 h-4" /> Salir
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Espacios", value: spaces.length, icon: Home },
            { label: "Publicados", value: spaces.filter((s) => s.published).length, icon: Globe },
            { label: "Reservas", value: reservations.length, icon: CreditCard },
            { label: "KYC Pendientes", value: kyc.filter((k) => k.status === "pending").length, icon: Users },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
              <Icon className="w-8 h-8 text-[#2C5E8D] flex-shrink-0" />
              <div>
                <p className="text-2xl font-bold text-[#2C5E8D]">{value}</p>
                <p className="text-xs text-[#2C5E8D]/60">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map(([t, label, Icon]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? "bg-[#2C5E8D] text-white shadow" : "bg-white text-[#2C5E8D] border border-[#AECBE9] hover:bg-[#AECBE9]/20"}`}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-[#2C5E8D]/50">Cargando datos...</div>
        ) : tab === "spaces" ? (
          <div className="space-y-4">
            {spaces.length === 0 && <div className="text-center py-20 text-[#2C5E8D]/50">No hay espacios registrados.</div>}
            {spaces.map((space) => (
              <div key={space.id} className="bg-white rounded-2xl shadow p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-semibold text-[#2C5E8D]">{space.ownerName}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[space.status] || "bg-gray-100 text-gray-600"}`}>
                        {space.status}
                      </span>
                      {space.published
                        ? <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">Publicado</span>
                        : <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-medium">No publicado</span>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0.5 text-sm text-[#2C5E8D]/70">
                      <p><span className="font-medium text-[#2C5E8D]">Email:</span> {space.ownerEmail}</p>
                      <p><span className="font-medium text-[#2C5E8D]">Tipo:</span> {space.spaceType}</p>
                      <p><span className="font-medium text-[#2C5E8D]">Ciudad:</span> {space.city}</p>
                      <p><span className="font-medium text-[#2C5E8D]">Precio/mes:</span> {space.priceMonthly ? `$${space.priceMonthly}` : "—"}</p>
                    </div>
                    {space.description && <p className="mt-1 text-xs text-[#2C5E8D]/50 italic">"{space.description}"</p>}
                    <p className="mt-1 text-xs text-[#2C5E8D]/40">
                      Registrado: {new Date(space.createdAt).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })}
                    </p>
                  </div>

                  <div className="flex sm:flex-col gap-2 flex-shrink-0">
                    {space.status !== "approved" && (
                      <button onClick={() => handleSpaceStatus(space.id, "approved")}
                        className="flex items-center gap-1.5 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-medium transition-colors">
                        <CheckCircle className="w-4 h-4" /> Aprobar
                      </button>
                    )}
                    {space.published ? (
                      <button onClick={() => handlePublish(space.id, false)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                        <EyeOff className="w-4 h-4" /> Despublicar
                      </button>
                    ) : (
                      <button onClick={() => handlePublish(space.id, true)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors">
                        <Globe className="w-4 h-4" /> Publicar
                      </button>
                    )}
                    {space.status !== "rejected" && (
                      <button onClick={() => handleSpaceStatus(space.id, "rejected")}
                        className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-medium transition-colors">
                        <XCircle className="w-4 h-4" /> Rechazar
                      </button>
                    )}
                    <button onClick={() => handleDelete(space.id)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm font-medium transition-colors">
                      <Trash2 className="w-4 h-4" /> Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : tab === "reservations" ? (
          <div className="space-y-4">
            {reservations.length === 0 && <div className="text-center py-20 text-[#2C5E8D]/50">No hay reservas.</div>}
            {reservations.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl shadow p-5">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-semibold text-[#2C5E8D]">{r.guestName}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[r.status] || "bg-gray-100 text-gray-600"}`}>{r.status}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-0.5 text-sm text-[#2C5E8D]/70">
                  <p><span className="font-medium text-[#2C5E8D]">Espacio:</span> {r.spaceTitle}</p>
                  <p><span className="font-medium text-[#2C5E8D]">Email:</span> {r.guestEmail}</p>
                  <p><span className="font-medium text-[#2C5E8D]">Fechas:</span> {r.checkIn} → {r.checkOut} ({r.days} días)</p>
                  <p><span className="font-medium text-[#2C5E8D]">Total:</span> {formatCOP(Number(r.totalPrice))}</p>
                  <p><span className="font-medium text-[#2C5E8D]">Registrado:</span> {new Date(r.createdAt).toLocaleDateString("es-CO")}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {kyc.length === 0 && <div className="text-center py-20 text-[#2C5E8D]/50">No hay documentos KYC enviados.</div>}
            {kyc.map((k) => (
              <div key={k.id} className="bg-white rounded-2xl shadow p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-semibold text-[#2C5E8D]">{k.hostName}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[k.status] || "bg-gray-100"}`}>{k.status}</span>
                    </div>
                    <div className="text-sm text-[#2C5E8D]/70 space-y-0.5">
                      <p><span className="font-medium text-[#2C5E8D]">Email:</span> {k.hostEmail}</p>
                      <p><span className="font-medium text-[#2C5E8D]">Teléfono:</span> {k.hostPhone || "—"}</p>
                      <p><span className="font-medium text-[#2C5E8D]">Cédula:</span> {k.cedulaFilename || "—"}</p>
                      <p><span className="font-medium text-[#2C5E8D]">RUT/Recibo:</span> {k.rutFilename || "—"}</p>
                      <p className="text-xs text-[#2C5E8D]/40">Enviado: {new Date(k.createdAt).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })}</p>
                    </div>
                  </div>
                  {k.status === "pending" && (
                    <div className="flex sm:flex-col gap-2 flex-shrink-0">
                      <button onClick={() => handleKycStatus(k.id, "approved")}
                        className="flex items-center gap-1.5 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-medium transition-colors">
                        <CheckCircle className="w-4 h-4" /> Aprobar
                      </button>
                      <button onClick={() => handleKycStatus(k.id, "rejected")}
                        className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-medium transition-colors">
                        <XCircle className="w-4 h-4" /> Rechazar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
