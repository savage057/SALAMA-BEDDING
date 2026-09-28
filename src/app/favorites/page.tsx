'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useFavoritesStore, FavoriteItem } from '@/store/useFavoritesStore';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/constants';

export default function FavoritesPage() {
  const { favorites, remove, removeMany, toggle } = useFavoritesStore();
  const addItem = useCartStore((s) => s.addItem);
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === favorites.length) setSelected([]);
    else setSelected(favorites.map((f) => f.productId));
  };

  const handleDeleteSelected = () => {
    removeMany(selected);
    setSelected([]);
  };

  const handleAddSelectedToCart = () => {
    const toAdd = favorites.filter((f) => selected.includes(f.productId));
    toAdd.forEach((item) => {
      addItem({
        variantId: `fav-${item.productId}`,
        productId: item.productId,
        productName: item.name,
        productSlug: item.slug,
        colorway: 'Default',
        bedSize: 'queen',
        quantity: 1,
        unitPrice: item.basePrice,
        imageUrl: item.imageUrl,
      });
    });
    setSelected([]);
  };

  const handleRemoveSingle = (id: string) => {
    remove(id);
    setSelected((prev) => prev.filter((x) => x !== id));
  };

  const hasSelection = selected.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <section className="bg-surface pt-32 pb-12 border-b border-border/40">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <nav className="text-xs font-sans font-medium uppercase tracking-widest text-muted mb-3">
            <a href="/" className="hover:text-charcoal transition-colors">Home</a>
            <span className="mx-2 text-border">/</span>
            <span className="text-charcoal/70">Favorites</span>
          </nav>
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal">
                My Favorites
              </h1>
              <p className="text-sm font-sans text-muted mt-2">
                {favorites.length === 0
                  ? 'You haven\'t saved any designs yet.'
                  : `${favorites.length} saved design${favorites.length !== 1 ? 's' : ''}`}
              </p>
            </div>

            {/* Select All toggle */}
            {favorites.length > 0 && (
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/60 text-xs font-sans font-semibold uppercase tracking-wider text-charcoal hover:border-charcoal transition-all cursor-pointer bg-white"
              >
                <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${selected.length === favorites.length ? 'bg-charcoal border-charcoal' : 'border-charcoal/40'}`}>
                  {selected.length === favorites.length && (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  )}
                </span>
                {selected.length === favorites.length ? 'Deselect All' : 'Select All'}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Bulk Action Bar */}
      {hasSelection && (
        <div className="sticky top-20 z-30 bg-charcoal text-white px-6 lg:px-12 py-3.5 flex items-center justify-between gap-4 shadow-lg animate-fade-in">
          <div className="max-w-[1400px] w-full mx-auto flex items-center justify-between gap-4">
            <span className="text-sm font-sans font-semibold">
              {selected.length} item{selected.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddSelectedToCart}
                className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold/80 text-white text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                Add to Cart
              </button>
              <button
                onClick={handleDeleteSelected}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
                Remove
              </button>
              <button
                onClick={() => setSelected([])}
                className="text-white/60 hover:text-white text-xs font-sans transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <section className="py-12 max-w-[1400px] mx-auto px-6 lg:px-12">
        {favorites.length === 0 ? (
          /* Empty state */
          <div className="py-32 text-center max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center text-charcoal/20 mx-auto mb-6">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h2 className="font-serif text-2xl font-bold text-charcoal mb-3">No saved favorites yet</h2>
            <p className="text-sm font-sans text-muted mb-8">
              Browse our collections and tap the heart icon on any design to save it here.
            </p>
            <Link
              href="/collections"
              className="inline-flex items-center justify-center bg-charcoal text-white font-sans font-semibold text-xs uppercase tracking-wider px-8 py-3.5 rounded-full hover:bg-gold transition-all duration-300"
            >
              Browse Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {favorites.map((item: FavoriteItem, idx: number) => (
              <FavoriteCard
                key={item.productId}
                item={item}
                selected={selected.includes(item.productId)}
                onToggleSelect={() => toggleSelect(item.productId)}
                onRemove={() => handleRemoveSingle(item.productId)}
                onAddToCart={() => {
                  addItem({
                    variantId: `fav-${item.productId}`,
                    productId: item.productId,
                    productName: item.name,
                    productSlug: item.slug,
                    colorway: 'Default',
                    bedSize: 'queen',
                    quantity: 1,
                    unitPrice: item.basePrice,
                    imageUrl: item.imageUrl,
                  });
                }}
                index={idx}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function FavoriteCard({
  item,
  selected,
  onToggleSelect,
  onRemove,
  onAddToCart,
  index,
}: {
  item: FavoriteItem;
  selected: boolean;
  onToggleSelect: () => void;
  onRemove: () => void;
  onAddToCart: () => void;
  index: number;
}) {
  const [cartAdded, setCartAdded] = useState(false);

  const handleCart = (e: React.MouseEvent) => {
    e.preventDefault();
    onAddToCart();
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 2000);
  };

  return (
    <div
      className={`group flex flex-col h-full bg-white rounded-2xl overflow-hidden border transition-all duration-300 ${
        selected ? 'border-charcoal shadow-lg shadow-charcoal/10 scale-[0.98]' : 'border-border/40 hover:shadow-xl hover:shadow-charcoal/5'
      }`}
      style={{ animationDelay: `${index * 0.04}s` }}
    >
      {/* Image */}
      <div className="relative block w-full pb-[75%] h-0 overflow-hidden bg-surface">
        <Link href={`/collections/${item.slug}`} className="absolute inset-0">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover transition-all duration-700 group-hover:brightness-90"
              onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface text-charcoal/20">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </div>
          )}
        </Link>

        {/* Checkbox overlay */}
        <button
          onClick={onToggleSelect}
          className={`absolute top-3 left-3 z-10 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm ${
            selected
              ? 'bg-charcoal border-charcoal'
              : 'bg-white/90 border-white hover:border-charcoal/40'
          }`}
          aria-label="Select item"
        >
          {selected && (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
        </button>

        {/* Remove (heart unfill) */}
        <button
          onClick={(e) => { e.preventDefault(); onRemove(); }}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-gold flex items-center justify-center text-white shadow-sm hover:bg-gold/80 transition-all cursor-pointer"
          aria-label="Remove from favorites"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Style badge */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="inline-block px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[9px] font-sans font-semibold uppercase tracking-wider text-charcoal">
            {item.styleCategory}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-5">
        <Link href={`/collections/${item.slug}`} className="hover:text-gold transition-colors">
          <h3 className="font-serif text-lg font-semibold text-charcoal mb-1 line-clamp-1">{item.name}</h3>
        </Link>
        <span className="font-serif text-base font-bold text-charcoal mb-4">{formatPrice(item.basePrice)}</span>

        <div className="mt-auto flex gap-2">
          <Link
            href={`/collections/${item.slug}`}
            className="flex-1 flex items-center justify-center py-2.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider border border-border/60 text-charcoal hover:border-charcoal transition-all duration-300"
          >
            View
          </Link>
          <button
            onClick={handleCart}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              cartAdded ? 'bg-success text-white' : 'bg-charcoal text-white hover:bg-gold'
            }`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {cartAdded ? 'Added!' : 'Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
