-- ============================================================
-- SALAMA BEDDINGS — Seed Data
-- ============================================================
-- Run after 001_initial_schema.sql
-- Uses CTEs with RETURNING to capture generated UUIDs so that
-- foreign-key references work without hard-coding IDs.
-- ============================================================

-- ------------------------------------
-- 1. COLLECTIONS
-- ------------------------------------
INSERT INTO public.collections (id, name, slug, description, hero_image) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'The Minimalist Collection', 'minimalist',
   'Clean lines, bold geometry, and modern simplicity for the refined bedroom.',
   '/images/collections/minimalist-hero.jpg'),

  ('a0000000-0000-0000-0000-000000000002', 'The Heritage Collection', 'heritage',
   'Timeless floral patterns inspired by traditional African and global textile heritage.',
   '/images/collections/heritage-hero.jpg'),

  ('a0000000-0000-0000-0000-000000000003', 'The Playful Comfort Collection', 'playful-comfort',
   'Fun character prints and vibrant themes designed to spark joy in kids'' rooms.',
   '/images/collections/playful-comfort-hero.jpg');

-- ------------------------------------
-- 2. PRODUCTS
-- ------------------------------------

-- Product 1: Geometric Stripe Duvet Cover
INSERT INTO public.products (id, name, slug, description, base_price, style_category, pattern_scale_note, status) VALUES
  ('b0000000-0000-0000-0000-000000000001',
   'Geometric Stripe Duvet Cover',
   'geometric-stripe-duvet-cover',
   'A crisp duvet cover with repeating geometric stripes in a bold two-tone palette. Made from 100% brushed microfibre for a soft, breathable finish.',
   25000.00,
   'geometric',
   'Features an all-over 3cm geometric stripe pattern repeating horizontally across the full width.',
   'active');

-- Product 2: Diamond Grid Comforter
INSERT INTO public.products (id, name, slug, description, base_price, style_category, pattern_scale_note, status) VALUES
  ('b0000000-0000-0000-0000-000000000002',
   'Diamond Grid Comforter',
   'diamond-grid-comforter',
   'A plush comforter featuring an interlocking diamond grid pattern. Filled with hypoallergenic hollow-fibre for all-season comfort.',
   32000.00,
   'geometric',
   'Features a 5cm diamond grid tiled pattern across the entire surface.',
   'active');

-- Product 3: Classic Rose Duvet Cover
INSERT INTO public.products (id, name, slug, description, base_price, style_category, pattern_scale_note, status) VALUES
  ('b0000000-0000-0000-0000-000000000003',
   'Classic Rose Duvet Cover',
   'classic-rose-duvet-cover',
   'Elegant rose bouquets on a soft-wash cotton blend. A heritage-inspired design that brings warmth to any bedroom.',
   28000.00,
   'floral',
   'Features scattered 8cm rose bouquet motifs on a 15cm repeat grid.',
   'active');

-- Product 4: Ditsy Floral Sheet Set
INSERT INTO public.products (id, name, slug, description, base_price, style_category, pattern_scale_note, status) VALUES
  ('b0000000-0000-0000-0000-000000000004',
   'Ditsy Floral Sheet Set',
   'ditsy-floral-sheet-set',
   'A complete sheet set (fitted sheet, flat sheet, 2 pillowcases) in a delicate ditsy floral print. Wrinkle-resistant finish.',
   18000.00,
   'floral',
   'Features a dense 1.5cm ditsy floral scatter with no directional repeat.',
   'active');

-- Product 5: Rabbit Character Comforter
INSERT INTO public.products (id, name, slug, description, base_price, style_category, pattern_scale_note, status) VALUES
  ('b0000000-0000-0000-0000-000000000005',
   'Rabbit Character Comforter',
   'rabbit-character-comforter',
   'A cosy kids'' comforter with a lovable twin-rabbit character print. Soft-touch polyester with rounded corners for safety.',
   22000.00,
   'kids',
   'Features a centered 60cm twin-rabbit motif on the front panel with smaller 10cm companion motifs on the border.',
   'active');

-- Product 6: Anime Dreams Duvet Cover
INSERT INTO public.products (id, name, slug, description, base_price, style_category, pattern_scale_note, status) VALUES
  ('b0000000-0000-0000-0000-000000000006',
   'Anime Dreams Duvet Cover',
   'anime-dreams-duvet-cover',
   'A vibrant duvet cover for anime fans, featuring kawaii-style characters in a dreamy pastel scene. Reversible design with a solid colour on the back.',
   24000.00,
   'kids',
   'Features a full-panel 150×200cm anime illustration on the front face with 4cm chibi border accents.',
   'active');

-- ------------------------------------
-- 3. PRODUCT VARIANTS
-- (2 colorways × 2 sizes = 4 per product)
-- ------------------------------------

-- Geometric Stripe Duvet Cover variants
INSERT INTO public.product_variants (id, product_id, colorway_name, bed_size, price_modifier, stock_qty, sku) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Navy / White',  'twin',  0,    15, 'SB-GSD-NW-TW'),
  ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Navy / White',  'queen', 3000, 10, 'SB-GSD-NW-QN'),
  ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'Charcoal / Gold','twin',  0,    12, 'SB-GSD-CG-TW'),
  ('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001', 'Charcoal / Gold','queen', 3000,  8, 'SB-GSD-CG-QN');

-- Diamond Grid Comforter variants
INSERT INTO public.product_variants (id, product_id, colorway_name, bed_size, price_modifier, stock_qty, sku) VALUES
  ('c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000002', 'Grey / Silver',  'full',  0,    20, 'SB-DGC-GS-FL'),
  ('c0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000002', 'Grey / Silver',  'king',  5000, 14, 'SB-DGC-GS-KG'),
  ('c0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000002', 'Teal / Cream',   'full',  0,    18, 'SB-DGC-TC-FL'),
  ('c0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000002', 'Teal / Cream',   'king',  5000, 11, 'SB-DGC-TC-KG');

-- Classic Rose Duvet Cover variants
INSERT INTO public.product_variants (id, product_id, colorway_name, bed_size, price_modifier, stock_qty, sku) VALUES
  ('c0000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000003', 'Blush Pink',     'queen', 0,    16, 'SB-CRD-BP-QN'),
  ('c0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000003', 'Blush Pink',     'king',  4000, 9,  'SB-CRD-BP-KG'),
  ('c0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000003', 'Ivory / Sage',   'queen', 0,    13, 'SB-CRD-IS-QN'),
  ('c0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000003', 'Ivory / Sage',   'king',  4000, 7,  'SB-CRD-IS-KG');

-- Ditsy Floral Sheet Set variants
INSERT INTO public.product_variants (id, product_id, colorway_name, bed_size, price_modifier, stock_qty, sku) VALUES
  ('c0000000-0000-0000-0000-000000000013', 'b0000000-0000-0000-0000-000000000004', 'Lavender',       'twin',  0,    25, 'SB-DFS-LV-TW'),
  ('c0000000-0000-0000-0000-000000000014', 'b0000000-0000-0000-0000-000000000004', 'Lavender',       'full',  1500, 20, 'SB-DFS-LV-FL'),
  ('c0000000-0000-0000-0000-000000000015', 'b0000000-0000-0000-0000-000000000004', 'Sunshine Yellow', 'twin',  0,    22, 'SB-DFS-SY-TW'),
  ('c0000000-0000-0000-0000-000000000016', 'b0000000-0000-0000-0000-000000000004', 'Sunshine Yellow', 'full',  1500, 17, 'SB-DFS-SY-FL');

-- Rabbit Character Comforter variants
INSERT INTO public.product_variants (id, product_id, colorway_name, bed_size, price_modifier, stock_qty, sku) VALUES
  ('c0000000-0000-0000-0000-000000000017', 'b0000000-0000-0000-0000-000000000005', 'Sky Blue',       'twin',  0,    30, 'SB-RCC-SB-TW'),
  ('c0000000-0000-0000-0000-000000000018', 'b0000000-0000-0000-0000-000000000005', 'Sky Blue',       'full',  2000, 24, 'SB-RCC-SB-FL'),
  ('c0000000-0000-0000-0000-000000000019', 'b0000000-0000-0000-0000-000000000005', 'Soft Pink',      'twin',  0,    28, 'SB-RCC-SP-TW'),
  ('c0000000-0000-0000-0000-000000000020', 'b0000000-0000-0000-0000-000000000005', 'Soft Pink',      'full',  2000, 21, 'SB-RCC-SP-FL');

-- Anime Dreams Duvet Cover variants
INSERT INTO public.product_variants (id, product_id, colorway_name, bed_size, price_modifier, stock_qty, sku) VALUES
  ('c0000000-0000-0000-0000-000000000021', 'b0000000-0000-0000-0000-000000000006', 'Pastel Galaxy',  'twin',  0,    19, 'SB-ADD-PG-TW'),
  ('c0000000-0000-0000-0000-000000000022', 'b0000000-0000-0000-0000-000000000006', 'Pastel Galaxy',  'queen', 3500, 14, 'SB-ADD-PG-QN'),
  ('c0000000-0000-0000-0000-000000000023', 'b0000000-0000-0000-0000-000000000006', 'Neon Sakura',    'twin',  0,    16, 'SB-ADD-NS-TW'),
  ('c0000000-0000-0000-0000-000000000024', 'b0000000-0000-0000-0000-000000000006', 'Neon Sakura',    'queen', 3500, 12, 'SB-ADD-NS-QN');

-- ------------------------------------
-- 4. PRODUCT IMAGES
-- (1 flat + 1 room per product)
-- ------------------------------------
INSERT INTO public.product_images (product_id, variant_id, type, url, alt_text, sort_order) VALUES
  -- Geometric Stripe Duvet Cover
  ('b0000000-0000-0000-0000-000000000001', NULL, 'flat', '/images/products/geometric-stripe-flat.jpg',  'Geometric Stripe Duvet Cover flat lay', 0),
  ('b0000000-0000-0000-0000-000000000001', NULL, 'room', '/images/products/geometric-stripe-room.jpg',  'Geometric Stripe Duvet Cover in a styled bedroom', 1),

  -- Diamond Grid Comforter
  ('b0000000-0000-0000-0000-000000000002', NULL, 'flat', '/images/products/diamond-grid-flat.jpg',  'Diamond Grid Comforter flat lay', 0),
  ('b0000000-0000-0000-0000-000000000002', NULL, 'room', '/images/products/diamond-grid-room.jpg',  'Diamond Grid Comforter in a styled bedroom', 1),

  -- Classic Rose Duvet Cover
  ('b0000000-0000-0000-0000-000000000003', NULL, 'flat', '/images/products/classic-rose-flat.jpg',  'Classic Rose Duvet Cover flat lay', 0),
  ('b0000000-0000-0000-0000-000000000003', NULL, 'room', '/images/products/classic-rose-room.jpg',  'Classic Rose Duvet Cover in a styled bedroom', 1),

  -- Ditsy Floral Sheet Set
  ('b0000000-0000-0000-0000-000000000004', NULL, 'flat', '/images/products/ditsy-floral-flat.jpg',  'Ditsy Floral Sheet Set flat lay', 0),
  ('b0000000-0000-0000-0000-000000000004', NULL, 'room', '/images/products/ditsy-floral-room.jpg',  'Ditsy Floral Sheet Set in a styled bedroom', 1),

  -- Rabbit Character Comforter
  ('b0000000-0000-0000-0000-000000000005', NULL, 'flat', '/images/products/rabbit-character-flat.jpg',  'Rabbit Character Comforter flat lay', 0),
  ('b0000000-0000-0000-0000-000000000005', NULL, 'room', '/images/products/rabbit-character-room.jpg',  'Rabbit Character Comforter in a kids'' room', 1),

  -- Anime Dreams Duvet Cover
  ('b0000000-0000-0000-0000-000000000006', NULL, 'flat', '/images/products/anime-dreams-flat.jpg',  'Anime Dreams Duvet Cover flat lay', 0),
  ('b0000000-0000-0000-0000-000000000006', NULL, 'room', '/images/products/anime-dreams-room.jpg',  'Anime Dreams Duvet Cover in a kids'' room', 1);

-- ------------------------------------
-- 5. PRODUCT ↔ COLLECTION LINKS
-- ------------------------------------
INSERT INTO public.product_collections (product_id, collection_id) VALUES
  -- Minimalist Collection
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001'),
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001'),

  -- Heritage Collection
  ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002'),
  ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002'),

  -- Playful Comfort Collection
  ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000003'),
  ('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000003');

-- ------------------------------------
-- 6. SAMPLE REVIEWS
-- ------------------------------------
INSERT INTO public.reviews (product_id, reviewer_name, rating, comment) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Amara O.', 5, 'Absolutely love the quality! The stripes are crisp and the fabric feels premium.'),
  ('b0000000-0000-0000-0000-000000000001', 'Chidi N.',  4, 'Great duvet cover. Slightly thinner than expected but still very nice.'),
  ('b0000000-0000-0000-0000-000000000003', 'Fatima B.', 5, 'The rose pattern is gorgeous. My bedroom looks like a magazine spread now!'),
  ('b0000000-0000-0000-0000-000000000005', 'Blessing A.', 5, 'My daughter won''t sleep without her rabbit comforter. So soft and cute!'),
  ('b0000000-0000-0000-0000-000000000006', 'Emeka J.',  4, 'My son loves the anime design. Washes well too.');
