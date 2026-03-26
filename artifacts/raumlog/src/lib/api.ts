const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
export const API_URL = `${BASE}/api`;

export async function adminLogin(password: string): Promise<string> {
  const res = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw new Error("Contraseña incorrecta");
  const data = await res.json();
  return data.token as string;
}

export async function fetchAdminSpaces(token: string) {
  const res = await fetch(`${API_URL}/admin/spaces`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("No autorizado");
  const data = await res.json();
  return data.spaces;
}

export async function updateSpaceStatus(
  token: string,
  id: number,
  status: "approved" | "rejected" | "pending"
) {
  const res = await fetch(`${API_URL}/admin/spaces/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Error al actualizar");
}

export async function deleteSpace(token: string, id: number) {
  const res = await fetch(`${API_URL}/admin/spaces/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al eliminar");
}

export async function submitSpace(data: {
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  spaceType: string;
  city: string;
  address: string;
  description: string;
  priceMonthly: string;
}) {
  const res = await fetch(`${API_URL}/spaces`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al enviar");
  return res.json();
}
