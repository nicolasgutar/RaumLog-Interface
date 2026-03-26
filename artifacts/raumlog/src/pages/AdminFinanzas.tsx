import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchAdminFinanzas } from "@/lib/api";
import {
  DollarSign, TrendingUp, Users, Receipt, RefreshCw,
  ArrowLeft, AlertCircle, ChevronDown, ChevronUp,
} from "lucide-react";

function formatCOP(n: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
}

function StatCard({ label, value, sub, color = "blue", icon: Icon }: {
  label: string; value: string; sub?: string; color?: string; icon: any;
}) {
  const colors: Record<string, string> = {
    blue: "bg-[#2C5E8D] text-white",
    green: "bg-green-600 text-white",
    yellow: "bg-amber-500 text-white",
    slate: "bg-slate-700 text-white",
  };
  return (
    <div className={`rounded-2xl p-5 ${colors[color]} shadow`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium opacity-80">{label}</span>
        <Icon className="w-5 h-5 opacity-70" />
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {sub && <p className="text-xs opacity-70 mt-1">{sub}</p>}
    </div>
  );
}

const STATUS_ES: Record<string, string> = {
  paid: "Pagada",
  in_storage: "En almacenamiento",
  completed: "Completada",
};
const STATUS_COLOR: Record<string, string> = {
  paid: "bg-blue-100 text-blue-700",
  in_storage: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-600",
};

export default function AdminFinanzas() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPayouts, setShowPayouts] = useState(true);

  const token = typeof window !== "undefined" ? sessionStorage.getItem("adminToken") || "" : "";

  const load = useCallback(async () => {
    if (!token) { navigate("/admin/login"); return; }
    setLoading(true);
    try {
      const d = await fetchAdminFinanzas(token);
      setData(d);
    } catch {
      setError("No autorizado o error al cargar.");
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => { load(); }, [load]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#AECBE9] border-t-[#2C5E8D] rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-red-600 mb-4">{error}</p>
        <Link to="/admin/login" className="text-[#2C5E8D] underline text-sm">Volver al login</Link>
      </div>
    </div>
  );

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/admin/control" className="text-[#2C5E8D] hover:text-[#1a3d5c] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-bold text-[#1a3d5c] text-lg">Dashboard Financiero</h1>
            <p className="text-xs text-gray-500">RaumLog · Superadmin</p>
          </div>
        </div>
        <button onClick={load} className="flex items-center gap-2 text-sm text-[#2C5E8D] hover:text-[#1a3d5c] border border-[#AECBE9] px-3 py-1.5 rounded-lg transition-colors">
          <RefreshCw className="w-4 h-4" /> Actualizar
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* ── KPI Cards ── */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Resumen de comisiones</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Comisión bruta total" icon={DollarSign} color="blue"
              value={formatCOP(data.totalCommission)}
              sub={`${data.transactionCount} transacción(es)`}
            />
            <StatCard
              label="IVA (19%) sobre comisión" icon={Receipt} color="yellow"
              value={formatCOP(data.ivaOnCommission)}
              sub="A declarar ante la DIAN"
            />
            <StatCard
              label="Comisión neta (después IVA)" icon={TrendingUp} color="green"
              value={formatCOP(data.netCommissionAfterIva)}
              sub="Ingreso real de RaumLog"
            />
            <StatCard
              label="Volumen total procesado" icon={Users} color="slate"
              value={formatCOP(data.totalRevenue)}
              sub="Suma de pagos de clientes"
            />
          </div>
        </section>

        {/* ── IVA Detail ── */}
        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <h3 className="font-semibold text-amber-800 mb-3 text-sm uppercase tracking-wide">
            Discriminación de IVA (19%)
          </h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-amber-600 mb-1">Comisión bruta</p>
              <p className="font-bold text-amber-900 text-lg">{formatCOP(data.totalCommission)}</p>
            </div>
            <div>
              <p className="text-amber-600 mb-1">IVA 19%</p>
              <p className="font-bold text-amber-900 text-lg">{formatCOP(data.ivaOnCommission)}</p>
            </div>
            <div>
              <p className="text-amber-600 mb-1">Base gravable</p>
              <p className="font-bold text-amber-900 text-lg">{formatCOP(data.netCommissionAfterIva)}</p>
            </div>
          </div>
          <p className="text-xs text-amber-600 mt-3">
            El IVA del 19% aplica sobre la comisión de intermediación de RaumLog. Este valor debe ser declarado y pagado al estado colombiano según el régimen tributario correspondiente.
          </p>
        </section>

        {/* ── Pending Payouts ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => setShowPayouts((v) => !v)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#2C5E8D]" />
              <h2 className="font-semibold text-[#1a3d5c]">
                Pagos pendientes por dispersar a anfitriones
                <span className="ml-2 text-sm font-normal text-gray-500">({data.pendingPayouts.length})</span>
              </h2>
            </div>
            {showPayouts ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>
          {showPayouts && (
            data.pendingPayouts.length === 0
              ? <p className="px-6 pb-5 text-sm text-gray-400">No hay pagos pendientes de dispersar.</p>
              : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-t border-b border-gray-100">
                      <tr>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Anfitrión (email)</th>
                        <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Reservas activas</th>
                        <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Monto a dispersar</th>
                        <th className="px-6 py-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {data.pendingPayouts.map((p: any, i: number) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-3 font-medium text-[#1a3d5c]">{p.email}</td>
                          <td className="px-6 py-3 text-right text-gray-600">{p.count}</td>
                          <td className="px-6 py-3 text-right font-bold text-green-700">{formatCOP(p.amount)}</td>
                          <td className="px-6 py-3 text-right">
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-medium">Pendiente</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t border-gray-200">
                      <tr>
                        <td colSpan={2} className="px-6 py-3 text-sm font-semibold text-gray-600">Total a dispersar</td>
                        <td className="px-6 py-3 text-right font-bold text-[#2C5E8D] text-base">
                          {formatCOP(data.pendingPayouts.reduce((s: number, p: any) => s + p.amount, 0))}
                        </td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )
          )}
        </section>

        {/* ── Transaction History ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-[#1a3d5c] flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#2C5E8D]" />
              Historial de transacciones (últimas 30)
            </h2>
          </div>
          {data.recentTransactions.length === 0
            ? <p className="px-6 py-8 text-center text-gray-400 text-sm">No hay transacciones pagadas aún.</p>
            : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">#</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Espacio</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Cliente</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Comisión</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">IVA 19%</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Neto host</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ref. Wompi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data.recentTransactions.map((tx: any) => {
                      const iva = Math.round(tx.platformCommission * 0.19);
                      return (
                        <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-gray-400 text-xs">RL-{tx.id}</td>
                          <td className="px-4 py-3 font-medium text-[#1a3d5c] max-w-[120px] truncate">{tx.spaceTitle}</td>
                          <td className="px-4 py-3 text-gray-600 max-w-[120px] truncate">{tx.guestName}</td>
                          <td className="px-4 py-3 text-right font-semibold text-[#2C5E8D]">{formatCOP(tx.totalPrice)}</td>
                          <td className="px-4 py-3 text-right text-amber-700">{formatCOP(tx.platformCommission)}</td>
                          <td className="px-4 py-3 text-right text-amber-500 text-xs">{formatCOP(iva)}</td>
                          <td className="px-4 py-3 text-right text-green-700">{formatCOP(tx.hostNetPrice)}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-1 rounded font-medium ${STATUS_COLOR[tx.status] || "bg-gray-100 text-gray-600"}`}>
                              {STATUS_ES[tx.status] || tx.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-400 font-mono">{tx.wompiReference || "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          }
        </section>
      </main>
    </div>
  );
}
