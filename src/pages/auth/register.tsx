import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo-provisoria.png";

const API = import.meta.env.VITE_API_URL as string;

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [accept, setAccept] = useState(true); // termos
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function validate(): string | null {
    if (!name.trim()) return "Informe seu nome completo.";
    if (!email.includes("@")) return "Informe um e-mail válido.";
    if (password.length < 6) return "A senha deve ter pelo menos 6 caracteres.";
    if (password !== confirm) return "As senhas não coincidem.";
    if (!accept) return "Você precisa aceitar os Termos e a Política de Privacidade.";
    return null;
  }

  // Lê o corpo uma ÚNICA vez e tenta parsear JSON.
  async function readJsonSafe(res: Response) {
    const text = await res.text(); // <- uma leitura só
    try {
      return text ? JSON.parse(text) : null;
    } catch {
      // se não for JSON, retorna objeto com mensagem bruta
      return text ? { message: text } : null;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      // lê o body uma única vez
      const payload = await readJsonSafe(res);

      if (!res.ok) {
        const msg =
          (payload && (payload.message || payload.error || payload.detail)) ||
          `Falha no cadastro (${res.status})`;
        throw new Error(msg);
      }

      // esperado: { token, user } (ajuste se seu backend retornar diferente)
      if (!payload?.token || !payload?.user) {
        throw new Error("Resposta inesperada do servidor.");
      }

      // login automático
      localStorage.setItem("auth", JSON.stringify(payload));
      navigate("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro inesperado ao cadastrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Top bar */}
      <div className="mx-auto max-w-6xl px-4 py-4 md:py-6">
        <Link to="/" className="inline-flex items-center gap-2">
          <img src={logo} alt="CapiWear" className="h-10 w-10 object-contain" />
          <span className="text-xl font-extrabold tracking-tight">CapiWear</span>
        </Link>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 pb-12 md:grid-cols-2 md:gap-12">
        {/* Lado visual (desktop) */}
        <div className="relative hidden overflow-hidden rounded-2xl border bg-black/5 md:block">
          <img
            src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1470&q=80"
            alt="Registre-se na CapiWear"
            className="h-[560px] w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <h2 className="text-2xl font-extrabold">Crie sua conta</h2>
            <p className="mt-1 text-sm text-white/80">
              Ganhe acesso a ofertas, histórico de pedidos e drops exclusivos.
            </p>
          </div>
        </div>

        {/* Card do formulário */}
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-2xl border bg-white/90 p-6 shadow-sm backdrop-blur">
            <h1 className="text-2xl font-extrabold tracking-tight">Comece agora</h1>
            <p className="mt-1 text-sm text-slate-600">
              Leva menos de 1 minuto. Sem custos.
            </p>

            {error && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Nome completo</label>
                <input
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none transition focus:border-black"
                  placeholder="Seu nome"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none transition focus:border-black"
                  placeholder="voce@exemplo.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Senha</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-slate-800 outline-none transition focus:border-black"
                    placeholder="Mínimo 6 caracteres"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute inset-y-0 right-0 mr-2 inline-flex items-center rounded-md px-2 text-slate-500 hover:text-slate-800"
                    aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPass ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M3 3l18 18" /><path d="M10.58 10.58A4 4 0 0012 16a4 4 0 003.42-6.42M21 12S18 5 12 5 3 12 3 12a13.2 13.2 0 004.24 4.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" /><circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-slate-500">Use letras e números para maior segurança.</p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Confirmar senha</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirm(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-slate-800 outline-none transition focus:border-black"
                    placeholder="Repita a senha"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute inset-y-0 right-0 mr-2 inline-flex items-center rounded-md px-2 text-slate-500 hover:text-slate-800"
                    aria-label={showConfirm ? "Ocultar confirmação" : "Mostrar confirmação"}
                  >
                    {showConfirm ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M3 3l18 18" /><path d="M10.58 10.58A4 4 0 0012 16a4 4 0 003.42-6.42M21 12S18 5 12 5 3 12 3 12a13.2 13.2 0 004.24 4.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" /><circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <input
                  id="accept"
                  type="checkbox"
                  checked={accept}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAccept(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-black focus:ring-black"
                />
                <label htmlFor="accept" className="text-sm text-slate-700">
                  Eu li e aceito os{" "}
                  <a className="underline underline-offset-2 hover:text-slate-900" href="#">
                    Termos
                  </a>{" "}
                  e a{" "}
                  <a className="underline underline-offset-2 hover:text-slate-900" href="#">
                    Política de Privacidade
                  </a>.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-lg bg-black py-2.5 font-semibold text-white transition hover:bg-zinc-900 disabled:opacity-60"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
                    Cadastrando…
                  </span>
                ) : (
                  "Criar conta"
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500">
              <span>🔒 Seus dados estão seguros</span>
              <span>•</span>
              <span>🎁 Ofertas exclusivas para membros</span>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            Já tem conta?{" "}
            <Link to="/login" className="font-medium text-black hover:opacity-80">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
