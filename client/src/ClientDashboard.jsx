import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from './i18n';
import logoHotel from './assets/logoHotel.png';

function ClientDashboard({ language }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const clientUser = localStorage.getItem('clientUser');
    if (!clientUser) {
      navigate('/client-login');
      return;
    }
    setUser(JSON.parse(clientUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('clientUser');
    localStorage.removeItem('clientToken');
    navigate('/');
  };

  const handleReportLostItem = () => {
    navigate('/add-lost-item', { state: { client: true } });
  };

  const handleCheckStatus = () => {
    navigate('/client-items');
  };

  const handlePayDeliveryFee = () => {
    navigate('/payment-options');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '800px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <img src={logoHotel} alt='Hotel Logo' style={{width: '120px'}} />
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
          <span style={{
            color: 'rgb(145, 111, 65)',
            fontFamily: 'romie, sans-serif',
            fontSize: '1rem'
          }}>
            Welcome, {user.name}
          </span>
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              color: 'rgb(145, 111, 65)',
              border: '2px solid rgb(145, 111, 65)',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              fontSize: '0.9rem',
              cursor: 'pointer',
              fontFamily: 'romie, sans-serif'
            }}
          >
            {t('logout', language)}
          </button>
        </div>
      </div>

      <h1 style={{
        color: 'rgb(145, 111, 65)',
        fontFamily: 'romie, sans-serif',
        fontWeight: 'bold',
        fontSize: '2.5rem',
        marginBottom: '3rem',
        textAlign: 'center'
      }}>
        Client Dashboard
      </h1>

      <div style={{
        display: 'flex',
        gap: '3rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%'
      }}>
        {/* Report Lost Item */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 4px 24px rgba(191, 161, 0, 0.15)',
          padding: '3rem 2.5rem',
          width: '350px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '320px'
        }}>
          <h2 style={{
            color: 'rgb(145, 111, 65)',
            fontFamily: 'romie, sans-serif',
            marginBottom: '1rem'
          }}>
            {t('reportLostItem', language)}
          </h2>
          <p style={{
            color: 'rgb(145, 111, 65)',
            fontFamily: 'romie, sans-serif',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            Report a new lost item with details and photos
          </p>
          <button
            onClick={handleReportLostItem}
            style={{
              background: '#bfa100',
              color: '#fff',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              fontSize: '1.1rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(191, 161, 0, 0.10)'
            }}
          >
            {t('reportLostItem', language)}
          </button>
        </div>

        {/* Pay Delivery Fee */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 4px 24px rgba(191, 161, 0, 0.15)',
          padding: '3rem 2.5rem',
          width: '350px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '320px'
        }}>
          <h2 style={{
            color: 'rgb(145, 111, 65)',
            fontFamily: 'romie, sans-serif',
            marginBottom: '1rem'
          }}>
            {t('payDeliveryFee', language)}
          </h2>
          <p style={{
            color: 'rgb(145, 111, 65)',
            fontFamily: 'romie, sans-serif',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            {t('deliveryFeeDescription', language)}
          </p>
          <button
            onClick={handlePayDeliveryFee}
            style={{
              background: '#bfa100',
              color: '#fff',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              fontSize: '1.1rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(191, 161, 0, 0.10)'
            }}
          >
            {t('payDeliveryFee', language)}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClientDashboard; 