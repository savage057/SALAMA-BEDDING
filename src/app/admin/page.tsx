'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface OrderItem {
  id: string;
  product_name: string;
  colorway: string;
  bed_size: string;
  quantity: number;
  unit_price: number;
}

interface Order {
  id: string;
  customer_name: string;
  status: 'pending_whatsapp' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  total_estimate: number;
  notes: string;
  created_at: string;
  order_items?: OrderItem[];
}

interface InventoryItem {
  id: string; // Variant ID
  product_id: string;
  product_name: string;
  style_category: string;
  product_type?: string;
  description: string;
  base_price: number;
  colorway: string;
  bed_size: string;
  stock_qty: number;
  sku: string;
  flat_image?: string;
  room_image?: string;
}

// ============================================================
// Supabase Storage helpers
// ============================================================
const STORAGE_BUCKET = 'product-images';

/** Ensure the product-images bucket exists (creates it if not). */
async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === STORAGE_BUCKET);
  if (!exists) {
    await supabase.storage.createBucket(STORAGE_BUCKET, { public: true });
  }
}

/**
 * Upload a File to Supabase Storage and return its permanent public URL.
 * @param file     The image File object selected by the user.
 * @param slug     Product slug used to name the file in storage.
 * @param type     'flat' or 'room' — used in the file name.
 */
async function uploadImageToStorage(
  file: File,
  slug: string,
  type: 'flat' | 'room'
): Promise<string> {
  await ensureBucket();

  const ext = file.name.split('.').pop() || 'jpg';
  const filePath = `products/${slug}-${type}-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file, { cacheControl: '31536000', upsert: false });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

// ============================================================
// Helpers to map raw DB / mock data → InventoryItem[]
// ============================================================
function mapSupabaseToInventory(dbProducts: any[]): InventoryItem[] {
  const mapped: InventoryItem[] = [];
  dbProducts.forEach((p: any) => {
    const variants = p.variants || [];
    const images = p.images || [];
    const flatImg = images.find((img: any) => img.type === 'flat')?.url || images.find((img: any) => img.type === 'room')?.url || images[0]?.url || '';
    const roomImg = images.find((img: any) => img.type === 'room')?.url || images.find((img: any) => img.type === 'flat')?.url || images[0]?.url || '';

    // Group variants by colorway
    const variantsByColorway: Record<string, any[]> = {};
    variants.forEach((v: any) => {
      const cw = v.colorway_name || 'Default';
      if (!variantsByColorway[cw]) {
        variantsByColorway[cw] = [];
      }
      variantsByColorway[cw].push(v);
    });

    Object.entries(variantsByColorway).forEach(([colorway, cVariants]) => {
      // Collect all unique sizes for this colorway
      const sizes = Array.from(new Set(cVariants.map((v) => v.bed_size)));
      const totalStock = cVariants.reduce((sum, v) => sum + v.stock_qty, 0);
      // Use first variant for primary metadata
      const primaryVariant = cVariants[0];

      if (primaryVariant) {
        mapped.push({
          id: primaryVariant.id,
          product_id: p.id,
          product_name: p.name,
          style_category: p.style_category,
          product_type: p.product_type || 'both',
          description: p.description || '',
          base_price: Number(p.base_price),
          colorway: colorway,
          bed_size: sizes.join(', '), // Comma-separated sizes for display
          stock_qty: totalStock,
          sku: primaryVariant.sku,
          flat_image: flatImg,
          room_image: roomImg,
        });
      }
    });
  });
  return mapped;
}

// ============================================================
// Component
// ============================================================

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'reviews' | 'about'>('inventory');

  // Data States
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStockId, setUpdatingStockId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  // About Page Editor States
  const [aboutData, setAboutData] = useState<any>(null);
  const [aboutLoading, setAboutLoading] = useState(false);
  const [savingAbout, setSavingAbout] = useState(false);
  const [aboutImageFile, setAboutImageFile] = useState<File | null>(null);
  const [aboutImagePreview, setAboutImagePreview] = useState<string>('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Form Field States
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('geometric');
  const [formProductType, setFormProductType] = useState('both');
  const [formPrice, setFormPrice] = useState(25000);
  const [formSizes, setFormSizes] = useState<string[]>(['queen']);
  const [formColorway, setFormColorway] = useState('Navy / White');
  const [formDescription, setFormDescription] = useState('');

  // Image Upload — we keep both the File (for upload) and a local preview URL
  const [flatImageFile, setFlatImageFile] = useState<File | null>(null);
  const [flatImagePreview, setFlatImagePreview] = useState<string>('');
  const [roomImageFile, setRoomImageFile] = useState<File | null>(null);
  const [roomImagePreview, setRoomImagePreview] = useState<string>('');

  // Upload progress feedback
  const [uploadStatus, setUploadStatus] = useState<string>('');

  // DB error state
  const [dbError, setDbError] = useState<string | null>(null);

  // Stats Counters
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalReviews: 0,
  });

  // ----------------------------------------------------------------
  // Load dashboard data — 100 % Supabase, no local fallback
  // ----------------------------------------------------------------
  const loadDashboardData = async () => {
    setLoading(true);
    setDbError(null);
    try {
      // ---- Products / Variants / Images ----
      const { data: dbProducts, error: productsError } = await supabase
        .from('products')
        .select('*, variants:product_variants(*), images:product_images(*)')
        .order('created_at', { ascending: false });

      if (productsError) throw new Error(`Products: ${productsError.message}`);

      const loadedInventory = mapSupabaseToInventory(dbProducts || []);
      setInventory(loadedInventory);
      setIsDemoMode(false);

      // ---- Reviews ----
      const { data: dbReviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('*, products(name)')
        .order('created_at', { ascending: false });

      if (reviewsError) throw new Error(`Reviews: ${reviewsError.message}`);
      const loadedReviews = (dbReviews || []).map((r: any) => ({
        ...r,
        product_name: r.products?.name || 'Unknown Product'
      }));
      setReviews(loadedReviews);

      // ---- Stats ----
      setStats({
        totalProducts: dbProducts ? dbProducts.length : 0,
        totalReviews: loadedReviews.length,
      });
    } catch (err: any) {
      console.error('Error loading dashboard from Supabase:', err);
      setDbError(err.message || 'Could not connect to Supabase. Check your credentials.');
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadAboutData = async () => {
    setAboutLoading(true);
    try {
      const res = await fetch('/api/about');
      if (res.ok) {
        const data = await res.json();
        setAboutData(data);
        setAboutImagePreview(data.image?.url || '');
      } else {
        console.error('Failed to fetch about data');
      }
    } catch (err) {
      console.error('Error loading about data:', err);
    } finally {
      setAboutLoading(false);
    }
  };

  const handleSaveAboutData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aboutData) return;

    setSavingAbout(true);
    try {
      let finalImageUrl = aboutData.image?.url || '';

      if (aboutImageFile) {
        const slug = 'about-hero-image';
        finalImageUrl = await uploadImageToStorage(aboutImageFile, slug, 'room');
      }

      const updatedData = {
        ...aboutData,
        image: {
          url: finalImageUrl
        }
      };

      const res = await fetch('/api/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        throw new Error('Failed to save About Page content');
      }

      alert('About Page content successfully updated!');
      setAboutImageFile(null);
      await loadAboutData();
    } catch (err: any) {
      console.error('Error saving about page:', err);
      alert(`Error saving: ${err.message || err}`);
    } finally {
      setSavingAbout(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'about' && !aboutData) {
      loadAboutData();
    }
  }, [activeTab, aboutData]);

  const handleUpdateField = (section: string, field: string, value: string) => {
    setAboutData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleUpdatePillar = (id: string, field: string, value: string) => {
    setAboutData((prev: any) => ({
      ...prev,
      pillars: (prev.pillars || []).map((p: any) => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const handleDeletePillar = (id: string) => {
    setAboutData((prev: any) => ({
      ...prev,
      pillars: (prev.pillars || []).filter((p: any) => p.id !== id)
    }));
  };

  const handleAddPillar = () => {
    const newPillar = {
      id: String(Date.now()),
      title: 'New Foundation Pillar',
      description: 'Provide details about this pillar...',
      icon: 'sizing'
    };
    setAboutData((prev: any) => ({
      ...prev,
      pillars: [...(prev.pillars || []), newPillar]
    }));
  };

  // ----------------------------------------------------------------
  // Open Modal Helpers
  // ----------------------------------------------------------------
  const openCreateModal = () => {
    setModalMode('create');
    setSelectedItem(null);
    setFormName('');
    setFormCategory('geometric');
    setFormProductType('both');
    setFormPrice(25000);
    setFormSizes(['queen']);
    setFormColorway('Navy / White');
    setFormDescription('');
    setFlatImageFile(null);
    setFlatImagePreview('');
    setRoomImageFile(null);
    setRoomImagePreview('');
    setUploadStatus('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: InventoryItem) => {
    setModalMode('edit');
    setSelectedItem(item);
    setFormName(item.product_name);
    setFormCategory(item.style_category);
    setFormProductType(item.product_type || 'both');
    setFormPrice(item.base_price);
    setFormSizes(item.bed_size.split(', ').map((s) => s.trim().toLowerCase()));
    setFormColorway(item.colorway);
    setFormDescription(item.description);
    setFlatImageFile(null);
    setFlatImagePreview(item.flat_image || '');
    setRoomImageFile(null);
    setRoomImagePreview(item.room_image || '');
    setUploadStatus('');
    setIsModalOpen(true);
  };

  // ----------------------------------------------------------------
  // Image selection handlers — only create local preview, not store
  // ----------------------------------------------------------------
  const handleFlatImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFlatImageFile(file);
      setFlatImagePreview(URL.createObjectURL(file)); // preview only
    }
  };

  const handleRoomImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRoomImageFile(file);
      setRoomImagePreview(URL.createObjectURL(file)); // preview only
    }
  };

  // ----------------------------------------------------------------
  // CRUD: Create / Edit — ALWAYS saves to Supabase
  // ----------------------------------------------------------------
  const handleSubmitProductForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    setActionLoading(true);
    setUploadStatus('');

    const slug = formName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    try {
      // ---- Step 1: Upload images to Supabase Storage ----
      let finalFlatUrl = flatImagePreview || '';
      let finalRoomUrl = roomImagePreview || '';

      // Only upload files that are brand-new (File objects), not existing URLs
      if (flatImageFile) {
        setUploadStatus('Uploading flat image...');
        finalFlatUrl = await uploadImageToStorage(flatImageFile, slug, 'flat');
      }
      if (roomImageFile) {
        setUploadStatus('Uploading room image...');
        finalRoomUrl = await uploadImageToStorage(roomImageFile, slug, 'room');
      }

      setUploadStatus('Saving to database...');

      // ---- Step 2: Save product data to Supabase ----
      if (modalMode === 'create') {
        // 2a. Insert product row
        const { data: prodData, error: prodErr } = await supabase
          .from('products')
          .insert({
            name: formName,
            slug,
            description: formDescription,
            base_price: formPrice,
            style_category: formCategory,
            product_type: formProductType,
            status: 'active',
          })
          .select('id')
          .single();

        if (prodErr) throw new Error(`Product insert failed: ${prodErr.message}`);
        const newProductId = prodData.id;

        // 2b. Insert variant rows for all selected sizes
        const variantsToInsert = formSizes.map((size) => {
          const sku = `SB-${formName.substring(0, 3).toUpperCase()}-${size.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
          return {
            product_id: newProductId,
            colorway_name: formColorway,
            bed_size: size,
            price_modifier: 0,
            stock_qty: 50,
            sku,
          };
        });
        const { error: varErr } = await supabase.from('product_variants').insert(variantsToInsert);

        if (varErr) throw new Error(`Variant insert failed: ${varErr.message}`);

        // 2c. Insert image rows (only if we have URLs)
        const imageRows = [];
        if (finalFlatUrl) {
          imageRows.push({ product_id: newProductId, type: 'flat', url: finalFlatUrl, alt_text: formName, sort_order: 0 });
        }
        if (finalRoomUrl) {
          imageRows.push({ product_id: newProductId, type: 'room', url: finalRoomUrl, alt_text: formName, sort_order: 1 });
        }
        if (imageRows.length > 0) {
          const { error: imgErr } = await supabase.from('product_images').insert(imageRows);
          if (imgErr) throw new Error(`Image insert failed: ${imgErr.message}`);
        }
      } else {
        // EDIT MODE
        if (!selectedItem) return;

        // 2a. Update product
        const { error: prodErr } = await supabase
          .from('products')
          .update({
            name: formName,
            description: formDescription,
            base_price: formPrice,
            style_category: formCategory,
            product_type: formProductType,
          })
          .eq('id', selectedItem.product_id);

        if (prodErr) throw new Error(`Product update failed: ${prodErr.message}`);

        // 2b. Update variant (only updating the first size in edit mode)
        const { error: varErr } = await supabase
          .from('product_variants')
          .update({ colorway_name: formColorway, bed_size: formSizes[0] || 'queen' })
          .eq('id', selectedItem.id);

        if (varErr) throw new Error(`Variant update failed: ${varErr.message}`);

        // 2c. Update images (upsert by type)
        if (flatImageFile && finalFlatUrl) {
          // Check if a flat image row already exists
          const { data: existing } = await supabase
            .from('product_images')
            .select('id')
            .eq('product_id', selectedItem.product_id)
            .eq('type', 'flat')
            .single();

          if (existing?.id) {
            await supabase
              .from('product_images')
              .update({ url: finalFlatUrl })
              .eq('id', existing.id);
          } else {
            await supabase.from('product_images').insert({
              product_id: selectedItem.product_id,
              type: 'flat',
              url: finalFlatUrl,
              alt_text: formName,
              sort_order: 0,
            });
          }
        }
        if (roomImageFile && finalRoomUrl) {
          const { data: existing } = await supabase
            .from('product_images')
            .select('id')
            .eq('product_id', selectedItem.product_id)
            .eq('type', 'room')
            .single();

          if (existing?.id) {
            await supabase
              .from('product_images')
              .update({ url: finalRoomUrl })
              .eq('id', existing.id);
          } else {
            await supabase.from('product_images').insert({
              product_id: selectedItem.product_id,
              type: 'room',
              url: finalRoomUrl,
              alt_text: formName,
              sort_order: 1,
            });
          }
        }
      }

      setUploadStatus('');
      await loadDashboardData();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Error saving product:', err);
      setUploadStatus('');
      alert(`Error: ${err.message || err}`);
    } finally {
      setActionLoading(false);
    }
  };

  // ----------------------------------------------------------------
  // CRUD: Delete
  // ----------------------------------------------------------------
  const handleDeleteProduct = async (item: InventoryItem) => {
    if (!confirm(`Delete "${item.product_name}"? This cannot be undone.`)) return;
    setUpdatingStockId(item.id);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', item.product_id);

      if (error) throw error;
      await loadDashboardData();
    } catch (err: any) {
      console.error('Error deleting product:', err);
      alert(`Could not delete product: ${err.message || err}`);
    } finally {
      setUpdatingStockId(null);
    }
  };

  // ----------------------------------------------------------------
  // Bulk Delete
  // ----------------------------------------------------------------
  const toggleSelectVariant = (id: string) => {
    setSelectedVariants((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedVariants.length === inventory.length) {
      setSelectedVariants([]);
    } else {
      setSelectedVariants(inventory.map((item) => item.id));
    }
  };

  const handleBulkDeleteSelected = async () => {
    if (selectedVariants.length === 0) return;
    if (!confirm(`Delete ${selectedVariants.length} selected product(s)? This cannot be undone.`)) return;
    setActionLoading(true);
    try {
      const selectedItems = inventory.filter((item) => selectedVariants.includes(item.id));
      const uniqueProductIds = Array.from(new Set(selectedItems.map((item) => item.product_id)));

      const { error } = await supabase
        .from('products')
        .delete()
        .in('id', uniqueProductIds);

      if (error) throw error;
      setSelectedVariants([]);
      await loadDashboardData();
    } catch (err: any) {
      console.error('Error during bulk deletion:', err);
      alert(`Bulk delete failed: ${err.message || err}`);
    } finally {
      setActionLoading(false);
    }
  };



  // ----------------------------------------------------------------
  // Stock Update
  // ----------------------------------------------------------------
  const handleUpdateStock = async (variantId: string, newQty: number) => {
    if (newQty < 0) return;
    setUpdatingStockId(variantId);
    try {
      const { error } = await supabase
        .from('product_variants')
        .update({ stock_qty: newQty })
        .eq('id', variantId);

      if (error) throw new Error(error.message);
      setInventory((prev) =>
        prev.map((item) => (item.id === variantId ? { ...item, stock_qty: newQty } : item))
      );
      setStats((prev) => {
        const updated = inventory.map((item) => (item.id === variantId ? { ...item, stock_qty: newQty } : item));
        return { ...prev, lowStockCount: updated.filter((i) => i.stock_qty < 10).length };
      });
    } catch (err) {
      console.warn('Stock update failed (updating local state only):', err);
      setInventory((prev) =>
        prev.map((item) => (item.id === variantId ? { ...item, stock_qty: newQty } : item))
      );
    } finally {
      setUpdatingStockId(null);
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadDashboardData();
    } catch (err: any) {
      console.error('Error deleting review:', err);
      alert(`Could not delete review: ${err.message || err}`);
    }
  };

  // ----------------------------------------------------------------
  // Loading state
  // ----------------------------------------------------------------
  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-charcoal/20 border-t-charcoal animate-spin mx-auto mb-4" />
        <p className="text-xs font-sans text-muted tracking-wider uppercase">
          Loading dashboard statistics...
        </p>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------
  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">
            Management Panel
          </h2>
          <p className="text-xs font-sans text-muted mt-1">
            {isDemoMode ? (
              <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded-full inline-block font-semibold">
                ⚠️ Supabase unavailable — dashboard may be empty
              </span>
            ) : (
              <span className="text-success bg-green-50 px-2 py-0.5 rounded-full inline-block font-semibold">
                ⚡ Live — All data from Supabase database
              </span>
            )}
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-charcoal text-white hover:bg-gold text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Product
        </button>
      </div>

      {/* DB Error Banner */}
      {dbError && (
        <div className="flex items-start gap-4 p-4 rounded-2xl bg-red-50 border border-red-200 animate-fade-in">
          <svg className="shrink-0 text-red-500 mt-0.5" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-sans font-bold text-red-700 mb-0.5">Could not load data from Supabase</p>
            <p className="text-[11px] font-sans text-red-600 break-words">{dbError}</p>
          </div>
          <button
            onClick={loadDashboardData}
            className="shrink-0 px-3 py-1.5 text-[11px] font-sans font-bold uppercase tracking-wider text-red-700 border border-red-300 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-border/40 p-6 shadow-sm flex flex-col gap-1.5 animate-fade-in">
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-muted">Active Designs</span>
          <span className="font-serif text-2xl lg:text-3xl font-bold text-charcoal">{stats.totalProducts}</span>
          <span className="text-[10px] font-sans text-success">Catalog count</span>
        </div>
        <div className="bg-white rounded-2xl border border-border/40 p-6 shadow-sm flex flex-col gap-1.5 animate-fade-in">
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-muted">Customer Reviews</span>
          <span className="font-serif text-2xl lg:text-3xl font-bold text-charcoal">{stats.totalReviews}</span>
          <span className="text-[10px] font-sans text-muted">Approved testimonials</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/40 pb-px">
        {(['inventory', 'reviews', 'about'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setSelectedVariants([]); }}
            className={`pb-4 px-6 font-sans text-sm font-semibold tracking-wider uppercase border-b-2 transition-all duration-300 cursor-pointer ${
              activeTab === tab
                ? 'border-charcoal text-charcoal'
                : 'border-transparent text-muted hover:text-charcoal'
            }`}
          >
            {tab === 'inventory'
              ? 'Inventory Levels'
              : tab === 'reviews'
              ? 'Customer Reviews'
              : 'About Page Content'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl border border-border/40 shadow-sm overflow-hidden animate-fade-in">
        {activeTab === 'inventory' ? (
          /* ---- Inventory Levels ---- */
          <div className="overflow-x-auto">
            {selectedVariants.length > 0 && (
              <div className="bg-red-50 border-b border-red-100 px-6 py-3.5 flex justify-between items-center animate-fade-in">
                <span className="text-xs font-sans text-red-700 font-semibold">
                  {selectedVariants.length} variant(s) selected
                </span>
                <button
                  onClick={handleBulkDeleteSelected}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-sans font-bold uppercase tracking-wider rounded-lg transition-all duration-300 shadow-md cursor-pointer"
                >
                  Delete Selected
                </button>
              </div>
            )}

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface/40 border-b border-border/40 text-[10px] font-sans font-bold uppercase tracking-wider text-charcoal/70">
                  <th className="p-5 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={inventory.length > 0 && selectedVariants.length === inventory.length}
                      onChange={toggleSelectAll}
                      className="rounded border-border/60 text-charcoal focus:ring-charcoal cursor-pointer w-4 h-4"
                    />
                  </th>
                  <th className="p-5">Bedding Product</th>
                  <th className="p-5">Colorway</th>
                  <th className="p-5">Bed Size</th>
                  <th className="p-5">SKU Reference</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 text-xs font-sans text-charcoal">
                {inventory.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-surface/10 transition-colors ${
                      item.stock_qty < 10 ? 'bg-[#ED7D31]/5' : ''
                    } ${selectedVariants.includes(item.id) ? 'bg-charcoal/5' : ''}`}
                  >
                    <td className="p-5 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={selectedVariants.includes(item.id)}
                        onChange={() => toggleSelectVariant(item.id)}
                        className="rounded border-border/60 text-charcoal focus:ring-charcoal cursor-pointer w-4 h-4"
                      />
                    </td>
                    <td className="p-5 font-semibold text-charcoal">
                      <div className="flex items-center gap-3">
                        {item.flat_image ? (
                          <img
                            src={item.flat_image}
                            alt={item.product_name}
                            className="w-10 h-10 object-cover rounded-lg bg-surface border border-border/40 shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-surface border border-border/40 shrink-0 flex items-center justify-center text-charcoal/30">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold">{item.product_name}</p>
                          <p className="text-[10px] text-muted capitalize">Style: {item.style_category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-muted">{item.colorway}</td>
                    <td className="p-5 text-muted font-bold">{item.bed_size.toUpperCase()}</td>
                    <td className="p-5 font-mono text-[10px] text-muted">{item.sku}</td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="px-2.5 py-1.5 bg-surface text-charcoal border border-border hover:bg-charcoal hover:text-white rounded-lg transition-colors cursor-pointer text-[11px] font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          disabled={updatingStockId === item.id}
                          onClick={() => handleDeleteProduct(item)}
                          className="px-2.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all cursor-pointer text-[11px] font-semibold disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'reviews' ? (
          /* ---- Customer Reviews ---- */
          <div className="overflow-x-auto">
            {reviews.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface/40 border-b border-border/40 text-[10px] font-sans font-bold uppercase tracking-wider text-charcoal/70">
                    <th className="p-5">Product</th>
                    <th className="p-5">Reviewer</th>
                    <th className="p-5">Rating</th>
                    <th className="p-5">Comment</th>
                    <th className="p-5">Date</th>
                    <th className="p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 text-xs font-sans text-charcoal">
                  {reviews.map((review) => (
                    <tr key={review.id} className="hover:bg-surface/10 transition-colors">
                      <td className="p-5 font-semibold text-charcoal">{review.product_name}</td>
                      <td className="p-5 text-muted">{review.reviewer_name}</td>
                      <td className="p-5">
                        <div className="flex gap-0.5 text-gold">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg
                              key={i}
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill={i < review.rating ? 'currentColor' : 'none'}
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          ))}
                        </div>
                      </td>
                      <td className="p-5 text-muted max-w-xs truncate" title={review.comment || ''}>
                        {review.comment || <span className="italic text-gray-300 font-sans">No comment</span>}
                      </td>
                      <td className="p-5 text-muted">
                        {new Date(review.created_at).toLocaleDateString(undefined, {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </td>
                      <td className="p-5 text-right">
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="px-2.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all cursor-pointer text-[11px] font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-20 text-center text-charcoal/40 p-6">
                <p className="text-sm font-sans">No reviews found in database.</p>
              </div>
            )}
          </div>
        ) : (
          /* ---- About Page Content Editor ---- */
          <div className="p-6 lg:p-10 font-sans">
            {aboutLoading ? (
              <div className="py-20 text-center flex flex-col items-center justify-center animate-fade-in">
                <div className="w-8 h-8 rounded-full border-2 border-charcoal/20 border-t-charcoal animate-spin mb-4" />
                <p className="text-xs text-muted tracking-wider uppercase">Loading about page data...</p>
              </div>
            ) : aboutData ? (
              <form onSubmit={handleSaveAboutData} className="flex flex-col gap-10">
                {/* 1. Legacy & Vision Segment */}
                <div className="bg-surface/30 p-6 rounded-2xl border border-border/40 flex flex-col gap-5">
                  <h3 className="font-serif text-base font-bold text-charcoal border-b border-border/40 pb-3 flex items-center gap-2">
                    <span className="w-1.5 h-3.5 bg-gold rounded-full" />
                    1. Legacy & Vision Segment
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-charcoal/70">
                        Hero Subtitle / Category Tag
                      </label>
                      <input
                        type="text"
                        required
                        value={aboutData.hero?.subtitle || ''}
                        onChange={(e) => handleUpdateField('hero', 'subtitle', e.target.value)}
                        className="bg-white border border-border/60 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-charcoal/70">
                        Hero Main Title
                      </label>
                      <input
                        type="text"
                        required
                        value={aboutData.hero?.title || ''}
                        onChange={(e) => handleUpdateField('hero', 'title', e.target.value)}
                        className="bg-white border border-border/60 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-charcoal/70">
                      Hero Description Text
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={aboutData.hero?.description || ''}
                      onChange={(e) => handleUpdateField('hero', 'description', e.target.value)}
                      className="bg-white border border-border/60 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal resize-none"
                    />
                  </div>
                </div>

                {/* 2. Hero Bedroom Image Segment */}
                <div className="bg-surface/30 p-6 rounded-2xl border border-border/40 flex flex-col gap-5">
                  <h3 className="font-serif text-base font-bold text-charcoal border-b border-border/40 pb-3 flex items-center gap-2">
                    <span className="w-1.5 h-3.5 bg-gold rounded-full" />
                    2. About Styled Bedroom Image
                  </h3>
                  
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    {aboutImagePreview ? (
                      <div className="w-44 h-32 rounded-xl overflow-hidden bg-white border border-border/40 shrink-0 shadow-md">
                        <img
                          src={aboutImagePreview}
                          alt="About Hero preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-44 h-32 rounded-xl border border-dashed border-border/60 shrink-0 flex items-center justify-center text-charcoal/30 bg-white">
                        No image preview
                      </div>
                    )}
                    
                    <div className="flex-1 flex flex-col gap-3.5">
                      <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-charcoal/70">
                        Upload New Image (Replaces current room photo)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setAboutImageFile(file);
                            setAboutImagePreview(URL.createObjectURL(file));
                          }
                        }}
                        className="text-xs font-sans text-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-charcoal file:text-white hover:file:bg-gold file:cursor-pointer"
                      />
                      <p className="text-[10px] text-muted leading-relaxed">
                        Recommended size: 800x600 pixels or larger. Replaces standard room-view graphics on the About page.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Story Segment */}
                <div className="bg-surface/30 p-6 rounded-2xl border border-border/40 flex flex-col gap-5">
                  <h3 className="font-serif text-base font-bold text-charcoal border-b border-border/40 pb-3 flex items-center gap-2">
                    <span className="w-1.5 h-3.5 bg-gold rounded-full" />
                    3. Brand Story Segment
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-charcoal/70">
                        Story Subtitle
                      </label>
                      <input
                        type="text"
                        required
                        value={aboutData.story?.subtitle || ''}
                        onChange={(e) => handleUpdateField('story', 'subtitle', e.target.value)}
                        className="bg-white border border-border/60 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-charcoal/70">
                        Story Main Title
                      </label>
                      <input
                        type="text"
                        required
                        value={aboutData.story?.title || ''}
                        onChange={(e) => handleUpdateField('story', 'title', e.target.value)}
                        className="bg-white border border-border/60 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-charcoal/70">
                        Story Paragraph 1
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={aboutData.story?.paragraph1 || ''}
                        onChange={(e) => handleUpdateField('story', 'paragraph1', e.target.value)}
                        className="bg-white border border-border/60 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal resize-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-charcoal/70">
                        Story Paragraph 2
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={aboutData.story?.paragraph2 || ''}
                        onChange={(e) => handleUpdateField('story', 'paragraph2', e.target.value)}
                        className="bg-white border border-border/60 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Pillars/Foundations Segment */}
                <div className="bg-surface/30 p-6 rounded-2xl border border-border/40 flex flex-col gap-5">
                  <div className="flex justify-between items-center border-b border-border/40 pb-3">
                    <h3 className="font-serif text-base font-bold text-charcoal flex items-center gap-2">
                      <span className="w-1.5 h-3.5 bg-gold rounded-full" />
                      4. Foundations / Pillars Segment
                    </h3>
                    <button
                      type="button"
                      onClick={handleAddPillar}
                      className="px-3.5 py-1.5 bg-charcoal text-white hover:bg-gold text-[10px] font-sans font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm"
                    >
                      + Add Pillar
                    </button>
                  </div>

                  <div className="flex flex-col gap-6">
                    {(aboutData.pillars || []).map((pillar: any, index: number) => (
                      <div key={pillar.id} className="bg-white p-5 rounded-xl border border-border/40 flex flex-col gap-4 relative">
                        <div className="absolute top-5 right-5">
                          <button
                            type="button"
                            onClick={() => handleDeletePillar(pillar.id)}
                            className="px-2.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all cursor-pointer text-[10px] font-bold uppercase"
                          >
                            Delete
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center pr-20">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-muted">
                              Pillar #{index + 1} Title
                            </label>
                            <input
                              type="text"
                              required
                              value={pillar.title || ''}
                              onChange={(e) => handleUpdatePillar(pillar.id, 'title', e.target.value)}
                              className="bg-surface/30 border border-border/60 rounded-lg px-3 py-2 text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-muted">
                              Icon Representation
                            </label>
                            <select
                              value={pillar.icon || 'sizing'}
                              onChange={(e) => handleUpdatePillar(pillar.id, 'icon', e.target.value)}
                              className="bg-surface/30 border border-border/60 rounded-lg px-3 py-2.5 text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal cursor-pointer"
                            >
                              <option value="sizing">Artisan Sizing Icon</option>
                              <option value="weave">Premium Weave Icon</option>
                              <option value="custom">Design Customization Icon</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-muted">
                            Pillar Description Details
                          </label>
                          <textarea
                            rows={2}
                            required
                            value={pillar.description || ''}
                            onChange={(e) => handleUpdatePillar(pillar.id, 'description', e.target.value)}
                            className="bg-surface/30 border border-border/60 rounded-lg px-3 py-2 text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal resize-none"
                          />
                        </div>
                      </div>
                    ))}
                    
                    {(!aboutData.pillars || aboutData.pillars.length === 0) && (
                      <div className="py-8 text-center text-muted text-xs border border-dashed border-border/60 rounded-xl bg-white">
                        No foundation pillars defined. Click "+ Add Pillar" to build one.
                      </div>
                    )}
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="submit"
                    disabled={savingAbout}
                    className="px-6 py-3 bg-charcoal hover:bg-gold text-white text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {savingAbout ? 'Saving Changes...' : 'Save About Page Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-20 text-center text-charcoal/40 p-6">
                <p className="text-sm font-sans">Could not load About Page data.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* Create / Edit Modal */}
      {/* ============================================================ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border/40 flex justify-between items-center bg-surface">
              <h3 className="font-serif text-lg font-bold text-charcoal">
                {modalMode === 'create' ? 'Add New Bedding Product' : `Edit: ${selectedItem?.product_name}`}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-charcoal/60 hover:text-charcoal p-1 cursor-pointer transition-colors"
                aria-label="Close modal"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitProductForm} className="p-6 max-h-[75vh] overflow-y-auto space-y-5">

              {/* Storage notice */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-green-50 border border-green-200 text-[11px] font-sans text-green-800">
                <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.09 6.09l1.05-1.05a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                Images are uploaded directly to Supabase Storage and saved with a permanent URL.
              </div>

              {/* Product Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-sans font-bold uppercase tracking-wider text-charcoal/70">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vintage Blossom Linen"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-surface border border-border/60 rounded-xl px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Style Category */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-charcoal/70">
                    Style Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-surface border border-border/60 rounded-xl px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal cursor-pointer"
                  >
                    <option value="geometric">Geometric</option>
                    <option value="floral">Floral</option>
                    <option value="abstract">Abstract</option>
                    <option value="kids">Kids &amp; Novelty</option>
                  </select>
                </div>

                {/* Product Type (Duvet / Bedsheet / Both) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-charcoal/70">
                    Product Type
                  </label>
                  <select
                    value={formProductType}
                    onChange={(e) => setFormProductType(e.target.value)}
                    className="w-full bg-surface border border-border/60 rounded-xl px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal cursor-pointer"
                  >
                    <option value="duvet">Duvet</option>
                    <option value="bedsheet">Bedsheet</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                {/* Price */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-charcoal/70">
                    Base Price (₦)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-surface border border-border/60 rounded-xl px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Bed Sizes */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-charcoal/70">
                    {modalMode === 'create' ? 'Bed Size(s)' : 'Bed Size'}
                  </label>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    {modalMode === 'create' && (
                      <label className="flex items-center gap-1.5 cursor-pointer border-r pr-3 border-border/40 mr-1">
                        <input
                          type="checkbox"
                          checked={formSizes.length === 4}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormSizes(['twin', 'full', 'queen', 'king']);
                            } else {
                              setFormSizes(['queen']);
                            }
                          }}
                          className="w-4 h-4 text-charcoal border-border/60 rounded focus:ring-charcoal focus:ring-1 cursor-pointer"
                        />
                        <span className="text-sm font-sans font-bold text-charcoal">
                          All
                        </span>
                      </label>
                    )}
                    {['twin', 'full', 'queen', 'king'].map(size => (
                      <label key={size} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type={modalMode === 'create' ? "checkbox" : "radio"}
                          value={size}
                          checked={formSizes.includes(size)}
                          onChange={(e) => {
                            if (modalMode === 'create') {
                              if (e.target.checked) {
                                setFormSizes([...formSizes, size]);
                              } else {
                                // Keep at least one size selected
                                if (formSizes.length > 1) {
                                  setFormSizes(formSizes.filter(s => s !== size));
                                }
                              }
                            } else {
                              setFormSizes([size]);
                            }
                          }}
                          className="w-4 h-4 text-charcoal border-border/60 rounded focus:ring-charcoal focus:ring-1"
                        />
                        <span className="text-sm font-sans text-charcoal capitalize">
                          {size}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Colorway */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-charcoal/70">
                    Colorway Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Navy / White"
                    value={formColorway}
                    onChange={(e) => setFormColorway(e.target.value)}
                    className="w-full bg-surface border border-border/60 rounded-xl px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-sans font-bold uppercase tracking-wider text-charcoal/70">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the fabric feel, print dimensions, and pattern scales..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-surface border border-border/60 rounded-xl px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal resize-none"
                />
              </div>

              {/* Image Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Flat Image */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-charcoal/70">
                    Flat Bedding Image
                    <span className="ml-1 text-green-600 font-normal normal-case tracking-normal">(→ Supabase Storage)</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex-1 flex flex-col items-center justify-center p-3 border-2 border-dashed border-border hover:border-charcoal/40 rounded-xl bg-surface cursor-pointer text-center transition-colors">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-charcoal/60 mb-1">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                      </svg>
                      <span className="text-[10px] font-sans text-muted">
                        {flatImageFile ? flatImageFile.name : 'Upload flatlay JPG/PNG'}
                      </span>
                      <input type="file" accept="image/*" onChange={handleFlatImageChange} className="hidden" />
                    </label>
                    {flatImagePreview && (
                      <img
                        src={flatImagePreview}
                        alt="Flat Preview"
                        className="w-16 h-16 object-cover rounded-xl border border-border"
                      />
                    )}
                  </div>
                </div>

                {/* Room Image */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-charcoal/70">
                    Room View Image
                    <span className="ml-1 text-green-600 font-normal normal-case tracking-normal">(→ Supabase Storage)</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex-1 flex flex-col items-center justify-center p-3 border-2 border-dashed border-border hover:border-charcoal/40 rounded-xl bg-surface cursor-pointer text-center transition-colors">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-charcoal/60 mb-1">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      <span className="text-[10px] font-sans text-muted">
                        {roomImageFile ? roomImageFile.name : 'Upload room view JPG/PNG'}
                      </span>
                      <input type="file" accept="image/*" onChange={handleRoomImageChange} className="hidden" />
                    </label>
                    {roomImagePreview && (
                      <img
                        src={roomImagePreview}
                        alt="Room Preview"
                        className="w-16 h-16 object-cover rounded-xl border border-border"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Upload status indicator */}
              {uploadStatus && (
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-charcoal/5 text-[11px] font-sans text-charcoal animate-fade-in">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-charcoal/20 border-t-charcoal animate-spin shrink-0" />
                  {uploadStatus}
                </div>
              )}

              {/* Modal Footer */}
              <div className="border-t border-border/40 pt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-border rounded-xl text-xs font-sans font-bold uppercase tracking-wider text-charcoal hover:bg-surface transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-charcoal hover:bg-gold text-white rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
                >
                  {actionLoading
                    ? (uploadStatus || 'Saving...')
                    : modalMode === 'create'
                    ? 'Create Product'
                    : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
