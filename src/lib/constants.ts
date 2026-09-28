/** Site-wide constants for SALAMA BEDDING */

export const SITE_NAME = 'SALAMA BEDDING';
export const SITE_TAGLINE = 'Luxury Comfort, Tailored for You.';
export const SITE_DESCRIPTION =
  'Discover premium bedding with vibrant, customizable patterns — from elegant florals and geometric designs to playful character prints. Browse our collections and order via WhatsApp.';

/** WhatsApp business number (update with real number) */
export const WHATSAPP_NUMBER = '2348147709019';

/** Currency formatting */
export const CURRENCY_SYMBOL = '₦';
export const CURRENCY_CODE = 'NGN';
export const CURRENCY_LOCALE = 'en-NG';

export function formatPrice(amount: number): string {
  return `${CURRENCY_SYMBOL}${amount.toLocaleString(CURRENCY_LOCALE)}`;
}

/** Navigation links */
export const NAV_LINKS = [
  { label: 'Collections', href: '/collections' },
  { label: 'Lookbook', href: '/lookbook' },
  { label: 'About', href: '/about' },
] as const;

/** Collection names */
export const COLLECTIONS = {
  MINIMALIST: {
    name: 'The Minimalist Collection',
    slug: 'minimalist',
    tagline: 'Stripes & Geometrics',
    description: 'Clean lines and bold geometry for the modern bedroom. Understated elegance that speaks volumes.',
  },
  HERITAGE: {
    name: 'The Heritage Collection',
    slug: 'heritage',
    tagline: 'Classic Florals & Ditsy Roses',
    description: 'Timeless floral patterns that bring warmth and romance to your sanctuary.',
  },
  PLAYFUL: {
    name: 'The Playful Comfort Collection',
    slug: 'playful-comfort',
    tagline: 'Character Prints',
    description: 'Whimsical character prints that bring joy and personality to every bedroom.',
  },
} as const;

/** Bed sizes */
export const BED_SIZES = [
  { value: 'twin', label: 'Twin', dimensions: '39" × 75"' },
  { value: 'full', label: 'Full', dimensions: '54" × 75"' },
  { value: 'queen', label: 'Queen', dimensions: '60" × 80"' },
  { value: 'king', label: 'King', dimensions: '76" × 80"' },
] as const;

/** Style categories */
export const STYLE_CATEGORIES = [
  { value: 'geometric', label: 'Geometric' },
  { value: 'floral', label: 'Floral' },
  { value: 'abstract', label: 'Abstract' },
  { value: 'kids', label: 'Kids & Novelty' },
] as const;
