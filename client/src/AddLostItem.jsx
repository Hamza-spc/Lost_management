import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import defaultImage from './assets/defaultImage.png';
import { t } from './i18n';


function AddLostItem({ logo, language }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateLastSeen, setDateLastSeen] = useState('');
  const [placeLastSeen, setPlaceLastSeen] = useState('');
  const [email, setEmail] = useState('');
  const [id, setId] = useState(generateUniqueId());
  const [image, setImage] = useState('');
  const [status, setStatus] = useState('Declared by client');
  const [expiration, setExpiration] = useState('unlimited');
  const navigate = useNavigate();
  const location = useLocation();
  const isClient = location.state && location.state.client === true;
  const isStaff = location.state && location.state.staff === true;

  // Generate unique ID function
  function generateUniqueId() {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substr(2, 5);
    return `ITEM-${timestamp}-${randomStr}`.toUpperCase();
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get client information if user is logged in
    let clientEmail = email;
    let clientId = null;
    if (isClient) {
      const clientUser = localStorage.getItem('clientUser');
      if (clientUser) {
        const user = JSON.parse(clientUser);
        clientEmail = user.email;
        clientId = user.id; // This is now the client's MongoDB _id
        console.log('Client user email:', user.email, 'clientId:', user.id);
      }
    }
    
    const itemData = {
      id,
      title,
      description,
      dateLastSeen,
      placeLastSeen,
      email: isClient ? email : undefined,
      clientEmail: isClient ? clientEmail : undefined,
      clientId: isClient ? clientId : undefined,
      image: image || defaultImage,
      status: isClient ? 'Declared by client' : isStaff ? 'Found by staff' : status,
      expiration: isStaff ? expiration : undefined
    };
    
    console.log('Submitting item data:', itemData);
    
    try {
      await axios.post('http://localhost:3001/lostitems', itemData);
      if (isClient) {
        alert('Report sent successfully, the staffs will be notified');
        navigate('/client-dashboard');
      } else {
        alert('Lost item added successfully!');
        navigate('/home');
      }
    } catch (err) {
      alert('Error adding lost item.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'flex-start', 
      padding: '1rem 0.5rem',
      margin: 0,
      width: '100%'
    }}>
      <img src={logo} alt='Hotel Logo' style={{width: '140px', marginBottom: '1.5rem'}} />
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .add-lost-item-container {
          background: white;
          border-radius: 24px;
          box-shadow: 0 8px 32px rgba(191, 161, 0, 0.12);
          padding: 2.5rem;
          width: calc(100% - 1rem);
          max-width: 600px;
          margin: 0 auto;
          animation: fadeInUp 0.6s ease-out;
          border: 1px solid rgba(191, 161, 0, 0.1);
        }
        
        .add-lost-item-title {
          color: #bfa100;
          font-family: 'romie', sans-serif;
          font-weight: 700;
          text-align: center;
          margin-bottom: 2rem;
          font-size: 1.75rem;
          letter-spacing: -0.02em;
        }
        
        .add-lost-item-label {
          color: #495057;
          font-family: 'romie', sans-serif;
          font-weight: 600;
          margin-bottom: 0.5rem;
          display: block;
          font-size: 0.95rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-control {
          width: 100%;
          padding: 0.875rem 1rem;
          font-size: 1rem;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          transition: all 0.2s ease;
          background: #fff;
          font-family: inherit;
        }
        
        .form-control:focus {
          outline: none;
          border-color: #bfa100;
          box-shadow: 0 0 0 3px rgba(191, 161, 0, 0.1);
          background: #fff;
        }
        
        .form-control:disabled {
          background: #f8f9fa;
          color: #6c757d;
          cursor: not-allowed;
        }
        
        textarea.form-control {
          min-height: 100px;
          resize: vertical;
        }
        
        .add-lost-item-btn {
          background: linear-gradient(135deg, #bfa100 0%, #d4b800 100%);
          color: #fff;
          font-weight: 600;
          border: none;
          border-radius: 12px;
          padding: 1rem 2rem;
          font-size: 1.1rem;
          box-shadow: 0 4px 16px rgba(191, 161, 0, 0.25);
          transition: all 0.3s ease;
          cursor: pointer;
          width: 100%;
          font-family: 'romie', sans-serif;
          letter-spacing: 0.02em;
        }
        
        .add-lost-item-btn:hover {
          background: linear-gradient(135deg, #a88a00 0%, #bfa100 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(191, 161, 0, 0.35);
        }
        
        .add-lost-item-btn:active {
          transform: translateY(0);
        }
        
        .image-preview {
          margin-top: 1rem;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .image-preview img {
          width: 100%;
          max-width: 300px;
          height: auto;
          display: block;
        }
        
        .form-help-text {
          color: #6c757d;
          font-size: 0.85rem;
          margin-top: 0.25rem;
          font-style: italic;
        }
        
        .required-asterisk {
          color: #dc3545;
          margin-left: 2px;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          margin-bottom: 1.5rem;
          align-items: start;
        }
        
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .add-lost-item-container {
            padding: 2rem 1.5rem;
            margin: 0;
            width: calc(100% - 0.5rem);
          }
        }
      `}</style>
      <div className='add-lost-item-container'>
        <h2 className='add-lost-item-title'>{t('addLostItem', language)}</h2>
        <form onSubmit={handleSubmit}>
          {/* ID Field */}
          <div className='form-group'>
            <label className='add-lost-item-label'>
              {t('id', language)}<span className='required-asterisk'>*</span>
            </label>
            <input 
              type='text' 
              className='form-control' 
              value={id} 
              onChange={e => setId(e.target.value)} 
              required 
              style={{backgroundColor: '#f8f9fa'}} 
            />
            <div className='form-help-text'>Auto-generated unique identifier</div>
          </div>

          {/* Title Field */}
          <div className='form-group'>
            <label className='add-lost-item-label'>
              {t('title', language)}<span className='required-asterisk'>*</span>
            </label>
            <input 
              type='text' 
              className='form-control' 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required 
              placeholder="e.g., iPhone 13, Black Wallet, Gold Watch"
            />
          </div>

          {/* Description Field */}
          <div className='form-group'>
            <label className='add-lost-item-label'>
              {t('description', language)}<span className='required-asterisk'>*</span>
            </label>
            <textarea 
              className='form-control' 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              required 
              placeholder="Provide detailed description of the item..."
            />
          </div>

          {/* Date and Place Row */}
          <div className='form-row'>
            <div className='form-group'>
              <label className='add-lost-item-label'>
                {t('dateLastSeen', language)}<span className='required-asterisk'>*</span>
              </label>
              <input 
                type='date' 
                className='form-control' 
                value={dateLastSeen} 
                onChange={e => setDateLastSeen(e.target.value)} 
                required 
              />
            </div>
            <div className='form-group'>
              <label className='add-lost-item-label'>
                {t('placeLastSeen', language)}<span className='required-asterisk'>*</span>
              </label>
              <input 
                type='text' 
                className='form-control' 
                value={placeLastSeen} 
                onChange={e => setPlaceLastSeen(e.target.value)} 
                required 
                placeholder="e.g., Lobby, Restaurant, Pool Area"
              />
            </div>
          </div>

          {/* Email Field (for clients only) */}
          {isClient && (
            <div className='form-group'>
              <label className='add-lost-item-label'>
                {t('emailLabel', language)}<span className='required-asterisk'>*</span>
              </label>
              <input 
                type='email' 
                className='form-control' 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                placeholder="your.email@example.com"
              />
            </div>
          )}

          {/* Status Field */}
          <div className='form-group'>
            <label className='add-lost-item-label'>{t('status', language)}</label>
            {isClient ? (
              <input 
                type='text' 
                className='form-control' 
                value={t('declaredByClient', language)} 
                disabled 
              />
            ) : isStaff ? (
              <input 
                type='text' 
                className='form-control' 
                value={t('foundByStaff', language)} 
                disabled 
              />
            ) : (
              <select className='form-control' value={status} onChange={e => setStatus(e.target.value)}>
                <option value='Found by staff'>{t('foundByStaff', language)}</option>
                <option value='Declared by client'>{t('declaredByClient', language)}</option>
                <option value='Delivered'>{t('delivered', language)}</option>
              </select>
            )}
          </div>

          {/* Expiration Field (for staff only) */}
          {isStaff && (
            <div className='form-group'>
              <label className='add-lost-item-label'>{t('expiration', language)}</label>
              <select className='form-control' value={expiration} onChange={e => setExpiration(e.target.value)}>
                <option value='1 month'>{t('expiration1Month', language)}</option>
                <option value='1 year'>{t('expiration1Year', language)}</option>
                <option value='unlimited'>{t('expirationUnlimited', language)}</option>
              </select>
            </div>
          )}

          {/* Image Upload Field */}
          <div className='form-group'>
            <label className='add-lost-item-label'>{t('imageOptional', language)}</label>
            <input 
              type='file' 
              className='form-control' 
              accept='image/*' 
              onChange={handleImageChange} 
            />
            <div className='form-help-text'>Upload a photo to help identify the item</div>
            {image && (
              <div className='image-preview'>
                <img src={image} alt='Preview' />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button type='submit' className='add-lost-item-btn'>
            {t('submit', language)}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddLostItem; 