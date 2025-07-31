import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { t } from './i18n';
import logoHotel from './assets/logoHotel.png';
import { config } from './config.js';

const stripePromise = loadStripe(config.STRIPE_PUBLISHABLE_KEY);

// Stripe Payment Form Component
function StripePaymentForm({ onSuccess, onError, loading, setLoading }) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      // Create payment intent on the server
      const token = localStorage.getItem('clientToken');
      const response = await fetch(`${config.API_BASE_URL}/api/payment/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: config.DELIVERY_FEE,
          description: 'Delivery fee for lost item'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      // Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: 'Client Name',
            email: localStorage.getItem('clientUser') ? JSON.parse(localStorage.getItem('clientUser')).email : ''
          }
        }
      });

      if (error) {
        onError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      }
    } catch (error) {
      onError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <div style={{
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1.5rem',
        background: '#f9f9f9'
      }}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      <button
        type="submit"
        disabled={!stripe || loading}
        style={{
          background: !stripe || loading ? '#ccc' : '#bfa100',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          cursor: !stripe || loading ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          width: '100%'
        }}
      >
        {loading ? 'Processing Payment...' : 'Pay $15.00'}
      </button>
    </form>
  );
}

function PaymentOptions({ language }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [showStripeForm, setShowStripeForm] = useState(false);

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

  const handleBackToDashboard = () => {
    navigate('/client-dashboard');
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    setShowStripeForm(method === 'stripe');
  };

  const handlePaymentSuccess = (paymentIntent) => {
    alert('Payment successful! Your delivery will be processed.');
    navigate('/client-dashboard');
  };

  const handlePaymentError = (error) => {
    alert(`Payment failed: ${error}`);
  };

  const paymentMethods = [
    {
      id: 'stripe',
      name: 'Credit Card',
      description: 'Visa, Mastercard, American Express',
      icon: '💳',
      color: '#6772e5'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay with your PayPal account',
      icon: '🔵',
      color: '#0070ba'
    },
    {
      id: 'apple-pay',
      name: 'Apple Pay',
      description: 'Quick and secure payment',
      icon: '🍎',
      color: '#000000'
    }
  ];

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fffbe6 0%, #bfa100 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem'
    }}>
      {/* Header */}
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

      {/* Main Content */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 4px 24px rgba(191, 161, 0, 0.15)',
        padding: '3rem',
        width: '100%',
        maxWidth: '600px',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: 'rgb(145, 111, 65)',
          fontFamily: 'romie, sans-serif',
          fontWeight: 'bold',
          fontSize: '2rem',
          marginBottom: '1rem'
        }}>
          Delivery Fee Payment
        </h1>

        <p style={{
          color: '#666',
          fontSize: '1.1rem',
          marginBottom: '2rem'
        }}>
          Amount to pay: <strong style={{color: 'rgb(145, 111, 65)'}}>$15.00</strong>
        </p>

        <div style={{
          marginBottom: '2rem'
        }}>
          <h2 style={{
            color: 'rgb(145, 111, 65)',
            fontFamily: 'romie, sans-serif',
            fontSize: '1.3rem',
            marginBottom: '1.5rem'
          }}>
            Select Payment Method
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => handlePaymentMethodSelect(method.id)}
                style={{
                  border: selectedPaymentMethod === method.id ? '3px solid rgb(145, 111, 65)' : '2px solid #e0e0e0',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: selectedPaymentMethod === method.id ? '#fffbe6' : 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <div style={{
                  fontSize: '2rem',
                  marginBottom: '0.5rem'
                }}>
                  {method.icon}
                </div>
                <h3 style={{
                  color: method.color,
                  fontFamily: 'romie, sans-serif',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  margin: 0
                }}>
                  {method.name}
                </h3>
                <p style={{
                  color: '#666',
                  fontSize: '0.9rem',
                  margin: 0,
                  textAlign: 'center'
                }}>
                  {method.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Form or Action Buttons */}
        {showStripeForm ? (
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{
              color: 'rgb(145, 111, 65)',
              fontFamily: 'romie, sans-serif',
              fontSize: '1.2rem',
              marginBottom: '1rem'
            }}>
              Enter Card Details
            </h3>
            <Elements stripe={stripePromise}>
              <StripePaymentForm
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                loading={loading}
                setLoading={setLoading}
              />
            </Elements>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={handleBackToDashboard}
              style={{
                background: '#ccc',
                color: '#333',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Back to Dashboard
            </button>
            
            {selectedPaymentMethod && selectedPaymentMethod !== 'stripe' && (
              <button
                onClick={() => alert(`Redirecting to ${selectedPaymentMethod} payment gateway...`)}
                style={{
                  background: '#bfa100',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Proceed to {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
              </button>
            )}
          </div>
        )}

        {selectedPaymentMethod && !showStripeForm && (
          <p style={{
            color: '#28a745',
            fontSize: '0.9rem',
            marginTop: '1rem',
            fontStyle: 'italic'
          }}>
            Selected: {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
          </p>
        )}
      </div>
    </div>
  );
}

export default PaymentOptions; 