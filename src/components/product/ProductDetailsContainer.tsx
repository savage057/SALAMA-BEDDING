'use client';

import { useState, useEffect } from 'react';
import ImageGallery from './ImageGallery';
import ColorwaySelector from './ColorwaySelector';
import SizeSelector from './SizeSelector';
import PatternScaleCallout from './PatternScaleCallout';
import Button from '@/components/ui/Button';
import { formatPrice, WHATSAPP_NUMBER } from '@/lib/constants';
import { useCartStore } from '@/store/useCartStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import type { Product, ProductVariant, ProductImage } from '@/types';

interface ProductDetailsContainerProps {
  product: Product & {
    variants: ProductVariant[];
    images: ProductImage[];
  };
}

export default function ProductDetailsContainer({ product }: ProductDetailsContainerProps) {
  // Get all unique colorways
  const colorways = Array.from(new Set(product.variants.map((v) => v.colorway_name)));

  // States
  const [selectedColorway, setSelectedColorway] = useState(colorways[0] || '');

  // Filter sizes based on selected colorway
  const availableVariants = product.variants.filter((v) => v.colorway_name === selectedColorway);

  // Set default selected size as the first available size in stock, or fallback to first overall
  const defaultSize =
    availableVariants.find((v) => v.stock_qty > 0)?.bed_size ||
    availableVariants[0]?.bed_size ||
    'queen';

  const [selectedSize, setSelectedSize] = useState<string>(defaultSize);

  // Sync size selection when colorway changes
  useEffect(() => {
    const newVariants = product.variants.filter((v) => v.colorway_name === selectedColorway);
    const inStockSize = newVariants.find((v) => v.stock_qty > 0)?.bed_size || newVariants[0]?.bed_size;
    if (inStockSize) {
      setSelectedSize(inStockSize);
    }
  }, [selectedColorway, product.variants]);

  // Derive active variant
  const activeVariant =
    product.variants.find(
      (v) => v.colorway_name === selectedColorway && v.bed_size === selectedSize
    ) || product.variants[0];

  const currentPrice = product.base_price + (activeVariant?.price_modifier || 0);
  const isInStock = activeVariant ? activeVariant.stock_qty > 0 : false;

  // Zustand cart store actions
  const { addItem, isProductInCart } = useCartStore();
  const inCart = isProductInCart(product.id);

  // Favorites store
  const { toggle: toggleFav, isFavorite } = useFavoritesStore();
  const favorited = isFavorite(product.id);

  const handleToggleFavorite = () => {
    const roomImg =
      product.images.find((img) => img.type === 'room')?.url ||
      product.images.find((img) => img.type === 'flat')?.url ||
      product.images[0]?.url ||
      '';
    toggleFav({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      basePrice: product.base_price,
      imageUrl: roomImg,
      styleCategory: product.style_category,
    });
  };

  // Filter gallery images specific to the active selections
  const activeColorwayVariantIds = availableVariants.map((v) => v.id);
  const filteredImages = product.images.filter(
    (img) =>
      img.variant_id === null || // Shared images
      activeColorwayVariantIds.includes(img.variant_id) // Colorway-specific images
  ).sort((a, b) => {
    if (a.type === 'room' && b.type !== 'room') return -1;
    if (a.type !== 'room' && b.type === 'room') return 1;
    return a.sort_order - b.sort_order;
  });

  // Add configuration to cart
  const handleAddToCart = () => {
    if (!activeVariant) return;

    // Use flat lay image for cart thumbnail, fallback to active room image, or first product image
    const cartImage =
      product.images.find((img) => img.type === 'flat')?.url ||
      filteredImages[0]?.url ||
      product.images[0]?.url ||
      '';

    addItem({
      variantId: activeVariant.id,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      colorway: selectedColorway,
      bedSize: selectedSize,
      quantity: 1,
      unitPrice: currentPrice,
      imageUrl: cartImage,
    });
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
      {/* Left Column: Image Gallery (sticky on desktop) */}
      <div className="lg:col-span-7 lg:sticky lg:top-32">
        {/* We key the ImageGallery by the selectedColorway to force it to re-mount/reset activeIndex to 1 (the room view) when colorway changes */}
        <ImageGallery
          key={selectedColorway}
          images={filteredImages}
          productName={product.name}
        />
      </div>

      {/* Right Column: Details & Customizer Selection */}
      <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-8">
        {/* Breadcrumbs */}
        <nav className="text-xs font-sans font-medium uppercase tracking-widest text-muted">
          <a href="/" className="hover:text-charcoal transition-colors">Home</a>
          <span className="mx-2 text-border">/</span>
          <a href="/collections" className="hover:text-charcoal transition-colors">Collections</a>
          <span className="mx-2 text-border">/</span>
          <span className="text-charcoal/70">{product.name}</span>
        </nav>

        {/* Product Title & Style */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-block px-3 py-1 rounded-full bg-surface text-[10px] font-sans font-semibold uppercase tracking-wider text-charcoal">
              {product.style_category}
            </span>
            {(product.product_type || 'both') === 'bedsheet' && (
              <span className="inline-block px-3 py-1 rounded-full bg-blue-600 text-[10px] font-sans font-bold uppercase tracking-wider text-white">
                Bedsheet
              </span>
            )}
            {(product.product_type || 'both') === 'both' && (
              <span className="inline-block px-3 py-1 rounded-full bg-blue-600 text-[10px] font-sans font-bold uppercase tracking-wider text-white">
                Duvet & Bedsheet
              </span>
            )}
            {(product.product_type || 'both') === 'duvet' && (
              <span className="inline-block px-3 py-1 rounded-full bg-surface text-[10px] font-sans font-semibold uppercase tracking-wider text-charcoal/60">
                Duvet Cover Only
              </span>
            )}
          </div>
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
            onSelect={setSelectedColorway}
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
          {/* Cart + Favorites row */}
          <div className="flex gap-3">
            <Button
              variant="gold"
              size="lg"
              disabled={!isInStock}
              className={`flex-1 flex items-center justify-center gap-2.5 transition-all duration-300 ${
                inCart ? 'bg-success hover:bg-success/90 border-success text-white' : ''
              }`}
              onClick={handleAddToCart}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {inCart ? 'Added to Cart' : 'Add to Cart'}
            </Button>

            {/* Favorites toggle */}
            <button
              onClick={handleToggleFavorite}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 font-sans font-semibold text-sm transition-all duration-300 cursor-pointer shrink-0 ${
                favorited
                  ? 'bg-gold border-gold text-white'
                  : 'border-border/60 text-charcoal hover:border-gold hover:text-gold'
              }`}
              aria-label={favorited ? 'Remove from favorites' : 'Save to favorites'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>

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
    </div>
  );
}
