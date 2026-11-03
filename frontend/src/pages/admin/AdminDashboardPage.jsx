import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign, ShoppingBag, Package, AlertTriangle,
  Users, CheckCircle2, ArrowRight, TrendingUp
} from 'lucide-react';
import client from '../../api/client';
import Sidebar from '../../components/Sidebar';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/dashboard/stats/')
      .then(res => setStats(res.data))
      .catch(err => console.error("Error fetching stats:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar role="admin" />

      <main className="dashboard-content">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 700, color: '#0f172a' }}>
            แดชบอร์ดภาพรวมระบบ (Admin Dashboard)
          </h1>
          <p style={{ color: '#64748b' }}>
            ติดตามยอดขาย สถานะคำสั่งซื้อ และสต็อกสินค้าไอทีแบบเรียลไทม์
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            กำลังโหลดข้อมูลสถิติ...
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
                  <DollarSign size={24} />
                </div>
                <div>
                  <div className="stat-value">
                    ฿{parseFloat(stats?.total_revenue || 0).toLocaleString()}
                  </div>
                  <div className="stat-label">ยอดขายรวมทั้งหมด</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <div className="stat-value">{stats?.total_orders || 0}</div>
                  <div className="stat-label">คำสั่งซื้อทั้งหมด</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
                  <Package size={24} />
                </div>
                <div>
                  <div className="stat-value">{stats?.total_products || 0}</div>
                  <div className="stat-label">รายการสินค้าในระบบ</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#fef2f2', color: '#dc2626' }}>
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <div className="stat-value" style={{ color: stats?.low_stock_products > 0 ? '#dc2626' : '#0f172a' }}>
                    {stats?.low_stock_products || 0}
                  </div>
                  <div className="stat-label">สินค้าสต็อกต่ำ (&le; 5 ชิ้น)</div>
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Orders */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="card" style={{ padding: '1.5rem' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1rem' }}>
                  สถานะคำสั่งซื้อปัจจุบัน
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f8fafc', borderRadius: 8 }}>
                    <span style={{ color: '#d97706', fontWeight: 600 }}>รอดำเนินการ (Pending)</span>
                    <span className="badge badge-warning">{stats?.pending_orders || 0} รายการ</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f8fafc', borderRadius: 8 }}>
                    <span style={{ color: '#2563eb', fontWeight: 600 }}>ชำระเงินแล้ว (Paid)</span>
                    <span className="badge badge-primary">{stats?.paid_orders || 0} รายการ</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f8fafc', borderRadius: 8 }}>
                    <span style={{ color: '#059669', fontWeight: 600 }}>กำลังจัดส่ง (Shipped)</span>
                    <span className="badge badge-success">{stats?.shipped_orders || 0} รายการ</span>
                  </div>
                </div>
                <Link to="/admin/orders" className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: '1rem' }}>
                  ไปจัดการคำสั่งซื้อทั้งหมด <ArrowRight size={16} />
                </Link>
              </div>

              <div className="card" style={{ padding: '1.5rem' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1rem' }}>
                  ทางลัดการจัดการระบบ
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <Link to="/admin/products" className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
                    <Package size={18} /> จัดการสินค้า (เพิ่ม / แก้ไข / ลบ CRUD)
                  </Link>
                  <Link to="/admin/orders" className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
                    <ShoppingBag size={18} /> จัดการสถานะคำสั่งซื้อ & ใส่เลขพัสดุ
                  </Link>
                  <Link to="/admin/company" className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
                    <TrendingUp size={18} /> แก้ไขข้อมูลบริษัท & วิสัยทัศน์
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 600 }}>คำสั่งซื้อล่าสุด</h2>
                <Link to="/admin/orders" style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 600 }}>
                  ดูทั้งหมด &rarr;
                </Link>
              </div>

              {stats?.recent_orders?.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  ยังไม่มีคำสั่งซื้อล่าสุด
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>เลขที่</th>
                        <th>ลูกค้า</th>
                        <th>ยอดรวม</th>
                        <th>สถานะ</th>
                        <th>เวลา</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats?.recent_orders?.map(o => (
                        <tr key={o.id}>
                          <td><strong>#{o.id}</strong></td>
                          <td>{o.customer_name}</td>
                          <td style={{ fontWeight: 600, color: '#1e3a8a' }}>฿{parseFloat(o.total_amount).toLocaleString()}</td>
                          <td><span className="badge badge-primary">{o.status}</span></td>
                          <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{new Date(o.created_at).toLocaleString('th-TH')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboardPage;
