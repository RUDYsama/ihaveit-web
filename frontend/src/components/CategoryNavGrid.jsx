import React from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Tv,
  Layers,
  HardDrive,
  Zap,
  Monitor,
  Fan,
  Gamepad2,
  Box,
  Flame
} from 'lucide-react';

const categories = [
  {
    id: 7,
    name: 'ซีพียู (CPU)',
    icon: Cpu,
    color: '#2563eb',
    bgColor: '#eff6ff',
    badge: 'AMD / Intel'
  },
  {
    id: 8,
    name: 'การ์ดจอ (GPU)',
    icon: Tv,
    color: '#059669',
    bgColor: '#ecfdf5',
    badge: 'RTX 40 / RX 7000'
  },
  {
    id: 9,
    name: 'เมนบอร์ด (MB)',
    icon: Layers,
    color: '#7c3aed',
    bgColor: '#f5f3ff',
    badge: 'Z890 / X870'
  },
  {
    id: 10,
    name: 'แรม (RAM DDR5)',
    icon: Layers,
    color: '#d97706',
    bgColor: '#fffbeb',
    badge: '6000-8000MHz'
  },
  {
    id: 13,
    name: 'เอสเอสดี (M.2 NVMe)',
    icon: HardDrive,
    color: '#0284c7',
    bgColor: '#f0f9ff',
    badge: 'Gen4 / Gen5'
  },
  {
    id: 11,
    name: 'พาวเวอร์ (PSU)',
    icon: Zap,
    color: '#e11d48',
    bgColor: '#fff1f2',
    badge: 'Gold / Platinum'
  },
  {
    id: 14,
    name: 'เคส & ชุดน้ำ',
    icon: Fan,
    color: '#0891b2',
    bgColor: '#ecfeff',
    badge: 'ARGB / AIO'
  },
  {
    id: 12,
    name: 'จอมอนิเตอร์',
    icon: Monitor,
    color: '#4f46e5',
    bgColor: '#eef2ff',
    badge: 'OLED / 240Hz'
  },
  {
    id: 15,
    name: 'เกมมิ่งเกียร์',
    icon: Gamepad2,
    color: '#c026d3',
    bgColor: '#fdf4ff',
    badge: 'Wireless / Pro'
  },
  {
    id: 0,
    name: 'โปรเด็ดประจำวัน',
    icon: Flame,
    color: '#dc2626',
    bgColor: '#fef2f2',
    badge: 'Flash Sale'
  }
];

const CategoryNavGrid = () => {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 4,
            height: 22,
            background: 'linear-gradient(to bottom, #2563eb, #38bdf8)',
            borderRadius: 2
          }} />
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#0f172a',
            margin: 0,
            letterSpacing: '-0.3px'
          }}>
            หมวดหมู่อุปกรณ์ไอทียอดนิยม
          </h3>
        </div>
        <Link
          to="/products"
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#2563eb',
            textDecoration: 'none'
          }}
        >
          หมวดหมู่ทั้งหมด ➔
        </Link>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))',
        gap: '0.75rem'
      }}>
        {categories.map((cat) => {
          const IconComp = cat.icon;
          const targetUrl = cat.id === 0 ? '/products' : `/products?category=${cat.id}`;

          return (
            <Link
              key={cat.id}
              to={targetUrl}
              style={{
                textDecoration: 'none',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 14,
                padding: '0.9rem 0.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.08)';
                e.currentTarget.style.borderColor = cat.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: cat.bgColor,
                  color: cat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.5rem',
                  transition: 'transform 0.2s ease'
                }}
              >
                <IconComp size={24} />
              </div>

              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#1e293b',
                  lineHeight: 1.25,
                  minHeight: '2.5em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {cat.name}
              </span>

              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  color: cat.color,
                  marginTop: 2
                }}
              >
                {cat.badge}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryNavGrid;
