import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Loader2, MapPin, DollarSign, Tag, Key, AlertTriangle, Pencil, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuthStore } from "@/store/authStore";
import { useSignedUpload, fetchSignedUrls, UploadedFile } from "@/hooks/useSignedUpload";
import { fetchMySpaces, saveSpace, deleteSpace } from "@/lib/api";
import { SpaceFormModal, DeleteSpaceModal, type SpaceDetails, emptyDetails } from "@/components/ProfilePage/SpaceFormModal";

export default function ProfilePage() {
  const { user, idToken } = useAuthStore();
  const navigate = useNavigate();
  const { uploadFile } = useSignedUpload();

  const [spaces, setSpaces] = useState<any[]>([]);
  const [signedImgs, setSignedImgs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // form modal state
  const [formOpen, setFormOpen] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [editingSpace, setEditingSpace] = useState<any | null>(null);
  const [details, setDetails] = useState<SpaceDetails>(emptyDetails);
  const [images, setImages] = useState<(UploadedFile & { previewUrl?: string })[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // delete modal state
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  const isVerified = user?.isUserVerified ?? false;

  const fetchSpaces = useCallback(async () => {
    if (!idToken) return;
    setLoading(true);
    try {
      const list = await fetchMySpaces(idToken);
      setSpaces(list);
      const allPaths = list.flatMap((s: any) => (s.images as string[]) ?? []).filter(Boolean);
      if (allPaths.length > 0) {
        const urls = await fetchSignedUrls(allPaths, "spaces");
        setSignedImgs(urls);
      }
    } finally {
      setLoading(false);
    }
  }, [idToken]);

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    fetchSpaces();
  }, [user, fetchSpaces]);

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
    setImages((space.images ?? []).map((p: string) => ({ filePath: p, fileName: p.split("/").pop() ?? "", contentType: "image/*", previewUrl: signedImgs[p] })));
    setFormStep(1);
    setFormError("");
    setFormOpen(true);
  }

  async function handleImageAdd(files: FileList) {
    const remaining = 10 - images.length;
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

  async function handleSave() {
    setFormError("");
    if (!details.spaceType || !details.city || !details.priceMonthly) {
      setFormError("Completa los campos obligatorios.");
      setFormStep(1);
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...details,
        priceMonthlyNum: parseInt(String(details.priceMonthlyNum), 10) || 0,
        ownerName: user?.name ?? "",
        ownerEmail: user?.email ?? "",
        ownerPhone: user?.phone ?? "",
        isVisible: isVerified,
        published: isVerified,
        images: images.map((img) => img.filePath),
      };
      await saveSpace(idToken!, payload, editingSpace?.id);
      setFormOpen(false);
      fetchSpaces();
    } catch (err: any) {
      setFormError(err.message || "Error de conexión. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteSpace(idToken!, deleteTarget.id);
      setDeleteTarget(null);
      fetchSpaces();
    } finally {
      setDeleting(false);
    }
  }

  const cardImage = (space: any) => {
    const p = (space.images as string[])?.[0];
    return p ? signedImgs[p] : null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCFB]">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">

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

      {formOpen && (
        <SpaceFormModal
          editingSpace={editingSpace}
          details={details}
          onDetailsChange={(k, v) => setDetails((d) => ({ ...d, [k]: v }))}
          images={images}
          onImageAdd={handleImageAdd}
          onImageRemove={(idx) => setImages((prev) => prev.filter((_, i) => i !== idx))}
          uploading={uploading}
          uploadProgress={uploadProgress}
          formStep={formStep}
          setFormStep={setFormStep}
          formError={formError}
          saving={saving}
          onSave={handleSave}
          isVerified={isVerified}
          onClose={() => setFormOpen(false)}
        />
      )}

      {deleteTarget && (
        <DeleteSpaceModal
          target={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          deleting={deleting}
        />
      )}
    </div>
  );
}
