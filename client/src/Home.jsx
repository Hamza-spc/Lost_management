import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { t } from './i18n';

function Home({ logo, language }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any session/localStorage if used for auth (optional)
    // localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #fffbe6 0%, #bfa100 100%)', padding: '3rem 1rem', borderRadius: '16px', boxShadow: '0 4px 24px rgba(191, 161, 0, 0.10)', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <img src={logo} alt='Hotel Logo' style={{width: '160px', marginBottom: '2rem'}} />
      <button
        onClick={handleLogout}
        style={{position: 'absolute', top: '6rem', right: '2rem', background: '#bfa100', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.5rem 1.25rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 8px rgba(191, 161, 0, 0.10)'}}
      >
        {t('logout', language)}
      </button>
      <Link
        to='/lost-items'
        state={{ onlyDeclaredByClient: true }}
        style={{position: 'absolute', top: '6rem', left: '2rem', background: '#bfa100', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '8px', padding: '0.5rem 1.25rem', textDecoration: 'none', fontSize: '1rem', boxShadow: '0 2px 8px rgba(191, 161, 0, 0.10)'}}
      >
        {t('checkReports', language)}
      </Link>
      <h2 style={{color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif', textAlign: 'center', marginBottom: '2.5rem', fontSize: '2.5rem'}}>{t('home', language)}</h2>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: '3rem', justifyContent: 'center', width: '100%'}}>
        {/* Section 1: Check Lost Items */}
        <section style={{flex: '1 1 350px', background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 8px rgba(191, 161, 0, 0.08)', minHeight: '260px'}}>
          <h3 style={{color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif'}}>{t('checkLostItems', language)}</h3>
          <p style={{color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif'}}>{t('viewLostItems', language)}</p>
          <Link to='/lost-items' style={{display: 'inline-block', marginTop: '1rem', background: '#bfa100', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '8px', padding: '0.75rem 1.5rem', textDecoration: 'none', boxShadow: '0 2px 8px rgba(191, 161, 0, 0.10)'}}>{t('viewLostItems', language)}</Link>
        </section>
        {/* Section 2: Add a Lost Item */}
        <section style={{flex: '1 1 350px', background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 8px rgba(191, 161, 0, 0.08)', minHeight: '260px'}}>
          <h3 style={{color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif'}}>{t('addLostItem', language)}</h3>
          <p style={{color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif'}}>{t('addLostItem', language)}</p>
          <Link to='/add-lost-item' state={{ staff: true }} style={{display: 'inline-block', marginTop: '1rem', background: '#bfa100', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '8px', padding: '0.75rem 1.5rem', textDecoration: 'none', boxShadow: '0 2px 8px rgba(191, 161, 0, 0.10)'}}>{t('goToForm', language)}</Link>
        </section>
      </div>
    </div>
  )
}

export default Home