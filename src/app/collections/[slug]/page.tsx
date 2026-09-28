import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getProductBySlug, getProducts, getCollectionBySlug } from '@/lib/data';
import ProductDetailsContainer from '@/components/product/ProductDetailsContainer';
import ProductCard from '@/components/shop/ProductCard';
import ReviewsSection from '@/components/product/ReviewsSection';

export const revalidate = 30;

interface DynamicSlugPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DynamicSlugPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // 1. Try to find if slug matches a product
  const product = await getProductBySlug(slug);
  if (product) {
    return {
      title: `${product.name} | SALAMA BEDDING`,
      description: product.description || `Buy the customizable ${product.name} bedding online.`,
      openGraph: {
        title: `${product.name} | SALAMA BEDDING`,
        description: product.description || `Buy the customizable ${product.name} bedding online.`,
        images: product.images[0] ? [{ url: product.images[0].url }] : [],
      },
    };
  }

  // 2. Try to find if slug matches a collection
  const collection = await getCollectionBySlug(slug);
  if (collection) {
    return {
      title: `${collection.name} | SALAMA BEDDING`,
      description: collection.description || `Explore the unique designs in our ${collection.name}.`,
    };
  }

  return {
    title: 'Product or Collection Not Found | SALAMA BEDDING',
  };
}

async function DynamicSlugContent({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // 1. Check if slug matches a Product
  const product = await getProductBySlug(slug);

  if (product) {
    // RENDER PRODUCT DETAIL PAGE (PDP)
    // Fetch all products to find room-view candidates
    const allProducts = await getProducts();
    const otherRoomViewProducts = allProducts.filter(
      (p) => p.id !== product.id && p.images.some((img) => img.type === 'room')
    );
    // Shuffle and pick 5 to 15 products
    const shuffled = [...otherRoomViewProducts].sort(() => 0.5 - Math.random());
    const targetCount = Math.min(shuffled.length, Math.floor(Math.random() * (15 - 5 + 1)) + 5);
    const relatedProducts = shuffled.slice(0, targetCount);

    return (
      <div className="min-h-screen bg-background">
        {/* PDP Container */}
        <section className="pt-32 pb-16 lg:py-40 max-w-[1400px] mx-auto px-6 lg:px-12">
          <ProductDetailsContainer product={product} />
          <ReviewsSection productId={product.id} productName={product.name} />
        </section>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="py-16 lg:py-24 border-t border-border/40 bg-surface/30">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
              <div className="mb-10 text-center sm:text-left">
                <span className="text-[10px] font-sans uppercase tracking-widest text-muted font-bold block mb-2">
                  You May Also Like
                </span>
                <h2 className="font-serif text-2xl lg:text-3xl font-bold text-charcoal">
                  Related Designs
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                {relatedProducts.map((p, idx) => (
                  <ProductCard key={p.id} product={p} viewMode="room" index={idx} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    );
  }

  // 2. Check if slug matches a Collection -> Redirect to main page with collection filter
  const collection = await getCollectionBySlug(slug);
  if (collection) {
    redirect(`/collections?collection=${slug}`);
  }

  // 3. Neither matches -> 404 Not Found
  notFound();
}

export default function DynamicSlugPage({ params }: DynamicSlugPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-charcoal/20 border-t-charcoal animate-spin" />
        </div>
      }
    >
      <DynamicSlugContent params={params} />
    </Suspense>
  );
}
