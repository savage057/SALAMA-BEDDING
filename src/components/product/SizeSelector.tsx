'use client';

import type { ProductVariant } from '@/types';

interface SizeSelectorProps {
  availableSizes: ProductVariant[];
  selectedSize: string;
  onSelect: (size: string) => void;
}

const SIZE_LABELS = {
  twin: { label: 'Twin', dimensions: '39" × 75"' },
  full: { label: 'Full', dimensions: '54" × 75"' },
  queen: { label: 'Queen', dimensions: '60" × 80"' },
  king: { label: 'King', dimensions: '76" × 80"' },
};

export default function SizeSelector({
  availableSizes,
  selectedSize,
  onSelect,
}: SizeSelectorProps) {
  const sizes = ['twin', 'full', 'queen', 'king'] as const;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-sans uppercase tracking-widest text-muted font-bold">
          Select Bed Size
        </span>
        <span className="text-xs font-sans text-muted">
          Dimensions shown below
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {sizes.map((sizeKey) => {
          // Find if this size is currently in stock for the active colorway
          const variant = availableSizes.find((v) => v.bed_size === sizeKey);
          const isAvailable = variant ? variant.stock_qty > 0 : false;
          const isActive = selectedSize === sizeKey;
          const info = SIZE_LABELS[sizeKey];

          return (
            <button
              key={sizeKey}
              disabled={!isAvailable}
              onClick={() => onSelect(sizeKey)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-300 ${
                !isAvailable
                  ? 'border-border bg-surface/50 text-muted opacity-40 cursor-not-allowed'
                  : isActive
                  ? 'border-charcoal bg-charcoal text-white shadow-sm'
                  : 'border-border bg-transparent text-charcoal hover:border-charcoal/30 cursor-pointer'
              }`}
            >
              <span className="text-xs font-sans font-semibold uppercase tracking-wider block">
                {info.label}
              </span>
              <span className={`text-[9px] font-sans mt-0.5 ${isActive ? 'text-white/70' : 'text-muted'}`}>
                {info.dimensions}
              </span>
              {isAvailable && variant && variant.stock_qty <= 5 && (
                <span className={`text-[8px] font-sans font-medium uppercase tracking-tighter mt-1 px-1 py-0.2 rounded ${
                  isActive ? 'bg-white/20 text-white' : 'bg-rose-50 text-rose-600'
                }`}>
                  Only {variant.stock_qty} left
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
