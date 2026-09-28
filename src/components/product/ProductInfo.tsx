'use client';

import { useState } from 'react';
import { formatPrice, WHATSAPP_NUMBER } from '@/lib/constants';
import ColorwaySelector from './ColorwaySelector';
import SizeSelector from './SizeSelector';
import PatternScaleCallout from './PatternScaleCallout';
import Button from '@/components/ui/Button';
import type { Product, ProductVariant, ProductImage } from '@/types';

interface ProductInfoProps {
  product: Product & {
    variants: ProductVariant[];
    images: ProductImage[];
  };
}

export default function ProductInfo({ product }: ProductInfoProps) {
  // Get all unique colorways for the selector
  const colorways = Array.from(new Set(product.variants.map((v) => v.colorway_name)));
  
  // Set default states
  const [selectedColorway, setSelectedColorway] = useState(colorways[0] || '');
  
  // Filter sizes based on selected colorway
  const availableVariants = product.variants.filter((v) => v.colorway_name === selectedColorway);
  
  // Set default selected size as the first available size in stock, or fallback to first overall
  const defaultSize =
    availableVariants.find((v) => v.stock_qty > 0)?.bed_size ||
    availableVariants[0]?.bed_size ||
    'queen';
    
  const [selectedSize, setSelectedSize] = useState<string>(defaultSize);

  // Derive the active variant based on selections
  const activeVariant =
    product.variants.find(
      (v) => v.colorway_name === selectedColorway && v.bed_size === selectedSize
    ) || product.variants[0];

  const currentPrice = product.base_price + (activeVariant?.price_modifier || 0);
  const isInStock = activeVariant ? activeVariant.stock_qty > 0 : false;

  // Handle colorway change: auto-select the first in-stock size for the new colorway
  const handleColorwaySelect = (colorway: string) => {
    setSelectedColorway(colorway);
    const newVariants = product.variants.filter((v) => v.colorway_name === colorway);
    const inStockSize = newVariants.find((v) => v.stock_qty > 0)?.bed_size || newVariants[0]?.bed_size;
    if (inStockSize) {
      setSelectedSize(inStockSize);
    }
  };

  // Generate WhatsApp message text for quick ordering
  const getWhatsAppLink = () => {
    const text = `Hi SALAMA Bedding, I'd like to order:
- ${product.name}
  Color: ${selectedColorway}
  Size: ${selectedSize.toUpperCase()}
  Price: ${formatPrice(currentPrice)}
  SKU: ${activeVariant?.sku}

Please confirm availability and shipping details. Thank you!`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      {/* Breadcrumbs */}
      <nav className="text-xs font-sans font-medium uppercase tracking-widest text-muted">
        <a href="/" className="hover:text-charcoal transition-colors">Home</a>
        <span className="mx-2 text-border">/</span>
        <a href="/shop" className="hover:text-charcoal transition-colors">Shop</a>
        <span className="mx-2 text-border">/</span>
        <span className="text-charcoal/70">{product.name}</span>
      </nav>

      {/* Product Title & Style */}
      <div>
        <span className="inline-block px-3 py-1 rounded-full bg-surface text-[10px] font-sans font-semibold uppercase tracking-wider text-charcoal mb-3">
          {product.style_category}
        </span>
        <h1 className="font-serif text-3xl lg:text-4xl font-bold text-charcoal mb-3">
          {product.name}
        </h1>
        <div className="flex items-baseline gap-4 mt-2">
          <span className="font-serif text-2xl lg:text-3xl font-bold text-charcoal">
            {formatPrice(currentPrice)}
          </span>
          {activeVariant?.price_modifier > 0 && (
            <span className="text-xs font-sans text-muted">
              (Includes price modifier for size {selectedSize.toUpperCase()})
            </span>
          )}
        </div>
      </div>

      <div className="h-px bg-border/40" />

      {/* Description */}
      {product.description && (
        <p className="font-sans text-sm text-charcoal/60 leading-relaxed">
          {product.description}
        </p>
      )}

      {/* Colorway Selector */}
      {colorways.length > 0 && (
        <ColorwaySelector
          colorways={colorways}
          selectedColorway={selectedColorway}
          onSelect={handleColorwaySelect}
        />
      )}

      {/* Size Selector */}
      {availableVariants.length > 0 && (
        <SizeSelector
          availableSizes={availableVariants}
          selectedSize={selectedSize}
          onSelect={setSelectedSize}
        />
      )}

      {/* Stock Indicator */}
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${isInStock ? 'bg-success animate-pulse' : 'bg-error'}`} />
        <span className="text-xs font-sans font-medium">
          {isInStock ? (
            <span className="text-success">
              In Stock — {activeVariant.stock_qty} pieces available
            </span>
          ) : (
            <span className="text-error font-semibold">
              Out of Stock (Select another combination)
            </span>
          )}
        </span>
      </div>

      {/* Pattern Scale Callout */}
      {product.pattern_scale_note && (
        <PatternScaleCallout note={product.pattern_scale_note} />
      )}

      <div className="h-px bg-border/40 my-2" />

      {/* Actions */}
      <div className="flex flex-col gap-3">
        {/* Add to Cart button (wired to UI state for now) */}
        <Button
          variant="gold"
          size="lg"
          disabled={!isInStock}
          className="w-full flex items-center justify-center gap-2.5"
          onClick={() => {
            alert(`Added to Cart: ${product.name} (${selectedColorway}, Size: ${selectedSize.toUpperCase()})`);
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Add to Cart
        </Button>

        {/* WhatsApp Direct Order */}
        <Button
          variant="secondary"
          size="lg"
          href={getWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2.5"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#25D366]">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Order Directly via WhatsApp
        </Button>
      </div>

    </div>
  );
}
