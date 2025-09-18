import { Outlet, Link } from "react-router-dom";
import logo from "../assets/images/logo-provisoria.png";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          {/* Logo + título */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="CapiWear logo"
              className="h-18 w-18 object-contain"
            />
            <span className="text-xl font-bold">CapiWear</span>
          </Link>

          {/* Navegação */}
          <nav className="hidden md:flex gap-4 text-sm text-slate-600">
            <Link to="/category/camisetas">Camisetas</Link>
            <Link to="/category/moletons">Moletons</Link>
            <Link to="/category/calcas">Calças</Link>
            <Link to="/category/acessorios">Acessórios</Link>
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