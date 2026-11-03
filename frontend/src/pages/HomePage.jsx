import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import client from '../api/client';
import ProductCard from '../components/ProductCard';
import PromoCarousel from '../components/PromoCarousel';
import CategoryNavGrid from '../components/CategoryNavGrid';

const FLAGSHIP_IDS = [10, 25, 43, 59, 104, 76, 111, 120, 88, 167];

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await client.get('/products/');
        const allProducts = prodRes.data || [];
        setTotalCount(allProducts.length);

        // Pick the 10 diverse flagship products for the 2 rows x 5 cards grid
        const flagshipMap = new Map();
        allProducts.forEach(p => flagshipMap.set(p.id, p));

        const selected = [];
        for (const id of FLAGSHIP_IDS) {
          if (flagshipMap.has(id)) {
            selected.push(flagshipMap.get(id));
          }
        }

        // If some IDs aren't found, fill up to 10 unique products
        if (selected.length < 10) {
          for (const p of allProducts) {
            if (!selected.some(s => s.id === p.id)) {
              selected.push(p);
            }
            if (selected.length === 10) break;
          }
        }

        setFeaturedProducts(selected.slice(0, 10));
      } catch (err) {
        console.error("Error loading home page products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="page-wrapper" style={{ paddingTop: '1.25rem', paddingBottom: '3rem' }}>
      {/* 1. Dynamic Graphic Promotion Carousel (Advice / IHAVEIT Style) */}
      <PromoCarousel />

      {/* 2. Popular IT Category Quick Navigation Bar */}
      <CategoryNavGrid />

      {/* 3. Featured Products Grid (Strictly 5 columns x 2 rows = 10 items) */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: '0.25rem' }}>
              <span className="badge badge-primary" style={{ fontSize: '0.75rem', padding: '3px 10px' }}>
                <Sparkles size={12} /> HOT PRODUCTS
              </span>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                ฮาร์ดแวร์ตัวท็อปยอดนิยม
              </span>
            </div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: '#0f172a',
              margin: 0,
              letterSpacing: '-0.3px'
            }}>
              สินค้าไอทียอดนิยมและแนะนำ
            </h2>
          </div>

          <Link
            to="/products"
            className="btn btn-outline btn-sm"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontWeight: 600,
              borderRadius: 8,
              padding: '0.45rem 0.9rem'
            }}
          >
            ดูสินค้าทั้งหมด ({totalCount || '167+'} รายการ) <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            กำลังโหลดข้อมูลสินค้า...
          </div>
        ) : (
          <div className="home-product-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
