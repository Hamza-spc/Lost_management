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
    <div style={{
      minHeight: '100vh',
      background: '#fff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem'
    }}>
      <img src={logoHotel} alt='Hotel Logo' style={{width: '160px', marginBottom: '2rem'}} />
      
      <div style={{
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 4px 24px rgba(191, 161, 0, 0.15)',
        padding: '3rem 2.5rem',
        width: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <h1 style={{
          color: 'rgb(145, 111, 65)',
          fontFamily: 'romie, sans-serif',
          fontWeight: 'bold',
          fontSize: '2rem',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          {t('clientLogin', language)}
        </h1>
        
        <p style={{
          color: 'rgb(145, 111, 65)',
          fontFamily: 'romie, sans-serif',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          Sign in with your Google account to access your lost items
        </p>

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap
          theme="filled_black"
          size="large"
          text="signin_with"
          shape="rectangular"
        />

        {/* Temporary test login button */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '2rem',
          borderTop: '1px solid #eee',
          width: '100%',
          textAlign: 'center'
        }}>
          <p style={{
            color: '#666',
            fontSize: '0.9rem',
            marginBottom: '1rem'
          }}>
            For testing purposes:
          </p>
          <button
            onClick={handleTestLogin}
            style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Test Login (Skip Google OAuth)
          </button>
        </div>

        <button
          onClick={() => navigate('/')}
          style={{
            background: 'transparent',
            color: 'rgb(145, 111, 65)',
            border: '2px solid rgb(145, 111, 65)',
            borderRadius: '8px',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            cursor: 'pointer',
            marginTop: '1rem',
            fontFamily: 'romie, sans-serif'
          }}
        >
          {t('backToHome', language)}
        </button>
      </div>
    </div>
  );
}

export default ClientLogin; 