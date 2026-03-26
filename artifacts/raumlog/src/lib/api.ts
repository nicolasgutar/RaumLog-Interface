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

export async function fetchAdminSpaces(token: string) {
  const res = await fetch(`${API_URL}/admin/spaces`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error("No autorizado");
  return (await res.json()).spaces;
}

export async function updateSpaceStatus(token: string, id: number, status: string) {
  const res = await fetch(`${API_URL}/admin/spaces/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Error al actualizar");
}

export async function publishSpace(token: string, id: number, published: boolean) {
  const res = await fetch(`${API_URL}/admin/spaces/${id}/publish`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ published }),
  });
  if (!res.ok) throw new Error("Error al publicar");
}

export async function deleteSpace(token: string, id: number) {
  const res = await fetch(`${API_URL}/admin/spaces/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al eliminar");
}

export async function fetchAdminReservations(token: string) {
  const res = await fetch(`${API_URL}/admin/reservations`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error("No autorizado");
  return (await res.json()).reservations;
}

export async function fetchAdminKyc(token: string) {
  const res = await fetch(`${API_URL}/admin/kyc`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error("No autorizado");
  return (await res.json()).submissions;
}

export async function updateKycStatus(token: string, id: number, status: string, adminNotes?: string) {
  const res = await fetch(`${API_URL}/admin/kyc/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status, adminNotes }),
  });
  if (!res.ok) throw new Error("Error al actualizar KYC");
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
