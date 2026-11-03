import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, ShieldCheck, Award, Zap } from 'lucide-react';
import client from '../api/client';

const Footer = () => {
  const [company, setCompany] = useState(null);

  useEffect(() => {
    client.get('/company-info/')
      .then(res => setCompany(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <footer className="footer" id="contact" style={{ background: '#0b1329', color: '#cbd5e1', paddingTop: '3rem', paddingBottom: '2rem' }}>
      <div className="page-wrapper" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '2.5rem',
        marginBottom: '2.5rem'
      }}>
        {/* Company Info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <span style={{
              fontSize: '1.8rem',
              fontWeight: 900,
              fontStyle: 'italic',
              color: '#ffffff',
              letterSpacing: '-0.5px'
            }}>
              IHAVE<span style={{ color: '#38bdf8' }}>IT</span>
            </span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            {company?.about || 'ศูนย์รวมอุปกรณ์ไอที คอมพิวเตอร์ประกอบระดับไฮเอนด์ การ์ดจอ ซีพียู เมนบอร์ด แรม และเกมมิ่งเกียร์ของแท้ประกันศูนย์ไทย 100% บริการจัดสเปกคอมโดยช่างผู้เชี่ยวชาญ'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600 }}>
            <ShieldCheck size={18} /> สินค้าของแท้ประกันศูนย์ไทยทุกชิ้น ออกใบกำกับภาษีได้
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>
            บริการและลิงก์ด่วน
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', padding: 0 }}>
            <li><Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>หน้าแรก IHAVEIT</Link></li>
            <li><Link to="/products" style={{ color: '#94a3b8', textDecoration: 'none' }}>อุปกรณ์ไอทีทั้งหมด</Link></li>
            <li><Link to="/cart" style={{ color: '#94a3b8', textDecoration: 'none' }}>ตะกร้าสินค้า</Link></li>
            <li><Link to="/wishlist" style={{ color: '#94a3b8', textDecoration: 'none' }}>รายการที่ถูกใจ (Wishlist)</Link></li>
            <li><Link to="/orders" style={{ color: '#94a3b8', textDecoration: 'none' }}>เช็คสถานะการจัดส่งพัสดุ</Link></li>
            <li><Link to="/admin" style={{ color: '#94a3b8', textDecoration: 'none' }}>ระบบจัดการหลังบ้าน (Admin)</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>
            ติดต่อฝ่ายบริการลูกค้า
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <MapPin size={18} style={{ color: '#38bdf8', flexShrink: 0, marginTop: 2 }} />
              <span>{company?.address || '123/45 ถนนวิภาวดีรังสิต แขวงจตุจักร เขตจตุจักร กรุงเทพฯ'}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <Phone size={18} style={{ color: '#38bdf8', flexShrink: 0 }} />
              <span>{company?.phone || '02-999-8877'}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <Mail size={18} style={{ color: '#38bdf8', flexShrink: 0 }} />
              <span>{company?.email || 'support@ihaveit.co.th'}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <Clock size={18} style={{ color: '#38bdf8', flexShrink: 0 }} />
              <span>{company?.business_hours || 'เปิดให้บริการทุกวัน: 09:00 - 20:00 น.'}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        paddingTop: '1.5rem',
        textAlign: 'center',
        fontSize: '0.825rem',
        color: '#64748b'
      }}>
        <div className="page-wrapper">
          <p>© 2026 IHAVEIT SOLUTIONS & IT STORE. สอบวิชา Web Programming - ขับเคลื่อนด้วย Django 5 REST Framework & React 18</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
