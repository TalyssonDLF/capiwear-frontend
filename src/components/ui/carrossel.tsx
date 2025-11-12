import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export type Slide = {
  id: string;
  title: string;
  subtitle?: string;
  cta?: string;
  link?: string;
};

type Props = {
  slides: Slide[];
  autoPlayMs?: number;
  className?: string;
};

const GRADIENTS = [
  'from-[#f97316] via-[#fb923c] to-[#fde68a]', // laranja-bege
  'from-[#78350f] via-[#92400e] to-[#fbbf24]', // marrom-âmbar
  'from-[#292524] via-[#44403c] to-[#78716c]', // cinza quente
];

export default function Carousel({ slides, autoPlayMs = 5000, className = '' }: Props) {
  const [index, setIndex] = useState(0);
  const total = slides.length;
  const timeout = useRef<number | null>(null);

  const go = (i: number) => total && setIndex((i + total) % total);
  const next = () => go(index + 1);
  const prev = () => go(index - 1);

  useEffect(() => {
    if (autoPlayMs <= 0 || total <= 1) return;
    if (timeout.current) window.clearTimeout(timeout.current);
    timeout.current = window.setTimeout(next, autoPlayMs);
    return () => timeout.current && window.clearTimeout(timeout.current);
  }, [index, autoPlayMs, total]);

  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-slate-100 max-w-6xl mx-auto ${className}`}>
      {/* Slides */}
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)`, width: `${total * 100}%` }}
      >
        {slides.map((s, i) => {
          const gradient = GRADIENTS[i % GRADIENTS.length];
          return (
            <div
              key={s.id}
              className={`relative w-full flex-shrink-0 h-[260px] md:h-[340px] bg-gradient-to-r ${gradient}`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent rounded-2xl" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-2xl font-extrabold md:text-3xl">{s.title}</h3>
                {s.subtitle && (
                  <p className="mt-1 max-w-xl text-sm text-white/90 md:text-base">{s.subtitle}</p>
                )}
                {s.link && s.cta && (
                  <Link
                    to={s.link}
                    className="mt-3 inline-block rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90"
                  >
                    {s.cta}
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Setas */}
      {total > 1 && (
        <>
          <button
            aria-label="Anterior"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-black shadow hover:bg-white"
          >
            ‹
          </button>
          <button
            aria-label="Próximo"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-black shadow hover:bg-white"
          >
            ›
          </button>
        </>
      )}

      {/* Dots */}
      {total > 1 && (
        <div className="pointer-events-none absolute bottom-2 left-0 right-0 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Ir para slide ${i + 1}`}
              onClick={() => go(i)}
              className={`pointer-events-auto h-2 w-2 cursor-pointer rounded-full ${
                i === index ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
