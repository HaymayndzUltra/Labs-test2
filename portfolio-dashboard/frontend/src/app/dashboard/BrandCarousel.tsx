'use client';

import Image from 'next/image';
import { useMemo, useState, type CSSProperties } from 'react';
import { FALLBACK_BRAND_IMAGE, brandLogos } from './constants';

type BrandLogo = (typeof brandLogos)[number];

function BrandLogoCard({ brand }: { brand: BrandLogo }) {
  const [logoSrc, setLogoSrc] = useState(brand.logo);

  return (
    <figure className="relative h-24 w-[200px] overflow-hidden rounded-2xl border border-indigo-100/70 bg-white/90 shadow-sm transition-transform duration-300 ease-out hover:-translate-y-0.5">
      <Image
        src={logoSrc}
        alt={`${brand.name} campaign banner`}
        fill
        sizes="(min-width: 768px) 200px, 70vw"
        className="object-contain p-4"
        onError={() => setLogoSrc(FALLBACK_BRAND_IMAGE)}
        loading="lazy"
      />
    </figure>
  );
}

export function BrandCarousel() {
  const marqueeDuration = Math.max(1, brandLogos.length * 3);
  const trackStyle: CSSProperties = { animationDuration: `${marqueeDuration}s` };
  const trackClasses =
    'flex w-max items-center gap-10 animate-marquee group-hover:[animation-play-state:paused]';

  const marqueeLogos = useMemo(() => {
    if (brandLogos.length <= 1) {
      return brandLogos;
    }
    return [...brandLogos, ...brandLogos];
  }, []);

  return (
    <section aria-labelledby="featured-brands-heading" className="space-y-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <div>
          <h2 id="featured-brands-heading" className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Featured brand partners
          </h2>
          <p className="text-xs text-neutral-500">
            Quick access to merchandising shortcuts from your most-used brands.
          </p>
        </div>
      </div>
      <div className="overflow-hidden border-y border-indigo-100/70 bg-white/95 py-6 shadow-soft">
        <div className="mx-auto hidden w-full max-w-7xl px-6 md:block">
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-r from-white via-white/90 to-white">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white via-white/90 to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white via-white/90 to-transparent"
            />
            <div className={trackClasses} style={trackStyle}>
              {marqueeLogos.map((brand, index) => (
                <BrandLogoCard key={`desktop-${brand.name}-${index}`} brand={brand} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden">
        <div className="scrollbar-hidden overflow-x-auto border-y border-indigo-100/70 bg-white/95 px-4 py-4">
          <div className="flex w-max items-center gap-8">
            {brandLogos.map((brand) => (
              <BrandLogoCard key={`mobile-${brand.name}`} brand={brand} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
