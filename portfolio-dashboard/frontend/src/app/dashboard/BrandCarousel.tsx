'use client';

import Image from 'next/image';
import { useMemo, useState, type CSSProperties } from 'react';
import { FALLBACK_BRAND_IMAGE, brandLogos } from './constants';

type BrandLogo = (typeof brandLogos)[number];

function BrandLogoCard({ brand }: { brand: BrandLogo }) {
  const [logoSrc, setLogoSrc] = useState(brand.logo);

  return (
    <figure className="relative h-28 w-[240px] overflow-hidden rounded-3xl ring-1 ring-indigo-100/60 shadow-soft transition-transform duration-300 ease-out hover:-translate-y-0.5">
      <Image
        src={logoSrc}
        alt={`${brand.name} campaign banner`}
        fill
        sizes="(min-width: 768px) 240px, 80vw"
        className="object-cover"
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
    'flex w-max items-center gap-16 animate-marquee group-hover:[animation-play-state:paused]';

  const marqueeLogos = useMemo(() => {
    if (brandLogos.length <= 1) {
      return brandLogos;
    }
    return [...brandLogos, ...brandLogos];
  }, []);

  return (
    <div className="space-y-2">
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
          <div className="flex w-max items-center gap-10">
            {brandLogos.map((brand) => (
              <BrandLogoCard key={`mobile-${brand.name}`} brand={brand} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
