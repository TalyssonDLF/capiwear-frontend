import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

type Slide = {
  [x: string]: any;
  id: string;
  title: string;
  subtitle?: string;
  cta?: string;
  image: string;
  link?: string;
};

type Props = {
  slides: Slide[];
  autoPlayMs?: number; // default 5000
  className?: string;
};

export default function Carousel({ slides, autoPlayMs = 5000, className = '' }: Props) {
  const [index, setIndex] = useState(0);
  const timeout = useRef<number | null>(null);
  const total = slides.length;

  const go = (i: number) => setIndex((i + total) % total);
  const next = () => go(index + 1);
  const prev = () => go(index - 1);

  useEffect(() => {
    if (autoPlayMs <= 0) return;
    if (timeout.current) window.clearTimeout(timeout.current);
    timeout.current = window.setTimeout(next, autoPlayMs);
    return () => { if (timeout.current) window.clearTimeout(timeout.current); };
  }, [index, autoPlayMs]);

  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-slate-100 ${className}`}>
      {/* Slides */}
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)`, width: `${total * 100}%` }}
      >
        {slides.map((s) => (
          <div key={s.id} className="relative h-[320px] w-full flex-shrink-0 md:h-[420px]">
            <img
                src={s.image}
                srcSet={`${s.image_800} 800w, ${s.image_1600} 1600w, ${s.image_1920} 1920w`}
                sizes="(max-width: 768px) 100vw, 1200px"
                alt={s.title}
                className="h-full w-full object-cover"
                />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h3 className="text-2xl font-extrabold md:text-3xl">{s.title}</h3>
              {s.subtitle && <p className="mt-1 max-w-xl text-sm text-white/90 md:text-base">{s.subtitle}</p>}
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
        ))}
      </div>

      {/* Arrows */}
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

      {/* Dots */}
      <div className="pointer-events-none absolute bottom-2 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, i) => (
          <span
            key={i}
            onClick={() => go(i)}
            className={`pointer-events-auto h-2 w-2 cursor-pointer rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
}