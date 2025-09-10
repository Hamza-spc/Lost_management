import React from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from './i18n';
import videoBg from './assets/video.mp4';

function Landing({ logo, language }) {
  const navigate = useNavigate();
  
  return (
    <div className="landing-page">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="landing-video"
      >
        <source src={videoBg} type='video/mp4' />
      </video>
      
      {/* Content */}
      <div className="landing-content">
        <div className="logo-container animate-fade-in">
          <img src={logo} alt='Hotel Logo' className="hotel-logo" />
        </div>
        
        <div className="hero-section animate-fade-in">
          <h1 className="landing-title">
            <span className="title-main">{t('lostItemsApp', language)}</span>
            <span className="title-subtitle">Sofitel Marrakech</span>
          </h1>
          <div className="title-decoration">
            <div className="decoration-line"></div>
            <div className="decoration-dot"></div>
            <div className="decoration-line"></div>
          </div>
        </div>
        
        {/* Login Cards */}
        <div className="login-cards-container">
          <div className="login-card card animate-fade-in">
            <div className="card-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h2>{t('staff', language)}</h2>
            <p>{t('staffDesc', language)}</p>
            <button
              onClick={() => navigate('/login')}
              className="btn btn-primary btn-lg"
            >
              {t('staffLogin', language)}
            </button>
          </div>
          
          <div className="login-card card animate-fade-in">
            <div className="card-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
            </div>
            <h2>{t('client', language)}</h2>
            <p>{t('clientDesc', language)}</p>
            <button
              onClick={() => navigate('/client-login')}
              className="btn btn-primary btn-lg"
            >
              {t('clientLogin', language)}
            </button>
          </div>
        </div>
        
        {/* Website Link */}
        <div className="website-section animate-fade-in">
          <div className="website-card">
            <div className="website-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
            </div>
            <div className="website-content">
              <h3 className="website-title">{t('checkWebsite', language)}</h3>
              <a href='https://sofitel.marrakech.app/' target='_blank' rel='noopener noreferrer' className="website-link">
                <span className="website-url">https://sofitel.marrakech.app/</span>
                <svg className="website-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7V17"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        {/* Social Media */}
        <div className="social-section animate-fade-in">
          <h3 className="social-title">{t('followUs', language)}</h3>
          <div className="social-links">
            <a href='https://www.instagram.com/sofitelmarrakech' target='_blank' rel='noopener noreferrer' className="social-link" aria-label='Instagram'>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <defs>
                  <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f09433" />
                    <stop offset="25%" stopColor="#e6683c" />
                    <stop offset="50%" stopColor="#dc2743" />
                    <stop offset="75%" stopColor="#cc2366" />
                    <stop offset="100%" stopColor="#bc1888" />
                  </linearGradient>
                </defs>
                <rect width="24" height="24" rx="6" fill="url(#instagram-gradient)"/>
                <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="2" fill="none"/>
                <circle cx="18" cy="6" r="1.5" fill="white"/>
              </svg>
            </a>
            <a href='https://www.facebook.com/SofitelMarrakech/' target='_blank' rel='noopener noreferrer' className="social-link" aria-label='Facebook'>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="6" fill="var(--primary)"/>
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="white"/>
              </svg>
            </a>
            <a href='https://sofitel.marrakech.app/' target='_blank' rel='noopener noreferrer' className="social-link" aria-label='Website'>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="6" fill="var(--primary)"/>
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="white" strokeWidth="2"/>
              </svg>
            </a>
          </div>
        </div>
        
        {/* Review Section */}
        <div className="review-section animate-fade-in">
          <h3 className="review-title">{t('shareOpinion', language)}</h3>
          <div className="review-links">
            <a href='https://www.google.com/maps/place//data=!4m3!3m2!1s0xdafee58becf2b5d:0x5ee3f0249e2dd3c0!12e1?source=g.page.m._&laa=merchant-review-solicitation' target='_blank' rel='noopener noreferrer' className="review-link" aria-label='Google Review'>
              <img src='https://www.admin.utelys.fr/public/img/page/banner_item/24126_image_1746006821.png' alt='Google Review' />
            </a>
            <a href='https://www.tripadvisor.fr/Hotel_Review-g293734-d299685-Reviews-Sofitel_Marrakech_Palais_Imperial_Spa-Marrakech_Marrakech_Safi.html' target='_blank' rel='noopener noreferrer' className="review-link" aria-label='TripAdvisor'>
              <img src='https://www.admin.utelys.fr/public/img/page/banner_item/24127_image_1746006933.png' alt='TripAdvisor' />
            </a>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .landing-page {
          position: relative;
          min-height: 100vh;
          background: #f5f5f5;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          padding: 3rem 1rem;
          overflow: hidden;
        }
        
        .landing-video {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          object-fit: cover;
          z-index: 0;
          opacity: 0.3;
          pointer-events: none;
        }
        
        .landing-content {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1200px;
        }
        
        .logo-container {
          text-align: center;
          margin-bottom: var(--spacing-2xl);
        }
        
        .hotel-logo {
          width: 160px;
          height: auto;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        }
        
        .hero-section {
          text-align: center;
          margin-bottom: 4rem;
        }
        
        .landing-title {
          margin-bottom: 1.5rem;
        }
        
        .title-main {
          display: block;
          font-size: 3.5rem;
          font-weight: 800;
          letter-spacing: 3px;
          background: linear-gradient(135deg, #917143 0%, #bfa100 50%, #d4b800 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 0.5rem;
          animation: titleGlow 3s ease-in-out infinite alternate;
          background-color: rgba(255, 255, 255, 1);
          padding: 1.5rem 2.5rem;
          border-radius: 1rem;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          border: 2px solid rgba(255, 255, 255, 0.5);
        }
        
        .title-subtitle {
          display: block;
          font-size: 1.5rem;
          font-weight: 400;
          color: #495057;
          letter-spacing: 1px;
          margin-bottom: 1.5rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: rgba(255, 255, 255, 0.9);
          padding: 0.75rem 1.5rem;
          border-radius: 0.75rem;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          display: inline-block;
        }
        
        .title-decoration {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-md);
        }
        
        .decoration-line {
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #bfa100, transparent);
          border-radius: 9999px;
        }
        
        .decoration-dot {
          width: 8px;
          height: 8px;
          background: #bfa100;
          border-radius: 9999px;
          box-shadow: 0 0 10px #bfa100;
          animation: pulse 2s infinite;
        }
        
        @keyframes titleGlow {
          0% {
            filter: drop-shadow(0 0 5px rgba(191, 161, 0, 0.3));
          }
          100% {
            filter: drop-shadow(0 0 20px rgba(191, 161, 0, 0.6));
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .login-cards-container {
          display: flex;
          gap: 3rem;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 4rem;
        }
        
        .login-card {
          width: 380px;
          min-height: 360px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 3rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 1.5rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        
        .login-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        
        .card-icon {
          margin-bottom: 1.5rem;
          color: #bfa100;
        }
        
        .login-card h2 {
          margin-bottom: 1rem;
          font-size: 1.75rem;
          font-weight: 600;
          color: #917143;
        }
        
        .login-card p {
          margin-bottom: 2rem;
          color: #495057;
          line-height: 1.6;
          flex-grow: 1;
        }
        
        .btn-primary {
          background: #bfa100;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 0.75rem;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(191, 161, 0, 0.3);
        }
        
        .btn-primary:hover {
          background: #a88a00;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(191, 161, 0, 0.4);
        }
        
        .website-section {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .website-card {
          display: inline-flex;
          align-items: center;
          gap: 1.5rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.4);
          border-radius: 1.5rem;
          padding: 2rem 3rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
          max-width: 600px;
        }
        
        .website-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          background: rgba(255, 255, 255, 1);
          border-color: rgba(191, 161, 0, 0.3);
        }
        
        .website-icon {
          color: var(--primary);
          background: rgba(191, 161, 0, 0.1);
          border-radius: var(--radius-full);
          padding: var(--spacing-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .website-content {
          text-align: left;
        }
        
        .website-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #917143;
          margin: 0 0 0.5rem 0;
          background-color: rgba(255, 255, 255, 0.9);
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          backdrop-filter: blur(10px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          display: inline-block;
        }
        
        .website-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #bfa100;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.15s ease-in-out;
          padding: 0.75rem 1.5rem;
          border-radius: 0.75rem;
          background: rgba(191, 161, 0, 0.1);
          border: 2px solid rgba(191, 161, 0, 0.2);
          font-size: 1rem;
        }
        
        .website-link:hover {
          color: var(--primary-dark);
          background: rgba(191, 161, 0, 0.1);
          transform: translateX(4px);
        }
        
        .website-url {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.9rem;
        }
        
        .website-arrow {
          color: var(--primary);
          transition: transform var(--transition-fast);
        }
        
        .website-link:hover .website-arrow {
          transform: translateX(2px) translateY(-2px);
        }
        
        .social-section {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .social-title {
          font-weight: 700;
          font-size: 1.3rem;
          margin-bottom: 1.5rem;
          color: #917143;
          background-color: rgba(255, 255, 255, 0.9);
          padding: 0.75rem 1.5rem;
          border-radius: 0.75rem;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          display: inline-block;
        }
        
        .social-links {
          display: flex;
          justify-content: center;
          gap: 2rem;
        }
        
        .social-link {
          display: inline-block;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 1rem;
          padding: 1.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          border: 2px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
        }
        
        .social-link svg {
          width: 40px;
          height: 40px;
          transition: transform 0.3s ease;
        }
        
        .social-link:hover svg {
          transform: scale(1.1);
        }
        
        /* Instagram icon styling - now uses gradient */
        .social-link:nth-child(1) svg {
          /* Instagram gradient is defined in the SVG itself */
        }
        
        /* Facebook icon styling */
        .social-link:nth-child(2) svg {
          color: #1877F2 !important;
        }
        
        .social-link:nth-child(2) svg rect {
          fill: #1877F2 !important;
        }
        
        .social-link:nth-child(2) svg path {
          fill: white !important;
        }
        
        /* Website icon styling */
        .social-link:nth-child(3) svg {
          color: #bfa100 !important;
        }
        
        .social-link:nth-child(3) svg rect {
          fill: #bfa100 !important;
        }
        
        .social-link:nth-child(3) svg circle,
        .social-link:nth-child(3) svg line,
        .social-link:nth-child(3) svg path {
          stroke: white !important;
          fill: none !important;
        }
        
        .social-link:hover {
          transform: translateY(-6px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
          background: rgba(255, 255, 255, 1);
          border-color: rgba(191, 161, 0, 0.3);
        }
        
        .review-section {
          text-align: center;
        }
        
        .review-title {
          font-weight: 700;
          font-size: 1.3rem;
          margin-bottom: 1.5rem;
          color: #917143;
          background-color: rgba(255, 255, 255, 0.9);
          padding: 0.75rem 1.5rem;
          border-radius: 0.75rem;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          display: inline-block;
        }
        
        .review-links {
          display: flex;
          justify-content: center;
          gap: 2rem;
        }
        
        .review-link {
          display: inline-block;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 1rem;
          padding: 1.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          border: 2px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
        }
        
        .review-link:hover {
          transform: translateY(-6px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
          background: rgba(255, 255, 255, 1);
          border-color: rgba(191, 161, 0, 0.3);
        }
        
        .review-link img {
          width: 80px;
          height: 80px;
          border-radius: 0.75rem;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        .review-link:hover img {
          transform: scale(1.1);
        }
        
        @media (max-width: 768px) {
          .title-main {
            font-size: 2.5rem;
            letter-spacing: 2px;
          }
          
          .title-subtitle {
            font-size: 1.2rem;
          }
          
          .decoration-line {
            width: 40px;
          }
          
          .login-cards-container {
            gap: var(--spacing-lg);
          }
          
          .login-card {
            width: 100%;
            max-width: 350px;
            padding: var(--spacing-2xl);
          }
          
          .social-links,
          .review-links {
            gap: var(--spacing-lg);
          }
          
          .website-card {
            flex-direction: column;
            text-align: center;
            gap: var(--spacing-md);
            padding: var(--spacing-lg);
          }
          
          .website-content {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}

export default Landing; 