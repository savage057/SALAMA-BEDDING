-- ============================================================
-- SALAMA BEDDINGS — Initial Database Schema
-- ============================================================
-- Run this migration against your Supabase Postgres instance.
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

-- Products: core bedding items
CREATE TABLE products (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  base_price    NUMERIC(10,2) NOT NULL,
  style_category TEXT NOT NULL CHECK (style_category IN ('geometric', 'floral', 'abstract', 'kids')),
  pattern_scale_note TEXT,
  status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Product variants: one row per (product × colorway × bed_size)
CREATE TABLE product_variants (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id     UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  colorway_name  TEXT NOT NULL,
  bed_size       TEXT NOT NULL CHECK (bed_size IN ('twin', 'full', 'queen', 'king')),
  price_modifier NUMERIC(10,2) NOT NULL DEFAULT 0,
  stock_qty      INTEGER NOT NULL DEFAULT 0,
  sku            TEXT NOT NULL UNIQUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Product images: flat-lay and styled room shots
CREATE TABLE product_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id  UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  type        TEXT NOT NULL CHECK (type IN ('flat', 'room')),
  url         TEXT NOT NULL,
  alt_text    TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

-- Collections: curated product groupings
CREATE TABLE collections (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  hero_image  TEXT
);

-- Product ↔ Collection join table
CREATE TABLE product_collections (
  product_id    UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, collection_id)
);

-- Reviews: guest reviews (no account required)
CREATE TABLE reviews (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL,
  rating        INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment       TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Orders: logged for record-keeping (payment via WhatsApp)
CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name   TEXT,
  customer_phone  TEXT,
  status          TEXT NOT NULL DEFAULT 'pending_whatsapp'
                    CHECK (status IN ('pending_whatsapp', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  total_estimate  NUMERIC(10,2),
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Order line items
CREATE TABLE order_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  variant_id   UUID REFERENCES product_variants(id),
  product_name TEXT NOT NULL,
  colorway     TEXT NOT NULL,
  bed_size     TEXT NOT NULL,
  quantity     INTEGER NOT NULL CHECK (quantity > 0),
  unit_price   NUMERIC(10,2) NOT NULL
);


-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_collections_slug ON collections(slug);
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);


-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- ---- Public READ policies (anon + authenticated) ----

CREATE POLICY "Public read: products"
  ON products FOR SELECT USING (true);

CREATE POLICY "Public read: product_variants"
  ON product_variants FOR SELECT USING (true);

CREATE POLICY "Public read: product_images"
  ON product_images FOR SELECT USING (true);

CREATE POLICY "Public read: collections"
  ON collections FOR SELECT USING (true);

CREATE POLICY "Public read: product_collections"
  ON product_collections FOR SELECT USING (true);

CREATE POLICY "Public read: reviews"
  ON reviews FOR SELECT USING (true);

-- ---- Guest INSERT policies (anon) ----

CREATE POLICY "Anon insert: reviews"
  ON reviews FOR INSERT WITH CHECK (true);

CREATE POLICY "Anon insert: orders"
  ON orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Anon insert: order_items"
  ON order_items FOR INSERT WITH CHECK (true);

-- Guest can read their own orders (by id — the frontend will hold the order id)
CREATE POLICY "Public read: orders"
  ON orders FOR SELECT USING (true);

CREATE POLICY "Public read: order_items"
  ON order_items FOR SELECT USING (true);

-- ---- Admin-only WRITE policies (authenticated) ----

CREATE POLICY "Admin manage: products"
  ON products FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin manage: product_variants"
  ON product_variants FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin manage: product_images"
  ON product_images FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin manage: collections"
  ON collections FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin manage: product_collections"
  ON product_collections FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin update: orders"
  ON orders FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin delete: orders"
  ON orders FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin manage: order_items"
  ON order_items FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin delete: reviews"
  ON reviews FOR DELETE USING (auth.role() = 'authenticated');
