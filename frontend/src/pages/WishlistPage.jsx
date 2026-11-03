import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/login', { state: { info: 'กรุณาเข้าสู่ระบบเพื่อดูรายการสินค้าที่คุณถูกใจ (Wishlist)' } });
    return null;
  }

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
  };

  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 700, color: '#0f172a' }}>
            สินค้าที่ถูกใจ (Wishlist)
          </h1>
          <p style={{ color: '#64748b' }}>
            รายการสินค้าไอทีที่คุณบันทึกไว้ ({wishlist.length} รายการ)
          </p>
        </div>
        <Link to="/products" className="btn btn-outline btn-sm">
          <ArrowLeft size={16} /> กลับไปหน้ารวมสินค้า
        </Link>
      </div>

      {wishlist.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
          <Heart size={56} style={{ color: '#cbd5e1', margin: '0 auto 1.5rem' }} />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            คุณยังไม่มีสินค้าที่ถูกใจ
          </h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
            กดรูปหัวใจที่สินค้าที่คุณสนใจเพื่อบันทึกไว้ดูภายหลัง
          </p>
          <Link to="/products" className="btn btn-primary">
            เลือกชมสินค้าไอที <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {wishlist.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-wrap">
                <img
                  src={product.image_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80'}
                  alt={product.name}
                  className="product-image"
                />
                <button
                  type="button"
                  onClick={() => removeFromWishlist(product.id)}
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    background: 'white',
                    color: '#ef4444',
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                  }}
                  title="ลบออกจากที่ถูกใจ"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="product-body">
                <div className="product-brand">{product.brand}</div>
                <Link to={`/products/${product.id}`} className="product-title">
                  {product.name}
                </Link>

                <div className="product-footer">
                  <div className="product-price">
                    ฿{parseFloat(product.price).toLocaleString()}
                  </div>
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="btn btn-primary btn-sm"
                  >
                    <ShoppingCart size={16} /> ย้ายลงตะกร้า
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
