import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from './i18n';
import logoHotel from './assets/logoHotel.png';

function ClientItems({ language }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const clientUser = localStorage.getItem('clientUser');
    if (!clientUser) {
      navigate('/client-login');
      return;
    }
    setUser(JSON.parse(clientUser));
    fetchClientItems();
  }, [navigate]);

  const fetchClientItems = async () => {
    try {
      const token = localStorage.getItem('clientToken');
      console.log('Fetching items for user ID:', user?.id);
      
      const response = await fetch(`http://localhost:3001/api/lost-items/client/${user?.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Received items:', data);
        setItems(data);
      } else {
        console.error('Failed to fetch items:', response.status);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePickup = async (itemId) => {
    try {
      const token = localStorage.getItem('clientToken');
      const response = await fetch(`http://localhost:3001/api/lost-items/${itemId}/pickup`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Pickup requested successfully! Staff will be notified.');
        fetchClientItems(); // Refresh the list
      } else {
        alert('Failed to request pickup. Please try again.');
      }
    } catch (error) {
      console.error('Error requesting pickup:', error);
      alert('Error requesting pickup. Please try again.');
    }
  };

  const handleDelivery = (itemId) => {
    navigate('/delivery-form', { state: { itemId } });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Declared by client':
        return '#ff9800';
      case 'Found by staff':
        return '#4caf50';
      case 'Delivered':
        return '#2196f3';
      default:
        return '#757575';
    }
  };

  if (loading) {
    return <div style={{textAlign: 'center', padding: '2rem'}}>Loading...</div>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fff',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <img src={logoHotel} alt='Hotel Logo' style={{width: '100px'}} />
            <h1 style={{
              color: 'rgb(145, 111, 65)',
              fontFamily: 'romie, sans-serif',
              fontWeight: 'bold',
              fontSize: '2rem'
            }}>
              My Lost Items
            </h1>
          </div>
          <button
            onClick={() => navigate('/client-dashboard')}
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
            Back to Dashboard
          </button>
        </div>

        {/* Items List */}
        {items.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: 'rgb(145, 111, 65)',
            fontFamily: 'romie, sans-serif'
          }}>
            <h3>No lost items found</h3>
            <p>You haven't reported any lost items yet.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gap: '1.5rem'
          }}>
            {items.map((item) => (
              <div key={item._id} style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 2px 12px rgba(191, 161, 0, 0.1)',
                padding: '1.5rem',
                border: '1px solid #f0f0f0'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <h3 style={{
                      color: 'rgb(145, 111, 65)',
                      fontFamily: 'romie, sans-serif',
                      marginBottom: '0.5rem'
                    }}>
                      {item.title}
                    </h3>
                    <p style={{
                      color: '#666',
                      marginBottom: '0.5rem'
                    }}>
                      {item.description}
                    </p>
                    <p style={{
                      color: '#666',
                      fontSize: '0.9rem'
                    }}>
                      Last seen: {new Date(item.dateLastSeen).toLocaleDateString()}
                    </p>
                  </div>
                  <span style={{
                    background: getStatusColor(item.status),
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    {item.status}
                  </span>
                </div>

                {item.image && (
                  <div style={{marginBottom: '1rem'}}>
                    <img
                      src={`http://localhost:3001/${item.image}`}
                      alt={item.title}
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                  </div>
                )}

                {/* Action buttons for found items */}
                {item.status === 'Found by staff' && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef'
                  }}>
                    <h4 style={{
                      color: 'rgb(145, 111, 65)',
                      fontFamily: 'romie, sans-serif',
                      marginBottom: '1rem'
                    }}>
                      {t('itemFoundNotification', language)}
                    </h4>
                    <p style={{
                      color: '#666',
                      marginBottom: '1rem'
                    }}>
                      {t('choosePickupOrDelivery', language)}
                    </p>
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      flexWrap: 'wrap'
                    }}>
                      <button
                        onClick={() => handlePickup(item._id)}
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
                        {t('pickupAtHotel', language)}
                      </button>
                      <button
                        onClick={() => handleDelivery(item._id)}
                        style={{
                          background: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.75rem 1.5rem',
                          fontSize: '1rem',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        {t('deliverToAddress', language)}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientItems; 