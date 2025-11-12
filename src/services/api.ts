// src/services/api.ts
const API = import.meta.env.VITE_API_URL as string;

export type ProductQuery = {
  category?: string;
  sub?: string;
  styles?: string[]; // ex.: ["street","basic"]
  min?: number;
  max?: number;
  page?: number;
  pageSize?: number;
  q?: string;
};

// monta querystring
const qs = (params: Record<string, any>) =>
  Object.entries(params)
    .filter(
      ([, v]) =>
        v !== undefined &&
        v !== null &&
        v !== "" &&
        !(Array.isArray(v) && v.length === 0)
    )
    .map(([k, v]) =>
      Array.isArray(v)
        ? v.map((x) => `${encodeURIComponent(k)}=${encodeURIComponent(x)}`).join("&")
        : `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
    )
    .join("&");

// ✅ LISTA de produtos (export nomeado)
export async function fetchProducts(query: ProductQuery = {}, signal?: AbortSignal) {
  const url = `${API}/Product${Object.keys(query).length ? `?${qs(query)}` : ""}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`GET /Product falhou (${res.status})`);
  return res.json(); // array de produtos
}

// ✅ DETALHE de produto (export nomeado)
export async function fetchProductById(id: number, signal?: AbortSignal) {
  const res = await fetch(`${API}/Product/${id}`, { signal });
  if (!res.ok) throw new Error(`GET /Product/${id} falhou (${res.status})`);
  return res.json();
}
