import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const infoMsg = location.state?.info || '';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await login(username, password);
      if (userData.is_staff || userData.profile?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/products');
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.requires_verification) {
        navigate('/verify-otp', {
          state: {
            email: err.response.data.email,
            info: err.response.data.error,
            dev_otp: err.response.data.dev_otp
          }
        });
      } else {
        setError(err.response?.data?.error || 'เข้าสู่ระบบไม่สำเร็จ โปรดตรวจสอบชื่อผู้ใช้และรหัสผ่าน');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: '100vh',
      maxHeight: '100vh',
      width: '100vw',
      display: 'flex',
      background: '#ffffff',
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    }}>
      {/* Left Side: Real IT Hardware / Custom Gaming PC Image */}
      <div style={{
        flex: '1 1 45%',
        maxWidth: '48%',
        height: '100vh',
        position: 'relative',
        background: '#0b1329',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }} className="auth-left-banner">
        <img
          src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80"
          alt="IHAVEIT PC Hardware"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(11,19,41,0.88) 0%, rgba(11,19,41,0.25) 50%, rgba(11,19,41,0.75) 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '2.5rem'
        }}>
          <div>
            <span style={{
              color: '#ffffff',
              fontSize: '2.2rem',
              fontWeight: 900,
              fontStyle: 'italic',
              letterSpacing: '-1px'
            }}>
              IHAVE<span style={{ color: '#38bdf8' }}>IT</span>
            </span>
            <div style={{ color: '#93c5fd', fontSize: '0.9rem', marginTop: 2, fontWeight: 500 }}>
              The Ultimate PC Hardware & Gaming Solutions
            </div>
          </div>

          <div>
            <h2 style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              ศูนย์รวมอุปกรณ์คอมพิวเตอร์ระดับพรีเมียม
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.5, maxWidth: 420 }}>
              ประกอบคอมพิวเตอร์ การ์ดจอ ซีพียู เมนบอร์ด แรม และอุปกรณ์เกมมิ่งเกียร์ของแท้ประกันศูนย์ 100%
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Form Container (Fits 100vh without any scrolling) */}
      <div style={{
        flex: '1 1 55%',
        height: '100vh',
        padding: '2rem 3.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        maxWidth: 580,
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>
        {/* Top Header Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: '#475569',
              fontSize: '0.9rem',
              fontWeight: 500,
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={16} />
            <span>กลับหน้าหลัก</span>
          </Link>
        </div>

        {/* Tab Switcher */}
        <div style={{
          background: '#f1f5f9',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: 4,
          display: 'flex',
          gap: 6,
          marginBottom: '1.75rem'
        }}>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              background: '#2563eb',
              color: '#ffffff',
              boxShadow: '0 3px 8px rgba(37,99,235,0.25)',
              cursor: 'default'
            }}
          >
            <span>เข้าสู่ระบบ</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/register')}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              background: 'transparent',
              color: '#64748b',
              cursor: 'pointer'
            }}
          >
            <span>สมัครสมาชิก</span>
          </button>
        </div>

        {/* Alerts */}
        {infoMsg && (
          <div className="alert alert-info" style={{ padding: '0.65rem 1rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
            <span>{infoMsg}</span>
          </div>
        )}

        {error && (
          <div className="alert alert-danger" style={{ padding: '0.65rem 1rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <h1 style={{
          fontSize: '1.85rem',
          fontWeight: 800,
          color: '#0f172a',
          marginBottom: '1.25rem',
          fontFamily: "'Prompt', sans-serif"
        }}>
          เข้าสู่ระบบ
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.15rem' }}>
            <label className="form-label" style={{ fontWeight: 600, color: '#334155', fontSize: '0.875rem', marginBottom: 4 }}>
              ชื่อผู้ใช้ หรือ อีเมล
            </label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="กรอกชื่อผู้ใช้ หรือ อีเมล"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                padding: '0.75rem 0.9rem',
                borderRadius: 8,
                borderColor: '#cbd5e1',
                fontSize: '0.925rem'
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontWeight: 600, color: '#334155', fontSize: '0.875rem', marginBottom: 4 }}>
              รหัสผ่าน
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="form-input"
                placeholder="กรอกรหัสผ่าน"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  padding: '0.75rem 2.5rem 0.75rem 0.9rem',
                  borderRadius: 8,
                  borderColor: '#cbd5e1',
                  fontSize: '0.925rem'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  padding: 2
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{
              width: '100%',
              padding: '0.85rem',
              fontSize: '1rem',
              borderRadius: 10,
              boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
            }}
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.9rem', color: '#64748b' }}>
          ยังไม่มีบัญชีผู้ใช้?{' '}
          <Link to="/register" style={{ color: '#2563eb', fontWeight: 600 }}>
            สมัครสมาชิก
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
