import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2, ShoppingBag, ArrowRight, ShieldCheck,
  CheckCircle2, AlertCircle, ArrowLeft, CreditCard
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_name: user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user?.username || '',
    customer_email: user?.email || '',
    customer_phone: user?.profile?.phone || '',
    shipping_address: user?.profile?.address || '',
    payment_method: 'โอนเงินผ่านธนาคาร / QR PromptPay',
    note: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);

  const shippingCost = totalPrice >= 1000 || totalPrice === 0 ? 0 : 50;
  const grandTotal = totalPrice + shippingCost;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { info: 'กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อสินค้า' } });
      return;
    }

    if (cartItems.length === 0) {
      setError('ไม่มีสินค้าในตะกร้า');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const orderPayload = {
        ...formData,
        items: cartItems.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity
        }))
      };

      const res = await client.post('/orders/', orderPayload);
      clearCart();
      setOrderSuccess(res.data);
    } catch (err) {
      console.error("Checkout failed:", err);
      setError(err.response?.data?.error || 'เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ');
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="page-wrapper" style={{ maxWidth: 640, margin: '3rem auto' }}>
        <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            background: '#ecfdf5',
            color: '#10b981',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem'
          }}>
            <CheckCircle2 size={36} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
            สั่งซื้อสินค้าสำเร็จเรียบร้อย!
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '1.5rem' }}>
            หมายเลขคำสั่งซื้อของคุณคือ <strong>#{orderSuccess.id}</strong><br />
            ยอดชำระสุทธิ: <strong style={{ color: '#1d4ed8', fontSize: '1.2rem' }}>฿{parseFloat(orderSuccess.total_amount).toLocaleString()}</strong>
          </p>

          <div style={{
            background: '#f8fafc',
            borderRadius: 12,
            padding: '1.25rem',
            textAlign: 'left',
            marginBottom: '2rem',
            border: '1px solid #e2e8f0',
            fontSize: '0.9rem'
          }}>
            <div style={{ marginBottom: 6 }}>ผู้รับสินค้า: <strong>{orderSuccess.customer_name}</strong></div>
            <div style={{ marginBottom: 6 }}>เบอร์โทร: {orderSuccess.customer_phone}</div>
            <div style={{ marginBottom: 6 }}>ที่อยู่จัดส่ง: {orderSuccess.shipping_address}</div>
            <div style={{ marginBottom: 6 }}>วิธีชำระเงิน: {orderSuccess.payment_method}</div>
            <div>สถานะคำสั่งซื้อ: <span className="badge badge-warning">{orderSuccess.status}</span></div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/orders" className="btn btn-primary">
              ดูประวัติคำสั่งซื้อของฉัน
            </Link>
            <Link to="/products" className="btn btn-outline">
              เลือกซื้อสินค้าต่อ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="page-wrapper" style={{ maxWidth: 600, margin: '4rem auto', textAlign: 'center' }}>
        <div className="card" style={{ padding: '3rem' }}>
          <ShoppingBag size={56} style={{ color: '#94a3b8', margin: '0 auto 1.5rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            ยังไม่มีสินค้าในตะกร้าของคุณ
          </h2>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>
            เลือกชมสินค้าไอที อุปกรณ์คอมพิวเตอร์ และโปรโมชันพิเศษจาก IHAVEIT
          </p>
          <Link to="/products" className="btn btn-primary btn-lg">
            ไปเลือกชมสินค้าไอที <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <h1 style={{ fontSize: '1.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.75rem' }}>
        ตะกร้าสินค้าและการสั่งซื้อ ({totalItems} รายการ)
      </h1>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Cart Items List */}
        <div>
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 600 }}>รายการสินค้าในตะกร้า</h2>
              <button
                type="button"
                onClick={clearCart}
                className="btn btn-outline btn-sm"
                style={{ color: '#ef4444', borderColor: '#fca5a5' }}
              >
                ล้างตะกร้า
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cartItems.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid #e2e8f0'
                  }}
                >
                  <img
                    src={product.image_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=200&q=80'}
                    alt={product.name}
                    style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 8, background: '#f8fafc' }}
                  />

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600 }}>{product.brand}</div>
                    <Link to={`/products/${product.id}`} style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem', display: 'block', marginBottom: 4 }}>
                      {product.name}
                    </Link>
                    <div style={{ color: '#64748b', fontSize: '0.85rem' }}>
                      ฿{parseFloat(product.price).toLocaleString()} / ชิ้น
                    </div>
                  </div>

                  {/* Quantity Control */}
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: 6 }}>
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      style={{ padding: '0.3rem 0.6rem', fontWeight: 700 }}
                    >
                      -
                    </button>
                    <span style={{ minWidth: 28, textAlign: 'center', fontSize: '0.9rem', fontWeight: 600 }}>
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      disabled={quantity >= product.stock}
                      style={{ padding: '0.3rem 0.6rem', fontWeight: 700 }}
                    >
                      +
                    </button>
                  </div>

                  <div style={{ minWidth: 90, textAlign: 'right', fontWeight: 700, color: '#1e3a8a' }}>
                    ฿{(parseFloat(product.price) * quantity).toLocaleString()}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(product.id)}
                    style={{ color: '#ef4444', padding: 6 }}
                    title="ลบออกจากตะกร้า"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Link to="/products" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', gap: 6 }}>
            <ArrowLeft size={16} /> เลือกดูสินค้าเพิ่มเติม
          </Link>
        </div>

        {/* Checkout Form */}
        <div>
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <CreditCard size={20} color="#2563eb" /> ข้อมูลการจัดส่งและสั่งซื้อ
            </h2>

            {!isAuthenticated && (
              <div className="alert alert-info" style={{ marginBottom: '1.25rem' }}>
                <div>
                  คุณยังไม่ได้เข้าสู่ระบบ <br />
                  <Link to="/login" style={{ fontWeight: 600, textDecoration: 'underline' }}>เข้าสู่ระบบตอนนี้</Link> เพื่อบันทึกคำสั่งซื้อลงบัญชีของคุณ
                </div>
              </div>
            )}

            <form onSubmit={handleCheckout}>
              <div className="form-group">
                <label className="form-label">ชื่อ-นามสกุล ผู้รับ *</label>
                <input
                  type="text"
                  name="customer_name"
                  required
                  className="form-input"
                  value={formData.customer_name}
                  onChange={handleChange}
                  placeholder="เช่น สมชาย ใจดี"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">อีเมลผู้สั่งซื้อ *</label>
                  <input
                    type="email"
                    name="customer_email"
                    required
                    className="form-input"
                    value={formData.customer_email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">เบอร์โทรศัพท์ *</label>
                  <input
                    type="tel"
                    name="customer_phone"
                    required
                    className="form-input"
                    value={formData.customer_phone}
                    onChange={handleChange}
                    placeholder="0812345678"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">ที่อยู่จัดส่งสินค้าอย่างละเอียด *</label>
                <textarea
                  name="shipping_address"
                  required
                  rows={3}
                  className="form-textarea"
                  value={formData.shipping_address}
                  onChange={handleChange}
                  placeholder="บ้านเลขที่, ถนน, แขวง/ตำบล, เขต/อำเภอ, จังหวัด, รหัสไปรษณีย์"
                />
              </div>

              <div className="form-group">
                <label className="form-label">ช่องทางชำระเงิน</label>
                <select
                  name="payment_method"
                  className="form-select"
                  value={formData.payment_method}
                  onChange={handleChange}
                >
                  <option value="โอนเงินผ่านธนาคาร / QR PromptPay">โอนเงินผ่านธนาคาร / QR PromptPay</option>
                  <option value="บัตรเครดิต / เดบิต">บัตรเครดิต / เดบิต (Visa, Mastercard)</option>
                  <option value="เก็บเงินปลายทาง (COD)">เก็บเงินปลายทาง (COD)</option>
                </select>
              </div>

              {/* Price Calculation Summary */}
              <div style={{
                background: '#f8fafc',
                borderRadius: 12,
                padding: '1.25rem',
                margin: '1.5rem 0',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem', color: '#64748b' }}>
                  <span>ยอดรวมสินค้า ({totalItems} ชิ้น):</span>
                  <span>฿{totalPrice.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem', color: '#64748b' }}>
                  <span>ค่าจัดส่งด่วน:</span>
                  <span>{shippingCost === 0 ? <strong style={{ color: '#16a34a' }}>ฟรี (ยอดเกิน ฿1,000)</strong> : `฿${shippingCost}`}</span>
                </div>
                <hr style={{ border: 0, borderTop: '1px solid #cbd5e1', margin: '10px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                  <span>ยอดสุทธิที่ต้องชำระ:</span>
                  <span style={{ color: '#1d4ed8' }}>฿{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
              >
                {loading ? 'กำลังดำเนินการสั่งซื้อ...' : 'ยืนยันการสั่งซื้อสินค้า'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
