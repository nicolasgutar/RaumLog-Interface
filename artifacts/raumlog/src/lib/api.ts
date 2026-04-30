import { API_URL } from "@/lib/constants";
export { API_URL };

// ── Admin ─────────────────────────────────────────────────────────────────────

export async function adminLogin(password: string): Promise<string> {
  const res = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw new Error("Contraseña incorrecta");
  return (await res.json()).token as string;
}

// ── Admin (v2 Protected) ─────────────────────────────────────────────────────

export async function fetchAdminUsers(token: string, page = 1, search = '', sort = 'name', order = 'asc') {
  const query = new URLSearchParams({
    page: page.toString(),
    search,
    sort,
    order
  }).toString();
  
  const res = await fetch(`${API_URL}/admin/users?${query}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (!res.ok) throw new Error("No se pudieron cargar los usuarios");
  return res.json();
}

export async function fetchAdminUserDetails(token: string, userId: string) {
  const res = await fetch(`${API_URL}/admin/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (!res.ok) throw new Error("No se pudieron cargar los detalles del usuario");
  return res.json();
}

export async function verifyHost(token: string, userId: string, isVerified: boolean) {
  const res = await fetch(`${API_URL}/admin/users/${userId}/verify`, {
    method: "PATCH",
    headers: { 
      "Content-Type": "application/json", 
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ isVerified }),
  });
  
  if (!res.ok) throw new Error("Error al actualizar verificación");
  return res.json();
}

export async function fetchAdminSpacesV2(token: string, page = 1, limit = 10, ownerId?: string) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  if (ownerId) params.append('ownerId', ownerId);
  
  const res = await fetch(`${API_URL}/admin/spaces?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (!res.ok) throw new Error("No se pudieron cargar los espacios");
  return res.json();
}

export async function toggleSpaceVisibility(token: string, spaceId: number, isVisible: boolean) {
  const res = await fetch(`${API_URL}/admin/spaces/${spaceId}/visibility`, {
    method: "PATCH",
    headers: { 
      "Content-Type": "application/json", 
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ isVisible }),
  });
  
  if (!res.ok) throw new Error("Error al cambiar visibilidad");
  return res.json();
}

export async function adminDeleteSpace(token: string, spaceId: number) {
  const res = await fetch(`${API_URL}/admin/spaces/${spaceId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Error al eliminar el espacio");
  }
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function verifyToken(idToken: string) {
  const res = await fetch(`${API_URL}/auth/verify-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed to verify token"); }
  return res.json() as Promise<{ user: any }>;
}

export async function registerUser(idToken: string, role: string, name: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken, role, name }),
  });
  if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Failed to finalize registration"); }
  return res.json() as Promise<{ user: any }>;
}

// ── User ──────────────────────────────────────────────────────────────────────

export async function onboardingStep1(idToken: string, data: { fullName: string; phone: string; role: string; acceptTerms: boolean }) {
  const res = await fetch(`${API_URL}/user/onboarding/step1`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Error al guardar"); }
  return res.json() as Promise<{ user: any }>;
}

export async function saveKycPaths(idToken: string, cedula: string | null, soporte: string | null) {
  const res = await fetch(`${API_URL}/kyc/save-paths`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
    body: JSON.stringify({ cedula, soporte }),
  });
  if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Error al guardar documentos"); }
  return res.json();
}

export async function becomeHost(idToken: string) {
  const res = await fetch(`${API_URL}/user/become-host`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
  });
  if (!res.ok) throw new Error("Error al cambiar de rol");
  return res.json() as Promise<{ user: any }>;
}

// ── Host Spaces (authenticated) ───────────────────────────────────────────────

export async function fetchMySpaces(idToken: string) {
  const res = await fetch(`${API_URL}/spaces/mine`, {
    headers: { Authorization: `Bearer ${idToken}` },
  });
  if (!res.ok) throw new Error("Error al cargar espacios");
  const data = await res.json();
  return (Array.isArray(data) ? data : data.data ?? []) as any[];
}

export async function saveSpace(idToken: string, payload: object, spaceId?: number) {
  const res = await fetch(spaceId ? `${API_URL}/spaces/${spaceId}` : `${API_URL}/spaces`, {
    method: spaceId ? "PUT" : "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error((e as any).error || "Error al guardar"); }
  return res.json();
}

export async function deleteSpace(idToken: string, spaceId: number) {
  await fetch(`${API_URL}/spaces/${spaceId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${idToken}` },
  });
}

export async function fetchAdminUserById(token: string, userId: string) {
  const res = await fetch(`${API_URL}/admin/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("No se pudieron cargar los detalles del usuario");
  return res.json();
}

// ── Spaces ─────────────────────────────────────────────────────────────────────

export async function submitSpace(data: object) {
  const res = await fetch(`${API_URL}/spaces`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al enviar");
  return res.json();
}

// ── Reservations ──────────────────────────────────────────────────────────────

export async function createReservation(data: object, idToken?: string) {
  const res = await fetch(`${API_URL}/reservations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear reserva");
  return (await res.json()).reservation;
}

export async function approveReservationByHost(id: number) {
  const res = await fetch(`${API_URL}/reservations/${id}/approve-host`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Error al aprobar reserva");
  return (await res.json()).reservation;
}

export async function checkinReservation(id: number, data: {
  checkinNotes: string;
  checkinPhotos: string[];
  declaredValue: string;
}) {
  const res = await fetch(`${API_URL}/reservations/${id}/checkin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al registrar check-in");
  return (await res.json()).reservation;
}

// ── Host ──────────────────────────────────────────────────────────────────────

export async function fetchHostSpaces(email: string) {
  const res = await fetch(`${API_URL}/host/spaces?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error("Error al cargar espacios");
  return (await res.json()).spaces;
}

export async function fetchHostReservations(email: string) {
  const res = await fetch(`${API_URL}/host/reservations?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error("Error al cargar reservas");
  return (await res.json()).reservations;
}

export async function updateReservationStatus(id: number, status: string, ownerEmail: string) {
  const res = await fetch(`${API_URL}/host/reservations/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, ownerEmail }),
  });
  if (!res.ok) throw new Error("Error al actualizar reserva");
  return (await res.json()).reservation;
}

// ── KYC ───────────────────────────────────────────────────────────────────────

export async function submitKyc(data: object) {
  const res = await fetch(`${API_URL}/kyc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al enviar documentos");
  return res.json();
}

export async function fetchSpaceById(spaceId: number) {
  const res = await fetch(`${API_URL}/spaces/${spaceId}`);
  if (!res.ok) throw new Error("Espacio no encontrado");
  return res.json();
}

export async function preparePayment(reservationId: number): Promise<{
  reference: string;
  amountInCents: number;
  currency: string;
  integritySignature: string;
  publicKey: string;
  customerData: { email: string; fullName: string; phoneNumber: string };
}> {
  const res = await fetch(`${API_URL}/reservations/${reservationId}/prepare-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Error al preparar el pago");
  return res.json();
}

// ── Wompi Integrity Signature ─────────────────────────────────────────────────

export async function generateWompiSignature(
  reference: string,
  amountInCents: number,
  currency: string,
  integrityKey: string
): Promise<string> {
  const data = `${reference}${amountInCents}${currency}${integrityKey}`;
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(data));
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
