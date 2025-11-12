import { Outlet, Link, NavLink } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/images/logo-provisoria.png";
import { useAuth } from "../context/AuthContext";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const [openUser, setOpenUser] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          {/* Logo + título */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="CapiWear"
              className="h-12 w-12 object-contain"
            />
            <span className="text-xl font-extrabold tracking-tight">CapiWear</span>
          </Link>

          {/* Navegação */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <NavLink
              to="/category/camisetas"
              className={({ isActive }) =>
                isActive ? "font-semibold text-black" : "hover:text-black"
              }
            >
              Camisetas
            </NavLink>
            <NavLink
              to="/category/moletons"
              className={({ isActive }) =>
                isActive ? "font-semibold text-black" : "hover:text-black"
              }
            >
              Moletons
            </NavLink>
            <NavLink
              to="/category/calcas"
              className={({ isActive }) =>
                isActive ? "font-semibold text-black" : "hover:text-black"
              }
            >
              Calças
            </NavLink>
            <NavLink
              to="/category/acessorios"
              className={({ isActive }) =>
                isActive ? "font-semibold text-black" : "hover:text-black"
              }
            >
              Acessórios
            </NavLink>

            <span className="h-5 w-px bg-slate-200" />

            {/* Área de auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setOpenUser((v) => !v)}
                  onBlur={() => setTimeout(() => setOpenUser(false), 150)}
                  className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-slate-50"
                >
                  <span className="font-medium">
                    Olá, {user.name?.split(" ")[0] ?? "Cliente"}
                  </span>
                  <svg
                    className={`h-4 w-4 transition ${openUser ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {openUser && (
                  <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border bg-white shadow-lg">
                    <Link
                      to="/account"
                      className="block px-4 py-2 text-sm hover:bg-slate-50"
                    >
                      Minha Conta
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm hover:bg-slate-50"
                    >
                      Meus Pedidos
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="rounded-md border px-3 py-1.5 text-sm hover:bg-slate-50"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="rounded-md bg-black px-3 py-1.5 text-sm text-white hover:bg-zinc-900"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black py-6 text-center text-sm text-white">
        © {new Date().getFullYear()} CapiWear. Todos os direitos reservados.
      </footer>
    </div>
  );
}
