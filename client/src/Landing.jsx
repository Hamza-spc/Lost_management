import React from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from './i18n';
import videoBg from './assets/video.mp4';

function Landing({ logo, language }) {
  const navigate = useNavigate();
  return (
    <div style={{position: 'relative', minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', padding: '3rem 1rem', overflow: 'hidden'}}>
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: 0,
          opacity: 0.35,
          pointerEvents: 'none',
        }}
      >
        <source src={videoBg} type='video/mp4' />
      </video>
      <img src={logo} alt='Hotel Logo' style={{width: '160px', marginBottom: '2rem'}} />
      <h1 style={{color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif', fontWeight: 'bold', fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center', letterSpacing: '1px'}}>{t('lostItemsApp', language)}</h1>
      <div style={{position: 'relative', zIndex: 1, width: '100%'}}>
        <div style={{display: 'flex', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%'}}>
          {/* Staff Choice */}
          <div style={{background: 'white', borderRadius: '20px', boxShadow: '0 4px 24px rgba(191, 161, 0, 0.15)', padding: '3rem 2.5rem', width: '350px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '320px'}}>
            <h2 style={{color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif', marginBottom: '1rem'}}>{t('staff', language)}</h2>
            <p style={{color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif', marginBottom: '2rem', textAlign: 'center'}}>{t('staffDesc', language)}</p>
            <button
              onClick={() => navigate('/login')}
              style={{background: '#bfa100', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '8px', padding: '0.75rem 1.5rem', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(191, 161, 0, 0.10)'}}
            >
              {t('staffLogin', language)}
            </button>
          </div>
          {/* Client Choice */}
          <div style={{background: 'white', borderRadius: '20px', boxShadow: '0 4px 24px rgba(191, 161, 0, 0.15)', padding: '3rem 2.5rem', width: '350px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '320px'}}>
            <h2 style={{color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif', marginBottom: '1rem'}}>{t('client', language)}</h2>
            <p style={{color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif', marginBottom: '2rem', textAlign: 'center'}}>{t('clientDesc', language)}</p>
            <button
              onClick={() => navigate('/add-lost-item', { state: { client: true } })}
              style={{background: '#bfa100', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '8px', padding: '0.75rem 1.5rem', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(191, 161, 0, 0.10)'}}
            >
              {t('reportLostItem', language)}
            </button>
          </div>
        </div>
        {/* Section 1: Website Reservation */}
        <div style={{marginTop: '3rem', width: '100%', textAlign: 'center'}}>
          <p style={{fontWeight: 'bold', color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif', fontSize: '1.1rem'}}>{t('checkWebsite', language)} <a href='https://sofitel.marrakech.app/' target='_blank' rel='noopener noreferrer' style={{color: 'rgb(145, 111, 65)', textDecoration: 'underline'}}>https://sofitel.marrakech.app/</a></p>
        </div>
        {/* Section 2: Follow Us */}
        <div style={{marginTop: '2rem', width: '100%', textAlign: 'center'}}>
          <div style={{fontWeight: 'bold', color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif', fontSize: '1.2rem', marginBottom: '0.5rem'}}>{t('followUs', language)}</div>
          <div style={{display: 'flex', justifyContent: 'center', gap: '2.5rem'}}>
            {/* Instagram */}
            <a href='https://www.instagram.com/sofitelmarrakech' target='_blank' rel='noopener noreferrer' style={{display: 'inline-block', background: '#fff', borderRadius: '12px', padding: '0.5rem'}} aria-label='Instagram'>
              <svg width='48' height='48' viewBox='0 0 32 32' fill='none'><rect width='32' height='32' rx='8' fill='#bfa100'/><path d='M16 11.2A4.8 4.8 0 1 0 16 20.8A4.8 4.8 0 1 0 16 11.2Z' stroke='white' strokeWidth='2'/><circle cx='24' cy='8' r='1.2' fill='white'/></svg>
            </a>
            {/* Facebook */}
            <a href='https://www.facebook.com/SofitelMarrakech/' target='_blank' rel='noopener noreferrer' style={{display: 'inline-block', background: '#fff', borderRadius: '12px', padding: '0.5rem'}} aria-label='Facebook'>
              <svg width='48' height='48' viewBox='0 0 32 32' fill='none'><rect width='32' height='32' rx='8' fill='#bfa100'/><path d='M20 11h-2a1 1 0 0 0-1 1v2h3l-.5 3h-2.5v8h-3v-8h-2v-3h2v-2a3 3 0 0 1 3-3h2v3z' fill='white'/></svg>
            </a>
            {/* Internet/Website */}
            <a href='https://sofitel.marrakech.app/' target='_blank' rel='noopener noreferrer' style={{display: 'inline-block', background: '#fff', borderRadius: '12px', padding: '0.5rem'}} aria-label='Website'>
              <svg width='48' height='48' viewBox='0 0 32 32' fill='none'><rect width='32' height='32' rx='8' fill='#bfa100'/><circle cx='16' cy='16' r='8' stroke='white' strokeWidth='2'/><path d='M8 16h16M16 8a16 16 0 0 1 0 16M16 8a16 16 0 0 0 0 16' stroke='white' strokeWidth='2'/></svg>
            </a>
          </div>
        </div>
        {/* Section 3: Share Your Opinion */}
        <div style={{marginTop: '2rem', width: '100%', textAlign: 'center'}}>
          <div style={{fontWeight: 'bold', color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif', fontSize: '1.2rem', marginBottom: '0.5rem'}}>{t('shareOpinion', language)}</div>
          <div style={{display: 'flex', justifyContent: 'center', gap: '2.5rem'}}>
            {/* Google Review */}
            <a href='https://www.admin.utelys.fr/public/img/page/banner_item/24126_image_1746006821.png' target='_blank' rel='noopener noreferrer' aria-label='Google Review' style={{background: '#fff', borderRadius: '12px', padding: '0.5rem', display: 'inline-block'}}>
              <img src='https://www.admin.utelys.fr/public/img/page/banner_item/24126_image_1746006821.png' alt='Google Review' style={{width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', background: '#fff'}} />
            </a>
            {/* TripAdvisor */}
            <a href='https://www.admin.utelys.fr/public/img/page/banner_item/24127_image_1746006933.png' target='_blank' rel='noopener noreferrer' aria-label='TripAdvisor' style={{background: '#fff', borderRadius: '12px', padding: '0.5rem', display: 'inline-block'}}>
              <img src='https://www.admin.utelys.fr/public/img/page/banner_item/24127_image_1746006933.png' alt='TripAdvisor' style={{width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', background: '#fff'}} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing; 