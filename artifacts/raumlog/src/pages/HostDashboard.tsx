import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useStore } from "@/store/useStore";
import { fetchHostSpaces, fetchHostReservations, updateReservationStatus } from "@/lib/api";
import { Home, PackageCheck, TrendingUp, CheckCircle, XCircle, Clock, LogIn } from "lucide-react";

type Space = {
  id: number;
  spaceType: string;
  city: string;
  address: string;
  priceMonthly: string;
  status: "pending" | "approved" | "rejected";
  published: boolean;
  createdAt: string;
};

type Reservation = {
  id: number;
  spaceTitle: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  itemsDescription: string;
  checkIn: string;
  checkOut: string;
  days: number;
  months: number;
  totalPrice: string;
  hostNetPrice: string;
  platformCommission: string;
  declaredValue: string;
  wompiReference: string;
  status: "pending_approval" | "approved_by_host" | "rejected" | "paid" | "in_storage" | "completed";
  createdAt: string;
};

type Tab = "spaces" | "reservations" | "earnings";

const STATUS_LABELS: Record<string, string> = {
  pending_approval: "Pendiente de aprobación",
  approved_by_host: "Aprobada por anfitrión",
  rejected: "Rechazada",
  paid: "Pagada",
  in_storage: "En almacenamiento",
  completed: "Finalizada",
};

const STATUS_COLORS: Record<string, string> = {
  pending_approval: "bg-yellow-100 text-yellow-700",
  approved_by_host: "bg-blue-100 text-blue-700",
  rejected: "bg-red-100 text-red-700",
  paid: "bg-green-100 text-green-700",
  in_storage: "bg-purple-100 text-purple-700",
  completed: "bg-gray-100 text-gray-600",
};

export default function HostDashboard() {
  const { authUser } = useStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("spaces");
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);

  const hostEmail = authUser?.email || "";

  const loadData = useCallback(async () => {
    if (!hostEmail) return;
    setLoading(true);
    try {
      const [s, r] = await Promise.all([fetchHostSpaces(hostEmail), fetchHostReservations(hostEmail)]);
      setSpaces(s);
      setReservations(r);
    } catch {
      console.error("Error loading host data");
    } finally {
      setLoading(false);
    }
  }, [hostEmail]);

  useEffect(() => {
    if (hostEmail) loadData();
  }, [hostEmail, loadData]);

  async function handleReservationStatus(id: number, status: "approved_by_host" | "rejected") {
    try {
      await updateReservationStatus(id, status, hostEmail);
      setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    } catch {
      alert("Error al actualizar la reserva");
    }
  }

  const paidReservations = reservations.filter((r) =>
    ["paid", "in_storage", "completed"].includes(r.status)
  );
  const estimatedRevenue = paidReservations.reduce((sum, r) => {
    const net = Number(r.hostNetPrice || 0);
    const total = Number(r.totalPrice || 0);
    return sum + (net > 0 ? net : total * 0.8);
  }, 0);

  const formatCOP = (n: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

  if (!authUser) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-sm text-center">
            <div className="w-14 h-14 rounded-full bg-[#2C5E8D]/10 flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-7 h-7 text-[#2C5E8D]" />
            </div>
            <h1 className="font-heading text-2xl text-[#2C5E8D] uppercase tracking-wide mb-2">
              Panel del Anfitrión
            </h1>
            <p className="text-[#2C5E8D]/60 text-sm mb-6">
              Inicia sesión o crea una cuenta de anfitrión para ver tus espacios y reservas.
            </p>
            <Link
              to="/mi-cuenta?redirigir=/dashboard/host"
              className="block w-full py-3 bg-[#2C5E8D] hover:bg-[#1a3d5c] text-white font-semibold rounded-lg transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/mi-cuenta?modo=register&redirigir=/dashboard/host"
              className="block w-full py-3 border border-[#AECBE9] text-[#2C5E8D] hover:bg-[#AECBE9]/10 font-semibold rounded-lg transition-colors mt-3"
            >
              Crear cuenta de anfitrión
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (authUser.role !== "host") {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-sm text-center">
            <h1 className="font-heading text-xl text-[#2C5E8D] uppercase tracking-wide mb-3">Acceso restringido</h1>
            <p className="text-[#2C5E8D]/60 text-sm mb-6">
              El panel de anfitrión solo está disponible para cuentas de tipo Anfitrión. Tu cuenta es de tipo Cliente.
            </p>
            <button
              onClick={() => navigate("/encuentra-tu-espacio")}
              className="w-full py-3 bg-[#2C5E8D] hover:bg-[#1a3d5c] text-white font-semibold rounded-lg transition-colors"
            >
              Buscar espacios
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        {/* Header */}
        <div className="bg-[#2C5E8D] py-8 px-4">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl text-white uppercase tracking-wide">Panel del Anfitrión</h1>
              <p className="text-[#AECBE9] text-sm mt-1">{authUser.name} · {authUser.email}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={loadData} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors">
                Actualizar
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#AECBE9]/30 flex items-center justify-center flex-shrink-0">
                <Home className="w-6 h-6 text-[#2C5E8D]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#2C5E8D]">{spaces.length}</p>
                <p className="text-sm text-[#2C5E8D]/60">Mis espacios</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#AECBE9]/30 flex items-center justify-center flex-shrink-0">
                <PackageCheck className="w-6 h-6 text-[#2C5E8D]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#2C5E8D]">{reservations.filter((r) => r.status === "pending_approval").length}</p>
                <p className="text-sm text-[#2C5E8D]/60">Solicitudes pendientes</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-green-700">{formatCOP(estimatedRevenue)}</p>
                <p className="text-sm text-[#2C5E8D]/60">Ingresos estimados</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-[#AECBE9]/40 pb-px">
            {([["spaces", "Mis Espacios"], ["reservations", "Solicitudes de Reserva"], ["earnings", "Ingresos"]] as [Tab, string][]).map(([t, label]) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${tab === t ? "bg-[#2C5E8D] text-white" : "text-[#2C5E8D] hover:bg-[#AECBE9]/20"}`}>
                {label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20 text-[#2C5E8D]/50">Cargando...</div>
          ) : tab === "spaces" ? (
            <div className="space-y-4">
              {spaces.length === 0 ? (
                <div className="text-center py-20 text-[#2C5E8D]/50">No tienes espacios registrados aún.</div>
              ) : spaces.map((space) => (
                <div key={space.id} className="bg-white rounded-2xl shadow p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-[#2C5E8D]">{space.spaceType} · {space.city}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[space.status]}`}>
                          {STATUS_LABELS[space.status]}
                        </span>
                        {space.published && (
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">Publicado</span>
                        )}
                      </div>
                      <p className="text-sm text-[#2C5E8D]/60">{space.address || "Sin dirección"}</p>
                      <p className="text-sm text-[#2C5E8D]/60">
                        Precio mensual: {space.priceMonthly ? `$${space.priceMonthly} COP` : "—"} ·
                        Registrado: {new Date(space.createdAt).toLocaleDateString("es-CO")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : tab === "reservations" ? (
            <div className="space-y-4">
              {reservations.length === 0 ? (
                <div className="text-center py-20 text-[#2C5E8D]/50">No tienes solicitudes de reserva aún.</div>
              ) : reservations.map((res) => (
                <div key={res.id} className="bg-white rounded-2xl shadow p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="font-semibold text-[#2C5E8D]">{res.guestName}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[res.status]}`}>
                          {res.status === "pending_approval" && <Clock className="inline w-3 h-3 mr-0.5" />}
                          {STATUS_LABELS[res.status]}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-[#2C5E8D]/70">
                        <p><span className="font-medium text-[#2C5E8D]">Espacio:</span> {res.spaceTitle}</p>
                        <p><span className="font-medium text-[#2C5E8D]">Email:</span> {res.guestEmail}</p>
                        <p><span className="font-medium text-[#2C5E8D]">Teléfono:</span> {res.guestPhone || "—"}</p>
                        <p><span className="font-medium text-[#2C5E8D]">Fechas:</span> {res.checkIn} → {res.checkOut}</p>
                        <p><span className="font-medium text-[#2C5E8D]">Duración:</span> {res.days} días{res.months > 0 ? ` (${res.months} meses)` : ""}</p>
                        <p><span className="font-medium text-[#2C5E8D]">Total:</span> {formatCOP(Number(res.totalPrice))}</p>
                      </div>
                      {res.itemsDescription && (
                        <p className="mt-2 text-sm text-[#2C5E8D]/60 italic">Va a guardar: "{res.itemsDescription}"</p>
                      )}
                    </div>
                    {res.status === "pending_approval" && (
                      <div className="flex sm:flex-col gap-2 flex-shrink-0">
                        <button onClick={() => handleReservationStatus(res.id, "approved_by_host")}
                          className="flex items-center gap-1.5 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-medium transition-colors">
                          <CheckCircle className="w-4 h-4" /> Aprobar
                        </button>
                        <button onClick={() => handleReservationStatus(res.id, "rejected")}
                          className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-medium transition-colors">
                          <XCircle className="w-4 h-4" /> Rechazar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow p-6">
                <h3 className="font-heading text-xl text-[#2C5E8D] mb-1 uppercase">Resumen de Ingresos</h3>
                <p className="text-xs text-[#2C5E8D]/50 mb-4">Comisión RaumLog: 20% · Tu parte (neto): 80%</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-xs text-[#2C5E8D]/60 mb-1">Tus ingresos netos (80%)</p>
                    <p className="text-2xl font-bold text-green-600">{formatCOP(estimatedRevenue)}</p>
                  </div>
                  <div className="bg-[#AECBE9]/20 rounded-xl p-4">
                    <p className="text-xs text-[#2C5E8D]/60 mb-1">Reservas pagadas</p>
                    <p className="text-2xl font-bold text-[#2C5E8D]">{paidReservations.length}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {paidReservations.length === 0 ? (
                    <p className="text-[#2C5E8D]/50 text-sm">Aún no tienes reservas pagadas.</p>
                  ) : paidReservations.map((r) => {
                    const net = Number(r.hostNetPrice) > 0 ? Number(r.hostNetPrice) : Number(r.totalPrice) * 0.8;
                    const commission = Number(r.totalPrice) - net;
                    return (
                      <div key={r.id} className="py-2 border-b border-[#AECBE9]/30 text-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-[#2C5E8D]">{r.guestName} — {r.spaceTitle}</p>
                            <p className="text-[#2C5E8D]/60">{r.checkIn} → {r.checkOut}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">{formatCOP(net)}</p>
                            <p className="text-xs text-[#2C5E8D]/40">total: {formatCOP(Number(r.totalPrice))} · com: {formatCOP(commission)}</p>
                          </div>
                        </div>
                        <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[r.status]}`}>
                          {STATUS_LABELS[r.status]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
