import { COLLECTIONS } from '@/lib/constants';
import Button from '@/components/ui/Button';

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
    accent: 'from-charcoal/80 to-charcoal/30',
  },
  {
    ...COLLECTIONS.HERITAGE,
    image: '/images/products/rose-room.jpg',
    accent: 'from-rose-900/70 to-rose-900/20',
  },
  {
    ...COLLECTIONS.PLAYFUL,
    image: '/images/products/rabbit-room.jpg',
    accent: 'from-amber-900/70 to-amber-900/20',
  },
];

export default function CollectionsGrid() {
  return (
    <section className="pt-0 pb-24 lg:pb-32 bg-background">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-8 reveal">
          <span className="inline-block text-xs font-sans font-medium uppercase tracking-[0.2em] text-muted mb-4">
            Our Collections
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal leading-[1.15] mb-6">
            Curated for Every Style
          </h2>
          <p className="text-base font-sans text-charcoal/50 max-w-xl mx-auto leading-relaxed">
            Three distinct worlds of bedding design — each crafted to transform your 
            bedroom into a reflection of your personality.
          </p>
        </div>

        {/* Collection Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {collections.map((collection, index) => (
            <a
              key={collection.slug}
              href={`/collections/${collection.slug}`}
              className={`reveal reveal-delay-${index + 1} group relative rounded-2xl overflow-hidden h-[480px] lg:h-[560px] block`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover transition-all duration-[800ms] ease-out group-hover:brightness-75"
                  loading="lazy"
                />
              </div>

              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${collection.accent} transition-opacity duration-500`} />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-10">
                {/* Tagline pill */}
                <div className="mb-4 opacity-0 translate-y-3 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-sans font-medium uppercase tracking-[0.15em] text-white/90">
                    {collection.tagline}
                  </span>
                </div>

                {/* Collection name */}
                <h3 className="font-serif text-2xl lg:text-3xl font-bold text-white mb-3 leading-tight">
                  {collection.name.replace('The ', '').replace(' Collection', '')}
                </h3>

                {/* Description */}
                <p className="text-sm font-sans text-white/70 leading-relaxed mb-6 max-w-xs line-clamp-2">
                  {collection.description}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-2 text-sm font-sans font-medium text-white group/cta">
                  <span className="uppercase tracking-[0.1em] text-xs">Explore</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform duration-300 group-hover:translate-x-1.5"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </div>

              {/* Hover border glow */}
              <div className="absolute inset-0 rounded-2xl border border-white/0 transition-all duration-500 group-hover:border-white/20 group-hover:shadow-[inset_0_0_40px_rgba(255,255,255,0.05)]" />
            </a>
          ))}
        </div>

        {/* Browse All CTA */}
        <div className="text-center mt-14 reveal">
          <Button variant="secondary" size="lg" href="/collections">
            Browse All Products
          </Button>
        </div>
      </div>
    </section>
  );
}
