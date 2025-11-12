import { useEffect, useState } from "react";
import Carousel from "../components/ui/carrossel";
import ProductCard from "../components/product/ProductCard";
import { PROMOS } from "../data/mock";
import type { Product, StyleTag } from "../types/product";
import { fetchProducts } from "../services/api";

const ALL_STYLES: StyleTag[] = ["street", "basic", "sport", "premium"];

type CartItem = {
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export default function HomePage() {
  const [styles, setStyles] = useState<StyleTag[]>([]);
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 🛒 Carrinho
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState<string | null>(null);

  const toggleStyle = (s: StyleTag) =>
    setStyles((prev) =>
      prev.includes(s) ? prev.filter((i) => i !== s) : [...prev, s]
    );

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const image =
        // pega da API
        (product as any).imgUrl ||
        // fallback pra algum mock antigo
        (product as any).imageUrl ||
        "https://via.placeholder.com/600x400?text=CapiWear";

      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          image,
          quantity: 1,
        },
      ];
    });

    setIsCartOpen(true);
    setCheckoutError(null);
    setCheckoutSuccess(null);
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }

    setCart((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      )
    );
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setIsCheckingOut(true);
    setCheckoutError(null);
    setCheckoutSuccess(null);

    try {
      const userId = 1; // TODO: pegar user logado
      const freight = 20; // TODO: calcular/buscar da API

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          freight,
          items: cart.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Erro ao criar pedido");
      }

      const order = await response.json();
      console.log("Pedido criado:", order);
      setCheckoutSuccess(`Pedido #${order.id} criado com sucesso!`);
      setCart([]);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Erro inesperado ao finalizar pedido";
      setCheckoutError(msg);
    } finally {
      setIsCheckingOut(false);
    }
  };

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    setError(null);

    fetchProducts(
      {
        styles,
        page: 1,
        pageSize: 24,
      },
      ac.signal
    )
      .then((json: Product[]) => setData(json))
      .catch((e: unknown) => {
        if (e instanceof Error && e.name !== "AbortError") {
          setError(e.message || "Erro ao carregar produtos");
        }
      })
      .finally(() => setLoading(false));

    return () => ac.abort();
  }, [styles]);

  return (
    <div className="space-y-8 relative">
      {/* Carrossel */}
      <Carousel slides={PROMOS} className="mt-2" autoPlayMs={6000} />

      {/* Barra de filtros + botão do carrinho */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="text-slate-600">
          <span className="text-sm">
            {loading ? "Carregando…" : `${data.length} produto(s) encontrado(s)`}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* estilos */}
          {ALL_STYLES.map((s) => (
            <button
              key={s}
              className={`rounded-full px-3 py-1 text-sm capitalize border ${
                styles.includes(s)
                  ? "bg-black text-white border-black"
                  : "bg-white hover:bg-slate-50"
              }`}
              onClick={() => toggleStyle(s)}
            >
              {s}
            </button>
          ))}

          {/* botão carrinho */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-1.5 text-sm font-semibold text-white hover:bg-slate-900 transition"
          >
            <span>Carrinho</span>
            <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-black">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mensagens de erro geral */}
      {error && (
        <div className="rounded-xl border bg-white p-4 text-center text-red-600">
          {error}
        </div>
      )}

      {/* Grid de produtos */}
      {loading && !data.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-2xl border bg-slate-200"
            />
          ))}
        </div>
      ) : (
        <section>
          {data.length === 0 ? (
            <div className="rounded-xl border bg-white p-6 text-center text-slate-600">
              Nenhum produto encontrado.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  price={p.price}
                  image={
                    (p as any).imgUrl ||
                    (p as any).imageUrl ||
                    "https://via.placeholder.com/600x400?text=CapiWear"
                  }
                  styles={p.styles ?? []}
                  category={p.category as any}
                  subcategory={p.subcategory}
                  onAddToCart={() => handleAddToCart(p)}
                  inCart={!!cart.find((i) => i.productId === p.id)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* 🛒 Drawer lateral do carrinho */}
      {isCartOpen && (
        <div className="fixed inset-0 z-40 flex justify-end">
          {/* overlay */}
          <div
            className="flex-1 bg-black/40"
            onClick={() => setIsCartOpen(false)}
          />

          {/* painel do carrinho */}
          <div className="h-full w-full max-w-md bg-white shadow-2xl flex flex-col translate-x-0 transform transition-transform duration-300">
            {/* header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div>
                <h2 className="text-lg font-semibold">Seu carrinho</h2>
                <p className="text-xs text-slate-500">
                  {cartCount} item(ns) • Subtotal: R$ {cartSubtotal.toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="rounded-full border px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
              >
                Fechar
              </button>
            </div>

            {/* conteúdo */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {checkoutError && (
                <div className="rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-700">
                  {checkoutError}
                </div>
              )}
              {checkoutSuccess && (
                <div className="rounded-md border border-emerald-200 bg-emerald-50 p-2 text-xs text-emerald-700">
                  {checkoutSuccess}
                </div>
              )}

              {cart.length === 0 ? (
                <p className="text-sm text-slate-500 mt-4">
                  Seu carrinho está vazio. Bora escolher umas capivaras estilosas 😎
                </p>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between gap-3 rounded-lg border px-2 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-12 w-12 rounded object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-slate-500">
                          R$ {item.price.toFixed(2)}
                        </p>
                        <div className="mt-1 flex items-center gap-1 text-xs">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.productId,
                                item.quantity - 1
                              )
                            }
                            className="h-5 w-5 rounded-full border text-center leading-4"
                          >
                            -
                          </button>
                          <span className="min-w-[24px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.productId,
                                item.quantity + 1
                              )
                            }
                            className="h-5 w-5 rounded-full border text-center leading-4"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-semibold">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleRemoveFromCart(item.productId)}
                        className="text-[11px] text-red-500 hover:underline"
                      >
                        remover
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* footer */}
            <div className="border-t px-4 py-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-semibold">
                  R$ {cartSubtotal.toFixed(2)}
                </span>
              </div>

              <button
                disabled={cart.length === 0 || isCheckingOut}
                onClick={handleCheckout}
                className={`w-full rounded-full px-4 py-2 text-sm font-semibold transition ${
                  cart.length === 0 || isCheckingOut
                    ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                    : "bg-black text-white hover:bg-slate-900"
                }`}
              >
                {isCheckingOut
                  ? "Finalizando..."
                  : cart.length === 0
                  ? "Carrinho vazio"
                  : "Finalizar compra"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
