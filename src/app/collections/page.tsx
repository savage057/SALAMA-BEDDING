'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/constants';
import { useCartStore } from '@/store/useCartStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import Link from 'next/link';
import type { Product, ProductVariant, ProductImage } from '@/types';

export const dynamic = 'force-dynamic';

type FullProduct = Product & { variants: ProductVariant[]; images: ProductImage[] };

// Style filter options
const STYLE_OPTIONS = [
  { value: '', label: 'All Styles' },
  { value: 'geometric', label: 'Geometric' },
  { value: 'floral', label: 'Floral' },
  { value: 'abstract', label: 'Abstract' },
  { value: 'kids', label: 'Kids & Novelty' },
];

const SIZE_OPTIONS = [
  { value: '', label: 'All Sizes' },
  { value: 'twin', label: 'Twin' },
  { value: 'full', label: 'Full' },
  { value: 'queen', label: 'Queen' },
  { value: 'king', label: 'King' },
];

// Heart icon
function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

// Cart icon
function CartIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

// Individual Product Card
function ProductCard({ product, index }: { product: FullProduct; index: number }) {
  const { toggle, isFavorite } = useFavoritesStore();
  const favorited = isFavorite(product.id);

  const { addItem, isProductInCart } = useCartStore();
  const inCart = isProductInCart(product.id);
  const roomImage = product.images.find((i) => i.type === 'room') || product.images.find((i) => i.type === 'flat') || product.images[0];
  const minModifier = Math.min(...(product.variants.map((v) => v.price_modifier).length ? product.variants.map((v) => v.price_modifier) : [0]), 0);
  const startingPrice = product.base_price + minModifier;
  const uniqueColorways = Array.from(new Set(product.variants.map((v) => v.colorway_name)));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const variant = product.variants.find((v) => v.stock_qty > 0) || product.variants[0];
    if (!variant) return;
    addItem({
      variantId: variant.id,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      colorway: variant.colorway_name,
      bedSize: variant.bed_size,
      quantity: 1,
      unitPrice: product.base_price + variant.price_modifier,
      imageUrl: roomImage?.url || '',
    });
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      basePrice: product.base_price,
      imageUrl: roomImage?.url || '',
      styleCategory: product.style_category,
    });
  };

  return (
    <div
      className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-border/40 hover:shadow-xl hover:shadow-charcoal/5 transition-all duration-500"
      style={{ animationDelay: `${index * 0.04}s` }}
    >
      {/* Image */}
      <div className="relative block w-full pb-[75%] h-0 overflow-hidden bg-surface">
        <Link href={`/collections/${product.slug}`} className="absolute inset-0">
          {roomImage ? (
            <img
              src={roomImage.url}
              alt={roomImage.alt_text || product.name}
              className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:brightness-90"
              loading={index < 4 ? 'eager' : 'lazy'}
              onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface text-charcoal/20">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </div>
          )}
        </Link>

        {/* Style badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-block px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[9px] font-sans font-semibold uppercase tracking-wider text-charcoal shadow-sm">
            {product.style_category}
          </span>
        </div>

        {/* Favorite button */}
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-sm border transition-all duration-300 cursor-pointer ${
            favorited
              ? 'bg-gold text-white border-gold scale-110'
              : 'bg-white/90 backdrop-blur-sm text-charcoal/60 border-white/80 hover:text-gold hover:scale-105'
          }`}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <HeartIcon filled={favorited} />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-5">
        <Link href={`/collections/${product.slug}`} className="hover:text-gold transition-colors duration-300">
          <h3 className="font-serif text-lg font-semibold text-charcoal mb-1 line-clamp-1">{product.name}</h3>
        </Link>

        {/* Product Type Slab */}
        <div className="mb-2">
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

        {product.description && (
          <p className="text-[11px] font-sans text-muted line-clamp-1 mb-3">{product.description}</p>
        )}

        <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-sans uppercase tracking-wider text-muted block">From</span>
            <span className="font-serif text-base font-bold text-charcoal">{formatPrice(startingPrice)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-sans text-muted">{uniqueColorways.length} color{uniqueColorways.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className={`mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
            inCart
              ? 'bg-success text-white'
              : 'bg-charcoal text-white hover:bg-gold'
          }`}
        >
          <CartIcon />
          {inCart ? 'In Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

// Filter Dropdown Button
function FilterDropdown({ products }: { products: FullProduct[] }) {
  const [open, setOpen] = useState(false);
  const [style, setStyle] = useState('');
  const [size, setSize] = useState('');
  const [colorway, setColorway] = useState('');
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  // Unique colorways from all products
  const allColorways = Array.from(
    new Set(products.flatMap((p) => p.variants.map((v) => v.colorway_name)))
  ).sort();

  const activeCount = [style, size, colorway, search].filter(Boolean).length;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const clearAll = () => { setStyle(''); setSize(''); setColorway(''); setSearch(''); };

  // Expose filter state to parent via a custom event
  useEffect(() => {
    const event = new CustomEvent('salama-filter-change', { detail: { style, size, colorway, search } });
    window.dispatchEvent(event);
  }, [style, size, colorway, search]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-sans font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
          open || activeCount > 0
            ? 'bg-charcoal text-white border-charcoal'
            : 'bg-white text-charcoal border-border/60 hover:border-charcoal'
        }`}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
        </svg>
        Filters
        {activeCount > 0 && (
          <span className="w-4 h-4 bg-gold text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl border border-border/60 shadow-xl shadow-charcoal/10 p-5 z-30 animate-scale-in">
          {/* Search */}
          <div className="mb-4">
            <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-charcoal/60 block mb-1.5">Search</label>
            <input
              type="text"
              placeholder="e.g. floral, stripe..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface border border-border/60 rounded-xl px-3 py-2 text-xs font-sans text-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal"
            />
          </div>

          {/* Style */}
          <div className="mb-4">
            <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-charcoal/60 block mb-1.5">Style</label>
            <div className="flex flex-wrap gap-1.5">
              {STYLE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStyle(opt.value)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-sans font-semibold transition-all cursor-pointer ${
                    style === opt.value
                      ? 'bg-charcoal text-white'
                      : 'bg-surface text-charcoal hover:bg-charcoal/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mb-4">
            <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-charcoal/60 block mb-1.5">Bed Size</label>
            <div className="flex flex-wrap gap-1.5">
              {SIZE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSize(opt.value)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-sans font-semibold transition-all cursor-pointer ${
                    size === opt.value
                      ? 'bg-charcoal text-white'
                      : 'bg-surface text-charcoal hover:bg-charcoal/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Colorway */}
          {allColorways.length > 0 && (
            <div className="mb-4">
              <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-charcoal/60 block mb-1.5">Colorway</label>
              <select
                value={colorway}
                onChange={(e) => setColorway(e.target.value)}
                className="w-full bg-surface border border-border/60 rounded-xl px-3 py-2 text-xs font-sans text-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal cursor-pointer"
              >
                <option value="">All Colorways</option>
                {allColorways.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          {/* Clear */}
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="w-full text-center text-xs font-sans font-semibold text-muted hover:text-charcoal border border-border/60 rounded-xl py-2 transition-colors cursor-pointer"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Main Collections Page
export default function CollectionsPage() {
  const [products, setProducts] = useState<FullProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ style: '', size: '', colorway: '', search: '' });

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*, variants:product_variants(*), images:product_images(*)')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (!error && data) setProducts(data as FullProduct[]);
      setLoading(false);
    }
    load();
  }, []);

  // Listen for filter changes from FilterDropdown
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setFilters(detail);
    };
    window.addEventListener('salama-filter-change', handler);
    return () => window.removeEventListener('salama-filter-change', handler);
  }, []);

  // Client-side filtering
  const filtered = products.filter((p) => {
    if (filters.style && p.style_category !== filters.style) return false;
    if (filters.size && !p.variants.some((v) => v.bed_size === filters.size)) return false;
    if (filters.colorway && !p.variants.some((v) => v.colorway_name === filters.colorway)) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.description?.toLowerCase().includes(q) && !p.style_category.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-surface pt-32 pb-12 border-b border-border/40">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <nav className="text-xs font-sans font-medium uppercase tracking-widest text-muted mb-3">
            <a href="/" className="hover:text-charcoal transition-colors">Home</a>
            <span className="mx-2 text-border">/</span>
            <span className="text-charcoal/70">Collections</span>
          </nav>
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal">
                Our Curated Bedding
              </h1>
              <p className="text-sm font-sans text-muted mt-2">
                Vibrant patterns styled in real rooms — tailored for your comfort.
              </p>
            </div>
            {/* Filter toggle */}
            <FilterDropdown products={products} />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm font-sans text-muted">
            Showing <span className="font-semibold text-charcoal">{loading ? '—' : filtered.length}</span>{' '}
            {filtered.length === 1 ? 'design' : 'designs'}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-surface animate-pulse h-80" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {filtered.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center text-charcoal/30 mx-auto mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <h3 className="font-serif text-xl font-bold text-charcoal mb-2">No designs found</h3>
            <p className="text-sm font-sans text-muted mb-8">
              We couldn&apos;t find any bedding matching your filters. Try clearing them.
            </p>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('salama-filter-change', { detail: { style: '', size: '', colorway: '', search: '' } }))}
              className="inline-flex items-center justify-center bg-charcoal text-white font-sans font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-full hover:bg-gold transition-all duration-300 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
