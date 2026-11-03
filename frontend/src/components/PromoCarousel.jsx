import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import client from '../api/client';

const initialSlides = [
  {
    id: 1,
    tag: 'IHAVEIT EASY PAY x บัตรเครดิตชั้นนำ',
    titleMain: 'ผ่อน 0%',
    titleSub: 'นานสูงสุด 48 เดือน*',
    desc: 'ผ่อนคอมประกอบ อุปกรณ์ฮาร์ดแวร์ และเกมมิ่งเกียร์ สบายกระเป๋า รับเครดิตเงินคืนรวมสูงสุด 21%*',
    banks: ['KTC', 'CardX', 'KBank', 'SCB', 'BBL', 'FirstChoice', 'TTB', 'UOB'],
    dateInfo: '1 พ.ย. 2569 - 31 ม.ค. 2570',
    disclaimer: '*เงื่อนไขเป็นไปตามที่สถาบันการเงินและบริษัทฯ กำหนด',
    btnText: 'เช็คโปรโมชั่นผ่อน',
    link: '/products',
    image: '/banners/banner_installment.jpg',
    bg: 'linear-gradient(135deg, #0f2b6b 0%, #1d4ed8 45%, #0284c7 80%, #0369a1 100%)',
    textColor: '#ffffff',
    highlightColor: '#67e8f9',
    badgeBg: 'rgba(255, 255, 255, 0.2)',
    badgeText: '#ffffff',
    btnBg: '#ffffff',
    btnTextColor: '#1d4ed8',
    glowColor: 'rgba(56, 189, 248, 0.4)'
  },
  {
    id: 2,
    tag: 'NVIDIA GEFORCE RTX 40 SUPER SERIES',
    titleMain: 'RTX 40 SUPER',
    titleSub: 'พลัง AI เจเนอเรชันใหม่',
    desc: 'พร้อมส่งทันที ทั้ง RTX 4070 Ti Super, 4080 Super และ 4090 ซื้อวันนี้แถมฟรีโค้ดเกมฟอร์มยักษ์และเสื้อ Limited',
    features: ['DLSS 3.5 Frame Gen', 'Full Ray Tracing', 'ประกันศูนย์ไทย 3+1 ปี'],
    dateInfo: 'สต็อกพร้อมส่งทันที จัดส่งด่วน 3 ชม. กทม.',
    disclaimer: '*ของแถมมีจำนวนจำกัดตามเงื่อนไขโปรโมชั่น',
    btnText: 'เลือกดูการ์ดจอเลย',
    link: '/products?category=8',
    image: '/banners/banner_rtx40.jpg',
    bg: 'linear-gradient(135deg, #05140d 0%, #064e3b 50%, #047857 80%, #065f46 100%)',
    textColor: '#ffffff',
    highlightColor: '#4ade80',
    badgeBg: 'rgba(74, 222, 128, 0.2)',
    badgeText: '#86efac',
    btnBg: '#10b981',
    btnTextColor: '#022c22',
    glowColor: 'rgba(16, 185, 129, 0.45)'
  },
  {
    id: 3,
    tag: 'NEW ARRIVAL • THE KING OF GAMING CPUS',
    titleMain: 'Ryzen 7 9800X3D',
    titleSub: 'ซีพียูเกมมิ่งที่แรงที่สุดในโลก',
    desc: 'สถาปัตยกรรม Zen 5 แคช 104MB 2nd Gen 3D V-Cache ไม่ต้องรอพรีออเดอร์ มีสินค้าส่งทันที ประกันศูนย์แท้ 3 ปี',
    features: ['8 Cores / 16 Threads', '104MB 3D V-Cache', 'Boost Clock 5.2 GHz'],
    dateInfo: 'สินค้าเข้าใหม่ มีจำนวนจำกัดต่อวัน',
    disclaimer: '*จำกัดสิทธิ์ 1 ท่าน ต่อ 1 ชิ้นเพื่อกระจายสินค้า',
    btnText: 'สั่งซื้อ Ryzen 9800X3D',
    link: '/products/10',
    image: '/banners/banner_ryzen.jpg',
    bg: 'linear-gradient(135deg, #1f0808 0%, #7f1d1d 50%, #991b1b 80%, #c2410c 100%)',
    textColor: '#ffffff',
    highlightColor: '#fde047',
    badgeBg: 'rgba(254, 240, 138, 0.2)',
    badgeText: '#fef08a',
    btnBg: '#ea580c',
    btnTextColor: '#ffffff',
    glowColor: 'rgba(234, 88, 12, 0.45)'
  },
  {
    id: 4,
    tag: 'IHAVEIT CUSTOM WORKSHOP',
    titleMain: 'รับจัดสเปกคอม',
    titleSub: 'ชุดน้ำเปิด-ปิด เทสเสถียร 100%',
    desc: 'ช่างมืออาชีพระดับประกวด ประกอบเนี๊ยบ เก็บสายทุกมิติ ทดสอบ Burn-in ความร้อน 24 ชม. ส่งฟรีถึงหน้าบ้าน',
    features: ['ฟรีค่าแรงประกอบ', 'ส่งด่วนถึงบ้าน 3 ชม.', 'รับประกัน Onsite 1 ปี'],
    dateInfo: 'บริการจัดสเปกตามงบประมาณ ปรึกษาฟรี',
    disclaimer: '*สามารถออกใบกำกับภาษีเต็มรูปแบบได้',
    btnText: 'ปรึกษาจัดสเปกฟรี',
    link: '/products',
    image: '/banners/banner_custompc.jpg',
    bg: 'linear-gradient(135deg, #090c1f 0%, #1e1b4b 45%, #1d4ed8 85%, #4338ca 100%)',
    textColor: '#ffffff',
    highlightColor: '#93c5fd',
    badgeBg: 'rgba(147, 197, 253, 0.2)',
    badgeText: '#bfdbfe',
    btnBg: '#ffffff',
    btnTextColor: '#1e1b4b',
    glowColor: 'rgba(99, 102, 241, 0.4)'
  }
];

const PromoCarousel = () => {
  const [slides, setSlides] = useState(initialSlides);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef(null);

  // Fetch banners from API if available
  useEffect(() => {
    client.get('/banners/')
      .then(res => {
        if (res.data && res.data.length > 0) {
          const apiSlides = res.data.map(b => ({
            id: b.id,
            tag: b.tag || 'PROMOTION',
            titleMain: b.title_main,
            titleSub: b.title_sub || '',
            desc: b.description || '',
            btnText: b.btn_text || 'ดูรายละเอียด',
            link: b.link || '/products',
            image: b.image_url || '/banners/banner_installment.jpg',
            bg: b.bg_gradient || 'linear-gradient(135deg, #0f2b6b 0%, #1d4ed8 45%, #0284c7 80%)',
            textColor: '#ffffff',
            highlightColor: '#67e8f9',
            badgeBg: 'rgba(255, 255, 255, 0.2)',
            badgeText: '#ffffff',
            btnBg: '#ffffff',
            btnTextColor: '#0f172a',
            glowColor: 'rgba(56, 189, 248, 0.4)',
            dateInfo: 'โปรโมชั่นพิเศษจาก IHAVEIT',
            disclaimer: '*เงื่อนไขเป็นไปตามที่บริษัทฯ กำหนด'
          }));
          setSlides(apiSlides);
        }
      })
      .catch(() => {
        // Fallback to initialSlides on network issue
      });
  }, []);

  const total = slides.length;

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + total) % total);
  };

  useEffect(() => {
    if (!isPaused && total > 1) {
      autoPlayRef.current = setInterval(nextSlide, 5000);
    }
    return () => clearInterval(autoPlayRef.current);
  }, [isPaused, current, total]);

  const slide = slides[current] || slides[0];
  if (!slide) return null;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 12px 35px -8px rgba(0, 0, 0, 0.25)',
        marginBottom: '2rem',
        background: slide.bg,
        transition: 'background 0.5s ease-in-out',
        minHeight: 390,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxSizing: 'border-box'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Dynamic Background Cyber Accents */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 75% 40%, rgba(255,255,255,0.12) 0%, transparent 60%), radial-gradient(circle at 10% 85%, rgba(0,0,0,0.3) 0%, transparent 50%)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Main Slide Content: 2-Column Layout */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '1.25rem 3rem 0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem',
          flex: 1
        }}
      >
        {/* Left Side: Campaign Typography & Badges */}
        <div style={{ flex: '1 1 56%', maxWidth: 640 }}>
          {/* Campaign Tag Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: '0.35rem' }}>
            <span
              style={{
                background: slide.badgeBg || 'rgba(255,255,255,0.2)',
                color: slide.badgeText || '#ffffff',
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.5px',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.25)'
              }}
            >
              ✦ {slide.tag}
            </span>
          </div>

          {/* Big Typography Header */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 3.2vw, 2.8rem)',
                fontWeight: 900,
                color: slide.textColor,
                margin: 0,
                lineHeight: 1.1,
                letterSpacing: '-1px',
                textShadow: '0 2px 10px rgba(0,0,0,0.35)'
              }}
            >
              {slide.titleMain}
            </h2>
            <span
              style={{
                fontSize: 'clamp(1.1rem, 1.8vw, 1.5rem)',
                fontWeight: 700,
                color: slide.highlightColor,
                margin: 0
              }}
            >
              {slide.titleSub}
            </span>
          </div>

          {/* Subtitle / Description */}
          <p
            style={{
              fontSize: 'clamp(0.82rem, 1vw, 0.92rem)',
              color: 'rgba(255, 255, 255, 0.92)',
              maxWidth: 580,
              lineHeight: 1.4,
              marginBottom: '0.45rem'
            }}
          >
            {slide.desc}
          </p>

          {/* Features / Banks Ribbon */}
          {slide.banks && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.65rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>บัตรที่ร่วมรายการ:</span>
              {slide.banks.map((bank, i) => (
                <span
                  key={i}
                  style={{
                    background: 'rgba(255,255,255,0.95)',
                    color: '#0f172a',
                    padding: '2px 7px',
                    borderRadius: 6,
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                >
                  {bank}
                </span>
              ))}
            </div>
          )}

          {slide.features && (
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.65rem' }}>
              {slide.features.map((feat, i) => (
                <span
                  key={i}
                  style={{
                    background: 'rgba(0,0,0,0.35)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#ffffff',
                    padding: '2px 8px',
                    borderRadius: 8,
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  ✓ {feat}
                </span>
              ))}
            </div>
          )}

          {/* CTA Button - Guaranteed 100% visible */}
          <div style={{ marginTop: '0.35rem' }}>
            <Link
              to={slide.link || '/products'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: slide.btnBg || '#ffffff',
                color: slide.btnTextColor || '#0f172a',
                padding: '9px 24px',
                borderRadius: 30,
                fontSize: '0.88rem',
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: `0 4px 18px ${slide.glowColor || 'rgba(0,0,0,0.25)'}`,
                transition: 'all 0.2s ease',
                border: 'none'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 8px 24px ${slide.glowColor || 'rgba(0,0,0,0.35)'}`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 4px 18px ${slide.glowColor || 'rgba(0,0,0,0.25)'}`;
              }}
            >
              <span>{slide.btnText || 'ดูรายละเอียด'}</span>
              <span>➔</span>
            </Link>
          </div>
        </div>

        {/* Right Side: Artwork */}
        <div
          style={{
            flex: '0 0 420px',
            width: 420,
            maxWidth: 420,
            height: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
          className="promo-banner-graphic"
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: `0 8px 30px ${slide.glowColor || 'rgba(0,0,0,0.3)'}`,
              border: '2px solid rgba(255, 255, 255, 0.25)'
            }}
          >
            <img
              src={slide.image}
              alt={slide.titleMain}
              onError={(e) => {
                e.currentTarget.src = '/banners/banner_installment.jpg';
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                transition: 'transform 0.5s ease'
              }}
              loading="eager"
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, rgba(0,0,0,0.15) 0%, transparent 40%, rgba(0,0,0,0.1) 100%)',
                pointerEvents: 'none'
              }}
            />
          </div>
        </div>
      </div>

      {/* Slide Footer */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '0.35rem 3rem 0.65rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          borderTop: '1px solid rgba(255,255,255,0.15)'
        }}
      >
        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.85)' }}>
          {slide.dateInfo}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              style={{
                width: current === idx ? 28 : 9,
                height: 9,
                borderRadius: 5,
                background: current === idx ? '#ffffff' : 'rgba(255,255,255,0.4)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0
              }}
              title={`สไลด์ที่ ${idx + 1}`}
            />
          ))}
        </div>

        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)' }}>
          {slide.disclaimer}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        style={{
          position: 'absolute',
          left: 10,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 3,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(6px)',
          border: '1px solid rgba(255,255,255,0.15)',
          color: '#ffffff',
          width: 36,
          height: 60,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(15, 23, 42, 0.75)')}
        onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(15, 23, 42, 0.45)')}
        title="สไลด์ก่อนหน้า"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        onClick={nextSlide}
        style={{
          position: 'absolute',
          right: 10,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 3,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(6px)',
          border: '1px solid rgba(255,255,255,0.15)',
          color: '#ffffff',
          width: 36,
          height: 60,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(15, 23, 42, 0.75)')}
        onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(15, 23, 42, 0.45)')}
        title="สไลด์ถัดไป"
      >
        <ChevronRight size={22} />
      </button>
    </div>
  );
};

export default PromoCarousel;
