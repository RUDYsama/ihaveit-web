import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { MailCheck, CheckCircle2, AlertCircle, RefreshCw, KeyRound, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const VerifyOtpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOtp, resendOtp } = useAuth();

  const emailFromState = location.state?.email || '';
  const devOtp = location.state?.dev_otp || '';
  const initialMsg = location.state?.message || location.state?.info || '';

  const [email, setEmail] = useState(emailFromState);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [currentDevOtp, setCurrentDevOtp] = useState(devOtp);

  const inputsRef = useRef([]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleDigitChange = (index, value) => {
    if (value.length > 1) {
      // Paste multiple digits
      const pasted = value.replace(/\D/g, '').slice(0, 6);
      const newDigits = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasted[i] || '';
      }
      setOtpDigits(newDigits);
      const nextFocus = Math.min(pasted.length, 5);
      inputsRef.current[nextFocus]?.focus();
      return;
    }

    const char = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];
    newDigits[index] = char;
    setOtpDigits(newDigits);

    if (char && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const fullOtp = otpDigits.join('');

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (fullOtp.length !== 6) {
      setError('กรุณากรอกรหัส OTP ให้ครบ 6 หลัก');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await verifyOtp(email, fullOtp);
      setSuccess('ยืนยันตัวตนสำเร็จ กำลังนำคุณเข้าสู่ระบบ...');
      setTimeout(() => {
        navigate('/products');
      }, 1500);
    } catch (err) {
      console.error("Verification error:", err);
      setError(err.response?.data?.error || 'รหัส OTP ไม่ถูกต้องหรือหมดอายุ');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || resending) return;
    setResending(true);
    setError('');
    try {
      const res = await resendOtp(email);
      setCountdown(60);
      setCanResend(false);
      if (res.dev_otp) setCurrentDevOtp(res.dev_otp);
      setSuccess('ส่งรหัส OTP ชุดใหม่ไปยังอีเมลของคุณแล้ว');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'เกิดข้อผิดพลาดในการส่งรหัสใหม่');
    } finally {
      setResending(false);
    }
  };

  const handleFillDevOtp = () => {
    if (currentDevOtp && currentDevOtp.length === 6) {
      setOtpDigits(currentDevOtp.split(''));
    }
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: 500, margin: '3rem auto' }}>
      <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: '#eff6ff',
          color: '#2563eb',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem'
        }}>
          <MailCheck size={28} />
        </div>

        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
          ยืนยันรหัส OTP ทางอีเมล
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          เราได้ส่งรหัสยืนยัน 6 หลักไปยังอีเมล<br />
          <strong style={{ color: '#0f172a' }}>{email || '(ไม่ระบุอีเมล)'}</strong>
        </p>

        {initialMsg && (
          <div className="alert alert-info" style={{ textAlign: 'left', marginBottom: '1rem' }}>
            <Info size={18} />
            <span>{initialMsg}</span>
          </div>
        )}

        {error && (
          <div className="alert alert-danger" style={{ textAlign: 'left' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success" style={{ textAlign: 'left' }}>
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
        )}

        {/* Cloud Host OTP Helper: In cloud environments (Render) where SMTP outbound ports 465/587 may be restricted */}
        {currentDevOtp && (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #86efac',
            borderRadius: 10,
            padding: '10px 14px',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            fontSize: '0.85rem',
            color: '#166534',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <KeyRound size={16} />
              <span>รหัส OTP สำรอง (Host Test): <strong style={{ fontSize: '1rem', letterSpacing: 1 }}>{currentDevOtp}</strong></span>
            </div>
            <button
              type="button"
              onClick={handleFillDevOtp}
              style={{
                background: '#16a34a',
                color: '#ffffff',
                border: 'none',
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              กรอกอัตโนมัติ
            </button>
          </div>
        )}

        {!email && (
          <div className="form-group" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            <label className="form-label">กรุณาระบุอีเมลของคุณ</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@gmail.com"
            />
          </div>
        )}

        {/* 6 Digit OTP Input Boxes */}
        <div className="otp-container">
          {otpDigits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputsRef.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="otp-box"
              autoFocus={idx === 0}
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || fullOtp.length !== 6}
          className="btn btn-primary btn-lg"
          style={{ width: '100%', marginBottom: '1rem' }}
        >
          {loading ? 'กำลังตรวจสอบรหัส...' : 'ยืนยันรหัส OTP'}
        </button>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
          <span>ไม่ได้รับรหัส OTP?</span>
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={resending}
              style={{ color: '#2563eb', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              {resending ? 'กำลังส่ง...' : 'ขอรหัสใหม่'}
            </button>
          ) : (
            <span>ขอรหัสใหม่ได้ใน ({countdown}s)</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
