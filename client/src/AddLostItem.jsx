import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import defaultImage from './assets/defaultImage.png';

function AddLostItem() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateLastSeen, setDateLastSeen] = useState('');
  const [placeLastSeen, setPlaceLastSeen] = useState('');
  const [id, setId] = useState('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState('Declared by client');
  const navigate = useNavigate();

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
    try {
      await axios.post('http://localhost:3001/lostitems', {
        id,
        title,
        description,
        dateLastSeen,
        placeLastSeen,
        image: image || defaultImage,
        status
      });
      alert('Lost item added successfully!');
      navigate('/home');
    } catch (err) {
      alert('Error adding lost item.');
    }
  };

  return (
    <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #fffde4 0%, #ffe680 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <style>{`
        .add-lost-item-container {
          background: white;
          border-radius: 20px;
          box-shadow: 0 4px 24px rgba(255, 230, 128, 0.15);
          padding: 2.5rem 2rem;
          width: 100%;
          max-width: 400px;
          margin: 2rem;
        }
        .add-lost-item-title {
          color: #e6c200;
          font-weight: bold;
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .add-lost-item-label {
          color: #e6c200;
          font-weight: 500;
        }
        .add-lost-item-btn {
          background: linear-gradient(90deg, #ffe680 0%, #fffde4 100%);
          color: #fff;
          font-weight: bold;
          border: none;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(255, 230, 128, 0.10);
          transition: background 0.2s;
        }
        .add-lost-item-btn:hover {
          background: linear-gradient(90deg, #fffde4 0%, #ffe680 100%);
          color: #e6c200;
        }
      `}</style>
      <div className='add-lost-item-container'>
        <h2 className='add-lost-item-title'>Add a Lost Item</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label className='add-lost-item-label'>ID</label>
            <input type='text' className='form-control' value={id} onChange={e => setId(e.target.value)} required />
          </div>
          <div className='mb-3'>
            <label className='add-lost-item-label'>Title</label>
            <input type='text' className='form-control' value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div className='mb-3'>
            <label className='add-lost-item-label'>Description</label>
            <textarea className='form-control' value={description} onChange={e => setDescription(e.target.value)} required />
          </div>
          <div className='mb-3'>
            <label className='add-lost-item-label'>Date Last Seen</label>
            <input type='date' className='form-control' value={dateLastSeen} onChange={e => setDateLastSeen(e.target.value)} required />
          </div>
          <div className='mb-3'>
            <label className='add-lost-item-label'>Place Last Seen</label>
            <input type='text' className='form-control' value={placeLastSeen} onChange={e => setPlaceLastSeen(e.target.value)} required />
          </div>
          <div className='mb-3'>
            <label className='add-lost-item-label'>Status</label>
            <select className='form-control' value={status} onChange={e => setStatus(e.target.value)}>
              <option value='Found by staff'>Found by staff</option>
              <option value='Declared by client'>Declared by client</option>
              <option value='Found'>Found</option>
              <option value='Delivered'>Delivered</option>
            </select>
          </div>
          <div className='mb-3'>
            <label className='add-lost-item-label'>Image (optional)</label>
            <input type='file' className='form-control' accept='image/*' onChange={handleImageChange} />
            {image && <img src={image} alt='Preview' style={{marginTop: '1rem', maxWidth: '100%', borderRadius: '8px'}} />}
          </div>
          <button type='submit' className='add-lost-item-btn w-100 py-2'>Submit</button>
        </form>
      </div>
    </div>
  );
}

export default AddLostItem; 