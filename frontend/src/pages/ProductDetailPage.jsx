import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, ArrowLeft, ShieldCheck, Check,
  Cpu, Truck, RotateCcw, AlertTriangle
} from 'lucide-react';
import client from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    client.get(`/products/${id}/`)
      .then(res => setProduct(res.data))
      .catch(err => {
        console.error("Product load error:", err);
        setError('ไม่พบสินค้านี้ในระบบ');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { info: 'กรุณาเข้าสู่ระบบก่อน เพื่อใส่สินค้าลงตะกร้าหรือสั่งซื้อ' } });
      return;
    }
    if (!product || product.stock <= 0) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { info: 'กรุณาเข้าสู่ระบบก่อน เพื่อสั่งซื้อสินค้าทันที' } });
      return;
    }
    if (!product || product.stock <= 0) return;
    addToCart(product, quantity);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '5rem' }}>
        กำลังโหลดข้อมูลสินค้า...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '5rem' }}>
        <p style={{ color: '#ef4444', fontSize: '1.2rem', marginBottom: '1rem' }}>{error}</p>
        <Link to="/products" className="btn btn-primary">
          <ArrowLeft size={16} /> กลับไปหน้ารวมสินค้า
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="page-wrapper">
      <Link to="/products" className="btn btn-outline btn-sm" style={{ marginBottom: '1.5rem', display: 'inline-flex', gap: 6 }}>
        <ArrowLeft size={16} /> กลับไปหน้ารวมสินค้า
      </Link>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '2.5rem',
        background: '#ffffff',
        padding: '2.5rem',
        borderRadius: 20,
        border: '1px solid #e2e8f0',
        marginBottom: '2.5rem'
      }}>
        {/* Product Image */}
        <div style={{
          background: '#f8fafc',
          borderRadius: 16,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 380,
          border: '1px solid #e2e8f0'
        }}>
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'}
            alt={product.name}
            style={{ width: '100%', maxHeight: 420, objectFit: 'contain' }}
          />
        </div>

        {/* Product Info */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            {product.brand && <span className="badge badge-primary">{product.brand}</span>}
            {product.category_name && <span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>{product.category_name}</span>}
          </div>

          <h1 style={{ fontSize: '1.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
            {product.name}
          </h1>

          <div style={{
            fontSize: '2.25rem',
            fontWeight: 800,
            color: '#1d4ed8',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'baseline',
            gap: '0.5rem'
          }}>
            ฿{parseFloat(product.price).toLocaleString()}
            <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 400 }}>รวมภาษีมูลค่าเพิ่มแล้ว</span>
          </div>

          <div style={{
            padding: '1rem',
            borderRadius: 12,
            background: isOutOfStock ? '#fef2f2' : '#f0fdf4',
            border: `1px solid ${isOutOfStock ? '#fecaca' : '#bbf7d0'}`,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            {isOutOfStock ? (
              <>
                <AlertTriangle size={20} color="#ef4444" />
                <span style={{ color: '#991b1b', fontWeight: 600 }}>สินค้าหมดชั่วคราว</span>
              </>
            ) : (
              <>
                <Check size={20} color="#16a34a" />
                <span style={{ color: '#166534', fontWeight: 600 }}>
                  มีสินค้าพร้อมส่ง (คงเหลือ {product.stock} ชิ้น)
                </span>
              </>
            )}
          </div>

          <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '2rem' }}>
            {product.description || 'ไม่มีรายละเอียดสินค้า'}
          </p>

          {/* Quantity and Actions */}
          {!isOutOfStock && (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: 8 }}>
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{ padding: '0.6rem 1rem', fontSize: '1.1rem', fontWeight: 600 }}
                >
                  -
                </button>
                <span style={{ minWidth: 40, textAlign: 'center', fontWeight: 600 }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  style={{ padding: '0.6rem 1rem', fontSize: '1.1rem', fontWeight: 600 }}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`btn btn-lg ${added ? 'btn-success' : 'btn-outline'}`}
                style={{ flex: 1 }}
              >
                {added ? <><Check size={20} /> เพิ่มแล้ว</> : <><ShoppingCart size={20} /> ใส่ตะกร้า</>}
              </button>

              <button
                onClick={handleBuyNow}
                className="btn btn-primary btn-lg"
                style={{ flex: 1 }}
              >
                สั่งซื้อทันที
              </button>
            </div>
          )}

          {/* Guarantee Badges */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.75rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #e2e8f0',
            fontSize: '0.8rem',
            color: '#64748b'
          }}>
            <div style={{ textAlign: 'center' }}>
              <ShieldCheck size={20} color="#2563eb" style={{ margin: '0 auto 4px' }} />
              <div>ประกันศูนย์ไทย</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Truck size={20} color="#2563eb" style={{ margin: '0 auto 4px' }} />
              <div>ส่งด่วน 1-2 วัน</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <RotateCcw size={20} color="#2563eb" style={{ margin: '0 auto 4px' }} />
              <div>เปลี่ยนใน 7 วัน</div>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Cpu size={22} color="#2563eb" /> ข้อมูลทางเทคนิคและสเปกสินค้า (Specifications)
          </h2>
          <div className="table-responsive">
            <table className="table">
              <tbody>
                {Object.entries(product.specs).map(([key, val]) => (
                  <tr key={key}>
                    <td style={{ width: '30%', fontWeight: 600, background: '#f8fafc' }}>{key}</td>
                    <td>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
