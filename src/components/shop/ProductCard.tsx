'use client';

import Link from 'next/link';
import { formatPrice } from '@/lib/constants';
import { useCartStore } from '@/store/useCartStore';
import type { Product, ProductVariant, ProductImage } from '@/types';

interface ProductCardProps {
  product: Product & {
    variants: ProductVariant[];
    images: ProductImage[];
  };
  viewMode: 'flat' | 'room';
  index?: number;
}

// Map colorway names to HEX values for display swatches
const COLORWAY_MAP: Record<string, string> = {
  'Teal / Green Stripe': '#117A65',
  'Charcoal / Gold': '#3A3A3A',
  'Sage Green': '#8B9F82',
  'Dusty Rose': '#C4929B',
  'Coral / Grey Floral': '#E06F6F',
  'Blush Pink': '#F4C2C2',
  'Burgundy Ditsy': '#6E2C3C',
  'Lavender': '#B4A7D6',
  'Cherry Red': '#C41E3A',
  'Sky Blue': '#87CEEB',
  'Daisy Blue': '#2471A3',
  'Sunset Orange': '#ED7D31',
};

export default function ProductCard({ product, viewMode, index = 0 }: ProductCardProps) {
  // Always prefer room view image first, fall back to flat, then any image
  const displayImage =
    product.images.find((img) => img.type === 'room') ||
    product.images.find((img) => img.type === 'flat') ||
    product.images[0];

  // Get unique colorways for swatches
  const uniqueColorways = Array.from(
    new Set(product.variants.map((v) => v.colorway_name))
  );

  // Find minimum price (base_price + min price_modifier)
  const minModifier = Math.min(...product.variants.map((v) => v.price_modifier), 0);
  const startingPrice = product.base_price + minModifier;

  const { addItem, isProductInCart } = useCartStore();
  const inCart = isProductInCart(product.id);

  // Staggered fade animation delay
  const animationDelay = `${index * 0.05}s`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      variantId: product.variants[0].id,
      productName: product.name,
      productSlug: product.slug,
      colorway: product.variants[0].colorway_name,
      bedSize: product.variants[0].bed_size,
      quantity: 1,
      unitPrice: product.base_price + product.variants[0].price_modifier,
      imageUrl: displayImage?.url || '',
    });
  };

  return (
    <div
      className="reveal group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-border/40 hover:shadow-xl hover:shadow-charcoal/5 transition-all duration-500"
      style={{ animationDelay }}
    >
      <Link href={`/collections/${product.slug}`} className="relative block w-full pb-[75%] h-0 overflow-hidden bg-surface">
        {displayImage ? (
          <img
            src={displayImage.url}
            alt={displayImage.alt_text || product.name}
            className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:brightness-90 absolute inset-0"
            loading={index < 4 ? "eager" : "lazy"}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent && !parent.querySelector('.img-fallback')) {
                const fallback = document.createElement('div');
                fallback.className = 'img-fallback w-full h-full absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface text-muted';
                fallback.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span style="font-size:10px;font-family:sans-serif">No Image</span>';
                parent.appendChild(fallback);
              }
            }}
          />
        ) : (
          <div className="w-full h-full absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface text-muted">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <span className="text-[10px] font-sans">No Image Available</span>
          </div>
        )}
        
        {/* Style Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-block px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[9px] font-sans font-semibold uppercase tracking-wider text-charcoal">
            {product.style_category}
          </span>
        </div>
      </Link>

      <div className="flex flex-col flex-1 p-5 lg:p-6">
        {/* Product Name */}
        <Link href={`/collections/${product.slug}`} className="hover:text-gold transition-colors duration-300">
          <h3 className="font-serif text-lg lg:text-xl font-semibold text-charcoal mb-1 line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Product Type Slab */}
        <div className="mb-2.5">
          {(product.product_type || 'both') === 'bedsheet' && (
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-600 text-[9px] font-sans font-bold uppercase tracking-wider text-white">
              Bedsheet
            </span>
          )}
          {(product.product_type || 'both') === 'both' && (
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-600 text-[9px] font-sans font-bold uppercase tracking-wider text-white">
              Duvet & Bedsheet
            </span>
          )}
          {(product.product_type || 'both') === 'duvet' && (
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-surface text-[9px] font-sans font-semibold uppercase tracking-wider text-charcoal/60">
              Duvet Cover Only
            </span>
          )}
        </div>

        {/* Pattern Scale Note */}
        {product.pattern_scale_note && (
          <p className="text-[11px] font-sans text-muted line-clamp-1 mb-4">
            {product.pattern_scale_note}
          </p>
        )}

        <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between gap-4">
          {/* Price */}
          <div>
            <span className="text-[10px] font-sans uppercase tracking-wider text-muted block">
              Starting from
            </span>
            <span className="font-serif text-base lg:text-lg font-bold text-charcoal">
              {formatPrice(startingPrice)}
            </span>
          </div>

          {/* Colorway Swatches */}
          <div className="flex flex-col items-end gap-1.5">
            <span className="text-[9px] font-sans text-muted">
              {uniqueColorways.length} {uniqueColorways.length === 1 ? 'Color' : 'Colors'}
            </span>
            <div className="flex gap-1">
              {uniqueColorways.slice(0, 4).map((colorway) => {
                const hexColor = COLORWAY_MAP[colorway] || '#CCCCCC';
                return (
                  <span
                    key={colorway}
                    className="w-3.5 h-3.5 rounded-full border border-white shadow-[0_0_0_1px_rgba(0,0,0,0.1)] block"
                    style={{ backgroundColor: hexColor }}
                    title={colorway}
                  />
                );
              })}
              {uniqueColorways.length > 4 && (
                <span className="text-[9px] font-sans font-semibold text-muted bg-surface px-1 rounded flex items-center justify-center">
                  +{uniqueColorways.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
