import React, { useEffect, useState, useMemo } from 'react';
import {
  Plus, Edit2, Trash2, Search, X, Check,
  AlertCircle, Package, ExternalLink, Image as ImageIcon,
  SlidersHorizontal, ArrowUpDown, Filter, RefreshCw
} from 'lucide-react';
import client from '../../api/client';
import Sidebar from '../../components/Sidebar';

const HARDWARE_IMAGE_PRESETS = [
  { label: 'CPU (Ryzen / Intel)', url: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80' },
  { label: 'GPU (RTX 4090 / 4080)', url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80' },
  { label: 'Mainboard (ROG / MSI)', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80' },
  { label: 'RAM (DDR5 Modules)', url: '/products/ram_module.jpg' },
  { label: 'PSU (ATX Modular Power)', url: '/products/psu_modular.jpg' },
  { label: 'SSD (M.2 NVMe)', url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=600&q=80' },
  { label: 'Case (Lian Li Panoramic)', url: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=600&q=80' },
  { label: 'Cooler (AIO Liquid)', url: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80' },
  { label: 'Monitor (OLED Curved)', url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80' },
  { label: 'Keyboard (Mechanical)', url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80' },
  { label: 'Mouse (Wireless Gaming)', url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80' }
];

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Filters & Sorting
  const [selectedCat, setSelectedCat] = useState('');
  const [stockFilter, setStockFilter] = useState('all'); // all, in_stock, low_stock, out_stock
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, price_asc, price_desc, stock_asc, stock_desc, name_asc

  // Full Edit/Add Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    image_url: '',
    specs_str: ''
  });
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');

  // Quick Image Modal State
  const [imageModalProduct, setImageModalProduct] = useState(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [savingImage, setSavingImage] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        client.get('/products/'),
        client.get('/categories/')
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered & Sorted Products
  const processedProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q))
      );
    }

    // Category
    if (selectedCat) {
      result = result.filter(p => String(p.category) === String(selectedCat));
    }

    // Stock Filter
    if (stockFilter === 'in_stock') {
      result = result.filter(p => p.stock > 0);
    } else if (stockFilter === 'low_stock') {
      result = result.filter(p => p.stock > 0 && p.stock <= 5);
    } else if (stockFilter === 'out_stock') {
      result = result.filter(p => p.stock <= 0);
    }

    // Sorting
    if (sortBy === 'newest') {
      result.sort((a, b) => b.id - a.id);
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => a.id - b.id);
    } else if (sortBy === 'price_asc') {
      result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (sortBy === 'stock_asc') {
      result.sort((a, b) => a.stock - b.stock);
    } else if (sortBy === 'stock_desc') {
      result.sort((a, b) => b.stock - a.stock);
    } else if (sortBy === 'name_asc') {
      result.sort((a, b) => a.name.localeCompare(b.name, 'th'));
    }

    return result;
  }, [products, search, selectedCat, stockFilter, sortBy]);

  // Open Add Product
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      brand: '',
      category: categories[0]?.id || '',
      price: '',
      stock: '10',
      description: '',
      image_url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80',
      specs_str: 'Model: Standard\nWarranty: 3 Years Thailand Warranty'
    });
    setModalError('');
    setIsModalOpen(true);
  };

  // Open Edit Product
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    let specsString = '';
    if (product.specs && typeof product.specs === 'object') {
      specsString = Object.entries(product.specs)
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n');
    }
    setFormData({
      name: product.name,
      brand: product.brand || '',
      category: product.category || '',
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      image_url: product.image_url || '',
      specs_str: specsString
    });
    setModalError('');
    setIsModalOpen(true);
  };

  // Open Quick Image Modal
  const handleOpenImageModal = (product) => {
    setImageModalProduct(product);
    setNewImageUrl(product.image_url || '');
  };

  // Save Quick Image
  const handleSaveImage = async (e) => {
    e.preventDefault();
    if (!imageModalProduct) return;
    setSavingImage(true);
    try {
      await client.put(`/products/${imageModalProduct.id}/`, {
        image_url: newImageUrl.trim()
      });
      setProducts(prev => prev.map(p => p.id === imageModalProduct.id ? { ...p, image_url: newImageUrl.trim() } : p));
      setImageModalProduct(null);
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการบันทึกรูปภาพสินค้า');
    } finally {
      setSavingImage(false);
    }
  };

  // Save Full Product
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSaving(true);
    setModalError('');

    const specsObj = {};
    if (formData.specs_str.trim()) {
      formData.specs_str.split('\n').forEach(line => {
        const parts = line.split(':');
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const val = parts.slice(1).join(':').trim();
          if (key && val) specsObj[key] = val;
        }
      });
    }

    const payload = {
      name: formData.name.trim(),
      brand: formData.brand.trim(),
      category: formData.category || null,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      description: formData.description.trim(),
      image_url: formData.image_url.trim(),
      specs: specsObj
    };

    try {
      if (editingProduct) {
        const res = await client.put(`/products/${editingProduct.id}/`, payload);
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? res.data : p));
      } else {
        const res = await client.post('/products/', payload);
        setProducts(prev => [res.data, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      setModalError('บันทึกข้อมูลไม่สำเร็จ กรุณาตรวจสอบข้อมูลอีกครั้ง');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบสินค้า "${name}"?`)) return;
    try {
      await client.delete(`/products/${id}/`);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการลบสินค้า');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 52px)', background: '#f8fafc' }}>
      <Sidebar />

      <main style={{ flex: 1, padding: '1.25rem 1.75rem', overflowX: 'hidden' }}>
        {/* Compact Admin Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                จัดการสินค้าไอที (Products Management)
              </h1>
              <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: 12 }}>
                {processedProducts.length} จาก {products.length} ชิ้น
              </span>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '2px 0 0' }}>
              ค้นหา กรองหมวดหมู่ เรียงลำดับ อัปเดตราคา สต็อก และเปลี่ยนรูปภาพสินค้าได้ทันที
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              onClick={fetchData}
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
              title="ดึงข้อมูลล่าสุด"
            >
              <RefreshCw size={13} /> รีเฟรช
            </button>
            <button
              onClick={handleOpenAddModal}
              className="btn btn-primary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '0.35rem 0.85rem', fontSize: '0.8rem', fontWeight: 700 }}
            >
              <Plus size={15} /> + เพิ่มสินค้าใหม่
            </button>
          </div>
        </div>

        {/* Compact Filter & Sort Tool Bar */}
        <div className="card" style={{ padding: '0.75rem 1rem', marginBottom: '1rem', borderRadius: 10, border: '1px solid #e2e8f0', background: '#ffffff' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', alignItems: 'center' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 180 }}>
              <input
                type="text"
                placeholder="ค้นหาชื่อสินค้า, แบรนด์..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input"
                style={{ padding: '0.4rem 0.65rem 0.4rem 2rem', fontSize: '0.82rem', borderRadius: 6, height: 34 }}
              />
              <Search
                size={14}
                style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
              />
            </div>

            {/* Category Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Filter size={14} style={{ color: '#64748b' }} />
              <select
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                className="form-input"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', borderRadius: 6, height: 34, minWidth: 140 }}
              >
                <option value="">ทุกหมวดหมู่ ({categories.length})</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Stock Filter */}
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="form-input"
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', borderRadius: 6, height: 34 }}
            >
              <option value="all">สต็อก: ทั้งหมด</option>
              <option value="in_stock">พร้อมส่ง (&gt; 0)</option>
              <option value="low_stock">สต็อกต่ำ (&lt;= 5)</option>
              <option value="out_stock">สินค้าหมด (0)</option>
            </select>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
              <ArrowUpDown size={14} style={{ color: '#64748b' }} />
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>เรียงตาม:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-input"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', borderRadius: 6, height: 34, minWidth: 150 }}
              >
                <option value="newest">ล่าสุด (ID มาก ➔ น้อย)</option>
                <option value="oldest">เก่าสุด (ID น้อย ➔ มาก)</option>
                <option value="price_asc">ราคา: ต่ำ ➔ สูง</option>
                <option value="price_desc">ราคา: สูง ➔ ต่ำ</option>
                <option value="stock_asc">สต็อก: น้อย ➔ มาก</option>
                <option value="stock_desc">สต็อก: มาก ➔ น้อย</option>
                <option value="name_asc">ชื่อสินค้า (A - Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Compact High-Density Product Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 10, border: '1px solid #e2e8f0', background: '#ffffff' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '0.55rem 0.75rem', width: 45, textAlign: 'center' }}>ID</th>
                <th style={{ padding: '0.55rem 0.75rem', width: 75, textAlign: 'center' }}>รูป</th>
                <th style={{ padding: '0.55rem 0.75rem' }}>ชื่อสินค้า &amp; แบรนด์</th>
                <th style={{ padding: '0.55rem 0.75rem', width: 140 }}>หมวดหมู่</th>
                <th style={{ padding: '0.55rem 0.75rem', width: 95, textAlign: 'right' }}>ราคา</th>
                <th style={{ padding: '0.55rem 0.75rem', width: 70, textAlign: 'center' }}>สต็อก</th>
                <th style={{ padding: '0.55rem 0.75rem', width: 90, textAlign: 'center' }}>สถานะ</th>
                <th style={{ padding: '0.55rem 0.75rem', width: 110, textAlign: 'center' }}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    กำลังโหลดข้อมูลสินค้า...
                  </td>
                </tr>
              ) : processedProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    ไม่พบสินค้าที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              ) : (
                processedProducts.map((p) => {
                  const isOutOfStock = p.stock <= 0;
                  const isLowStock = p.stock > 0 && p.stock <= 5;

                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }} className="admin-table-row">
                      <td style={{ padding: '0.45rem 0.75rem', textAlign: 'center', color: '#94a3b8', fontWeight: 600 }}>
                        {p.id}
                      </td>

                      {/* Image Thumbnail with Quick Change Button */}
                      <td style={{ padding: '0.45rem 0.75rem', textAlign: 'center' }}>
                        <div
                          onClick={() => handleOpenImageModal(p)}
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 6,
                            overflow: 'hidden',
                            background: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            position: 'relative'
                          }}
                          title="คลิกเพื่อเปลี่ยนรูปภาพสินค้านี้"
                        >
                          <img
                            src={p.image_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=100&q=80'}
                            alt={p.name}
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=100&q=80';
                            }}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      </td>

                      <td style={{ padding: '0.45rem 0.75rem' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
                          {p.name}
                        </div>
                        {p.brand && (
                          <div style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 600 }}>
                            {p.brand}
                          </div>
                        )}
                      </td>

                      <td style={{ padding: '0.45rem 0.75rem', color: '#475569', fontSize: '0.75rem' }}>
                        <span style={{
                          background: '#f1f5f9',
                          padding: '2px 6px',
                          borderRadius: 4,
                          fontWeight: 500
                        }}>
                          {p.category_name || '-'}
                        </span>
                      </td>

                      <td style={{ padding: '0.45rem 0.75rem', textAlign: 'right', fontWeight: 700, color: '#1e293b' }}>
                        ฿{parseFloat(p.price).toLocaleString()}
                      </td>

                      <td style={{ padding: '0.45rem 0.75rem', textAlign: 'center', fontWeight: 800 }}>
                        <span style={{
                          color: isOutOfStock ? '#ef4444' : isLowStock ? '#d97706' : '#10b981'
                        }}>
                          {p.stock}
                        </span>
                      </td>

                      <td style={{ padding: '0.45rem 0.75rem', textAlign: 'center' }}>
                        <span style={{
                          fontSize: '0.68rem',
                          padding: '2px 6px',
                          borderRadius: 12,
                          fontWeight: 700,
                          background: isOutOfStock ? '#fee2e2' : isLowStock ? '#fef3c7' : '#dcfce7',
                          color: isOutOfStock ? '#b91c1c' : isLowStock ? '#b45309' : '#15803d'
                        }}>
                          {isOutOfStock ? 'สินค้าหมด' : isLowStock ? 'ใกล้หมด' : 'เปิดขาย'}
                        </span>
                      </td>

                      <td style={{ padding: '0.45rem 0.75rem', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: 4 }}>
                          <button
                            onClick={() => handleOpenImageModal(p)}
                            style={{
                              background: '#eff6ff',
                              color: '#1d4ed8',
                              border: 'none',
                              padding: '3px 6px',
                              borderRadius: 4,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center'
                            }}
                            title="เปลี่ยนรูปภาพสินค้า"
                          >
                            <ImageIcon size={12} />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            style={{
                              background: '#f1f5f9',
                              color: '#334155',
                              border: '1px solid #cbd5e1',
                              padding: '3px 6px',
                              borderRadius: 4,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center'
                            }}
                            title="แก้ไขข้อมูล"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            style={{
                              background: '#fee2e2',
                              color: '#b91c1c',
                              border: 'none',
                              padding: '3px 6px',
                              borderRadius: 4,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center'
                            }}
                            title="ลบสินค้า"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Quick Image Edit Modal */}
        {imageModalProduct && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '1rem'
          }}>
            <div className="card" style={{ maxWidth: 460, width: '100%', padding: '1.5rem', borderRadius: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  แก้ไขรูปภาพสินค้าเฉพาะชิ้นนี้
                </h3>
                <button
                  onClick={() => setImageModalProduct(null)}
                  style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 26, height: 26, cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '0.75rem' }}>
                สินค้า: <strong style={{ color: '#0f172a' }}>{imageModalProduct.name}</strong>
              </div>

              {/* Preview Thumbnail */}
              <div style={{
                width: '100%',
                height: 160,
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.85rem'
              }}>
                <img
                  src={newImageUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80'}
                  alt="Preview"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80';
                  }}
                  style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                />
              </div>

              <form onSubmit={handleSaveImage}>
                <div style={{ marginBottom: '0.65rem' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 3 }}>
                    ลิงก์รูปภาพ (Image URL)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="วาง URL รูปภาพที่ต้องการ (เช่น https://... หรือ /products/...)"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="form-input"
                    style={{ padding: '0.45rem 0.65rem', fontSize: '0.82rem' }}
                  />
                </div>

                {/* Quick Presets */}
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: 4 }}>
                    หรือคลิกเลือกรูปภาพฮาร์ดแวร์จริงสำเร็จรูป:
                  </span>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', maxHeight: 85, overflowY: 'auto' }}>
                    {HARDWARE_IMAGE_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setNewImageUrl(preset.url)}
                        style={{
                          background: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          borderRadius: 4,
                          padding: '2px 6px',
                          fontSize: '0.68rem',
                          cursor: 'pointer'
                        }}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setImageModalProduct(null)}
                    className="btn btn-outline btn-sm"
                    style={{ padding: '0.35rem 0.85rem' }}
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={savingImage}
                    className="btn btn-primary btn-sm"
                    style={{ padding: '0.35rem 1.1rem', fontWeight: 700 }}
                  >
                    {savingImage ? 'กำลังบันทึก...' : 'บันทึกรูปภาพ'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Full Add/Edit Modal */}
        {isModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}>
            <div className="card" style={{ maxWidth: 560, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem', borderRadius: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {editingProduct ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มสินค้าใหม่ในระบบ'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 26, height: 26, cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              {modalError && (
                <div className="alert alert-danger" style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                  <AlertCircle size={15} />
                  <span>{modalError}</span>
                </div>
              )}

              <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 2 }}>
                    ชื่อสินค้า (Product Name)*
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                    style={{ padding: '0.45rem 0.65rem', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 2 }}>
                      แบรนด์ (Brand)
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น ASUS, Intel, AMD"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="form-input"
                      style={{ padding: '0.45rem 0.65rem', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 2 }}>
                      หมวดหมู่สินค้า*
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="form-input"
                      style={{ padding: '0.45rem 0.65rem', fontSize: '0.85rem' }}
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 2 }}>
                      ราคา (THB)*
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="form-input"
                      style={{ padding: '0.45rem 0.65rem', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 2 }}>
                      จำนวนสต็อก (ชิ้น)*
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="form-input"
                      style={{ padding: '0.45rem 0.65rem', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 2 }}>
                    รูปภาพสินค้า (Image URL)
                  </label>
                  <input
                    type="text"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="form-input"
                    style={{ padding: '0.45rem 0.65rem', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 2 }}>
                    รายละเอียดสินค้า (Description)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="form-input"
                    style={{ padding: '0.45rem 0.65rem', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 2 }}>
                    สเปกเทคนิค (Specs บรรทัดละ 1 ข้อ เช่น Key: Value)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.specs_str}
                    onChange={(e) => setFormData({ ...formData, specs_str: e.target.value })}
                    className="form-input"
                    style={{ padding: '0.45rem 0.65rem', fontSize: '0.82rem', fontFamily: 'monospace' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-outline btn-sm"
                    style={{ padding: '0.35rem 0.85rem' }}
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-primary btn-sm"
                    style={{ padding: '0.35rem 1.25rem', fontWeight: 700 }}
                  >
                    {saving ? 'กำลังบันทึก...' : 'บันทึกสินค้า'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminProductsPage;
