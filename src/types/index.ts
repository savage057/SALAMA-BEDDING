// ============================================================
// SALAMA BEDDINGS — TypeScript Type Definitions
// ============================================================
// Mirrors the Supabase/Postgres schema defined in
// supabase/migrations/001_initial_schema.sql
// ============================================================

// ------------------------------------
// Shared Enums / Literal Unions
// ------------------------------------

/** Visual style categories for product designs. */
export type StyleCategory = 'geometric' | 'floral' | 'abstract' | 'kids';

/** Lifecycle status of a product listing. */
export type ProductStatus = 'active' | 'draft' | 'archived';

/** Standard bed sizes offered. */
export type BedSize = 'twin' | 'full' | 'queen' | 'king';

/** Product image presentation types. */
export type ImageType = 'flat' | 'room';

/** Order processing statuses. */
export type OrderStatus =
  | 'pending_whatsapp'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

// ============================================================
// Database Row Interfaces
// ============================================================

/**
 * A bedding product (duvet cover, comforter, sheet set, etc.).
 *
 * Variants hold per-colorway / per-size pricing and stock.
 */
export interface Product {
  /** Primary key — auto-generated UUID. */
  id: string;
  /** Human-readable product name. */
  name: string;
  /** URL-safe slug, unique across all products. */
  slug: string;
  /** Long-form product description (nullable). */
  description: string | null;
  /** Base retail price in NGN (₦). */
  base_price: number;
  /** Design style classification. */
  style_category: StyleCategory;
  /** Product type: duvet, bedsheet, or both */
  product_type?: 'duvet' | 'bedsheet' | 'both';
  /** Description of the print scale / repeat, e.g. "3cm stripe". */
  pattern_scale_note: string | null;
  /** Publishing status. */
  status: ProductStatus;
  created_at: string;
  updated_at: string;
}

/**
 * A purchasable variant of a product defined by colorway + bed size.
 *
 * The final price is `product.base_price + variant.price_modifier`.
 */
export interface ProductVariant {
  id: string;
  /** FK → products.id */
  product_id: string;
  /** Display name for the colour combination, e.g. "Navy / White". */
  colorway_name: string;
  /** Bed size this variant fits. */
  bed_size: BedSize;
  /** Price adjustment relative to the product's base_price (can be 0). */
  price_modifier: number;
  /** Current available stock count. */
  stock_qty: number;
  /** Stock-keeping unit code, unique across all variants. */
  sku: string;
  created_at: string;
}

/**
 * An image associated with a product (and optionally a specific variant).
 */
export interface ProductImage {
  id: string;
  /** FK → products.id */
  product_id: string;
  /** FK → product_variants.id (nullable — null means shared across all variants). */
  variant_id: string | null;
  /** Whether the shot is a flat-lay or a styled room scene. */
  type: ImageType;
  /** Relative or absolute URL to the image asset. */
  url: string;
  /** Accessible alt text for the image. */
  alt_text: string | null;
  /** Display ordering (lower = first). */
  sort_order: number;
}

/**
 * A curated collection that groups related products.
 */
export interface Collection {
  id: string;
  /** Display name, e.g. "The Heritage Collection". */
  name: string;
  /** URL-safe slug, unique across all collections. */
  slug: string;
  /** Optional description shown on the collection page. */
  description: string | null;
  /** URL to the hero/banner image for this collection. */
  hero_image: string | null;
}

/**
 * Join-table row linking a product to a collection.
 */
export interface ProductCollection {
  product_id: string;
  collection_id: string;
}

/**
 * A customer review for a product.
 */
export interface Review {
  id: string;
  /** FK → products.id */
  product_id: string;
  /** Name provided by the reviewer. */
  reviewer_name: string;
  /** Star rating from 1 (worst) to 5 (best). */
  rating: number;
  /** Optional free-text comment. */
  comment: string | null;
  created_at: string;
}

/**
 * A customer order (initiated via WhatsApp checkout).
 */
export interface Order {
  id: string;
  /** Customer's full name. */
  customer_name: string | null;
  /** Customer's phone number (WhatsApp-reachable). */
  customer_phone: string | null;
  /** Current fulfilment status. */
  status: OrderStatus;
  /** Estimated order total in NGN (₦). */
  total_estimate: number | null;
  /** Internal / customer notes. */
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * A single line item within an order.
 *
 * Denormalised product info is stored so the record stays correct
 * even if the source product or variant is later modified.
 */
export interface OrderItem {
  id: string;
  /** FK → orders.id */
  order_id: string;
  /** FK → product_variants.id */
  variant_id: string;
  /** Snapshot of the product name at time of order. */
  product_name: string;
  /** Snapshot of the colorway at time of order. */
  colorway: string;
  /** Snapshot of the bed size at time of order. */
  bed_size: string;
  /** Number of units ordered (must be ≥ 1). */
  quantity: number;
  /** Price per unit in NGN (₦) at time of order. */
  unit_price: number;
}

// ============================================================
// Client-Side Types
// ============================================================

/**
 * Represents a single item in the shopping cart.
 *
 * Contains denormalised product info so the cart can render
 * without re-fetching from the database.
 */
export interface CartItem {
  /** The selected variant's UUID. */
  variantId: string;
  /** Parent product UUID. */
  productId: string;
  /** Display name of the product. */
  productName: string;
  /** Product slug for linking back to the PDP. */
  productSlug: string;
  /** Colorway label, e.g. "Navy / White". */
  colorway: string;
  /** Bed size label. */
  bedSize: string;
  /** Quantity in cart (≥ 1). */
  quantity: number;
  /** Unit price in NGN (₦) — base_price + price_modifier. */
  unitPrice: number;
  /** Thumbnail URL for the cart line item. */
  imageUrl: string;
}

/**
 * Zustand store shape for the shopping cart.
 *
 * `totalItems` and `totalPrice` are computed getters
 * derived from the `items` array.
 */
export interface CartStore {
  /** All items currently in the cart. */
  items: CartItem[];

  /**
   * Add a new item or increment its quantity if it already
   * exists (matched by `variantId`).
   */
  addItem: (item: CartItem) => void;

  /**
   * Remove an item entirely by its variant ID.
   */
  removeItem: (variantId: string) => void;

  /**
   * Set the quantity for a specific variant.
   * Removes the item if quantity is set to 0.
   */
  updateQuantity: (variantId: string, quantity: number) => void;

  /** Empty the cart completely. */
  clearCart: () => void;

  /** Total number of units across all line items. */
  totalItems: () => number;

  /** Sum of `unitPrice × quantity` for every line item, in NGN (₦). */
  totalPrice: () => number;

  /** Check if a product is in the cart by productId */
  isProductInCart: (productId: string) => boolean;
}
