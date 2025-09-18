import { useMemo, useState } from 'react';
import Carousel from '../components/ui/carrossel';
import ProductCard from '../components/product/ProductCard';
import { PRODUCTS, PROMOS } from '../data/mock';
import type { StyleTag } from '../types/product';

const BRL = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const ALL_STYLES: StyleTag[] = ['street', 'basic', 'sport', 'premium'];

export default function HomePage() {
  // filtros
  const [styles, setStyles] = useState<StyleTag[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(300);

  const toggleStyle = (s: StyleTag) =>
    setStyles((prev) => (prev.includes(s) ? prev.filter((i) => i !== s) : [...prev, s]));

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (styles.length && !styles.some((s) => p.styles.includes(s))) return false;
      if (p.price < minPrice || p.price > maxPrice) return false;
      return true;
    });
  }, [styles, minPrice, maxPrice]);

  return (
    <div className="space-y-8">
      {/* Carrossel de promoções / drops */}
      <Carousel slides={PROMOS} className="mt-2" autoPlayMs={6000} />

      {/* Barra de filtros */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="text-slate-600">
          <span className="text-sm">{filtered.length} produto(s) encontrado(s)</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* estilos */}
          {ALL_STYLES.map((s) => (
            <button
              key={s}
              className={`rounded-full px-3 py-1 text-sm capitalize border ${
                styles.includes(s) ? 'bg-black text-white border-black' : 'bg-white hover:bg-slate-50'
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      </section>
    </div>
  );
}