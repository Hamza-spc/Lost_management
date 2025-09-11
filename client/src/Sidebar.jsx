import React, { useState } from 'react';
import { t } from './i18n';

const Sidebar = ({ language, setLanguage, onToggle }) => {
  const [open, setOpen] = useState(false); // Start with sidebar closed
  
  const handleToggle = () => {
    const newOpen = !open;
    setOpen(newOpen);
    if (onToggle) onToggle(newOpen);
  };

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        onClick={handleToggle}
        style={{
          position: 'fixed',
          top: 24,
          left: 24,
          zIndex: 2001,
          background: '#bfa100',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: 48,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(191,161,0,0.10)',
          cursor: 'pointer',
        }}
        aria-label='Open sidebar'
      >
        {/* Hamburger icon */}
        <svg width='28' height='28' viewBox='0 0 24 24' fill='none'><rect y='4' width='24' height='2' rx='1' fill='white'/><rect y='11' width='24' height='2' rx='1' fill='white'/><rect y='18' width='24' height='2' rx='1' fill='white'/></svg>
      </button>
      {/* Sidebar Overlay */}
      {open && (
        <div
          onClick={handleToggle}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.2)',
            zIndex: 2000,
          }}
        />
      )}
      {/* Sidebar Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: open ? 0 : -280,
          width: 280,
          height: '100vh',
          background: '#fff',
          boxShadow: '2px 0 16px rgba(191,161,0,0.15)',
          zIndex: 2002,
          transition: 'left 0.3s cubic-bezier(.4,0,.2,1)',
          display: open ? 'flex' : 'none',
          flexDirection: 'column',
          padding: '2rem 1.5rem',
          borderRight: '2px solid #bfa100',
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleToggle}
          style={{
            alignSelf: 'flex-end',
            background: 'none',
            border: 'none',
            fontSize: 28,
            color: '#bfa100',
            cursor: 'pointer',
            marginBottom: '1.5rem',
          }}
          aria-label='Close sidebar'
        >
          &times;
        </button>
        {/* Contact Section */}
        <div style={{marginBottom: '2rem'}}>
          <div style={{fontWeight: 'bold', color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif', fontSize: '1.1rem', marginBottom: '1rem'}}>{t('contact', language)}</div>
          <div style={{display: 'flex', alignItems: 'center', marginBottom: '0.75rem'}}>
            {/* Phone icon */}
            <svg width='22' height='22' viewBox='0 0 24 24' fill='none' style={{marginRight: 10}}><path d='M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.07 21 3 13.93 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.24 1.01l-2.2 2.2z' stroke='#bfa100' strokeWidth='2' fill='none'/></svg>
            <span style={{color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif', fontSize: '1rem'}}>{t('phone', language)}</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center'}}>
            {/* Email icon */}
            <svg width='22' height='22' viewBox='0 0 24 24' fill='none' style={{marginRight: 10}}><rect x='3' y='5' width='18' height='14' rx='2' stroke='#bfa100' strokeWidth='2' fill='none'/><path d='M3 7l9 6 9-6' stroke='#bfa100' strokeWidth='2' fill='none'/></svg>
            <span style={{color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif', fontSize: '1rem'}}>{t('email', language)}</span>
          </div>
        </div>
        {/* Languages Section */}
        <div style={{marginBottom: '2rem'}}>
          <div style={{fontWeight: 'bold', color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif', fontSize: '1.1rem', marginBottom: '1rem'}}>{t('languages', language)}</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            {/* UK Flag */}
            <button
              onClick={() => setLanguage('en')}
              style={{background: language === 'en' ? '#bfa100' : '#fff', border: '1px solid #bfa100', borderRadius: 8, padding: 6, cursor: 'pointer', display: 'flex', alignItems: 'center'}}
              aria-label='Switch to English'
            >
              <span style={{marginRight: 8}}>
                <svg width='24' height='16' viewBox='0 0 24 16'><rect width='24' height='16' rx='3' fill='#fff'/><path d='M0 0l24 16M24 0L0 16' stroke='#bfa100' strokeWidth='2'/><rect x='10' width='4' height='16' fill='#bfa100'/><rect y='6' width='24' height='4' fill='#bfa100'/></svg>
              </span>
              <span style={{color: language === 'en' ? '#fff' : '#bfa100', fontWeight: 'bold'}}>{t('english', language)}</span>
            </button>
            {/* France Flag */}
            <button
              onClick={() => setLanguage('fr')}
              style={{background: language === 'fr' ? '#bfa100' : '#fff', border: '1px solid #bfa100', borderRadius: 8, padding: 6, cursor: 'pointer', display: 'flex', alignItems: 'center'}}
              aria-label='Switch to French'
            >
              <span style={{marginRight: 8}}>
                <svg width='24' height='16' viewBox='0 0 24 16'><rect width='24' height='16' rx='3' fill='#fff'/><rect width='8' height='16' rx='3' fill='#0055A4'/><rect x='16' width='8' height='16' rx='3' fill='#EF4135'/></svg>
              </span>
              <span style={{color: language === 'fr' ? '#fff' : '#bfa100', fontWeight: 'bold'}}>{t('french', language)}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 