const API = import.meta.env.VITE_API_URL as string;

export async function apiLogin(payload: { email: string; password: string }) {
  const res = await fetch(`${API}/User/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let msg = `Falha no login (${res.status})`;
    try { const d = await res.json(); if (d?.message) msg = d.message; } catch {}
    throw new Error(msg);
  }
  return res.json() as Promise<{ token: string; user: any }>;
}

export async function apiRegister(payload: { name: string; email: string; password: string }) {
  const res = await fetch(`${API}/User/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let msg = `Falha no cadastro (${res.status})`;
    try { const d = await res.json(); if (d?.message) msg = d.message; } catch {}
    throw new Error(msg);
  }
  return res.json() as Promise<{ token: string; user: any }>;
}
