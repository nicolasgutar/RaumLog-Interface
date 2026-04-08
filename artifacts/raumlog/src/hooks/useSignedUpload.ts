import { useAuthStore } from "@/store/authStore";
import { API_URL } from "@/lib/constants";

export interface UploadedFile {
  filePath: string;  // GCS path stored in DB
  fileName: string;  // Original display name
  contentType: string;
}

/**
 * Hook to upload a file directly to GCS via a backend-generated signed URL.
 * The file goes: Browser → GCS (PUT via signed URL)
 * Then the GCS path is returned for storing in the DB.
 */
export function useSignedUpload() {
  const { idToken } = useAuthStore();

  async function uploadFile(
    file: File,
    bucket: "spaces" | "kyc" = "kyc",
    onProgress?: (pct: number) => void
  ): Promise<UploadedFile> {
    // 1. Get signed upload URL from backend
    const urlRes = await fetch(`${API_URL}/storage/upload-url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type,
        bucket,
      }),
    });

    if (!urlRes.ok) {
      const err = await urlRes.json().catch(() => ({}));
      throw new Error(err.error || "Error al obtener URL de carga");
    }

    const { uploadUrl, filePath } = await urlRes.json();

    // 2. PUT file directly to GCS
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader("Content-Type", file.type);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({ filePath, fileName: file.name, contentType: file.type });
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error("Error de red durante la carga"));
      xhr.send(file);
    });
  }

  return { uploadFile };
}

/**
 * Fetch signed read URLs for GCS file paths.
 * Used to display private images and documents.
 */
export async function fetchSignedUrls(
  paths: string[],
  bucket: "spaces" | "kyc" = "spaces"
): Promise<Record<string, string>> {
  if (!paths || paths.length === 0) return {};
  try {
    const res = await fetch(`${API_URL}/storage/signed-urls`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paths, bucket }),
    });
    if (!res.ok) return {};
    const { urls } = await res.json();
    return urls ?? {};
  } catch {
    return {};
  }
}
