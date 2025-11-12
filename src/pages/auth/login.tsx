import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo-provisoria.png";

const API = import.meta.env.VITE_API_URL as string; // ex: https://localhost:7233/api

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function readJsonSafe(res: Response) {
    const text = await res.text();
    try {
      return text ? JSON.parse(text) : null;
    } catch {
      return text ? { message: text } : null;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.includes("@")) return setError("Informe um e-mail válido.");
    if (password.length < 6) return setError("A senha deve ter pelo menos 6 caracteres.");

    setLoading(true);
    try {
      const res = await fetch(`${API}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const payload = await readJsonSafe(res);

      if (!res.ok) {
        const msg =
          (payload && (payload.message || payload.error || payload.detail)) ||
          `Falha no login (${res.status})`;
        throw new Error(msg);
      }

      if (!payload?.token || !payload?.user) {
        throw new Error("Resposta inesperada do servidor.");
      }

      const authData = JSON.stringify(payload);
      if (remember) localStorage.setItem("auth", authData);
      else sessionStorage.setItem("auth", authData);

      navigate("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro inesperado ao tentar logar.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-4 md:py-6">
        <Link to="/" className="inline-flex items-center gap-2">
          <img src={logo} alt="CapiWear" className="h-10 w-10 object-contain" />
          <span className="text-xl font-extrabold tracking-tight">CapiWear</span>
        </Link>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 pb-12 md:grid-cols-2 md:gap-12">
        {/* Imagem lateral */}
        <div className="relative hidden overflow-hidden rounded-2xl border bg-black/5 md:block">
          <img
            src="https://images.unsplash.com/photo-1600185365313-67b59a3ea629?auto=format&fit=crop&w=1470&q=80"
            alt="Lookbook CapiWear"
            className="h-[560px] w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <h2 className="text-2xl font-extrabold">Entre e descubra seu próximo drop</h2>
            <p className="mt-1 text-sm text-white/80">
              Novidades toda semana, frete rápido e cupons exclusivos.
            </p>
          </div>
        </div>

        {/* Card de login */}
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-2xl border bg-white/90 p-6 shadow-sm backdrop-blur">
            <h1 className="text-2xl font-extrabold tracking-tight">Bem-vindo de volta</h1>
            <p className="mt-1 text-sm text-slate-600">
              Faça login para acompanhar pedidos e acessar ofertas.
            </p>

            {error && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none transition focus:border-black"
                  placeholder="voce@exemplo.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-700">Senha</label>
                  <Link to="/forgot" className="text-xs font-medium text-slate-600 hover:text-black">
                    Esqueceu a senha?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-slate-800 outline-none transition focus:border-black"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute inset-y-0 right-0 mr-2 inline-flex items-center rounded-md px-2 text-slate-500 hover:text-slate-800"
                    aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPass ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M3 3l18 18" />
                        <path d="M10.58 10.58A4 4 0 0012 16a4 4 0 003.42-6.42M21 12S18 5 12 5 3 12 3 12a13.2 13.2 0 004.24 4.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-black focus:ring-black"
                  />
                  <span>Lembrar de mim</span>
                </label>
                <Link to="/register" className="text-sm font-medium text-black hover:opacity-80">
                  Criar conta
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-lg bg-black py-2.5 font-semibold text-white transition hover:bg-zinc-900 disabled:opacity-60"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
                    Entrando…
                  </span>
                ) : (
                  "Entrar"
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500">
              <span>🔒 Segurança de nível bancário</span>
              <span>•</span>
              <span>🚚 Frete para todo o Brasil</span>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            Ao entrar você concorda com nossos{" "}
            <a className="underline underline-offset-2 hover:text-slate-700" href="#">
              Termos
            </a>{" "}
            e{" "}
            <a className="underline underline-offset-2 hover:text-slate-700" href="#">
              Privacidade
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
