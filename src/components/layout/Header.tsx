'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { NAV_LINKS, SITE_NAME } from '@/lib/constants';
import { useCartStore } from '@/store/useCartStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import CartDrawer from '@/components/cart/CartDrawer';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const totalItems = useCartStore((state) => state.totalItems());
  const favCount = useFavoritesStore((state) => state.count());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 group">
              {/* Luxury Minimalist Icon */}
              <div className="relative w-9 h-9 rounded-xl bg-charcoal group-hover:bg-gold flex items-center justify-center transition-all duration-500 shadow-md">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-500 group-hover:rotate-180"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="flex flex-col items-start leading-[1.1]">
                <span className="font-serif text-xl lg:text-2xl font-bold tracking-[0.06em] text-charcoal group-hover:text-gold transition-colors duration-300">
                  SALAMA
                </span>
                <span className="text-[8px] font-sans font-bold uppercase tracking-[0.32em] text-gold pl-[1px]">
                  BEDDING
                </span>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-10">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="relative text-[0.82rem] font-sans font-medium uppercase tracking-[0.14em] text-charcoal/70 hover:text-charcoal transition-colors duration-300 group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-charcoal transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>

            {/* Right Side: Favorites + Cart + Mobile Toggle */}
            <div className="flex items-center gap-3">
              {/* Favorites Icon */}
              <Link
                href="/favorites"
                className="relative p-2 text-charcoal hover:text-gold transition-colors duration-300 cursor-pointer"
                aria-label="My favorites"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {mounted && favCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-gold text-white text-[9px] font-sans font-bold flex items-center justify-center rounded-full px-1 shadow-[0_0_0_2px_rgba(255,255,255,0.8)] animate-scale-in">
                    {favCount}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-charcoal hover:text-accent-glow transition-colors duration-300 cursor-pointer"
                aria-label="Shopping cart"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {mounted && totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-gold text-white text-[9px] font-sans font-bold flex items-center justify-center rounded-full px-1 shadow-[0_0_0_2px_rgba(255,255,255,0.8)] animate-scale-in">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Toggle */}
              <button
                className="lg:hidden p-2 text-charcoal"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <div className="w-6 flex flex-col gap-1.5">
                  <span className={`block h-[1.5px] bg-charcoal transition-all duration-300 origin-center ${isMobileMenuOpen ? 'rotate-45 translate-y-[4.5px]' : ''}`} />
                  <span className={`block h-[1.5px] bg-charcoal transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 scale-0' : ''}`} />
                  <span className={`block h-[1.5px] bg-charcoal transition-all duration-300 origin-center ${isMobileMenuOpen ? '-rotate-45 -translate-y-[4.5px]' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${isMobileMenuOpen ? 'visible' : 'invisible'}`}>
        <div
          className={`absolute inset-0 bg-charcoal/20 backdrop-blur-sm transition-opacity duration-500 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full pt-28 px-10 pb-10">
            <nav className="flex flex-col gap-6">
              {NAV_LINKS.map((link, i) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-serif text-3xl text-charcoal hover:text-gold transition-colors duration-300"
                  style={{ animationDelay: `${i * 0.08}s` }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/favorites"
                className="font-serif text-3xl text-charcoal hover:text-gold transition-colors duration-300 flex items-center gap-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Favorites
                {mounted && favCount > 0 && (
                  <span className="text-sm font-sans font-bold bg-gold text-white px-2 py-0.5 rounded-full">{favCount}</span>
                )}
              </a>
            </nav>
            <div className="mt-auto">
              <div className="h-px bg-border mb-8" />
              <p className="text-sm text-muted font-sans">Luxury Comfort, Tailored for You.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
