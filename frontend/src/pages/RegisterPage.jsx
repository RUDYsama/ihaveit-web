import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneDigits, setPhoneDigits] = useState(['', '', '', '', '', '', '', '', '', '']);
  const phoneRefs = useRef([]);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const phonePlaceholders = ['0', '8', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'];

  // Handle individual phone digit changes & paste
  const handlePhoneChange = (index, value) => {
    // If user pastes multiple characters
    if (value.length > 1) {
      const cleanDigits = value.replace(/\D/g, '').slice(0, 10);
      const newDigits = [...phoneDigits];
      for (let i = 0; i < 10; i++) {
        newDigits[i] = cleanDigits[i] || '';
      }
      setPhoneDigits(newDigits);
      const focusTarget = Math.min(cleanDigits.length, 9);
      phoneRefs.current[focusTarget]?.focus();
      return;
    }

    const char = value.replace(/\D/g, '');
    const newDigits = [...phoneDigits];
    newDigits[index] = char;
    setPhoneDigits(newDigits);

    if (char && index < 9) {
      phoneRefs.current[index + 1]?.focus();
    }
  };

  const handlePhoneKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !phoneDigits[index] && index > 0) {
      phoneRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }
    if (password.length < 6) {
      setError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }

    const fullPhone = phoneDigits.join('');

    setLoading(true);
    try {
      const res = await register({
        username: username.trim(),
        email: email.trim(),
        password: password,
        phone: fullPhone,
        role: 'member'
      });

      navigate('/verify-otp', {
        state: {
          email: email,
          message: res.message,
          dev_otp: res.dev_otp
        }
      });
    } catch (err) {
      console.error(err);
      const resErrors = err.response?.data;
      if (typeof resErrors === 'object') {
        const firstErrKey = Object.keys(resErrors)[0];
        const val = resErrors[firstErrKey];
        setError(`${firstErrKey}: ${Array.isArray(val) ? val.join(', ') : val}`);
      } else {
        setError('เกิดข้อผิดพลาดในการลงทะเบียน โปรดลองอีกครั้ง');
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
              เริ่มต้นเปิดบัญชีสมาชิก IHAVEIT
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.5, maxWidth: 420 }}>
              สมัครสมาชิกเพื่อรับสิทธิประโยชน์ สั่งซื้อสินค้า ตรวจสอบสถานะการจัดส่ง และรับประกันสินค้าของแท้
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Form Container (Fits 100vh with Zero Scroll) */}
      <div style={{
        flex: '1 1 55%',
        height: '100vh',
        padding: '1.5rem 3.5rem',
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
          marginBottom: '1rem'
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
          marginBottom: '1.25rem'
        }}>
          <button
            type="button"
            onClick={() => navigate('/login')}
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
            <span>เข้าสู่ระบบ</span>
          </button>

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
            <span>สมัครสมาชิก</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger" style={{ padding: '0.65rem 1rem', fontSize: '0.85rem', marginBottom: '0.85rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Register Form */}
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          color: '#0f172a',
          marginBottom: '0.2rem',
          fontFamily: "'Prompt', sans-serif"
        }}>
          สมัครสมาชิก
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem' }}>
          สร้างบัญชีผู้ใช้ใหม่สำหรับระบบร้านค้าและบริการฮาร์ดแวร์ไอที
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label className="form-label" style={{ fontWeight: 600, color: '#334155', fontSize: '0.85rem', marginBottom: 3 }}>
              ชื่อผู้ใช้ (USERNAME)
            </label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="เช่น somchai_it"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                padding: '0.65rem 0.85rem',
                borderRadius: 8,
                borderColor: '#cbd5e1',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label className="form-label" style={{ fontWeight: 600, color: '#334155', fontSize: '0.85rem', marginBottom: 3 }}>
              อีเมล (EMAIL)
            </label>
            <input
              type="email"
              required
              className="form-input"
              placeholder="name@institution.ac.th"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                padding: '0.65rem 0.85rem',
                borderRadius: 8,
                borderColor: '#cbd5e1',
                fontSize: '0.9rem'
              }}
            />
          </div>

          {/* 10 Separate Boxes for Phone Number */}
          <div className="form-group" style={{ marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
              <label className="form-label" style={{ fontWeight: 600, color: '#334155', margin: 0, fontSize: '0.85rem' }}>
                เบอร์โทรศัพท์
              </label>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>10 หลัก</span>
            </div>
            
            <div style={{
              display: 'flex',
              gap: '6px',
              justifyContent: 'space-between',
              width: '100%'
            }}>
              {phoneDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (phoneRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  placeholder={phonePlaceholders[idx]}
                  value={digit}
                  onChange={(e) => handlePhoneChange(idx, e.target.value)}
                  onKeyDown={(e) => handlePhoneKeyDown(idx, e)}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    height: 42,
                    textAlign: 'center',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#1e293b',
                    border: '1px solid #cbd5e1',
                    borderRadius: 10,
                    background: '#ffffff',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#2563eb';
                    e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#cbd5e1';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, color: '#334155', fontSize: '0.85rem', marginBottom: 3 }}>
                รหัสผ่าน
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  className="form-input"
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    padding: '0.65rem 2.2rem 0.65rem 0.8rem',
                    borderRadius: 8,
                    borderColor: '#cbd5e1',
                    fontSize: '0.85rem'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 2
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, color: '#334155', fontSize: '0.85rem', marginBottom: 3 }}>
                ยืนยันรหัสผ่าน
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  className="form-input"
                  placeholder="กรอกรหัสผ่านซ้ำอีกครั้ง"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    padding: '0.65rem 2.2rem 0.65rem 0.8rem',
                    borderRadius: 8,
                    borderColor: '#cbd5e1',
                    fontSize: '0.85rem'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 2
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.8rem',
              fontSize: '0.95rem',
              borderRadius: 10,
              boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
            }}
          >
            {loading ? 'กำลังลงทะเบียนและส่ง OTP...' : 'สมัครสมาชิก'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
          มีบัญชีอยู่แล้ว?{' '}
          <Link to="/login" style={{ color: '#2563eb', fontWeight: 600 }}>
            เข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
