import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, Building2,
  Image as ImageIcon, ArrowLeft, Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside style={{
      width: 220,
      background: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      padding: '1.25rem 0.85rem',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      minHeight: 'calc(100vh - 52px)'
    }}>
      <div style={{ marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: 2 }}>
          <Shield size={16} color="#2563eb" />
          <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#0f172a' }}>ADMIN CONTROL</span>
        </div>
        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
          ผู้ดูแล: <strong style={{ color: '#1e293b' }}>{user?.username || 'admin'}</strong>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
        <NavLink
          to="/admin"
          end
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={17} />
          <span>ภาพรวมระบบ</span>
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
        >
          <Package size={17} />
          <span>จัดการสินค้า (CRUD)</span>
        </NavLink>

        <NavLink
          to="/admin/banners"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
        >
          <ImageIcon size={17} />
          <span>จัดการแบนเนอร์</span>
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
        >
          <ShoppingBag size={17} />
          <span>จัดการคำสั่งซื้อ</span>
        </NavLink>

        <NavLink
          to="/admin/company"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
        >
          <Building2 size={17} />
          <span>ข้อมูลร้านค้า</span>
        </NavLink>

        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
          <NavLink
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.75rem',
              borderRadius: 8,
              fontSize: '0.8rem',
              color: '#64748b',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={16} /> กลับสู่หน้าร้านค้า
          </NavLink>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
