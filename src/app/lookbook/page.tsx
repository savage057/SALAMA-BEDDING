import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const revalidate = 60; // Revalidate every 60 seconds instead of force-dynamic

export const metadata = {
  title: 'Look Room | SALAMA BEDDING',
  description:
    'Browse our visual Look Room. Get inspiration for your home by exploring our bedding designs styled in real bedroom settings.',
};

export default async function LookbookPage() {
  // Query Supabase directly to only show products and images stored in the database
  const { data: dbProducts } = await supabase
    .from('products')
    .select('*, images:product_images(*)')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  const products = dbProducts || [];

  // Extract room-view images (only from database, at most 2 per product)
  const looks = products.flatMap((product) => {
    const roomImages = (product.images || []).filter((img: any) => img.type === 'room');
    // Limit to at most 2 room images per product
    const selectedRoomImages = roomImages.slice(0, 2);
    
    return selectedRoomImages.map((img: any) => ({
      imageId: img.id,
      imageUrl: img.url,
      altText: img.alt_text || product.name,
      productName: product.name,
      productSlug: product.slug,
      styleCategory: product.style_category,
      basePrice: product.base_price,
    }));
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <section className="bg-surface pt-32 pb-16 border-b border-border/40">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <nav className="text-xs font-sans font-medium uppercase tracking-widest text-muted mb-2">
                <Link href="/" className="hover:text-charcoal transition-colors">Home</Link>
                <span className="mx-2 text-border">/</span>
                <span className="text-charcoal/70">Look Room</span>
              </nav>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal">
                The Look Room
              </h1>
            </div>
            <p className="text-sm font-sans text-muted max-w-sm text-center sm:text-right">
              Explore our designs styled in real bedrooms. Click any room setup to view and customize the bedding.
            </p>
          </div>
        </div>
      </section>

      {/* Look Room Gallery */}
      <section className="py-16 max-w-[1400px] mx-auto px-6 lg:px-12">
        {looks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
            {looks.map((look, idx) => (
              <Link
                key={look.imageId}
                href={`/collections/${look.productSlug}`}
                className="group relative block aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-border/40 hover:shadow-xl hover:shadow-charcoal/5 transition-all duration-500 bg-surface animate-fade-in"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {/* Room View Image */}
                <img
                  src={look.imageUrl}
                  alt={look.altText}
                  className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:brightness-[0.65] absolute inset-0"
                  loading={idx < 6 ? 'eager' : 'lazy'}
                />

                {/* Hover overlay details */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 pointer-events-none">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-gold mb-1 block">
                    {look.styleCategory}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white mb-2 leading-tight">
                    {look.productName}
                  </h3>
                  <span className="text-xs font-sans text-white/80 font-semibold flex items-center gap-1">
                    Shop this Room
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>

                {/* Floating corner card showing design name (disappears on hover) */}
                <div className="absolute bottom-4 left-4 group-hover:opacity-0 transition-opacity duration-300 z-10">
                  <div className="glass-card rounded-xl px-3 py-1.5 text-[10px] font-sans font-bold text-charcoal shadow-sm">
                    {look.productName}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-charcoal/40 p-6 bg-surface/50 border border-dashed border-border/60 rounded-2xl">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-muted">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <p className="text-sm font-sans">No room-styled setups found in database.</p>
          </div>
        )}
      </section>
    </div>
  );
}
