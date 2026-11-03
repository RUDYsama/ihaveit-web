import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import client from '../api/client';
import {
  Search, Globe, ArrowLeftRight, Heart, ShoppingCart,
  User as UserIcon, LogOut, ShieldCheck, ChevronDown,
  ArrowRight
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [totalMatches, setTotalMatches] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const [currentLang, setCurrentLang] = useState('th');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Click outside to close language dropdown
  useEffect(() => {
    const handleLangOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleLangOutside);
    return () => document.removeEventListener('mousedown', handleLangOutside);
  }, []);

  // Live Auto-Suggestion Debounced Fetch
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 1) {
      setSuggestions([]);
      setTotalMatches(0);
      setIsDropdownOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const res = await client.get('/products/', { params: { search: q } });
        setSuggestions(res.data.slice(0, 5));
        setTotalMatches(res.data.length);
        setIsDropdownOpen(true);
      } catch (err) {
        console.error("Live suggestion error:", err);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close suggestion dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const handleSelectSuggestion = (productId) => {
    setIsDropdownOpen(false);
    setSearchQuery('');
    navigate(`/products/${productId}`);
  };

  const handleHeartClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', {
        state: { info: 'กรุณาเข้าสู่ระบบก่อน เพื่อดูรายการสินค้าที่ถูกใจ (Wishlist)' }
      });
    } else {
      navigate('/wishlist');
    }
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', {
        state: { info: 'กรุณาเข้าสู่ระบบก่อน เพื่อดูตะกร้าสินค้าและการสั่งซื้อ' }
      });
    } else {
      navigate('/cart');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="advice-navbar">
      <div className="advice-navbar-inner">
        {/* Brand Logo - IHAVEIT in Advice Italic Bold Style */}
        <Link to="/" className="advice-logo-link">
          <span className="advice-logo-text">
            IHAVE<span className="advice-logo-accent">IT</span>
          </span>
        </Link>

        {/* Center Search Pill with Live Suggestions */}
        <div ref={searchContainerRef} className="advice-search-form" style={{ position: 'relative' }}>
          <form onSubmit={handleSearchSubmit} className="advice-search-box">
            <input
              type="text"
              placeholder="ค้นหาสินค้า, แบรนด์, รุ่น (เช่น RTX 4080, Ryzen 7, ASUS)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim().length >= 1 && suggestions.length > 0) {
                  setIsDropdownOpen(true);
                }
              }}
              className="advice-search-input"
            />
            <button type="submit" className="advice-search-btn">
              <Search size={16} />
              <span>ค้นหา</span>
            </button>
          </form>

          {/* Floating Live Suggestion Dropdown */}
          {isDropdownOpen && suggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              background: '#ffffff',
              borderRadius: 16,
              boxShadow: '0 15px 35px rgba(0, 20, 60, 0.25)',
              border: '1px solid #e2e8f0',
              zIndex: 300,
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '0.65rem 1.25rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#64748b',
                background: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>สินค้าแนะนำที่ตรงกับคำค้นหา</span>
                <span>พบ {totalMatches} รายการ</span>
              </div>

              <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                {suggestions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectSuggestion(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      padding: '0.75rem 1.25rem',
                      borderBottom: '1px solid #f1f5f9',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
                  >
                    <img
                      src={item.image_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=100&q=80'}
                      alt={item.name}
                      style={{
                        width: 44,
                        height: 44,
                        objectFit: 'cover',
                        borderRadius: 8,
                        background: '#f8fafc',
                        flexShrink: 0
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600, textTransform: 'uppercase' }}>
                        {item.brand}
                      </div>
                      <div style={{
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: '#0f172a',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {item.name}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e3a8a' }}>
                        ฿{parseFloat(item.price).toLocaleString()}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: item.stock > 0 ? '#10b981' : '#ef4444' }}>
                        {item.stock > 0 ? 'มีสินค้า' : 'หมด'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* View all matches footer */}
              <div
                onClick={handleSearchSubmit}
                style={{
                  padding: '0.75rem 1.25rem',
                  background: '#f8fafc',
                  textAlign: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#2563eb',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#eff6ff')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#f8fafc')}
              >
                <span>ดูผลการค้นหาทั้งหมด ({totalMatches} รายการ)</span>
                <ArrowRight size={15} />
              </div>
            </div>
          )}
        </div>

        {/* Right Menu Icons */}
        <div className="advice-right-actions">
          {/* Language Selector Dropdown */}
          <div ref={langRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="advice-lang-badge"
              style={{ cursor: 'pointer' }}
            >
              <Globe size={16} />
              <span>{currentLang === 'th' ? 'ไทย' : 'EN'}</span>
              <ChevronDown size={14} style={{ transform: isLangOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {isLangOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                background: '#ffffff',
                borderRadius: 12,
                boxShadow: '0 8px 24px rgba(0, 20, 60, 0.2)',
                border: '1px solid #e2e8f0',
                minWidth: 140,
                overflow: 'hidden',
                zIndex: 400
              }}>
                <button
                  type="button"
                  onClick={() => { setCurrentLang('th'); setIsLangOpen(false); }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.875rem',
                    color: currentLang === 'th' ? '#1d4ed8' : '#334155',
                    background: currentLang === 'th' ? '#eff6ff' : 'transparent',
                    fontWeight: currentLang === 'th' ? 700 : 500,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <span>🇹🇭 ภาษาไทย</span>
                  {currentLang === 'th' && <span>✓</span>}
                </button>
                <button
                  type="button"
                  onClick={() => { setCurrentLang('en'); setIsLangOpen(false); }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.875rem',
                    color: currentLang === 'en' ? '#1d4ed8' : '#334155',
                    background: currentLang === 'en' ? '#eff6ff' : 'transparent',
                    fontWeight: currentLang === 'en' ? 700 : 500,
                    border: 'none',
                    cursor: 'pointer',
                    borderTop: '1px solid #f1f5f9'
                  }}
                >
                  <span>🇬🇧 English</span>
                  {currentLang === 'en' && <span>✓</span>}
                </button>
              </div>
            )}
          </div>

          {/* Compare Icon */}
          <button
            type="button"
            className="advice-icon-circle"
            title="เปรียบเทียบสินค้า"
            onClick={() => navigate('/products')}
          >
            <ArrowLeftRight size={17} />
          </button>

          {/* Wishlist Heart Icon */}
          <button
            type="button"
            onClick={handleHeartClick}
            className="advice-icon-circle"
            title="รายการที่ถูกใจ (Wishlist)"
          >
            <Heart size={18} fill={wishlistCount > 0 ? '#ef4444' : 'none'} color={wishlistCount > 0 ? '#ef4444' : '#ffffff'} />
            {wishlistCount > 0 && (
              <span className="advice-icon-badge">{wishlistCount}</span>
            )}
          </button>

          {/* Cart Icon */}
          <button
            type="button"
            onClick={handleCartClick}
            className="advice-icon-circle"
            title="ตะกร้าสินค้า"
          >
            <ShoppingCart size={18} />
            {totalItems > 0 && (
              <span className="advice-icon-badge">{totalItems}</span>
            )}
          </button>

          {/* Divider */}
          <div className="advice-vertical-divider" />

          {/* Login / User Status */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="advice-auth-pill"
                  style={{ background: '#f59e0b', borderColor: '#d97706', color: '#ffffff' }}
                  title="เข้าสู่ระบบผู้ดูแล Admin"
                >
                  <ShieldCheck size={16} />
                  <span>Admin</span>
                </Link>
              )}
              <Link to="/orders" className="advice-auth-pill">
                <UserIcon size={16} />
                <span>{user?.first_name || user?.username}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="advice-logout-btn"
                title="ออกจากระบบ"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="advice-auth-pill">
              <UserIcon size={17} />
              <span>เข้าสู่ระบบ</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
