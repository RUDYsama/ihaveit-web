import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, RefreshCw } from 'lucide-react';
import client from '../api/client';
import ProductCard from '../components/ProductCard';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('newest'); // newest, price-low, price-high

  useEffect(() => {
    // Fetch categories
    client.get('/categories/')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;

      const res = await client.get('/products/', { params });
      let data = res.data;

      // Client-side sorting
      if (sortBy === 'price-low') {
        data.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      } else if (sortBy === 'price-high') {
        data.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      } else {
        data.sort((a, b) => b.id - a.id);
      }

      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cat = searchParams.get('category') || '';
    const s = searchParams.get('search') || '';
    setSelectedCategory(cat);
    setSearchTerm(s);
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="page-wrapper">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
          สินค้าไอทีและอุปกรณ์คอมพิวเตอร์
        </h1>
        <p style={{ color: '#64748b' }}>
          เลือกดูอุปกรณ์ไอที โน้ตบุ๊ก ซีพียู การ์ดจอ จอมอนิเตอร์ และเกมมิ่งเกียร์ของแท้ประกันศูนย์
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search form */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: '1 1 300px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                placeholder="ค้นหาชื่อสินค้า, แบรนด์ (เช่น ASUS, RTX, Apple)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Search
                size={18}
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              ค้นหา
            </button>
          </form>

          {/* Sort By */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', whiteSpace: 'nowrap' }}>
              <SlidersHorizontal size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} />
              เรียงตาม:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
              style={{ width: 'auto', padding: '0.5rem 0.8rem' }}
            >
              <option value="newest">สินค้ามาใหม่ล่าสุด</option>
              <option value="price-low">ราคา: ต่ำไปสูง</option>
              <option value="price-high">ราคา: สูงไปต่ำ</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginTop: '1.25rem',
          paddingTop: '1rem',
          borderTop: '1px solid #e2e8f0'
        }}>
          <button
            onClick={() => setSelectedCategory('')}
            className={`btn btn-sm ${selectedCategory === '' ? 'btn-primary' : 'btn-outline'}`}
          >
            ทั้งหมด
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(String(cat.id))}
              className={`btn btn-sm ${selectedCategory === String(cat.id) ? 'btn-primary' : 'btn-outline'}`}
            >
              {cat.name} ({cat.product_count ?? 0})
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
          <RefreshCw size={28} className="animate-spin" style={{ marginBottom: '1rem' }} />
          <div>กำลังค้นหาและโหลดรายการสินค้า...</div>
        </div>
      ) : products.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
          <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '1rem' }}>
            ไม่พบสินค้าที่ตรงกับเงื่อนไขการค้นหา
          </p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}
            className="btn btn-outline"
          >
            ล้างตัวกรองทั้งหมด
          </button>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem' }}>
            พบสินค้าทั้งหมด <strong>{products.length}</strong> รายการ
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
