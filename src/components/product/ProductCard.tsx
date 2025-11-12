type ProductCardProps = {
  id: number;
  name: string;
  price: number;
  image: string;
  styles: string[];
  category?: string;
  subcategory?: string;
  onAddToCart?: () => void;
  inCart?: boolean;
};

export default function ProductCard({
  name,
  price,
  image,
  styles,
  onAddToCart,
  inCart,
}: ProductCardProps) {
  return (
    <div className="flex flex-col rounded-2xl border bg-white p-3">
      <img
        src={image}
        alt={name}
        className="mb-3 h-40 w-full rounded-xl object-cover"
      />
      <div className="flex-1 space-y-1">
        <h3 className="text-sm font-semibold">{name}</h3>
        <p className="text-base font-bold">
          R$ {price.toFixed(2)}
        </p>
        {styles?.length > 0 && (
          <div className="flex flex-wrap gap-1 text-[11px] text-slate-500">
            {styles.map((t) => (
              <span
                key={t}
                className="rounded-full border px-2 py-0.5"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {onAddToCart && (
        <button
          onClick={onAddToCart}
          className={`mt-3 w-full rounded-full px-3 py-1.5 text-sm font-semibold transition ${
            inCart
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-black text-white hover:bg-slate-900"
          }`}
        >
          {inCart ? "No carrinho" : "Adicionar ao carrinho"}
        </button>
      )}
    </div>
  );
}
