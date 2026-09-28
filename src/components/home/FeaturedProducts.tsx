'use client';

import { COLLECTIONS } from '@/lib/constants';

interface CollectionCard {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  image: string;
  accent: string;
}

const collections: CollectionCard[] = [
  {
    ...COLLECTIONS.MINIMALIST,
    image: '/images/products/stripe-room.jpg',
    accent: 'from-charcoal/90 via-charcoal/50 to-transparent',
  },
  {
    ...COLLECTIONS.HERITAGE,
    image: '/images/products/rose-room.jpg',
    accent: 'from-[#2e1c1e]/90 via-[#2e1c1e]/50 to-transparent',
  },
  {
    ...COLLECTIONS.PLAYFUL,
    image: '/images/products/rabbit-room.jpg',
    accent: 'from-[#2c221e]/90 via-[#2c221e]/50 to-transparent',
  },
];

export default function FeaturedProducts() {
  return (
    <section className="py-24 lg:py-32 bg-background border-t border-border/20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16 reveal">
          <span className="inline-block text-xs font-sans font-medium uppercase tracking-[0.2em] text-muted mb-4">
            Curated Styles
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal leading-[1.15] mb-6">
            Featured Bedding Collections
          </h2>
          <p className="text-base font-sans text-charcoal/50 max-w-xl mx-auto leading-relaxed font-light">
            Explore three distinct design styles, each crafted to transform your bedroom into a personalized sanctuary of comfort.
          </p>
        </div>

        {/* Collection Cards Grid (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {collections.map((collection, index) => (
            <a
              key={collection.slug}
              href={`/collections/${collection.slug}`}
              className="reveal group relative rounded-3xl overflow-hidden h-[480px] lg:h-[580px] block border border-border/20 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-[600ms] ease-out"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background Image with Ken Burns Zoom Effect */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover scale-100 group-hover:scale-108 transition-transform duration-[1200ms] ease-out brightness-[0.85] group-hover:brightness-[0.75]"
                  loading="lazy"
                />
              </div>

              {/* Gradient Overlay with Shift Animation */}
              <div className={`absolute inset-0 z-10 bg-gradient-to-t ${collection.accent} opacity-85 group-hover:opacity-95 transition-opacity duration-[600ms]`} />

              {/* Content Container */}
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 lg:p-12">
                {/* Tagline Pill */}
                <div className="mb-4 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-[500ms] ease-out">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-white/90">
                    {collection.tagline}
                  </span>
                </div>

                {/* Collection Name */}
                <h3 className="font-serif text-2xl lg:text-3xl font-bold text-white mb-3 leading-tight group-hover:text-gold transition-colors duration-300">
                  {collection.name.replace('The ', '').replace(' Collection', '')}
                </h3>

                {/* Description */}
                <p className="text-xs lg:text-sm font-sans text-white/70 leading-relaxed mb-8 max-w-xs line-clamp-3 font-light">
                  {collection.description}
                </p>

                {/* Explore Action Button */}
                <div className="flex items-center gap-2 text-xs font-sans font-bold text-white uppercase tracking-wider">
                  <span className="border-b border-transparent group-hover:border-white transition-all duration-300">
                    Explore Collection
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform duration-300 group-hover:translate-x-2"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </div>

              {/* Interactive Inner Border Overlay */}
              <div className="absolute inset-0 z-30 rounded-3xl border border-white/0 group-hover:border-white/15 transition-all duration-500 pointer-events-none" />
            </a>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-16 reveal">
          <a
            href="/collections"
            className="inline-flex items-center gap-3 px-10 py-4.5 bg-charcoal hover:bg-gold text-white text-xs font-sans font-bold uppercase tracking-[0.2em] rounded-2xl shadow-lg transition-all duration-[400ms] hover:scale-105 active:scale-98 cursor-pointer group hover:shadow-[0_10px_25px_-5px_rgba(196,163,90,0.4)]"
          >
            Browse All Products
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:translate-x-1.5"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
