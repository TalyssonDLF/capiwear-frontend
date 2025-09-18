import { useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import { PRODUCTS } from "../data/mock";
import type { StyleTag } from "../types/product";

// mapa de subcategorias visíveis por categoria
const SUBCATS: Record<string, string[]> = {
  camisetas: ["oversized", "gola v", "baby look", "básica", "premium", "dry fit"],
  moletons: ["com capuz", "sem capuz", "zippado"],
  calcas: ["jogger", "jeans", "moletom"],
  acessorios: ["bones", "meias", "cintos"],
};

const LABELS: Record<string, string> = {
  camisetas: "Camisetas",
  moletons: "Moletons",
  calcas: "Calças",
  acessorios: "Acessórios",
};

const ALL_STYLES: StyleTag[] = ["street", "basic", "sport", "premium"];
const BRL = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function CategoryPage() {
  const { slug = "" } = useParams(); // camisetas|moletons|calcas|acessorios
  const [searchParams, setSearchParams] = useSearchParams();

  // filtros locais
  const [styles, setStyles] = useState<StyleTag[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(300);

  // subcategoria inicial pela query ?sub=
  const initialSub = decodeURIComponent(searchParams.get("sub") || "");
  const [subcat, setSubcat] = useState(initialSub);

  const toggleStyle = (s: StyleTag) =>
    setStyles((prev) => (prev.includes(s) ? prev.filter((i) => i !== s) : [...prev, s]));

  const isValidCategory =
    slug === "camisetas" || slug === "moletons" || slug === "calcas" || slug === "acessorios";

  const subcats = SUBCATS[slug] || [];

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (p.category !== slug) return false;
      if (subcat && (p.subcategory || "").toLowerCase() !== subcat.toLowerCase()) return false;
      if (styles.length && !styles.some((s) => p.styles.includes(s))) return false;
      if (p.price < minPrice || p.price > maxPrice) return false;
      return true;
    });
  }, [slug, subcat, styles, minPrice, maxPrice]);

  if (!isValidCategory) {
    return <div className="text-slate-600">Categoria não encontrada.</div>;
  }

  const handlePickSub = (sc: string) => {
    const next = sc === subcat ? "" : sc;
    setSubcat(next);
    if (next) searchParams.set("sub", encodeURIComponent(next));
    else searchParams.delete("sub");
    setSearchParams(searchParams, { replace: true });
  };

  return (
    <div className="space-y-6">
      {/* Título + contador */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">{LABELS[slug]}</h1>
          <p className="text-slate-600 text-sm">
            {filtered.length} produto(s){subcat ? ` • ${subcat}` : ""}
          </p>
        </div>
      </div>

      {/* Subcategorias como chips */}
      {subcats.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {subcats.map((sc) => (
            <button
              key={sc}
              onClick={() => handlePickSub(sc)}
              className={`rounded-full border px-3 py-1 text-sm capitalize ${
                subcat === sc ? "bg-black text-white border-black" : "bg-white hover:bg-slate-50"
              }`}
            >
              {sc}
            </button>
          ))}
          {subcat && (
            <button
              onClick={() => handlePickSub(subcat)}
              className="rounded-full border px-3 py-1 text-sm"
              title="Limpar subcategoria"
            >
              Limpar
            </button>
          )}
        </div>
      )}

      {/* Filtros: estilos + preço */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="text-slate-600 text-sm">
          Filtre por estilo e preço para encontrar seu {LABELS[slug].toLowerCase()} ideal.
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {ALL_STYLES.map((s) => (
            <button
              key={s}
              className={`rounded-full px-3 py-1 text-sm capitalize border ${
                styles.includes(s) ? "bg-black text-white border-black" : "bg-white hover:bg-slate-50"
              }`}
              onClick={() => toggleStyle(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de produtos */}
      <section>
        {filtered.length === 0 ? (
          <div className="rounded-xl border bg-white p-6 text-center text-slate-600">
            Nenhum produto encontrado com os filtros aplicados.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}