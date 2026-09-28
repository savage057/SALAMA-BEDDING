'use server';

import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { localProducts as seedProducts, localVariants as seedVariants, localImages as seedImages } from '@/lib/data';

function getMockDbPath() {
  return path.join(process.cwd(), 'src/lib/mock_db.json');
}

function readMockDb() {
  const dbPath = getMockDbPath();
  if (!fs.existsSync(dbPath)) {
    const initialData = {
      products: seedProducts,
      variants: seedVariants,
      images: seedImages,
    };
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2), 'utf8');
    return initialData;
  }
  try {
    const content = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading mock_db.json, recreating...', err);
    const initialData = {
      products: seedProducts,
      variants: seedVariants,
      images: seedImages,
    };
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2), 'utf8');
    return initialData;
  }
}

function writeMockDb(data: any) {
  const dbPath = getMockDbPath();
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

// Server Action: Create Product
export async function createProductAction(formData: {
  name: string;
  category: string;
  price: number;
  size: string;
  colorway: string;
  description: string;
  flatImage: string;
  roomImage: string;
}) {
  const db = readMockDb();
  const mockProductId = `prod-${Date.now()}`;
  const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const newProduct = {
    id: mockProductId,
    name: formData.name,
    slug,
    description: formData.description,
    base_price: formData.price,
    style_category: formData.category,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockVariantId = `v-${Date.now()}`;
  const sku = `SB-${formData.name.substring(0, 3).toUpperCase()}-${formData.size.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
  const newVariant = {
    id: mockVariantId,
    product_id: mockProductId,
    colorway_name: formData.colorway,
    bed_size: formData.size,
    price_modifier: 0,
    stock_qty: 50,
    sku,
    created_at: new Date().toISOString(),
  };

  const newImages = [
    {
      id: `img-flat-${Date.now()}`,
      product_id: mockProductId,
      variant_id: null,
      type: 'flat',
      url: formData.flatImage || '/images/products/stripe-room.jpg',
      alt_text: formData.name,
      sort_order: 0,
    },
    {
      id: `img-room-${Date.now()}`,
      product_id: mockProductId,
      variant_id: null,
      type: 'room',
      url: formData.roomImage || '/images/products/stripe-room.jpg',
      alt_text: formData.name,
      sort_order: 1,
    },
  ];

  db.products.push(newProduct);
  db.variants.push(newVariant);
  db.images.push(...newImages);

  writeMockDb(db);

  revalidatePath('/');
  revalidatePath('/collections');
  return { success: true, product: newProduct };
}

// Server Action: Update Product
export async function updateProductAction(formData: {
  variantId: string;
  productId: string;
  name: string;
  category: string;
  price: number;
  size: string;
  colorway: string;
  description: string;
  flatImage: string;
  roomImage: string;
}) {
  const db = readMockDb();

  db.products = db.products.map((p: any) =>
    p.id === formData.productId
      ? {
          ...p,
          name: formData.name,
          description: formData.description,
          base_price: formData.price,
          style_category: formData.category,
          updated_at: new Date().toISOString(),
        }
      : p
  );

  db.variants = db.variants.map((v: any) =>
    v.id === formData.variantId
      ? {
          ...v,
          colorway_name: formData.colorway,
          bed_size: formData.size,
        }
      : v
  );

  db.images = db.images.map((img: any) => {
    if (img.product_id === formData.productId) {
      if (img.type === 'flat') {
        return { ...img, url: formData.flatImage || img.url };
      }
      if (img.type === 'room') {
        return { ...img, url: formData.roomImage || img.url };
      }
    }
    return img;
  });

  writeMockDb(db);

  revalidatePath('/');
  revalidatePath('/collections');
  return { success: true };
}

// Server Action: Delete Product
export async function deleteProductAction(productId: string) {
  const db = readMockDb();

  db.products = db.products.filter((p: any) => p.id !== productId);
  db.variants = db.variants.filter((v: any) => v.product_id !== productId);
  db.images = db.images.filter((img: any) => img.product_id !== productId);

  writeMockDb(db);

  revalidatePath('/');
  revalidatePath('/collections');
  return { success: true };
}

// Server Action: Update Variant Stock
export async function updateVariantStockAction(variantId: string, stockQty: number) {
  const db = readMockDb();
  db.variants = db.variants.map((v: any) =>
    v.id === variantId ? { ...v, stock_qty: stockQty } : v
  );
  writeMockDb(db);
  revalidatePath('/');
  revalidatePath('/collections');
  return { success: true };
}

// Server Action: Get Mock Database
export async function getMockDbAction() {
  return readMockDb();
}
