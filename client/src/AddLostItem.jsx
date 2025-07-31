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
    <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #fffbe6 0%, #bfa100 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '3rem 1rem'}}>
      <img src={logo} alt='Hotel Logo' style={{width: '160px', marginBottom: '2rem'}} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .add-lost-item-container {
          background: white;
          border-radius: 20px;
          box-shadow: 0 4px 24px rgba(191, 161, 0, 0.15);
          padding: 3rem 2.5rem;
          width: 100%;
          max-width: 500px;
          margin: 2rem auto;
        }
        .add-lost-item-title {
          color: rgb(145, 111, 65);
          font-family: romie, sans-serif;
          font-weight: bold;
          text-align: center;
          margin-bottom: 2rem;
          font-size: 2rem;
        }
        .add-lost-item-label {
          color: rgb(145, 111, 65);
          font-family: romie, sans-serif;
          font-weight: 500;
        }
        .add-lost-item-btn {
          background: #bfa100;
          color: #fff;
          font-weight: bold;
          border: none;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(191, 161, 0, 0.10);
          transition: background 0.2s;
        }
        .add-lost-item-btn:hover {
          background: #bfa100;
          color: #fff;
        }
      `}</style>
              <div className='add-lost-item-container'>
        <h2 className='add-lost-item-title'>{t('addLostItem', language)}</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label className='add-lost-item-label'>{t('id', language)}</label>
            <input type='text' className='form-control' value={id} onChange={e => setId(e.target.value)} required style={{backgroundColor: '#f9f9f9'}} />
            <small style={{color: '#666', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block'}}>Auto-generated unique identifier</small>
          </div>
          <div className='mb-3'>
            <label className='add-lost-item-label'>{t('title', language)}</label>
            <input type='text' className='form-control' value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div className='mb-3'>
            <label className='add-lost-item-label'>{t('description', language)}</label>
            <textarea className='form-control' value={description} onChange={e => setDescription(e.target.value)} required />
          </div>
          <div className='mb-3'>
            <label className='add-lost-item-label'>{t('dateLastSeen', language)}</label>
            <input type='date' className='form-control' value={dateLastSeen} onChange={e => setDateLastSeen(e.target.value)} required />
          </div>
          <div className='mb-3'>
            <label className='add-lost-item-label'>{t('placeLastSeen', language)}</label>
            <input type='text' className='form-control' value={placeLastSeen} onChange={e => setPlaceLastSeen(e.target.value)} required />
          </div>
          {isClient && (
            <div className='mb-3'>
              <label className='add-lost-item-label'>{t('emailLabel', language)}</label>
              <input type='email' className='form-control' value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
          )}
          <div className='mb-3'>
            <label className='add-lost-item-label'>{t('status', language)}</label>
            {isClient ? (
              <input type='text' className='form-control' value={t('declaredByClient', language)} disabled />
            ) : isStaff ? (
              <input type='text' className='form-control' value={t('foundByStaff', language)} disabled />
            ) : (
              <select className='form-control' value={status} onChange={e => setStatus(e.target.value)}>
                <option value='Found by staff'>{t('foundByStaff', language)}</option>
                <option value='Declared by client'>{t('declaredByClient', language)}</option>
                <option value='Delivered'>{t('delivered', language)}</option>
              </select>
            )}
          </div>
          {isStaff && (
            <div className='mb-3'>
              <label className='add-lost-item-label'>{t('expiration', language)}</label>
              <select className='form-control' value={expiration} onChange={e => setExpiration(e.target.value)}>
                <option value='1 month'>{t('expiration1Month', language)}</option>
                <option value='1 year'>{t('expiration1Year', language)}</option>
                <option value='unlimited'>{t('expirationUnlimited', language)}</option>
              </select>
            </div>
          )}
          <div className='mb-3'>
            <label className='add-lost-item-label'>{t('imageOptional', language)}</label>
            <input type='file' className='form-control' accept='image/*' onChange={handleImageChange} />
            {image && <img src={image} alt='Preview' style={{marginTop: '1rem', maxWidth: '100%', borderRadius: '8px'}} />}
          </div>
          <button type='submit' className='add-lost-item-btn w-100 py-2'>{t('submit', language)}</button>
        </form>
      </div>
    </div>
  );
}

export default AddLostItem; 