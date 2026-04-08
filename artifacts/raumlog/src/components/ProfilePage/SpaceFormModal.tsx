import { useRef } from "react";
import {
  X, Loader2, ChevronLeft, ChevronRight,
  Image as ImageIcon, Upload, AlertTriangle, CheckCircle,
} from "lucide-react";
import type { UploadedFile } from "@/hooks/useSignedUpload";

export type SpaceDetails = {
  spaceType: string; city: string; address: string; description: string;
  priceMonthly: string; priceAnnual: string; priceMonthlyNum: number;
  category: string; accessType: string;
};

export const emptyDetails: SpaceDetails = {
  spaceType: "", city: "", address: "", description: "",
  priceMonthly: "", priceAnnual: "", priceMonthlyNum: 0,
  category: "General", accessType: "24/7",
};

const CATEGORIES = ["General", "Muebles", "Cajas", "Vehículos", "Electrodomésticos"] as const;
const ACCESS_TYPES = ["24/7", "Con cita", "Solo entrega"] as const;
const MAX_IMAGES = 10;

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

export function SpaceFormModal({
  editingSpace, details, onDetailsChange, images, onImageAdd, onImageRemove,
  uploading, uploadProgress, formStep, setFormStep, formError, saving, onSave, isVerified, onClose,
}: {
  editingSpace: any | null;
  details: SpaceDetails;
  onDetailsChange: (key: keyof SpaceDetails, value: any) => void;
  images: (UploadedFile & { previewUrl?: string })[];
  onImageAdd: (files: FileList) => void;
  onImageRemove: (idx: number) => void;
  uploading: boolean;
  uploadProgress: number;
  formStep: number;
  setFormStep: React.Dispatch<React.SetStateAction<number>>;
  formError: string;
  saving: boolean;
  onSave: () => void;
  isVerified: boolean;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-7 pt-7 pb-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-xl font-bold text-[#1a3d5c]">{editingSpace ? "Editar Espacio" : "Publicar Nuevo Espacio"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-all"><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        <div className="px-7 pt-5 flex-1 overflow-y-auto">
          <Steps step={formStep} total={3} />

          {formStep === 1 && (
            <div className="space-y-4 pb-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#2C5E8D] uppercase tracking-wider block mb-1">Tipo de espacio *</label>
                  <input value={details.spaceType} onChange={(e) => onDetailsChange("spaceType", e.target.value)} placeholder="Ej: Bodega, Cuarto, Garaje..."
                    className="w-full px-3 py-2.5 border border-[#AECBE9] rounded-xl text-sm text-[#1a3d5c] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#2C5E8D] uppercase tracking-wider block mb-1">Ciudad *</label>
                  <select value={details.city} onChange={(e) => onDetailsChange("city", e.target.value)} required
                    className="w-full px-3 py-2.5 border border-[#AECBE9] rounded-xl text-sm text-[#1a3d5c] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30 bg-white">
                    <option value="">Selecciona...</option>
                    <option value="Bogotá">Bogotá</option>
                    <option value="Medellín">Medellín</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#2C5E8D] uppercase tracking-wider block mb-1">Dirección</label>
                <input value={details.address} onChange={(e) => onDetailsChange("address", e.target.value)} placeholder="Calle, número, barrio..."
                  className="w-full px-3 py-2.5 border border-[#AECBE9] rounded-xl text-sm text-[#1a3d5c] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#2C5E8D] uppercase tracking-wider block mb-1">Descripción</label>
                <textarea value={details.description} onChange={(e) => onDetailsChange("description", e.target.value)} rows={3}
                  placeholder="Tamaño, condiciones, qué puedes almacenar..."
                  className="w-full px-3 py-2.5 border border-[#AECBE9] rounded-xl text-sm text-[#1a3d5c] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30 resize-none" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#2C5E8D] uppercase tracking-wider block mb-1">Precio mensual *</label>
                  <input type="number" value={details.priceMonthlyNum || ""}
                    onChange={(e) => {
                      const val = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                      onDetailsChange("priceMonthlyNum", val);
                      onDetailsChange("priceMonthly", val > 0 ? `$${val.toLocaleString("es-CO")}` : "");
                    }}
                    placeholder="Ej: 200000" required
                    className="w-full px-3 py-2.5 border border-[#AECBE9] rounded-xl text-sm text-[#1a3d5c] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#2C5E8D] uppercase tracking-wider block mb-1">Precio anual</label>
                  <input type="number" value={details.priceAnnual.replace(/[^0-9]/g, "")}
                    onChange={(e) => {
                      const val = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                      onDetailsChange("priceAnnual", val > 0 ? `$${val.toLocaleString("es-CO")}` : "");
                    }}
                    placeholder="Ej: 2000000"
                    className="w-full px-3 py-2.5 border border-[#AECBE9] rounded-xl text-sm text-[#1a3d5c] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#2C5E8D] uppercase tracking-wider block mb-1">Categoría</label>
                  <select value={details.category} onChange={(e) => onDetailsChange("category", e.target.value)}
                    className="w-full px-3 py-2.5 border border-[#AECBE9] rounded-xl text-sm text-[#1a3d5c] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30 bg-white">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#2C5E8D] uppercase tracking-wider block mb-1">Tipo de acceso</label>
                  <select value={details.accessType} onChange={(e) => onDetailsChange("accessType", e.target.value)}
                    className="w-full px-3 py-2.5 border border-[#AECBE9] rounded-xl text-sm text-[#1a3d5c] outline-none focus:ring-2 focus:ring-[#2C5E8D]/30 bg-white">
                    {ACCESS_TYPES.map((a) => <option key={a}>{a}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {formStep === 2 && (
            <div className="pb-6">
              <p className="text-sm text-gray-500 mb-4">Añade fotos de tu espacio. Las imágenes de alta calidad aumentan las reservas hasta un 70%.</p>
              <ImageUploadZone images={images} onAdd={onImageAdd} onRemove={onImageRemove} uploading={uploading} progress={uploadProgress} />
              {images.length === 0 && <p className="text-xs text-gray-400 mt-2">Al menos una imagen es recomendada pero no obligatoria.</p>}
            </div>
          )}

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

        <div className="flex gap-3 px-7 py-5 border-t border-gray-100 flex-shrink-0">
          {formStep > 1
            ? <button onClick={() => setFormStep(s => s - 1)} className="flex items-center gap-1 px-5 py-2.5 border border-[#AECBE9] text-[#2C5E8D] font-semibold rounded-xl hover:bg-[#AECBE9]/10 transition-all text-sm">
                <ChevronLeft className="w-4 h-4" /> Atrás
              </button>
            : <button onClick={onClose} className="flex-1 py-2.5 border border-[#AECBE9] text-[#2C5E8D] font-semibold rounded-xl hover:bg-[#AECBE9]/10 transition-all text-sm">Cancelar</button>
          }
          {formStep < 3
            ? <button onClick={() => { if (!details.spaceType || !details.city || !details.priceMonthly) { return; } setFormStep(s => s + 1); }}
                className="flex-1 flex items-center justify-center gap-1 py-2.5 bg-[#2C5E8D] hover:bg-[#1a3d5c] text-white font-semibold rounded-xl transition-all text-sm">
                Siguiente <ChevronRight className="w-4 h-4" />
              </button>
            : <button onClick={onSave} disabled={saving}
                className="flex-1 py-2.5 bg-[#2C5E8D] hover:bg-[#1a3d5c] text-white font-semibold rounded-xl transition-all text-sm disabled:opacity-60 flex items-center justify-center gap-2">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Guardando...</> : editingSpace ? "Guardar cambios" : "Publicar espacio"}
              </button>
          }
        </div>
      </div>
    </div>
  );
}

export function DeleteSpaceModal({
  target, onClose, onConfirm, deleting,
}: {
  target: any;
  onClose: () => void;
  onConfirm: () => void;
  deleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </div>
        <h3 className="text-xl font-bold text-[#1a3d5c] mb-2">¿Eliminar espacio?</h3>
        <p className="text-sm text-gray-500 mb-6">Vas a eliminar <span className="font-semibold text-[#1a3d5c]">"{target.spaceType}"</span> en {target.city}. Esta acción no se puede deshacer.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all text-sm">Cancelar</button>
          <button onClick={onConfirm} disabled={deleting}
            className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all text-sm disabled:opacity-60 flex items-center justify-center gap-2">
            {deleting ? <><Loader2 className="w-4 h-4 animate-spin" />Eliminando...</> : "Sí, eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
