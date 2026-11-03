import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Check, Eye, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [added, setAdded] = useState(false);

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login', {
        state: { info: 'กรุณาเข้าสู่ระบบก่อน เพื่อบันทึกสินค้าที่ถูกใจ (Wishlist)' }
      });
      return;
    }
    toggleWishlist(product);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (product.stock <= 0) return;

    if (!isAuthenticated) {
      navigate('/login', {
        state: { info: 'กรุณาเข้าสู่ระบบก่อน เพื่อสั่งซื้อสินค้าหรือเพิ่มลงในตะกร้า' }
      });
      return;
    }

    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const isOutOfStock = product.stock <= 0;
  const isFav = isInWishlist(product.id);

  return (
    <div className="product-card" style={{ borderRadius: 14, overflow: 'hidden' }}>
      <div className="product-image-wrap" style={{ height: 160, position: 'relative' }}>
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80'}
          alt={product.name}
          className="product-image"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80';
          }}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {product.category_name && (
          <span className="product-category-tag" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>
            {product.category_name}
          </span>
        )}

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={handleHeartClick}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: 'rgba(255, 255, 255, 0.92)',
            border: 'none',
            borderRadius: '50%',
            width: 30,
            height: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
            zIndex: 2
          }}
          title={isFav ? 'นำออกจากที่ถูกใจ' : 'บันทึกเป็นสินค้าที่ถูกใจ'}
        >
          <Heart
            size={16}
            fill={isFav ? '#ef4444' : 'none'}
            color={isFav ? '#ef4444' : '#64748b'}
          />
        </button>

        {isOutOfStock && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f87171',
            fontWeight: 700,
            fontSize: '0.9rem'
          }}>
            สินค้าหมด
          </div>
        )}
      </div>

      <div className="product-body" style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {product.brand && (
          <div className="product-brand" style={{ fontSize: '0.725rem', marginBottom: 2 }}>
            {product.brand}
          </div>
        )}

        <Link
          to={`/products/${product.id}`}
          className="product-title"
          title={product.name}
          style={{
            fontSize: '0.875rem',
            lineHeight: 1.35,
            minHeight: '2.4em',
            marginBottom: '0.4rem',
            color: '#0f172a',
            fontWeight: 600
          }}
        >
          {product.name}
        </Link>

        <div style={{ fontSize: '0.72rem', color: isOutOfStock ? '#ef4444' : '#10b981', fontWeight: 600, marginBottom: '0.6rem' }}>
          {isOutOfStock ? '● สินค้าหมด' : `● พร้อมส่ง (เหลือ ${product.stock})`}
        </div>

        <div className="product-footer" style={{ marginTop: 'auto', paddingTop: '0.6rem', borderTop: '1px solid #f1f5f9' }}>
          <div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>ราคาพิเศษ</div>
            <div className="product-price" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1d4ed8' }}>
              ฿{parseFloat(product.price).toLocaleString()}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <Link
              to={`/products/${product.id}`}
              className="btn btn-outline btn-sm"
              style={{ padding: '0.35rem 0.5rem' }}
              title="ดูรายละเอียดสินค้า"
            >
              <Eye size={15} />
            </Link>

            <button
              onClick={handleAdd}
              disabled={isOutOfStock}
              className={`btn btn-sm ${added ? 'btn-success' : 'btn-primary'}`}
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
              title={isOutOfStock ? 'สินค้าหมด' : 'สั่งซื้อ / ใส่ตะกร้า'}
            >
              {added ? <Check size={14} /> : <><ShoppingCart size={14} /> สั่งซื้อ</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
