const API = import.meta.env.VITE_API_URL as string;

export function withAuth(headers: HeadersInit = {}, token?: string) {
  return token ? { ...headers, Authorization: `Bearer ${token}` } : headers;
}

export { API };
