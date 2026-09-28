'use client';

import { useState, useRef } from 'react';
import type { ProductImage } from '@/types';

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] || images[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Viewport */}
      <div
        className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-surface border border-border/40 group shadow-sm"
      >
        {activeImage ? (
            <img
              src={activeImage.url}
              alt={activeImage.alt_text || `${productName} main image`}
              className="w-full h-full object-cover transition-all duration-700 ease-out absolute inset-0 group-hover:brightness-95"
            />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted font-sans text-xs">
            No Image Available
          </div>
        )}

        {/* Flat / Room Badge Indicator */}
        {activeImage && (
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-block px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[9px] font-sans font-semibold uppercase tracking-wider text-charcoal shadow-sm">
              {activeImage.type === 'room' ? 'Room styled' : 'Product flat-lay'}
            </span>
          </div>
        )}

      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(idx)}
              className={`relative w-20 h-16 rounded-lg overflow-hidden border-2 bg-surface cursor-pointer shrink-0 transition-all duration-300 ${
                activeIndex === idx
                  ? 'border-charcoal shadow-sm scale-95'
                  : 'border-transparent hover:border-charcoal/30'
              }`}
            >
              <img
                src={img.url}
                alt={img.alt_text || `${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover absolute inset-0"
              />
              {/* Micro badge on thumb */}
              <div className="absolute bottom-0.5 right-0.5 bg-black/60 px-1 rounded text-[7px] text-white uppercase tracking-tighter">
                {img.type}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
