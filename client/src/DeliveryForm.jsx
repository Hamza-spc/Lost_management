import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { t } from './i18n';
import logoHotel from './assets/logoHotel.png';
import { config } from './config.js';

// Initialize Stripe
const stripePromise = loadStripe(config.STRIPE_PUBLISHABLE_KEY);

function DeliveryForm({ language }) {
  const navigate = useNavigate();
  const location = useLocation();
  const itemId = location.state?.itemId;
  
  const [formData, setFormData] = useState({
    address: '',
    phoneNumber: '',
    city: '',
    postalCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(null);

  useEffect(() => {
    if (!itemId) {
      navigate('/client-items');
      return;
    }
    fetchItemDetails();
  }, [itemId, navigate]);

  const fetchItemDetails = async () => {
    try {
      const token = localStorage.getItem('clientToken');
      const response = await fetch(`http://localhost:3001/api/lost-items/${itemId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setItem(data);
      }
    } catch (error) {
      console.error('Error fetching item details:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.address || !formData.phoneNumber || !formData.city || !formData.postalCode) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('clientToken');
      
      // First, create the delivery request
      const deliveryResponse = await fetch(`http://localhost:3001/api/lost-items/${itemId}/delivery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!deliveryResponse.ok) {
        throw new Error('Failed to create delivery request');
      }

      const deliveryData = await deliveryResponse.json();

      // Then, create Stripe payment intent
      const paymentResponse = await fetch('http://localhost:3001/api/payment/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: 1500, // $15.00 in cents
          itemId: itemId,
          deliveryId: deliveryData.deliveryId
        })
      });

      if (!paymentResponse.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await paymentResponse.json();

      // Redirect to Stripe payment
      const stripe = await stripePromise;
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: {
            // This would be handled by Stripe Elements in a real implementation
          },
          billing_details: {
            name: 'Client Name',
            email: localStorage.getItem('clientUser') ? JSON.parse(localStorage.getItem('clientUser')).email : ''
          }
        }
      });

      if (error) {
        alert(`Payment failed: ${error.message}`);
      } else {
        alert('Payment successful! Your item will be delivered to the provided address.');
        navigate('/client-items');
      }

    } catch (error) {
      console.error('Error processing delivery:', error);
      alert('Error processing delivery request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!item) {
    return <div style={{textAlign: 'center', padding: '2rem'}}>Loading...</div>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fff',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '600px',
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
              Delivery Form
            </h1>
          </div>
          <button
            onClick={() => navigate('/client-items')}
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
            Back to Items
          </button>
        </div>

        {/* Item Details */}
        <div style={{
          background: '#f8f9fa',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{
            color: 'rgb(145, 111, 65)',
            fontFamily: 'romie, sans-serif',
            marginBottom: '1rem'
          }}>
            Item to be delivered:
          </h3>
          <p style={{fontWeight: 'bold', marginBottom: '0.5rem'}}>{item.title}</p>
          <p style={{color: '#666'}}>{item.description}</p>
        </div>

        {/* Delivery Form */}
        <form onSubmit={handleSubmit} style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 12px rgba(191, 161, 0, 0.1)',
          padding: '2rem',
          border: '1px solid #f0f0f0'
        }}>
          <h2 style={{
            color: 'rgb(145, 111, 65)',
            fontFamily: 'romie, sans-serif',
            marginBottom: '1.5rem'
          }}>
            Delivery Information
          </h2>

          <div style={{marginBottom: '1.5rem'}}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: 'rgb(145, 111, 65)',
              fontFamily: 'romie, sans-serif',
              fontWeight: 'bold'
            }}>
              {t('deliveryAddress', language)} *
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                minHeight: '80px'
              }}
              placeholder="Enter your full delivery address"
            />
          </div>

          <div style={{marginBottom: '1.5rem'}}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: 'rgb(145, 111, 65)',
              fontFamily: 'romie, sans-serif',
              fontWeight: 'bold'
            }}>
              City *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit'
              }}
              placeholder="Enter your city"
            />
          </div>

          <div style={{marginBottom: '1.5rem'}}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: 'rgb(145, 111, 65)',
              fontFamily: 'romie, sans-serif',
              fontWeight: 'bold'
            }}>
              Postal Code *
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit'
              }}
              placeholder="Enter your postal code"
            />
          </div>

          <div style={{marginBottom: '2rem'}}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: 'rgb(145, 111, 65)',
              fontFamily: 'romie, sans-serif',
              fontWeight: 'bold'
            }}>
              {t('phoneNumber', language)} *
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit'
              }}
              placeholder="Enter your phone number"
            />
          </div>

          {/* Delivery Fee Information */}
          <div style={{
            background: '#e8f5e8',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '2rem',
            border: '1px solid #c3e6c3'
          }}>
            <h4 style={{
              color: 'rgb(145, 111, 65)',
              fontFamily: 'romie, sans-serif',
              marginBottom: '0.5rem'
            }}>
              {t('deliveryFee', language)}: $15.00
            </h4>
            <p style={{color: '#666', fontSize: '0.9rem'}}>
              This fee covers secure delivery to your address within 24-48 hours.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#ccc' : '#bfa100',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '1rem',
              fontSize: '1.1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontFamily: 'romie, sans-serif'
            }}
          >
            {loading ? 'Processing...' : t('payDeliveryFee', language)}
          </button>
        </form>
      </div>
    </div>
  );
}

export default DeliveryForm; 