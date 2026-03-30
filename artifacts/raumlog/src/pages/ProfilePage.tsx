import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, Pencil, Trash2, AlertTriangle, X, Loader2,
  MapPin, DollarSign, Tag, Key, ChevronLeft, ChevronRight,
  Image as ImageIcon, CheckCircle, Upload,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuthStore } from "@/store/authStore";
import { useSignedUpload, fetchSignedUrls, UploadedFile } from "@/hooks/useSignedUpload";

const API = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001";
const CATEGORIES = ["General", "Muebles", "Cajas", "Vehículos", "Electrodomésticos"] as const;
const ACCESS_TYPES = ["24/7", "Con cita", "Solo entrega"] as const;
const MAX_IMAGES = 10;

type SpaceDetails = {
  spaceType: string; city: string; address: string; description: string;
  priceMonthly: string; priceAnnual: string; priceMonthlyNum: number;
  category: string; accessType: string;
};

const emptyDetails: SpaceDetails = {
  spaceType: "", city: "", address: "", description: "",
  priceMonthly: "", priceAnnual: "", priceMonthlyNum: 0,
  category: "General", accessType: "24/7",
};

// ── Image Upload Zone ──────────────────────────────────────────────────────────
function ImageUploadZone({
  images, onAdd, onRemove, uploading, progress,
}: {
  images: (UploadedFile & { previewUrl?: string })[];
  onAdd: (files: FileList) => void;
  onRemove: (idx: number) => void;
  uploading: boolean;
  progress: number;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <p className="text-xs text-gray-500 mb-3">{images.length}/{MAX_IMAGES} imágenes · JPG, PNG, WEBP · máx 10 MB c/u</p>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
        {images.map((img, i) => (
          <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-[#AECBE9]/40 group">
            {img.previewUrl
              ? <img src={img.previewUrl} alt="" className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-[#AECBE9]/20 flex items-center justify-center"><ImageIcon className="w-6 h-6 text-[#AECBE9]" /></div>
            }
            <button onClick={() => onRemove(i)}
              className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {uploading && (
          <div className="aspect-square rounded-xl border-2 border-dashed border-[#2C5E8D]/40 flex flex-col items-center justify-center gap-1 bg-[#2C5E8D]/5">
            <Loader2 className="w-5 h-5 text-[#2C5E8D] animate-spin" />
            <span className="text-[10px] text-[#2C5E8D]">{progress}%</span>
          </div>
        )}

        {!uploading && images.length < MAX_IMAGES && (
          <button onClick={() => ref.current?.click()} type="button"
            className="aspect-square rounded-xl border-2 border-dashed border-[#AECBE9]/60 hover:border-[#2C5E8D] flex flex-col items-center justify-center gap-1 transition-all group">
            <Upload className="w-5 h-5 text-[#AECBE9] group-hover:text-[#2C5E8D] transition-colors" />
            <span className="text-[10px] text-gray-400">Agregar</span>
          </button>
        )}
      </div>
      <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden"
        onChange={(e) => e.target.files && onAdd(e.target.files)} />
    </div>
  );
}

// ── Step indicator ─────────────────────────────────────────────────────────────
function Steps({ step, total }: { step: number; total: number }) {
  const labels = ["Detalles", "Imágenes", "Confirmar"];
  return (
    <div className="flex items-center gap-2 mb-6">
      {Array.from({ length: total }, (_, i) => {
        const n = i + 1;
        return (
          <div key={n} className="flex items-center gap-2 flex-1">
            <div className={`flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap
              ${n < step ? "text-[#2C5E8D]" : n === step ? "text-[#2C5E8D]" : "text-gray-300"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 flex-shrink-0
                ${n < step ? "bg-[#2C5E8D] border-[#2C5E8D] text-white" : n === step ? "border-[#2C5E8D] text-[#2C5E8D]" : "border-gray-200 text-gray-300"}`}>
                {n < step ? "✓" : n}
              </div>
              <span className="hidden sm:inline">{labels[i]}</span>
            </div>
            {i < total - 1 && <div className={`flex-1 h-0.5 rounded ${n < step ? "bg-[#2C5E8D]" : "bg-gray-200"}`} />}
          </div>
        );
      })}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, idToken } = useAuthStore();
  const navigate = useNavigate();
  const { uploadFile } = useSignedUpload();

  const [spaces, setSpaces] = useState<any[]>([]);
  const [signedImgs, setSignedImgs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // modal state
  const [formOpen, setFormOpen] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [editingSpace, setEditingSpace] = useState<any | null>(null);
  const [details, setDetails] = useState<SpaceDetails>(emptyDetails);
  const [images, setImages] = useState<(UploadedFile & { previewUrl?: string })[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // delete modal
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  const isVerified = user?.isUserVerified ?? false;

  // ── Fetch spaces ─────────────────────────────────────────────────────────────
  const fetchSpaces = useCallback(async () => {
    if (!idToken) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/spaces/mine`, { headers: { Authorization: `Bearer ${idToken}` } });
      if (res.ok) {
        const data = await res.json();
        const list: any[] = Array.isArray(data) ? data : data.data ?? [];
        setSpaces(list);

        // Fetch signed URLs for all space images
        const allPaths = list.flatMap((s: any) => (s.images as string[]) ?? []).filter(Boolean);
        if (allPaths.length > 0) {
          const urls = await fetchSignedUrls(allPaths, "spaces");
          setSignedImgs(urls);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [idToken]);

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    fetchSpaces();
  }, [user, fetchSpaces]);

  // ── Open create / edit ────────────────────────────────────────────────────────
  function openCreate() {
    setEditingSpace(null);
    setDetails(emptyDetails);
    setImages([]);
    setFormStep(1);
    setFormError("");
    setFormOpen(true);
  }

  function openEdit(space: any) {
    setEditingSpace(space);
    setDetails({
      spaceType: space.spaceType ?? "", city: space.city ?? "", address: space.address ?? "",
      description: space.description ?? "", priceMonthly: space.priceMonthly ?? "",
      priceAnnual: space.priceAnnual ?? "", priceMonthlyNum: space.priceMonthlyNum ?? 0,
      category: space.category ?? "General", accessType: space.accessType ?? "24/7",
    });
    // existing images as UploadedFile stubs
    setImages((space.images ?? []).map((p: string) => ({ filePath: p, fileName: p.split("/").pop() ?? "", contentType: "image/*", previewUrl: signedImgs[p] })));
    setFormStep(1);
    setFormError("");
    setFormOpen(true);
  }

  // ── Image upload ──────────────────────────────────────────────────────────────
  async function handleImageAdd(files: FileList) {
    const remaining = MAX_IMAGES - images.length;
    const toUpload = Array.from(files).slice(0, remaining);
    for (const file of toUpload) {
      if (file.size > 10 * 1024 * 1024) { setFormError(`${file.name} supera 10 MB`); continue; }
      const previewUrl = URL.createObjectURL(file);
      setUploading(true);
      setUploadProgress(0);
      try {
        const result = await uploadFile(file, "spaces", setUploadProgress);
        setImages((prev) => [...prev, { ...result, previewUrl }]);
      } catch (err: any) {
        setFormError(err.message);
      } finally {
        setUploading(false);
      }
    }
  }

  function handleImageRemove(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  // ── Save space ────────────────────────────────────────────────────────────────
  async function handleSave() {
    setFormError("");
    if (!details.spaceType || !details.city || !details.priceMonthly) { setFormError("Completa los campos obligatorios."); setFormStep(1); return; }
    setSaving(true);
    try {
      const payload = {
        ...details,
        priceMonthlyNum: parseInt(String(details.priceMonthlyNum), 10) || 0,
        ownerName: user?.name ?? "",
        ownerEmail: user?.email ?? "",
        ownerPhone: user?.phone ?? "",
        isVisible: isVerified,
        images: images.map((img) => img.filePath), // store GCS paths
      };

      const url = editingSpace ? `${API}/api/spaces/${editingSpace.id}` : `${API}/api/spaces`;
      const method = editingSpace ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify(payload),
      });

      if (!res.ok) { const e = await res.json().catch(() => ({})); setFormError(e.error || "Error al guardar"); return; }
      setFormOpen(false);
      fetchSpaces();
    } catch { setFormError("Error de conexión. Intenta de nuevo."); } finally { setSaving(false); }
  }

  // ── Delete ────────────────────────────────────────────────────────────────────
  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`${API}/api/spaces/${deleteTarget.id}`, { method: "DELETE", headers: { Authorization: `Bearer ${idToken}` } });
      setDeleteTarget(null);
      fetchSpaces();
    } finally { setDeleting(false); }
  }

  const f = (k: keyof SpaceDetails, v: any) => setDetails((d) => ({ ...d, [k]: v }));

  // First image signed URL for a space card
  const cardImage = (space: any) => {
    const p = (space.images as string[])?.[0];
    return p ? signedImgs[p] : null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCFB]">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">

        {/* Page header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-heading font-bold text-[#1a3d5c]">Mis Espacios</h1>
            <p className="text-[#2C5E8D]/60 mt-1 text-sm">Gestiona tus espacios publicados en RaumLog.</p>
          </div>
          <button onClick={openCreate}
            className="flex items-center gap-2 bg-[#2C5E8D] hover:bg-[#1a3d5c] text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
            <Plus className="w-4 h-4" /> Publicar Espacio
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-24"><Loader2 className="w-8 h-8 text-[#2C5E8D] animate-spin" /></div>
        ) : spaces.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-[#AECBE9]/30 shadow-sm">
            <div className="w-20 h-20 bg-[#AECBE9]/20 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <MapPin className="w-10 h-10 text-[#2C5E8D]/50" />
            </div>
            <h3 className="text-xl font-bold text-[#1a3d5c] mb-2">Aún no tienes espacios publicados</h3>
            <p className="text-[#2C5E8D]/50 text-sm mb-6 max-w-xs mx-auto">Empieza a generar ingresos publicando tu primer espacio.</p>
            <button onClick={openCreate} className="bg-[#2C5E8D] text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-[#1a3d5c] transition-all">
              Publicar mi primer espacio
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaces.map((space) => {
              const img = cardImage(space);
              return (
                <div key={space.id} className="bg-white rounded-2xl border border-[#AECBE9]/30 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                  <div className="h-40 bg-gradient-to-br from-[#2C5E8D]/10 to-[#AECBE9]/20 relative overflow-hidden">
                    {img
                      ? <img src={img} alt={space.spaceType} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <div className="w-full h-full flex items-center justify-center"><MapPin className="w-10 h-10 text-[#2C5E8D]/30" /></div>
                    }
                    <span className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${space.isVisible ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {space.isVisible ? "Visible" : "En revisión"}
                    </span>
                    {(space.images?.length ?? 0) > 1 && (
                      <span className="absolute bottom-3 right-3 text-[10px] bg-black/50 text-white px-2 py-0.5 rounded-full">{space.images.length} fotos</span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-[#1a3d5c] text-base mb-1 truncate">{space.spaceType}</h3>
                    <p className="text-[#2C5E8D]/60 text-xs mb-3 truncate">{space.address}, {space.city}</p>
                    <div className="flex items-center gap-3 text-xs text-[#2C5E8D]/60 mb-4">
                      <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{space.category}</span>
                      <span className="flex items-center gap-1"><Key className="w-3 h-3" />{space.accessType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 font-bold text-[#2C5E8D] text-sm"><DollarSign className="w-3.5 h-3.5" />{space.priceMonthly}/mes</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(space)} className="p-1.5 text-[#2C5E8D]/50 hover:text-[#2C5E8D] hover:bg-[#2C5E8D]/10 rounded-lg transition-all"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteTarget(space)} className="p-1.5 text-red-400/60 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Unverified notice */}
        {!isVerified && (
          <div className="mt-10 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800 mb-1">Cuenta pendiente de verificación</p>
              <p className="text-xs text-amber-700">Los espacios que crees no serán visibles para los clientes hasta que tu cuenta sea verificada por el equipo de RaumLog.</p>
            </div>
            <button onClick={() => navigate("/onboarding")} className="flex-shrink-0 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-all">
              Completar verificación
            </button>
          </div>
        )}
      </main>
      <Footer />

      {/* ── Multi-step Space Form Modal ─────────────────────────────────── */}
      {formOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-7 pt-7 pb-4 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-xl font-bold text-[#1a3d5c]">{editingSpace ? "Editar Espacio" : "Publicar Nuevo Espacio"}</h2>
              <button onClick={() => setFormOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-all"><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <div className="px-7 pt-5 flex-1 overflow-y-auto">
              <Steps step={formStep} total={3} />

              {/* Step 1: Details */}
              {formStep === 1 && (
                <div className="space-y-4 pb-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#2C5E8D] uppercase tracking-wider block mb-1">Tipo de espacio *</label>
                      <input value={details.spaceType} onChange={(e) => f("spaceType", e.target.value)} placeholder="Ej: Bodega, Cuarto, Garaje..."
                        className="w-full px-3 py-2.5 border border-[#AECBE9] rounded-xl text-sm text-[#1a3d5c] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#2C5E8D] uppercase tracking-wider block mb-1">Ciudad *</label>
                      <select
                        value={details.city}
                        onChange={(e) => f("city", e.target.value)}
                        required
                        className="w-full px-3 py-2.5 border border-[#AECBE9] rounded-xl text-sm text-[#1a3d5c] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30 bg-white"
                      >
                        <option value="">Selecciona...</option>
                        <option value="Bogotá">Bogotá</option>
                        <option value="Medellín">Medellín</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#2C5E8D] uppercase tracking-wider block mb-1">Dirección</label>
                    <input value={details.address} onChange={(e) => f("address", e.target.value)} placeholder="Calle, número, barrio..."
                      className="w-full px-3 py-2.5 border border-[#AECBE9] rounded-xl text-sm text-[#1a3d5c] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#2C5E8D] uppercase tracking-wider block mb-1">Descripción</label>
                    <textarea value={details.description} onChange={(e) => f("description", e.target.value)} rows={3}
                      placeholder="Tamaño, condiciones, qué puedes almacenar..."
                      className="w-full px-3 py-2.5 border border-[#AECBE9] rounded-xl text-sm text-[#1a3d5c] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30 resize-none" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#2C5E8D] uppercase tracking-wider block mb-1">Precio mensual *</label>
                      <input 
                        type="number"
                        value={details.priceMonthlyNum || ""} 
                        onChange={(e) => {
                          const val = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                          f("priceMonthlyNum", val);
                          f("priceMonthly", val > 0 ? `$${val.toLocaleString("es-CO")}` : "");
                        }} 
                        placeholder="Ej: 200000"
                        required
                        className="w-full px-3 py-2.5 border border-[#AECBE9] rounded-xl text-sm text-[#1a3d5c] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#2C5E8D] uppercase tracking-wider block mb-1">Precio anual</label>
                      <input 
                        type="number"
                        value={details.priceAnnual.replace(/[^0-9]/g, "")} 
                        onChange={(e) => {
                          const val = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                          f("priceAnnual", val > 0 ? `$${val.toLocaleString("es-CO")}` : "");
                        }} 
                        placeholder="Ej: 2000000"
                        className="w-full px-3 py-2.5 border border-[#AECBE9] rounded-xl text-sm text-[#1a3d5c] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30" 
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#2C5E8D] uppercase tracking-wider block mb-1">Categoría</label>
                      <select value={details.category} onChange={(e) => f("category", e.target.value)}
                        className="w-full px-3 py-2.5 border border-[#AECBE9] rounded-xl text-sm text-[#1a3d5c] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30 bg-white">
                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#2C5E8D] uppercase tracking-wider block mb-1">Tipo de acceso</label>
                      <select value={details.accessType} onChange={(e) => f("accessType", e.target.value)}
                        className="w-full px-3 py-2.5 border border-[#AECBE9] rounded-xl text-sm text-[#1a3d5c] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30 bg-white">
                        {ACCESS_TYPES.map((a) => <option key={a}>{a}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Images */}
              {formStep === 2 && (
                <div className="pb-6">
                  <p className="text-sm text-gray-500 mb-4">Añade fotos de tu espacio. Las imágenes de alta calidad aumentan las reservas hasta un 70%.</p>
                  <ImageUploadZone images={images} onAdd={handleImageAdd} onRemove={handleImageRemove} uploading={uploading} progress={uploadProgress} />
                  {images.length === 0 && <p className="text-xs text-gray-400 mt-2">Al menos una imagen es recomendada pero no obligatoria.</p>}
                </div>
              )}

              {/* Step 3: Confirm */}
              {formStep === 3 && (
                <div className="pb-6 space-y-4">
                  <div className="bg-[#2C5E8D]/5 rounded-2xl p-5 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Tipo:</span><span className="font-semibold text-[#1a3d5c]">{details.spaceType}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Ciudad:</span><span className="font-semibold text-[#1a3d5c]">{details.city}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Dirección:</span><span className="font-semibold text-[#1a3d5c] text-right max-w-[60%]">{details.address || "—"}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Precio/mes:</span><span className="font-semibold text-[#2C5E8D]">{details.priceMonthly}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Categoría:</span><span className="font-semibold text-[#1a3d5c]">{details.category}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Acceso:</span><span className="font-semibold text-[#1a3d5c]">{details.accessType}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Imágenes:</span><span className="font-semibold text-[#1a3d5c]">{images.length}</span></div>
                  </div>
                  {!isVerified && (
                    <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" />
                      <span>Este espacio no será visible públicamente hasta que tu cuenta sea verificada.</span>
                    </div>
                  )}
                  {isVerified && (
                    <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-xs text-green-700">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-500" />
                      <span>Tu espacio será visible públicamente de inmediato.</span>
                    </div>
                  )}
                  {formError && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{formError}</p>}
                </div>
              )}
            </div>

            {/* Footer nav */}
            <div className="flex gap-3 px-7 py-5 border-t border-gray-100 flex-shrink-0">
              {formStep > 1
                ? <button onClick={() => setFormStep(s => s - 1)} className="flex items-center gap-1 px-5 py-2.5 border border-[#AECBE9] text-[#2C5E8D] font-semibold rounded-xl hover:bg-[#AECBE9]/10 transition-all text-sm">
                    <ChevronLeft className="w-4 h-4" /> Atrás
                  </button>
                : <button onClick={() => setFormOpen(false)} className="flex-1 py-2.5 border border-[#AECBE9] text-[#2C5E8D] font-semibold rounded-xl hover:bg-[#AECBE9]/10 transition-all text-sm">Cancelar</button>
              }
              {formStep < 3
                ? <button onClick={() => { if (!details.spaceType || !details.city || !details.priceMonthly) { setFormError("Completa tipo, ciudad y precio."); return; } setFormError(""); setFormStep(s => s + 1); }}
                    className="flex-1 flex items-center justify-center gap-1 py-2.5 bg-[#2C5E8D] hover:bg-[#1a3d5c] text-white font-semibold rounded-xl transition-all text-sm">
                    Siguiente <ChevronRight className="w-4 h-4" />
                  </button>
                : <button onClick={handleSave} disabled={saving}
                    className="flex-1 py-2.5 bg-[#2C5E8D] hover:bg-[#1a3d5c] text-white font-semibold rounded-xl transition-all text-sm disabled:opacity-60 flex items-center justify-center gap-2">
                    {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Guardando...</> : editingSpace ? "Guardar cambios" : "Publicar espacio"}
                  </button>
              }
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation ─────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5"><Trash2 className="w-8 h-8 text-red-500" /></div>
            <h3 className="text-xl font-bold text-[#1a3d5c] mb-2">¿Eliminar espacio?</h3>
            <p className="text-sm text-gray-500 mb-6">Vas a eliminar <span className="font-semibold text-[#1a3d5c]">"{deleteTarget.spaceType}"</span> en {deleteTarget.city}. Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all text-sm">Cancelar</button>
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all text-sm disabled:opacity-60 flex items-center justify-center gap-2">
                {deleting ? <><Loader2 className="w-4 h-4 animate-spin" />Eliminando...</> : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
