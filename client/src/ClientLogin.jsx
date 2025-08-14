import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { t } from './i18n';
import logoHotel from './assets/logoHotel.png';

function ClientLogin({ language }) {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Send the credential to your backend
      const response = await fetch('http://localhost:3001/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user info in localStorage
        localStorage.setItem('clientUser', JSON.stringify(data.user));
        localStorage.setItem('clientToken', data.token);
        
        // Redirect to client dashboard
        navigate('/client-dashboard');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    alert('Google login failed. Please try again.');
  };

  // Temporary test login function (remove this in production)
  const handleTestLogin = () => {
    const testUser = {
      id: 'test_user_123',
      name: 'Test Client',
      email: 'test@example.com'
    };
    const testToken = 'test_token_' + Date.now();
    
    localStorage.setItem('clientUser', JSON.stringify(testUser));
    localStorage.setItem('clientToken', testToken);
    
    navigate('/client-dashboard');
  };

  return (
    <div className="client-login-page">
      <div className="client-login-background">
        <div className="client-login-background-overlay"></div>
      </div>
      
      <div className="client-login-container">
        <div className="logo-section">
          <img src={logoHotel} alt='Hotel Logo' className="hotel-logo" />
        </div>
        
        <div className="client-login-card card">
          <div className="card-header">
            <h1 className="client-login-title">
              {t('clientLogin', language)}
            </h1>
            
            <p className="client-login-subtitle">
              Sign in with your Google account to access your lost items
            </p>
          </div>

          <div className="google-login-section">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="filled_black"
              size="large"
              text="signin_with"
              shape="rectangular"
            />
          </div>

          {/* Temporary test login button */}
          <div className="test-login-section">
            <p className="test-login-text">
              For testing purposes:
            </p>
            <button
              onClick={handleTestLogin}
              className="btn btn-accent"
            >
              Test Login (Skip Google OAuth)
            </button>
          </div>

          <div className="client-login-footer">
            <button
              onClick={() => navigate('/')}
              className="btn btn-outline"
            >
              {t('backToHome', language)}
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .client-login-page {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-lg);
          position: relative;
          overflow: hidden;
        }
        
        .client-login-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
        }
        
        .client-login-background-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 70% 80%, rgba(255,255,255,0.1) 0%, transparent 50%);
        }
        
        .client-login-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 450px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .logo-section {
          text-align: center;
          margin-bottom: var(--spacing-2xl);
        }
        
        .hotel-logo {
          width: 140px;
          height: auto;
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
        }
        
        .client-login-card {
          width: 100%;
          padding: var(--spacing-3xl);
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: var(--shadow-xl);
          text-align: center;
        }
        
        .card-header {
          margin-bottom: var(--spacing-2xl);
          border-bottom: none;
          padding-bottom: 0;
        }
        
        .client-login-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: var(--spacing-md);
          color: var(--secondary);
          background: linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .client-login-subtitle {
          color: var(--gray-600);
          font-size: 1rem;
          margin: 0;
          line-height: 1.6;
        }
        
        .google-login-section {
          margin-bottom: var(--spacing-2xl);
        }
        
        .test-login-section {
          margin-top: var(--spacing-2xl);
          padding-top: var(--spacing-2xl);
          border-top: 1px solid var(--gray-100);
          margin-bottom: var(--spacing-2xl);
        }
        
        .test-login-text {
          color: var(--gray-500);
          font-size: 0.9rem;
          margin-bottom: var(--spacing-md);
        }
        
        .client-login-footer {
          padding-top: var(--spacing-lg);
          border-top: 1px solid var(--gray-100);
        }
        
        @media (max-width: 768px) {
          .client-login-page {
            padding: var(--spacing-md);
          }
          
          .client-login-card {
            padding: var(--spacing-2xl);
          }
          
          .client-login-title {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </div>
  );
}

export default ClientLogin; 