import { FileText, Upload, X } from "lucide-react";

export type KycFiles = {
  cedulaFile: File | null;
  rutFile: File | null;
};

function FileDropZone({ label, file, onFile, onClear }: {
  label: string;
  file: File | null;
  onFile: (f: File) => void;
  onClear: () => void;
}) {
  return (
    <div className={`border-2 border-dashed rounded-xl p-5 text-center transition-colors ${file ? "border-green-400 bg-green-50" : "border-[#AECBE9] hover:border-[#2C5E8D]"}`}>
      {file ? (
        <div className="flex items-center justify-center gap-3">
          <FileText className="w-5 h-5 text-green-600" />
          <span className="text-sm text-green-700 font-medium">{file.name}</span>
          <button type="button" onClick={onClear} className="text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="cursor-pointer flex flex-col items-center gap-2">
          <Upload className="w-8 h-8 text-[#AECBE9]" />
          <span className="text-sm text-[#2C5E8D]/60">{label}</span>
          <span className="text-xs text-[#2C5E8D]/40">PDF, JPG, PNG — máx. 5 MB</span>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only"
            onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        </label>
      )}
    </div>
  );
}

export function KycUploadForm({ files, onChange, onSubmit, onSkip, loading, error }: {
  files: KycFiles;
  onChange: (updates: Partial<KycFiles>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSkip: () => void;
  loading: boolean;
  error: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <span className="text-sm text-[#2C5E8D]/60">Datos del espacio</span>
        </div>
        <div className="flex-1 h-px bg-[#AECBE9]/40" />
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#2C5E8D] flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-[#2C5E8D]">Verificación KYC</span>
        </div>
      </div>

      <h2 className="font-heading text-2xl text-[#2C5E8D] mb-2 uppercase tracking-wide">Verificación de identidad</h2>
      <p className="text-[#2C5E8D]/60 text-sm mb-6">
        Para publicar tu espacio necesitamos verificar tu identidad. Sube los documentos requeridos (PDF o imagen).
        Quedarán en estado <strong>Pendiente de revisión</strong>.
      </p>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#2C5E8D] mb-2">Cédula de Ciudadanía *</label>
          <FileDropZone
            label="Haz clic para subir tu cédula"
            file={files.cedulaFile}
            onFile={(f) => onChange({ cedulaFile: f })}
            onClear={() => onChange({ cedulaFile: null })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#2C5E8D] mb-2">RUT o Recibo de Servicio Público *</label>
          <FileDropZone
            label="Haz clic para subir el documento"
            file={files.rutFile}
            onFile={(f) => onChange({ rutFile: f })}
            onClear={() => onChange({ rutFile: null })}
          />
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button type="submit" disabled={loading || !files.cedulaFile || !files.rutFile}
          className="w-full py-3 bg-[#2C5E8D] hover:bg-[#1a3d5c] disabled:opacity-50 text-white font-semibold rounded-lg transition-colors">
          {loading ? "Enviando documentos..." : "Enviar documentos para revisión"}
        </button>
        <button type="button" onClick={onSkip}
          className="w-full py-2 text-[#2C5E8D]/50 hover:text-[#2C5E8D] text-sm transition-colors">
          Omitir por ahora (enviaré documentos más tarde)
        </button>
      </form>
    </div>
  );
}
