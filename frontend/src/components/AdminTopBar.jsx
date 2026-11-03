import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ExternalLink, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminTopBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{
      height: 52,
      background: '#0f172a',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      borderBottom: '1px solid #1e293b',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      {/* Brand & Portal Label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 900, fontStyle: 'italic', color: '#ffffff' }}>
            IHAVE<span style={{ color: '#38bdf8' }}>IT</span>
          </span>
        </Link>
        <span style={{
          background: 'rgba(56, 189, 248, 0.15)',
          color: '#38bdf8',
          fontSize: '0.72rem',
          fontWeight: 700,
          padding: '2px 8px',
          borderRadius: 4,
          border: '1px solid rgba(56, 189, 248, 0.3)',
          letterSpacing: '0.5px'
        }}>
          ADMIN CONTROL CENTER
        </span>
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            color: '#94a3b8',
            fontSize: '0.8rem',
            fontWeight: 600,
            textDecoration: 'none',
            padding: '4px 10px',
            borderRadius: 6,
            background: 'rgba(255,255,255,0.06)'
          }}
          title="เปิดหน้าร้านในแท็บใหม่"
        >
          <span>ดูหน้าร้าน</span>
          <ExternalLink size={13} />
        </Link>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '0.82rem',
          color: '#cbd5e1',
          borderLeft: '1px solid #334155',
          paddingLeft: '0.85rem'
        }}>
          <User size={15} style={{ color: '#38bdf8' }} />
          <span>{user?.username || 'admin'}</span>
          <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>(Superuser)</span>
        </div>

        <button
          onClick={handleLogout}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            background: '#ef4444',
            color: '#ffffff',
            border: 'none',
            borderRadius: 6,
            padding: '4px 10px',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
          title="ออกจากระบบ Admin"
        >
          <LogOut size={13} />
          <span>ออกจากระบบ</span>
        </button>
      </div>
    </header>
  );
};

export default AdminTopBar;
