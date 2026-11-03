import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle2, Truck, AlertCircle, ArrowRight } from 'lucide-react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

const OrdersPage = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      client.get('/orders/')
        .then(res => setOrders(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="badge badge-warning"><Clock size={12} style={{ marginRight: 4 }} /> รอดำเนินการ / ชำระเงิน</span>;
      case 'Paid':
        return <span className="badge badge-primary"><CheckCircle2 size={12} style={{ marginRight: 4 }} /> ชำระเงินแล้ว</span>;
      case 'Shipped':
        return <span className="badge" style={{ background: '#e0e7ff', color: '#4338ca' }}><Truck size={12} style={{ marginRight: 4 }} /> กำลังจัดส่ง</span>;
      case 'Delivered':
        return <span className="badge badge-success"><CheckCircle2 size={12} style={{ marginRight: 4 }} /> จัดส่งสำเร็จ</span>;
      default:
        return <span className="badge badge-danger">{status}</span>;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="page-wrapper" style={{ maxWidth: 500, margin: '4rem auto', textAlign: 'center' }}>
        <div className="card" style={{ padding: '3rem' }}>
          <Package size={52} style={{ color: '#94a3b8', margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>กรุณาเข้าสู่ระบบ</h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>เข้าสู่ระบบเพื่อดูประวัติการสั่งซื้อของคุณ</p>
          <Link to="/login" className="btn btn-primary">เข้าสู่ระบบ</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 700, color: '#0f172a' }}>
          ประวัติคำสั่งซื้อของฉัน
        </h1>
        <p style={{ color: '#64748b' }}>
          ตรวจสอบสถานะคำสั่งซื้อ การจัดส่ง และหมายเลขติดตามพัสดุ
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
          กำลังโหลดประวัติคำสั่งซื้อ...
        </div>
      ) : orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
          <Package size={56} style={{ color: '#cbd5e1', margin: '0 auto 1.5rem' }} />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            คุณยังไม่มีประวัติการสั่งซื้อ
          </h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
            เริ่มต้นเลือกซื้อสินค้าไอทีที่ต้องการได้ที่ร้านค้าของเรา
          </p>
          <Link to="/products" className="btn btn-primary">
            ดูสินค้าไอทีทั้งหมด <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => (
            <div key={order.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid #e2e8f0',
                marginBottom: '1rem'
              }}>
                <div>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginRight: '0.75rem' }}>
                    คำสั่งซื้อ #{order.id}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    สั่งซื้อเมื่อ: {new Date(order.created_at).toLocaleString('th-TH')}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {getStatusBadge(order.status)}
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1d4ed8' }}>
                    ฿{parseFloat(order.total_amount).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: '#f8fafc',
                      padding: '0.75rem 1rem',
                      borderRadius: 8
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>{item.product_name}</span>
                      <span style={{ color: '#64748b', fontSize: '0.85rem', marginLeft: 8 }}>x {item.quantity}</span>
                    </div>
                    <div style={{ fontWeight: 600, color: '#334155' }}>
                      ฿{parseFloat(item.subtotal).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping & Tracking details */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                fontSize: '0.875rem',
                color: '#64748b',
                paddingTop: '0.75rem',
                borderTop: '1px dashed #e2e8f0'
              }}>
                <div>
                  <strong>ที่อยู่จัดส่ง:</strong> {order.shipping_address} ({order.customer_phone})
                </div>
                <div>
                  <strong>เลขพัสดุ (Tracking):</strong>{' '}
                  <span style={{ color: order.tracking_number ? '#2563eb' : '#94a3b8', fontWeight: 600 }}>
                    {order.tracking_number || 'กำลังจัดเตรียมพัสดุ'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
