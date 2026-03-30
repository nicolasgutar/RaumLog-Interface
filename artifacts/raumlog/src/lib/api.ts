const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
export const API_URL = `${BASE}/api`;

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

export async function createReservation(data: object) {
  const res = await fetch(`${API_URL}/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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

export async function payReservation(id: number) {
  const res = await fetch(`${API_URL}/reservations/${id}/pay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Error al procesar pago");
  return res.json();
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
