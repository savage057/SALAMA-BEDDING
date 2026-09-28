/**
 * SALAMA BEDDING — Product Data Layer
 *
 * Coordinates data fetching between Supabase DB and local mock fallbacks.
 * If Supabase is unmigrated, it falls back to local data gracefully.
 */

import { supabase } from './supabase';
import type {
  Product,
  ProductVariant,
  ProductImage,
  Collection,
} from '@/types';

// ============================================================
// Local Mock Fallback Data (matching seed SQL)
// ============================================================

export const localCollections: Collection[] = [
  {
    id: 'col-minimalist',
    name: 'The Minimalist Collection',
    slug: 'minimalist',
    description:
      'Clean lines and bold geometry for the modern bedroom. Understated elegance that speaks volumes.',
    hero_image: '/images/products/stripe-room.jpg',
  },
  {
    id: 'col-heritage',
    name: 'The Heritage Collection',
    slug: 'heritage',
    description:
      'Timeless floral patterns that bring warmth and romance to your sanctuary.',
    hero_image: '/images/products/rose-room.jpg',
  },
  {
    id: 'col-playful',
    name: 'The Playful Comfort Collection',
    slug: 'playful-comfort',
    description:
      'Whimsical character prints that bring joy and personality to every bedroom.',
    hero_image: '/images/products/rabbit-room.jpg',
  },
];

export const localProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Geometric Stripe Duvet Cover',
    slug: 'geometric-stripe-duvet',
    description:
      'Bold parallel stripes in a contemporary palette. This duvet cover transforms your bed into a statement piece with its precision-printed geometric pattern on premium 300-thread-count cotton sateen.',
    base_price: 25000,
    style_category: 'geometric',
    pattern_scale_note:
      'Features an all-over 3cm geometric stripe pattern with alternating thick and thin lines',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod-2',
    name: 'Diamond Grid Comforter',
    slug: 'diamond-grid-comforter',
    description:
      'Interlocking diamond shapes create a sophisticated, textured look. Filled with hypoallergenic microfiber for cloud-like comfort without the weight.',
    base_price: 32000,
    style_category: 'geometric',
    pattern_scale_note:
      'Features a repeating 8cm diamond lattice grid across the entire surface',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod-3',
    name: 'Classic Rose Duvet Cover',
    slug: 'classic-rose-duvet',
    description:
      'Full-bloom roses scattered on a soft backdrop, evoking the romance of an English garden. Crafted from breathable cotton percale with a smooth, crisp hand-feel.',
    base_price: 28000,
    style_category: 'floral',
    pattern_scale_note:
      'Features large 12cm cabbage rose motifs arranged in a trailing vine layout',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod-4',
    name: 'Ditsy Floral Sheet Set',
    slug: 'ditsy-floral-sheets',
    description:
      'Tiny scattered blossoms in a vintage-inspired print. This complete sheet set includes a fitted sheet, flat sheet, and two pillowcases in soft brushed microfiber.',
    base_price: 18000,
    style_category: 'floral',
    pattern_scale_note:
      'Features an all-over 2cm micro-floral print with delicate petal details',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod-5',
    name: 'Rabbit Character Comforter',
    slug: 'rabbit-character-comforter',
    description:
      'Adorable twin rabbits in playful poses, perfect for kids\' rooms or the young at heart. Ultra-soft velvet-touch finish on top with a smooth cotton-blend reverse.',
    base_price: 22000,
    style_category: 'kids',
    pattern_scale_note:
      'Features a centered 60cm twin-rabbit motif with surrounding 4cm mini-rabbit repeats',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod-6',
    name: 'Anime Dreams Duvet Cover',
    slug: 'anime-dreams-duvet',
    description:
      'Vibrant anime-inspired characters in a dynamic collage layout. Reversible design — bold print on one side, subtle tone-on-tone on the reverse.',
    base_price: 24000,
    style_category: 'kids',
    pattern_scale_note:
      'Features 15cm anime character panels in a comic-strip grid layout',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

export const localVariants: ProductVariant[] = [
  // 1. Geometric Stripe Duvet — Teal / Green Stripe
  { id: 'v-1a-tw', product_id: 'prod-1', colorway_name: 'Teal / Green Stripe', bed_size: 'twin', price_modifier: 0, stock_qty: 15, sku: 'SB-GSD-TG-TW', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-1a-fl', product_id: 'prod-1', colorway_name: 'Teal / Green Stripe', bed_size: 'full', price_modifier: 1500, stock_qty: 12, sku: 'SB-GSD-TG-FL', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-1a-qn', product_id: 'prod-1', colorway_name: 'Teal / Green Stripe', bed_size: 'queen', price_modifier: 3000, stock_qty: 20, sku: 'SB-GSD-TG-QN', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-1a-kg', product_id: 'prod-1', colorway_name: 'Teal / Green Stripe', bed_size: 'king', price_modifier: 5000, stock_qty: 12, sku: 'SB-GSD-TG-KG', created_at: '2024-01-01T00:00:00Z' },
  // Geometric Stripe Duvet — Charcoal / Gold
  { id: 'v-1b-tw', product_id: 'prod-1', colorway_name: 'Charcoal / Gold', bed_size: 'twin', price_modifier: 0, stock_qty: 10, sku: 'SB-GSD-CG-TW', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-1b-fl', product_id: 'prod-1', colorway_name: 'Charcoal / Gold', bed_size: 'full', price_modifier: 1500, stock_qty: 14, sku: 'SB-GSD-CG-FL', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-1b-qn', product_id: 'prod-1', colorway_name: 'Charcoal / Gold', bed_size: 'queen', price_modifier: 3000, stock_qty: 18, sku: 'SB-GSD-CG-QN', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-1b-kg', product_id: 'prod-1', colorway_name: 'Charcoal / Gold', bed_size: 'king', price_modifier: 5000, stock_qty: 8, sku: 'SB-GSD-CG-KG', created_at: '2024-01-01T00:00:00Z' },

  // 2. Diamond Grid Comforter — Sage Green
  { id: 'v-2a-tw', product_id: 'prod-2', colorway_name: 'Sage Green', bed_size: 'twin', price_modifier: 0, stock_qty: 10, sku: 'SB-DGC-SG-TW', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-2a-fl', product_id: 'prod-2', colorway_name: 'Sage Green', bed_size: 'full', price_modifier: 2000, stock_qty: 12, sku: 'SB-DGC-SG-FL', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-2a-qn', product_id: 'prod-2', colorway_name: 'Sage Green', bed_size: 'queen', price_modifier: 3500, stock_qty: 14, sku: 'SB-DGC-SG-QN', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-2a-kg', product_id: 'prod-2', colorway_name: 'Sage Green', bed_size: 'king', price_modifier: 5500, stock_qty: 9, sku: 'SB-DGC-SG-KG', created_at: '2024-01-01T00:00:00Z' },
  // Diamond Grid — Dusty Rose
  { id: 'v-2b-tw', product_id: 'prod-2', colorway_name: 'Dusty Rose', bed_size: 'twin', price_modifier: 0, stock_qty: 15, sku: 'SB-DGC-DR-TW', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-2b-fl', product_id: 'prod-2', colorway_name: 'Dusty Rose', bed_size: 'full', price_modifier: 2000, stock_qty: 10, sku: 'SB-DGC-DR-FL', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-2b-qn', product_id: 'prod-2', colorway_name: 'Dusty Rose', bed_size: 'queen', price_modifier: 3500, stock_qty: 16, sku: 'SB-DGC-DR-QN', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-2b-kg', product_id: 'prod-2', colorway_name: 'Dusty Rose', bed_size: 'king', price_modifier: 5500, stock_qty: 7, sku: 'SB-DGC-DR-KG', created_at: '2024-01-01T00:00:00Z' },

  // 3. Classic Rose Duvet — Coral / Grey Floral
  { id: 'v-3a-tw', product_id: 'prod-3', colorway_name: 'Coral / Grey Floral', bed_size: 'twin', price_modifier: 0, stock_qty: 15, sku: 'SB-CRD-CG-TW', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-3a-fl', product_id: 'prod-3', colorway_name: 'Coral / Grey Floral', bed_size: 'full', price_modifier: 1500, stock_qty: 10, sku: 'SB-CRD-CG-FL', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-3a-qn', product_id: 'prod-3', colorway_name: 'Coral / Grey Floral', bed_size: 'queen', price_modifier: 3000, stock_qty: 22, sku: 'SB-CRD-CG-QN', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-3a-kg', product_id: 'prod-3', colorway_name: 'Coral / Grey Floral', bed_size: 'king', price_modifier: 5000, stock_qty: 11, sku: 'SB-CRD-CG-KG', created_at: '2024-01-01T00:00:00Z' },
  // Classic Rose — Blush Pink
  { id: 'v-3b-tw', product_id: 'prod-3', colorway_name: 'Blush Pink', bed_size: 'twin', price_modifier: 0, stock_qty: 12, sku: 'SB-CRD-BP-TW', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-3b-fl', product_id: 'prod-3', colorway_name: 'Blush Pink', bed_size: 'full', price_modifier: 1500, stock_qty: 16, sku: 'SB-CRD-BP-FL', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-3b-qn', product_id: 'prod-3', colorway_name: 'Blush Pink', bed_size: 'queen', price_modifier: 3000, stock_qty: 17, sku: 'SB-CRD-BP-QN', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-3b-kg', product_id: 'prod-3', colorway_name: 'Blush Pink', bed_size: 'king', price_modifier: 5000, stock_qty: 13, sku: 'SB-CRD-BP-KG', created_at: '2024-01-01T00:00:00Z' },

  // 4. Ditsy Floral Sheets — Burgundy Ditsy
  { id: 'v-4a-tw', product_id: 'prod-4', colorway_name: 'Burgundy Ditsy', bed_size: 'twin', price_modifier: 0, stock_qty: 25, sku: 'SB-DFS-BD-TW', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-4a-fl', product_id: 'prod-4', colorway_name: 'Burgundy Ditsy', bed_size: 'full', price_modifier: 1000, stock_qty: 18, sku: 'SB-DFS-BD-FL', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-4a-qn', product_id: 'prod-4', colorway_name: 'Burgundy Ditsy', bed_size: 'queen', price_modifier: 2000, stock_qty: 30, sku: 'SB-DFS-BD-QN', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-4a-kg', product_id: 'prod-4', colorway_name: 'Burgundy Ditsy', bed_size: 'king', price_modifier: 4000, stock_qty: 14, sku: 'SB-DFS-BD-KG', created_at: '2024-01-01T00:00:00Z' },
  // Ditsy Floral — Lavender
  { id: 'v-4b-tw', product_id: 'prod-4', colorway_name: 'Lavender', bed_size: 'twin', price_modifier: 0, stock_qty: 20, sku: 'SB-DFS-LV-TW', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-4b-fl', product_id: 'prod-4', colorway_name: 'Lavender', bed_size: 'full', price_modifier: 1000, stock_qty: 15, sku: 'SB-DFS-LV-FL', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-4b-qn', product_id: 'prod-4', colorway_name: 'Lavender', bed_size: 'queen', price_modifier: 2000, stock_qty: 28, sku: 'SB-DFS-LV-QN', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-4b-kg', product_id: 'prod-4', colorway_name: 'Lavender', bed_size: 'king', price_modifier: 4000, stock_qty: 12, sku: 'SB-DFS-LV-KG', created_at: '2024-01-01T00:00:00Z' },

  // 5. Rabbit Character — Cherry Red
  { id: 'v-5a-tw', product_id: 'prod-5', colorway_name: 'Cherry Red', bed_size: 'twin', price_modifier: 0, stock_qty: 18, sku: 'SB-RCC-CR-TW', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-5a-fl', product_id: 'prod-5', colorway_name: 'Cherry Red', bed_size: 'full', price_modifier: 1500, stock_qty: 12, sku: 'SB-RCC-CR-FL', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-5a-qn', product_id: 'prod-5', colorway_name: 'Cherry Red', bed_size: 'queen', price_modifier: 3000, stock_qty: 14, sku: 'SB-RCC-CR-QN', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-5a-kg', product_id: 'prod-5', colorway_name: 'Cherry Red', bed_size: 'king', price_modifier: 5000, stock_qty: 10, sku: 'SB-RCC-CR-KG', created_at: '2024-01-01T00:00:00Z' },
  // Rabbit Character — Sky Blue
  { id: 'v-5b-tw', product_id: 'prod-5', colorway_name: 'Sky Blue', bed_size: 'twin', price_modifier: 0, stock_qty: 22, sku: 'SB-RCC-SB-TW', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-5b-fl', product_id: 'prod-5', colorway_name: 'Sky Blue', bed_size: 'full', price_modifier: 1500, stock_qty: 15, sku: 'SB-RCC-SB-FL', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-5b-qn', product_id: 'prod-5', colorway_name: 'Sky Blue', bed_size: 'queen', price_modifier: 3000, stock_qty: 10, sku: 'SB-RCC-SB-QN', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-5b-kg', product_id: 'prod-5', colorway_name: 'Sky Blue', bed_size: 'king', price_modifier: 5000, stock_qty: 8, sku: 'SB-RCC-SB-KG', created_at: '2024-01-01T00:00:00Z' },

  // 6. Anime Dreams — Daisy Blue
  { id: 'v-6a-tw', product_id: 'prod-6', colorway_name: 'Daisy Blue', bed_size: 'twin', price_modifier: 0, stock_qty: 16, sku: 'SB-ADD-DB-TW', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-6a-fl', product_id: 'prod-6', colorway_name: 'Daisy Blue', bed_size: 'full', price_modifier: 1500, stock_qty: 11, sku: 'SB-ADD-DB-FL', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-6a-qn', product_id: 'prod-6', colorway_name: 'Daisy Blue', bed_size: 'queen', price_modifier: 3000, stock_qty: 12, sku: 'SB-ADD-DB-QN', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-6a-kg', product_id: 'prod-6', colorway_name: 'Daisy Blue', bed_size: 'king', price_modifier: 5000, stock_qty: 7, sku: 'SB-ADD-DB-KG', created_at: '2024-01-01T00:00:00Z' },
  // Anime Dreams — Sunset Orange
  { id: 'v-6b-tw', product_id: 'prod-6', colorway_name: 'Sunset Orange', bed_size: 'twin', price_modifier: 0, stock_qty: 19, sku: 'SB-ADD-SO-TW', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-6b-fl', product_id: 'prod-6', colorway_name: 'Sunset Orange', bed_size: 'full', price_modifier: 1500, stock_qty: 14, sku: 'SB-ADD-SO-FL', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-6b-qn', product_id: 'prod-6', colorway_name: 'Sunset Orange', bed_size: 'queen', price_modifier: 3000, stock_qty: 15, sku: 'SB-ADD-SO-QN', created_at: '2024-01-01T00:00:00Z' },
  { id: 'v-6b-kg', product_id: 'prod-6', colorway_name: 'Sunset Orange', bed_size: 'king', price_modifier: 5000, stock_qty: 9, sku: 'SB-ADD-SO-KG', created_at: '2024-01-01T00:00:00Z' },
];

export const localImages: ProductImage[] = [
  // 1. Geometric Stripe Duvet Cover
  { id: 'img-prod1-flat', product_id: 'prod-1', variant_id: null, type: 'flat', url: '/images/products/stripe-room.jpg', alt_text: 'Teal & Green Stripe Duvet Cover folded close-up', sort_order: 0 },
  { id: 'img-prod1-room-tg', product_id: 'prod-1', variant_id: 'v-1a-tw', type: 'room', url: '/images/products/stripe-room.jpg', alt_text: 'Teal & Green Stripe Duvet Cover styled in a luxury bedroom', sort_order: 1 },
  { id: 'img-prod1-room-cg', product_id: 'prod-1', variant_id: 'v-1b-tw', type: 'room', url: '/images/products/stripe-room.jpg', alt_text: 'Charcoal & Gold Geometric Stripe Duvet Cover in room', sort_order: 2 },

  // 2. Diamond Grid Comforter
  { id: 'img-prod2-flat', product_id: 'prod-2', variant_id: null, type: 'flat', url: '/images/products/stripe-room.jpg', alt_text: 'Diamond Grid Comforter pattern detail', sort_order: 0 },
  { id: 'img-prod2-room-sg', product_id: 'prod-2', variant_id: 'v-2a-tw', type: 'room', url: '/images/products/stripe-room.jpg', alt_text: 'Sage Green Diamond Grid Comforter styled in room', sort_order: 1 },
  { id: 'img-prod2-room-dr', product_id: 'prod-2', variant_id: 'v-2b-tw', type: 'room', url: '/images/products/stripe-room.jpg', alt_text: 'Dusty Rose Diamond Grid Comforter styled in room', sort_order: 2 },

  // 3. Classic Rose Duvet Cover
  { id: 'img-prod3-flat', product_id: 'prod-3', variant_id: null, type: 'flat', url: '/images/products/rose-room.jpg', alt_text: 'Classic Rose Duvet Cover fabric layout', sort_order: 0 },
  { id: 'img-prod3-room-cg', product_id: 'prod-3', variant_id: 'v-3a-tw', type: 'room', url: '/images/products/rose-room.jpg', alt_text: 'Coral & Grey Floral Duvet Cover styled in a luxury bedroom', sort_order: 1 },
  { id: 'img-prod3-room-bp', product_id: 'prod-3', variant_id: 'v-3b-tw', type: 'room', url: '/images/products/rose-room.jpg', alt_text: 'Blush Pink Classic Rose Duvet Cover in room', sort_order: 2 },

  // 4. Ditsy Floral Sheet Set
  { id: 'img-prod4-flat', product_id: 'prod-4', variant_id: null, type: 'flat', url: '/images/products/ditsy-room.jpg', alt_text: 'Ditsy Floral Sheets fabric pattern close-up', sort_order: 0 },
  { id: 'img-prod4-room-bd', product_id: 'prod-4', variant_id: 'v-4a-tw', type: 'room', url: '/images/products/ditsy-room.jpg', alt_text: 'Burgundy Ditsy Floral Sheet Set styled in a luxury bedroom', sort_order: 1 },
  { id: 'img-prod4-room-lv', product_id: 'prod-4', variant_id: 'v-4b-tw', type: 'room', url: '/images/products/ditsy-room.jpg', alt_text: 'Lavender Ditsy Floral Sheets in room', sort_order: 2 },

  // 5. Rabbit Character Comforter
  { id: 'img-prod5-flat', product_id: 'prod-5', variant_id: null, type: 'flat', url: '/images/products/rabbit-room.jpg', alt_text: 'Rabbit Character Comforter layout flat', sort_order: 0 },
  { id: 'img-prod5-room-cr', product_id: 'prod-5', variant_id: 'v-5a-tw', type: 'room', url: '/images/products/rabbit-room.jpg', alt_text: 'Cherry Red Rabbit Character Comforter styled in a luxury bedroom', sort_order: 1 },
  { id: 'img-prod5-room-sb', product_id: 'prod-5', variant_id: 'v-5b-tw', type: 'room', url: '/images/products/rabbit-room.jpg', alt_text: 'Sky Blue Rabbit Character Comforter in room', sort_order: 2 },

  // 6. Anime Dreams Duvet Cover
  { id: 'img-prod6-flat', product_id: 'prod-6', variant_id: null, type: 'flat', url: '/images/products/anime-room.jpg', alt_text: 'Anime Dreams Duvet Cover folded layout', sort_order: 0 },
  { id: 'img-prod6-room-db', product_id: 'prod-6', variant_id: 'v-6a-tw', type: 'room', url: '/images/products/anime-room.jpg', alt_text: 'Daisy Blue Anime Dreams Duvet Cover styled in room', sort_order: 1 },
  { id: 'img-prod6-room-so', product_id: 'prod-6', variant_id: 'v-6b-tw', type: 'room', url: '/images/products/anime-room.jpg', alt_text: 'Sunset Orange Anime Dreams Duvet Cover in room', sort_order: 2 },
];

export const localProductCollectionMap: Record<string, string[]> = {
  'prod-1': ['col-minimalist'],
  'prod-2': ['col-minimalist'],
  'prod-3': ['col-heritage'],
  'prod-4': ['col-heritage'],
  'prod-5': ['col-playful'],
  'prod-6': ['col-playful'],
};

// ============================================================
// Helper Functions (with Supabase DB + local fallback logic)
// ============================================================

export function getLocalMockDb() {
  if (typeof window !== 'undefined') {
    return {
      products: localProducts,
      variants: localVariants,
      images: localImages
    };
  }
  
  try {
    const fs = require('fs');
    const path = require('path');
    const dbPath = path.join(process.cwd(), 'src/lib/mock_db.json');
    if (fs.existsSync(dbPath)) {
      const fileData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      // Merge file data with hardcoded local seed so neither source is lost.
      // File entries take precedence if IDs clash (they are more recent).
      const fileProductIds = new Set((fileData.products || []).map((p: any) => p.id));
      const fileVariantIds = new Set((fileData.variants || []).map((v: any) => v.id));
      const fileImageIds   = new Set((fileData.images   || []).map((i: any) => i.id));

      return {
        products: [
          ...localProducts.filter((p) => !fileProductIds.has(p.id)),
          ...(fileData.products || []),
        ],
        variants: [
          ...localVariants.filter((v) => !fileVariantIds.has(v.id)),
          ...(fileData.variants || []),
        ],
        images: [
          ...localImages.filter((i) => !fileImageIds.has(i.id)),
          ...(fileData.images || []),
        ],
      };
    }
  } catch (err) {
    console.error('Error reading mock_db.json file:', err);
  }
  
  return {
    products: localProducts,
    variants: localVariants,
    images: localImages
  };
}

/** Get all products, optionally filtered */
export async function getProducts(filters?: {
  style?: string;
  colorway?: string;
  size?: string;
  collection?: string;
  search?: string;
}): Promise<(Product & { variants: ProductVariant[]; images: ProductImage[] })[]> {
  try {
    // Try querying Supabase
    const { data: dbProducts, error } = await supabase
      .from('products')
      .select('*, variants:product_variants(*), images:product_images(*)');

    if (error || !dbProducts || dbProducts.length === 0) {
      throw new Error(error?.message || 'No products returned from database.');
    }

    // ---------------------------------------------------------------
    // Merge Supabase results with any locally-added products in
    // mock_db.json (admin demo-mode additions) so they always appear.
    // ---------------------------------------------------------------
    const localDb = getLocalMockDb();
    const supabaseIds = new Set(dbProducts.map((p: any) => p.id));
    // Also match by slug in case IDs differ between sources
    const supabaseSlugs = new Set(dbProducts.map((p: any) => p.slug));

    // Find local-only products (not already fetched from Supabase)
    const localOnlyProducts = localDb.products.filter(
      (lp: any) => !supabaseIds.has(lp.id) && !supabaseSlugs.has(lp.slug) && lp.status === 'active'
    );

    // Shape local-only products to match the Supabase product shape
    const localOnlyShaped = localOnlyProducts.map((lp: any) => ({
      ...lp,
      variants: localDb.variants.filter((v: any) => v.product_id === lp.id),
      images: localDb.images.filter((img: any) => img.product_id === lp.id),
    }));

    // Combine: Supabase products first, then local-only additions
    const allProducts = [
      ...dbProducts as (Product & { variants: ProductVariant[]; images: ProductImage[] })[],
      ...localOnlyShaped as (Product & { variants: ProductVariant[]; images: ProductImage[] })[],
    ];

    // Filter combined list
    let filtered = allProducts;

    if (filters?.style) {
      filtered = filtered.filter((p) => p.style_category === filters.style);
    }

    if (filters?.collection) {
      // Find collection in DB or mock
      const col = await getCollectionBySlug(filters.collection);
      if (col) {
        // Query product collections join
        const { data: joinMap } = await supabase
          .from('product_collections')
          .select('product_id')
          .eq('collection_id', col.id);

        if (joinMap && joinMap.length > 0) {
          const productIds = joinMap.map((j) => j.product_id);
          // Only apply collection filter to Supabase products;
          // local-only products have no collection assignment, so keep them visible
          filtered = filtered.filter(
            (p) => productIds.includes(p.id) || localOnlyShaped.some((lp: any) => lp.id === p.id)
          );
        }
      }
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.style_category.toLowerCase().includes(q)
      );
    }

    return filtered.map((p) => {
      let filteredVariants = p.variants;
      if (filters?.colorway) {
        filteredVariants = filteredVariants.filter((v) =>
          v.colorway_name.toLowerCase().includes(filters.colorway!.toLowerCase())
        );
      }
      if (filters?.size) {
        filteredVariants = filteredVariants.filter((v) => v.bed_size === filters.size);
      }

      // Live image fallback enrichment: if database products have empty images table, match by slug to local files
      let productImages = p.images || [];
      if (productImages.length === 0) {
        const localProd = localDb.products.find((lp: any) => lp.slug === p.slug);
        if (localProd) {
          productImages = localDb.images.filter((img: any) => img.product_id === localProd.id);
        }
      }

      return {
        ...p,
        variants: filteredVariants.length > 0 ? filteredVariants : p.variants,
        images: productImages,
      };
    });
  } catch (err) {
    // Graceful fallback to local mock data
    const db = getLocalMockDb();
    let filtered = db.products.filter((p: any) => p.status === 'active');

    if (filters?.style) {
      filtered = filtered.filter((p: any) => p.style_category === filters.style);
    }

    if (filters?.collection) {
      const col = localCollections.find((c) => c.slug === filters.collection);
      if (col) {
        const productIds = Object.entries(localProductCollectionMap)
          .filter(([, colIds]) => colIds.includes(col.id))
          .map(([prodId]) => prodId);
        filtered = filtered.filter((p: any) => productIds.includes(p.id));
      }
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p: any) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.style_category.toLowerCase().includes(q)
      );
    }

    return filtered.map((product: any) => {
      let productVariants = db.variants.filter((v: any) => v.product_id === product.id);

      if (filters?.colorway) {
        productVariants = productVariants.filter((v: any) =>
          v.colorway_name.toLowerCase().includes(filters.colorway!.toLowerCase())
        );
      }

      if (filters?.size) {
        productVariants = productVariants.filter((v: any) => v.bed_size === filters.size);
      }

      return {
        ...product,
        variants:
          productVariants.length > 0
            ? productVariants
            : db.variants.filter((v: any) => v.product_id === product.id),
        images: db.images.filter((i: any) => i.product_id === product.id),
      };
    });
  }
}

/** Get a single product by slug */
export async function getProductBySlug(
  slug: string
): Promise<(Product & { variants: ProductVariant[]; images: ProductImage[] }) | null> {
  try {
    const { data: dbProduct, error } = await supabase
      .from('products')
      .select('*, variants:product_variants(*), images:product_images(*)')
      .eq('slug', slug)
      .single();

    if (error || !dbProduct) {
      throw new Error(error?.message || 'Product not found.');
    }

    const product = dbProduct as Product & { variants: ProductVariant[]; images: ProductImage[] };
    if (!product.images || product.images.length === 0) {
      const db = getLocalMockDb();
      const localProd = db.products.find((lp: any) => lp.slug === product.slug);
      if (localProd) {
        product.images = db.images.filter((img: any) => img.product_id === localProd.id);
      }
    }

    return product;
  } catch (err) {
    // Fallback to local
    const db = getLocalMockDb();
    const product = db.products.find((p: any) => p.slug === slug);
    if (!product) return null;

    return {
      ...product,
      variants: db.variants.filter((v: any) => v.product_id === product.id),
      images: db.images.filter((i: any) => i.product_id === product.id),
    };
  }
}

/** Get unique colorways for a product */
export async function getProductColorways(productId: string): Promise<string[]> {
  try {
    const { data: dbVariants } = await supabase
      .from('product_variants')
      .select('colorway_name')
      .eq('product_id', productId);

    if (dbVariants && dbVariants.length > 0) {
      return Array.from(new Set(dbVariants.map((v) => v.colorway_name)));
    }
    throw new Error();
  } catch {
    const productVariants = localVariants.filter((v) => v.product_id === productId);
    return Array.from(new Set(productVariants.map((v) => v.colorway_name)));
  }
}

/** Get available sizes for a product + colorway */
export async function getAvailableSizes(
  productId: string,
  colorway?: string
): Promise<ProductVariant[]> {
  try {
    let query = supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', productId)
      .gt('stock_qty', 0);

    if (colorway) {
      query = query.eq('colorway_name', colorway);
    }

    const { data: dbVariants } = await query;
    if (dbVariants && dbVariants.length > 0) {
      return dbVariants as ProductVariant[];
    }
    throw new Error();
  } catch {
    return localVariants.filter(
      (v) =>
        v.product_id === productId &&
        (!colorway || v.colorway_name === colorway) &&
        v.stock_qty > 0
    );
  }
}

/** Get all unique colorways across all products */
export async function getAllColorways(): Promise<string[]> {
  try {
    const { data: dbVariants } = await supabase
      .from('product_variants')
      .select('colorway_name');

    if (dbVariants && dbVariants.length > 0) {
      return Array.from(new Set(dbVariants.map((v) => v.colorway_name))).sort();
    }
    throw new Error();
  } catch {
    return Array.from(new Set(localVariants.map((v) => v.colorway_name))).sort();
  }
}

/** Get a collection by slug */
export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  try {
    const { data: dbCollection, error } = await supabase
      .from('collections')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !dbCollection) {
      throw new Error();
    }
    return dbCollection as Collection;
  } catch {
    return localCollections.find((c) => c.slug === slug) || null;
  }
}

/** Get collection for a product */
export async function getProductCollections(productId: string): Promise<Collection[]> {
  try {
    const { data: joins } = await supabase
      .from('product_collections')
      .select('collection_id')
      .eq('product_id', productId);

    if (joins && joins.length > 0) {
      const colIds = joins.map((j) => j.collection_id);
      const { data: dbCols } = await supabase
        .from('collections')
        .select('*')
        .in('id', colIds);

      if (dbCols) return dbCols as Collection[];
    }
    throw new Error();
  } catch {
    const colIds = localProductCollectionMap[productId] || [];
    return localCollections.filter((c) => colIds.includes(c.id));
  }
}

/** Get all collections */
export async function getCollections(): Promise<Collection[]> {
  try {
    const { data: dbCollections, error } = await supabase
      .from('collections')
      .select('*');

    if (error || !dbCollections || dbCollections.length === 0) {
      throw new Error();
    }
    return dbCollections as Collection[];
  } catch {
    return localCollections;
  }
}
