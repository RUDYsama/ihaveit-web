import React, { useEffect, useState } from 'react';
import {
  Image as ImageIcon, Plus, Edit2, Trash2, CheckCircle2,
  XCircle, ArrowLeft, RefreshCw, Eye, Sparkles, ExternalLink
} from 'lucide-react';
import client from '../../api/client';
import Sidebar from '../../components/Sidebar';

const PRESET_IMAGES = [
  { label: '0% ผ่อน 48 เดือน (บัตรเครดิต 3D)', url: '/banners/banner_installment.jpg' },
  { label: 'RTX 40 SUPER (การ์ดจอเลเซอร์เขียว)', url: '/banners/banner_rtx40.jpg' },
  { label: 'Ryzen 7 9800X3D (ชิปส้มเพลิง 3D Cache)', url: '/banners/banner_ryzen.jpg' },
  { label: 'Custom Watercooling PC (ชุดน้ำพาโนรามา)', url: '/banners/banner_custompc.jpg' }
];

const PRESET_GRADIENTS = [
  { label: 'Royal Blue (น้ำเงินคราม)', val: 'linear-gradient(135deg, #0f2b6b 0%, #1d4ed8 45%, #0284c7 80%, #0369a1 100%)' },
  { label: 'Emerald Cyber (เขียวมรกตนีออน)', val: 'linear-gradient(135deg, #05140d 0%, #064e3b 50%, #047857 80%, #065f46 100%)' },
  { label: 'Magma Crimson (แดงส้มเพลิง)', val: 'linear-gradient(135deg, #1f0808 0%, #7f1d1d 50%, #991b1b 80%, #c2410c 100%)' },
  { label: 'Midnight Sapphire (ม่วงน้ำเงินเข้ม)', val: 'linear-gradient(135deg, #090c1f 0%, #1e1b4b 45%, #1d4ed8 85%, #4338ca 100%)' }
];

const AdminBannersPage = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  const [formData, setFormData] = useState({
    title_main: '',
    title_sub: '',
    tag: '',
    description: '',
    image_url: '/banners/banner_installment.jpg',
    link: '/products',
    btn_text: 'ดูโปรโมชั่น',
    bg_gradient: PRESET_GRADIENTS[0].val,
    is_active: true,
    order: 0
  });

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await client.get('/banners/?all=true');
      setBanners(res.data);
    } catch (err) {
      console.error("Error fetching banners:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setFormData({
      title_main: '',
      title_sub: '',
      tag: '',
      description: '',
      image_url: '/banners/banner_installment.jpg',
      link: '/products',
      btn_text: 'เลือกดูสินค้า',
      bg_gradient: PRESET_GRADIENTS[0].val,
      is_active: true,
      order: banners.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b) => {
    setEditingBanner(b);
    setFormData({
      title_main: b.title_main,
      title_sub: b.title_sub || '',
      tag: b.tag || '',
      description: b.description || '',
      image_url: b.image_url || '',
      link: b.link || '/products',
      btn_text: b.btn_text || 'ดูรายละเอียด',
      bg_gradient: b.bg_gradient || PRESET_GRADIENTS[0].val,
      is_active: b.is_active,
      order: b.order
    });
    setIsModalOpen(true);
  };

  const handleToggleActive = async (b) => {
    try {
      await client.put(`/banners/${b.id}/`, { is_active: !b.is_active });
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert('ไม่สามารถเปลี่ยนสถานะได้');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('คุณต้องการลบแบนเนอร์นี้ใช่หรือไม่?')) return;
    try {
      await client.delete(`/banners/${id}/`);
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการลบแบนเนอร์');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBanner) {
        await client.put(`/banners/${editingBanner.id}/`, formData);
      } else {
        await client.post('/banners/', formData);
      }
      setIsModalOpen(false);
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการบันทึกแบนเนอร์');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 52px)', background: '#f8fafc' }}>
      <Sidebar />

      <main style={{ flex: 1, padding: '1.5rem 2rem', overflowX: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              จัดการแบนเนอร์โปรโมชั่น (Banners Management)
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.825rem', marginTop: 2, margin: 0 }}>
              เพิ่ม ลบ แก้ไข ลำดับ และเปิด/ปิดสไลด์แบนเนอร์หน้าแรกของ IHAVEIT
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={fetchBanners}
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
            >
              <RefreshCw size={14} /> รีเฟรช
            </button>
            <button
              onClick={handleOpenAdd}
              className="btn btn-primary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.4rem 0.85rem', fontSize: '0.825rem' }}
            >
              <Plus size={15} /> + เพิ่มแบนเนอร์ใหม่
            </button>
          </div>
        </div>

        {/* Banners Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid #e2e8f0', borderRadius: 12 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.825rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '0.65rem 1rem', width: 60, textAlign: 'center' }}>ลำดับ</th>
                <th style={{ padding: '0.65rem 1rem', width: 140 }}>รูปภาพ</th>
                <th style={{ padding: '0.65rem 1rem' }}>หัวข้อแคมเปญ</th>
                <th style={{ padding: '0.65rem 1rem', width: 150 }}>แท็ก & ลิงก์</th>
                <th style={{ padding: '0.65rem 1rem', width: 100, textAlign: 'center' }}>สถานะ</th>
                <th style={{ padding: '0.65rem 1rem', width: 120, textAlign: 'center' }}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: '#64748b' }}>
                    กำลังโหลดข้อมูลแบนเนอร์...
                  </td>
                </tr>
              ) : banners.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: '#64748b' }}>
                    ยังไม่มีแบนเนอร์ในระบบ
                  </td>
                </tr>
              ) : (
                banners.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.65rem 1rem', textAlign: 'center', fontWeight: 700, color: '#64748b' }}>
                      #{b.order || b.id}
                    </td>

                    <td style={{ padding: '0.65rem 1rem' }}>
                      <div style={{
                        width: 120,
                        height: 58,
                        borderRadius: 8,
                        overflow: 'hidden',
                        background: b.bg_gradient || '#0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #cbd5e1'
                      }}>
                        {b.image_url ? (
                          <img
                            src={b.image_url}
                            alt={b.title_main}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <ImageIcon size={20} color="#94a3b8" />
                        )}
                      </div>
                    </td>

                    <td style={{ padding: '0.65rem 1rem' }}>
                      <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>
                        {b.title_main} <span style={{ color: '#2563eb', fontWeight: 600 }}>{b.title_sub}</span>
                      </div>
                      <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: 2, maxWidth: 360, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {b.description}
                      </div>
                    </td>

                    <td style={{ padding: '0.65rem 1rem' }}>
                      {b.tag && (
                        <span style={{
                          background: '#eff6ff',
                          color: '#1d4ed8',
                          padding: '2px 6px',
                          borderRadius: 4,
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          display: 'inline-block',
                          marginBottom: 3
                        }}>
                          {b.tag}
                        </span>
                      )}
                      <div style={{ color: '#64748b', fontSize: '0.72rem' }}>
                        {b.link}
                      </div>
                    </td>

                    <td style={{ padding: '0.65rem 1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleToggleActive(b)}
                        style={{
                          background: b.is_active ? '#dcfce7' : '#fee2e2',
                          color: b.is_active ? '#15803d' : '#b91c1c',
                          padding: '3px 8px',
                          borderRadius: 20,
                          border: 'none',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                        title="คลิกเพื่อเปิด/ปิดการแสดงผล"
                      >
                        {b.is_active ? '● กำลังแสดง' : '○ ปิดการแสดง'}
                      </button>
                    </td>

                    <td style={{ padding: '0.65rem 1rem', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: 5 }}>
                        <button
                          onClick={() => handleOpenEdit(b)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          title="แก้ไขแบนเนอร์"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
                          style={{
                            background: '#fee2e2',
                            color: '#b91c1c',
                            border: 'none',
                            padding: '0.25rem 0.5rem',
                            borderRadius: 6,
                            cursor: 'pointer'
                          }}
                          title="ลบแบนเนอร์"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Add/Edit Banner */}
        {isModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}>
            <div className="card" style={{ maxWidth: 580, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem', borderRadius: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {editingBanner ? 'แก้ไขข้อมูลแบนเนอร์' : 'เพิ่มแบนเนอร์ใหม่'}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 3 }}>
                      หัวข้อหลัก (Title Main)*
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น ผ่อน 0%, RTX 40 SUPER"
                      value={formData.title_main}
                      onChange={(e) => setFormData({ ...formData, title_main: e.target.value })}
                      className="form-input"
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 3 }}>
                      หัวข้อย่อย (Title Sub)
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น นานสูงสุด 48 เดือน"
                      value={formData.title_sub}
                      onChange={(e) => setFormData({ ...formData, title_sub: e.target.value })}
                      className="form-input"
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 3 }}>
                    แท็กแคมเปญ (Tag Badge)
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น IHAVEIT EASY PAY x บัตรเครดิต"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    className="form-input"
                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 3 }}>
                    รายละเอียดโปรโมชั่น
                  </label>
                  <textarea
                    rows={2}
                    placeholder="ข้อความโปรโมชั่นที่จะแสดงใต้หัวข้อ..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="form-input"
                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 3 }}>
                    ลิงก์รูปภาพกราฟิก (Image URL)*
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="/banners/banner_installment.jpg หรือ URL รูปภาพ"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="form-input"
                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                  />
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 4 }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>เลือกรูป Preset:</span>
                    {PRESET_IMAGES.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, image_url: p.url })}
                        style={{
                          background: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          borderRadius: 4,
                          padding: '1px 6px',
                          fontSize: '0.68rem',
                          cursor: 'pointer'
                        }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 3 }}>
                      ลิงก์ปลายทาง (Link)
                    </label>
                    <input
                      type="text"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      className="form-input"
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 3 }}>
                      ข้อความบนปุ่ม (Button Text)
                    </label>
                    <input
                      type="text"
                      value={formData.btn_text}
                      onChange={(e) => setFormData({ ...formData, btn_text: e.target.value })}
                      className="form-input"
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 3 }}>
                    สีพื้นหลัง Gradient
                  </label>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                    {PRESET_GRADIENTS.map((g, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, bg_gradient: g.val })}
                        style={{
                          padding: '3px 8px',
                          borderRadius: 6,
                          background: g.val,
                          color: '#ffffff',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          border: formData.bg_gradient === g.val ? '2px solid #ffffff' : 'none',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                          cursor: 'pointer'
                        }}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={formData.bg_gradient}
                    onChange={(e) => setFormData({ ...formData, bg_gradient: e.target.value })}
                    className="form-input"
                    style={{ padding: '0.45rem 0.75rem', fontSize: '0.78rem' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: 4 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                    เปิดแสดงผลบนหน้าแรก (Active)
                  </label>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>ลำดับแสดงผล:</span>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      style={{ width: 60, padding: '3px 6px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-outline btn-sm"
                    style={{ padding: '0.45rem 1rem' }}
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    style={{ padding: '0.45rem 1.25rem', fontWeight: 700 }}
                  >
                    บันทึกแบนเนอร์
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminBannersPage;
