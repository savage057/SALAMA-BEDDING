'use client';

import { useEffect, useRef, useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice, WHATSAPP_NUMBER } from '@/lib/constants';
import Button from '@/components/ui/Button';

import { supabase } from '@/lib/supabase';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem } = useCartStore();
  const drawerRef = useRef<HTMLDivElement>(null);
  
  const [selectedVariantIds, setSelectedVariantIds] = useState<Set<string>>(new Set());

  // Automatically select all new items
  useEffect(() => {
    setSelectedVariantIds(new Set(items.map(item => item.variantId)));
  }, [items.length]);

  const toggleSelection = (variantId: string) => {
    setSelectedVariantIds((prev) => {
      const next = new Set(prev);
      if (next.has(variantId)) {
        next.delete(variantId);
      } else {
        next.add(variantId);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedVariantIds.size === items.length) {
      setSelectedVariantIds(new Set());
    } else {
      setSelectedVariantIds(new Set(items.map(item => item.variantId)));
    }
  };

  const selectedItems = items.filter(item => selectedVariantIds.has(item.variantId));
  const selectedTotalPrice = selectedItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);

  // Lock body scroll when cart drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Click outside drawer to close
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        isOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose]);

  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item to checkout.");
      return;
    }

    const orderRefId = Math.random().toString(36).substring(2, 11).toUpperCase();

    // 1. Log guest order record in Supabase database
    try {
      const { data: dbOrder, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: 'Guest Customer',
          customer_phone: '',
          status: 'pending_whatsapp',
          total_estimate: selectedTotalPrice,
          notes: `Order Ref: ${orderRefId}`,
        })
        .select()
        .single();

      if (!orderError && dbOrder) {
        const dbItems = selectedItems.map((item) => ({
          order_id: dbOrder.id,
          variant_id: item.variantId,
          product_name: item.productName,
          colorway: item.colorway,
          bed_size: item.bedSize,
          quantity: item.quantity,
          unit_price: item.unitPrice,
        }));
        await supabase.from('order_items').insert(dbItems);
      }
    } catch (err) {
      console.warn('Supabase order logging fallback:', err);
    }

    // 2. Format WhatsApp checkout message text with embedded absolute image URLs
    let message = `i would like to purchase the item(s).\n\n`;
    selectedItems.forEach((item) => {
      message += `- ${item.productName}\n`;
      message += `  Color: ${item.colorway}\n`;
      message += `  Size: ${item.bedSize.toUpperCase()}\n`;
      message += `  Qty: ${item.quantity} x ${formatPrice(item.unitPrice)}\n`;
      
      if (item.imageUrl) {
        const absoluteImageUrl = item.imageUrl.startsWith('/')
          ? window.location.origin + item.imageUrl
          : item.imageUrl;
        message += `  Image: ${absoluteImageUrl}\n`;
      }
      message += `\n`;
    });
    
    message += `Total Price: ${formatPrice(selectedTotalPrice)}\n`;
    message += `Reference Order ID: ${orderRefId}\n\n`;
    message += `Please confirm payment details. Thank you!`;

    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    // 3. Open WhatsApp directly and clear checked out items
    window.open(whatsappLink, '_blank');
    selectedItems.forEach(item => removeItem(item.variantId));
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-500 ${
        isOpen ? 'visible' : 'invisible'
      }`}
    >
      {/* Dark blur backdrop */}
      <div
        className={`absolute inset-0 bg-charcoal/30 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className={`absolute right-0 top-0 h-full w-full sm:w-[480px] bg-background shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-border/40 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-charcoal">
              Your Shopping Cart
            </h2>
            <p className="text-[10px] font-sans uppercase tracking-wider text-muted mt-1">
              Guest checkout
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-charcoal/50 hover:text-charcoal transition-colors duration-300"
            aria-label="Close cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Select All */}
        {items.length > 0 && (
          <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between bg-surface/10">
            <label className="flex items-center gap-2 text-xs font-sans text-charcoal cursor-pointer">
              <input
                type="checkbox"
                checked={selectedVariantIds.size === items.length && items.length > 0}
                onChange={toggleAll}
                className="w-4 h-4 accent-charcoal rounded border-border/40 cursor-pointer"
              />
              <span className="font-semibold uppercase tracking-wider">Select All</span>
            </label>
            <span className="text-[10px] text-muted font-sans font-semibold">
              {selectedVariantIds.size} of {items.length} selected
            </span>
          </div>
        )}

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.variantId}
                className="flex items-start gap-4 pb-6 border-b border-border/20 last:border-0 last:pb-0"
              >
                {/* Checkbox */}
                <div className="pt-1.5 shrink-0">
                  <input
                    type="checkbox"
                    checked={selectedVariantIds.has(item.variantId)}
                    onChange={() => toggleSelection(item.variantId)}
                    className="w-4 h-4 accent-charcoal rounded border-border/40 cursor-pointer"
                  />
                </div>

                {/* Thumbnail */}
                <div className="relative w-20 aspect-[4/3] rounded-lg overflow-hidden border border-border/40 bg-surface shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={`${item.productName} thumbnail`}
                    className="w-full h-full object-cover absolute inset-0"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-sm font-semibold text-charcoal truncate mb-1">
                    {item.productName}
                  </h3>
                  <p className="text-[10px] font-sans text-muted">
                    Color: {item.colorway} | Size: {item.bedSize.toUpperCase()}
                  </p>
                  <p className="text-xs font-sans font-semibold text-charcoal mt-2">
                    {formatPrice(item.unitPrice)}
                  </p>
                </div>

                {/* Adjust Qty & Remove */}
                <div className="flex flex-col items-end gap-3 shrink-0">
                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="text-[10px] font-sans text-muted hover:text-error transition-colors duration-300"
                    aria-label="Remove item"
                  >
                    Remove
                  </button>
                  <div className="flex items-center border border-border/40 rounded-lg overflow-hidden bg-surface">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="px-2 py-1 text-xs hover:bg-border/20 text-charcoal/60"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-sans font-semibold text-charcoal min-w-[24px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="px-2 py-1 text-xs hover:bg-border/20 text-charcoal/60"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* Empty state */
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-charcoal/30 mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
              <h3 className="font-serif text-base font-bold text-charcoal mb-1">Your cart is empty</h3>
              <p className="text-xs font-sans text-muted max-w-[200px] leading-relaxed mb-6">
                Add premium patterned beddings to start customizing your space.
              </p>
              <Button variant="secondary" size="sm" onClick={onClose}>
                Continue Browsing
              </Button>
            </div>
          )}
        </div>

        {/* Footer summary */}
        {items.length > 0 && (
          <div className="p-6 border-t border-border/40 bg-surface/30">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-sans font-medium text-charcoal/70">Selected Subtotal</span>
              <span className="font-serif text-lg lg:text-xl font-bold text-charcoal">
                {formatPrice(selectedTotalPrice)}
              </span>
            </div>

            <p className="text-[10px] font-sans text-muted leading-relaxed mb-6">
              Orders are generated as deep links to finalize checkout on WhatsApp. Stock quantities will be locked upon vendor confirmation.
            </p>

            <Button
              variant="gold"
              size="lg"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleCheckout}
              disabled={selectedItems.length === 0}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="mr-1">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Finalize Order via WhatsApp
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
