import type { Product } from '../../types/product';

const BRL = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function ProductCard({ id, name, price, image, styles }: Product) {
  return (
    <article className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md">
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="h-60 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="absolute left-2 top-2 flex items-center gap-1">
          {styles.map((s) => (
            <span key={s} className="rounded-full bg-white/80 px-2 py-0.5 text-xs capitalize text-slate-700 backdrop-blur">
              {s}
            </span>
          ))}
        </div>
      </div>
      <div className="space-y-1 p-4">
        <h3 className="line-clamp-2 text-base font-semibold">{name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">{BRL(price)}</span>
          <button className="rounded-xl bg-black px-4 py-2 text-sm text-white">Comprar</button>
        </div>
      </div>
    </article>
  );
}