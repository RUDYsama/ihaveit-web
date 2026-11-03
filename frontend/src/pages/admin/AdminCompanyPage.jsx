import React, { useEffect, useState } from 'react';
import { Building2, Save, Check, AlertCircle } from 'lucide-react';
import client from '../../api/client';
import Sidebar from '../../components/Sidebar';

const AdminCompanyPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    about: '',
    vision: '',
    mission: '',
    email: '',
    phone: '',
    address: '',
    business_hours: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    client.get('/company-info/')
      .then(res => setFormData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    try {
      const res = await client.put('/company-info/', formData);
      setFormData(res.data);
      setSuccessMsg('บันทึกข้อมูลบริษัทสำเร็จเรียบร้อย');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role="admin" />

      <main className="dashboard-content">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 700, color: '#0f172a' }}>
            แก้ไขข้อมูลบริษัทและวิสัยทัศน์ (Company Profile)
          </h1>
          <p style={{ color: '#64748b' }}>
            ข้อมูลในส่วนนี้จะถูกนำไปแสดงผลบนหน้า Home Page และ Footer ของเว็บไซต์
          </p>
        </div>

        {successMsg && (
          <div className="alert alert-success">
            <Check size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            กำลังโหลดข้อมูลบริษัท...
          </div>
        ) : (
          <div className="card" style={{ maxWidth: 800, padding: '2rem' }}>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">ชื่อบริษัท / ร้านค้าไอที *</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="form-input"
                  value={formData.name || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">สโลแกน / Tagline</label>
                <input
                  type="text"
                  name="tagline"
                  className="form-input"
                  value={formData.tagline || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">เกี่ยวกับบริษัท (About Us)</label>
                <textarea
                  name="about"
                  rows={3}
                  className="form-textarea"
                  value={formData.about || ''}
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">วิสัยทัศน์ (Vision)</label>
                  <textarea
                    name="vision"
                    rows={3}
                    className="form-textarea"
                    value={formData.vision || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">พันธกิจ (Mission)</label>
                  <textarea
                    name="mission"
                    rows={3}
                    className="form-textarea"
                    value={formData.mission || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">อีเมลติดต่อ</label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    value={formData.email || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">เบอร์โทรศัพท์ติดต่อ</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-input"
                    value={formData.phone || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">ที่อยู่สำนักงาน / ร้าน</label>
                <textarea
                  name="address"
                  rows={2}
                  className="form-textarea"
                  value={formData.address || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">เวลาทำการ</label>
                <input
                  type="text"
                  name="business_hours"
                  className="form-input"
                  value={formData.business_hours || ''}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '1rem' }}
              >
                <Save size={18} /> {saving ? 'กำลังบันทึก...' : 'บันทึกการแก้ไขข้อมูลบริษัท'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminCompanyPage;
