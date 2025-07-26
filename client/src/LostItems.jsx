import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { t } from './i18n';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

const NO_IMAGE_URL = 'https://img.freepik.com/icon/no-image-available-vector_53876-51002.jpg';

function LostItems({ logo, language }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [editFields, setEditFields] = useState({});
  const [aiResults, setAiResults] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const fileInputRef = useRef();
  const location = useLocation();
  const onlyDeclaredByClient = location.state && location.state.onlyDeclaredByClient;
  const isStaff = !onlyDeclaredByClient;

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    let filteredItems = items;
    if (onlyDeclaredByClient) {
      filteredItems = filteredItems.filter(item => item.status === 'Declared by client');
    }
    if (search.trim() !== '') {
      filteredItems = filteredItems.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.placeLastSeen.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (dateFilter) {
      filteredItems = filteredItems.filter(item => {
        if (!item.dateLastSeen) return false;
        const itemDate = new Date(item.dateLastSeen).toISOString().split('T')[0];
        return itemDate === dateFilter;
      });
    }
    setFiltered(filteredItems);
  }, [search, dateFilter, items, onlyDeclaredByClient]);

  const fetchItems = async () => {
    try {
      const res = await axios.get('http://localhost:3001/lostitems');
      setItems(res.data);
      setFiltered(res.data);
    } catch (err) {
      setItems([]);
      setFiltered([]);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await axios.delete(`http://localhost:3001/lostitems/${id}`);
      fetchItems();
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  const handleEdit = (item) => {
    setEditItem(item._id);
    setEditFields({
      title: item.title,
      description: item.description,
      dateLastSeen: item.dateLastSeen ? item.dateLastSeen.split('T')[0] : '',
      placeLastSeen: item.placeLastSeen,
      email: item.email || '',
      status: item.status,
      expiration: item.expiration || 'unlimited',
    });
  };

  const handleEditChange = (e) => {
    setEditFields({ ...editFields, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id) => {
    try {
      await axios.patch(`http://localhost:3001/lostitems/${id}`, editFields);
      setEditItem(null);
      fetchItems();
    } catch (err) {
      alert('Failed to update item');
    }
  };

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      await axios.patch(`http://localhost:3001/lostitems/${itemId}`, { status: newStatus });
      fetchItems();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  // AI Similarity Search
  const handleAISearch = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAiLoading(true);
    setAiResults([]);
    // Load MobileNet
    const model = await mobilenet.load();
    // Read uploaded image
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    await new Promise(res => { img.onload = res; });
    // Get embedding for uploaded image
    const uploadedTensor = tf.browser.fromPixels(img).resizeNearestNeighbor([224,224]).toFloat().expandDims();
    const uploadedEmbedding = model.infer(uploadedTensor, true);
    // Get embeddings for all items
    const itemEmbeddings = await Promise.all(filtered.map(async item => {
      const itemImg = document.createElement('img');
      itemImg.src = item.image || NO_IMAGE_URL;
      await new Promise(res => { itemImg.onload = res; });
      const itemTensor = tf.browser.fromPixels(itemImg).resizeNearestNeighbor([224,224]).toFloat().expandDims();
      const itemEmbedding = model.infer(itemTensor, true);
      return itemEmbedding;
    }));
    // Compute cosine similarity
    const uploadedNorm = uploadedEmbedding.norm();
    const similarities = itemEmbeddings.map((emb, i) => {
      const dot = uploadedEmbedding.flatten().dot(emb.flatten());
      const sim = dot.div(uploadedNorm.mul(emb.norm())).dataSync()[0];
      return { item: filtered[i], similarity: sim };
    });
    similarities.sort((a, b) => b.similarity - a.similarity);
    setAiResults(similarities.slice(0, 1)); // Show only the most similar
    setAiLoading(false);
  };

  return (
    <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #fffbe6 0%, #bfa100 100%)', padding: '3rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <img src={logo} alt='Hotel Logo' style={{width: '160px', marginBottom: '2rem'}} />
      <div style={{maxWidth: '900px', margin: '0 auto', width: '100%'}}>
        <h2 style={{color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif', textAlign: 'center', marginBottom: '2rem'}}>{t('viewLostItems', language)}</h2>
        <div style={{display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center'}}>
          <input
            type='text'
            placeholder={t('searchLostItems', language)}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{flex: '1 1 300px', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e6c200', fontSize: '1rem'}}
          />
          <input
            type='date'
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            style={{flex: '0 0 200px', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e6c200', fontSize: '1rem'}}
          />
          {isStaff && (
            <>
              <input
                type='file'
                accept='image/*'
                ref={fileInputRef}
                style={{display: 'none'}}
                onChange={handleAISearch}
              />
              <button
                onClick={() => fileInputRef.current.click()}
                style={{background: '#bfa100', color: '#fff', border: 'none', borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative'}}
                title='Upload a photo and let AI find visually similar items'
              >
                <svg width='28' height='28' viewBox='0 0 24 24' fill='none'><circle cx='12' cy='12' r='10' stroke='white' strokeWidth='2'/><path d='M8 16v-1a4 4 0 0 1 8 0v1' stroke='white' strokeWidth='2'/><circle cx='12' cy='10' r='2' fill='white'/></svg>
                <span style={{position: 'absolute', bottom: -28, left: '50%', transform: 'translateX(-50%)', background: '#222', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: 6, fontSize: 12, whiteSpace: 'nowrap', opacity: 0, pointerEvents: 'none', transition: 'opacity 0.2s'}} className='ai-tooltip'>AI</span>
              </button>
            </>
          )}
        </div>
        {aiLoading && <div style={{textAlign: 'center', color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif', fontWeight: 'bold'}}>AI is searching for similar items...</div>}
        {aiResults.length > 0 && (
          <div style={{marginBottom: '2rem'}}>
            <h4 style={{color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif', textAlign: 'center'}}>AI Similar Items</h4>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center'}}>
              {aiResults.map(({ item, similarity }) => (
                <div key={item._id || item.id} style={{background: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(191, 161, 0, 0.10)', padding: '1.5rem', width: '260px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                  <img
                    src={item.image ? item.image : NO_IMAGE_URL}
                    alt={item.title}
                    style={{width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem', background: '#f8f8f8'}}
                  />
                  <h4 style={{color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif', marginBottom: '0.5rem'}}>{item.title}</h4>
                  <p style={{marginBottom: '0.5rem'}}><strong>ID:</strong> {item.id}</p>
                  <p style={{marginBottom: '0.5rem'}}><strong>{t('description', language)}:</strong> {item.description}</p>
                  <p style={{marginBottom: '0.5rem'}}><strong>{t('dateLastSeen', language)}:</strong> {item.dateLastSeen ? new Date(item.dateLastSeen).toLocaleDateString() : ''}</p>
                  <p style={{marginBottom: '0.5rem'}}><strong>{t('placeLastSeen', language)}:</strong> {item.placeLastSeen}</p>
                  {item.email && (
                    <p style={{marginBottom: '0.5rem'}}><strong>{t('emailLabel', language)}:</strong> {item.email}</p>
                  )}
                  <div style={{marginTop: '0.5rem', width: '100%'}}>
                    <label style={{color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif', fontWeight: 500}}>{t('status', language)}: </label>
                    <span style={{marginLeft: '0.5rem'}}>{t(item.status === 'Found by staff' ? 'foundByStaff' : item.status === 'Declared by client' ? 'declaredByClient' : item.status.toLowerCase(), language)}</span>
                  </div>
                  <div style={{marginTop: '0.5rem', width: '100%'}}>
                    <label style={{color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif', fontWeight: 500}}>{t('expiration', language)}: </label>
                    <span style={{marginLeft: '0.5rem'}}>{t('expiration' + (item.expiration === '1 month' ? '1Month' : item.expiration === '1 year' ? '1Year' : 'Unlimited'), language)}</span>
                  </div>
                  <div style={{marginTop: '0.5rem', color: '#888', fontSize: 13}}>Similarity: {(similarity * 100).toFixed(1)}%</div>
                </div>
              ))}
            </div>
          </div>
        )}
        <style>{`
          @media (min-width: 900px) {
            .lost-items-grid {
              display: grid !important;
              grid-template-columns: repeat(3, 1fr) !important;
            }
          }
          @media (max-width: 899px) {
            .lost-items-grid {
              display: grid !important;
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
        <div
          className='lost-items-grid'
          style={{
            gap: '2rem',
            justifyContent: 'center',
            alignItems: 'stretch',
            margin: '0 auto',
            width: '100%'
          }}
        >
          {filtered.length === 0 && <p>{t('noLostItemsFound', language)}</p>}
          {filtered.map(item => (
            <div key={item._id || item.id} style={{background: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(191, 161, 0, 0.10)', padding: '1.5rem', width: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative'}}>
              <img
                src={item.image ? item.image : NO_IMAGE_URL}
                alt={item.title}
                style={{width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem', background: '#f8f8f8'}}
                onError={e => { e.target.onerror = null; e.target.src = NO_IMAGE_URL; }}
              />
              {editItem === item._id ? (
                <>
                  <input name='title' value={editFields.title} onChange={handleEditChange} className='form-control mb-2' />
                  <textarea name='description' value={editFields.description} onChange={handleEditChange} className='form-control mb-2' />
                  <input name='dateLastSeen' type='date' value={editFields.dateLastSeen} onChange={handleEditChange} className='form-control mb-2' />
                  <input name='placeLastSeen' value={editFields.placeLastSeen} onChange={handleEditChange} className='form-control mb-2' />
                  <input name='email' type='email' value={editFields.email || ''} onChange={handleEditChange} className='form-control mb-2' placeholder={t('emailLabel', language)} />
                  <select name='status' value={editFields.status} onChange={handleEditChange} className='form-control mb-2'>
                    <option value='Found by staff'>{t('foundByStaff', language)}</option>
                    <option value='Declared by client'>{t('declaredByClient', language)}</option>
                    <option value='Delivered'>{t('delivered', language)}</option>
                  </select>
                  <select name='expiration' value={editFields.expiration} onChange={handleEditChange} className='form-control mb-2'>
                    <option value='1 month'>{t('expiration1Month', language)}</option>
                    <option value='1 year'>{t('expiration1Year', language)}</option>
                    <option value='unlimited'>{t('expirationUnlimited', language)}</option>
                  </select>
                  <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.5rem'}}>
                    <button onClick={() => handleEditSave(item._id)} style={{background: '#bfa100', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', fontWeight: 'bold', cursor: 'pointer'}}>{t('submit', language)}</button>
                    <button onClick={() => setEditItem(null)} style={{background: '#ccc', color: '#333', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', fontWeight: 'bold', cursor: 'pointer'}}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <h4 style={{color: '#e6c200', marginBottom: '0.5rem'}}>{item.title}</h4>
                  <p style={{marginBottom: '0.5rem'}}><strong>ID:</strong> {item.id}</p>
                  <p style={{marginBottom: '0.5rem'}}><strong>{t('description', language)}:</strong> {item.description}</p>
                  <p style={{marginBottom: '0.5rem'}}><strong>{t('dateLastSeen', language)}:</strong> {item.dateLastSeen ? new Date(item.dateLastSeen).toLocaleDateString() : ''}</p>
                  <p style={{marginBottom: '0.5rem'}}><strong>{t('placeLastSeen', language)}:</strong> {item.placeLastSeen}</p>
                  {item.email && (
                    <p style={{marginBottom: '0.5rem'}}><strong>{t('emailLabel', language)}:</strong> {item.email}</p>
                  )}
                  <div style={{marginTop: '0.5rem', width: '100%'}}>
                    <label style={{color: '#e6c200', fontWeight: 500}}>{t('status', language)}: </label>
                    <select
                      value={item.status || 'Declared by client'}
                      onChange={e => handleStatusChange(item._id, e.target.value)}
                      style={{marginLeft: '0.5rem', borderRadius: '6px', border: '1px solid #e6c200', padding: '0.25rem 0.5rem'}}
                    >
                      <option value='Found by staff'>{t('foundByStaff', language)}</option>
                      <option value='Declared by client'>{t('declaredByClient', language)}</option>
                      <option value='Delivered'>{t('delivered', language)}</option>
                    </select>
                  </div>
                  <div style={{marginTop: '0.5rem', width: '100%'}}>
                    <label style={{color: '#e6c200', fontWeight: 500}}>{t('expiration', language)}: </label>
                    <span style={{marginLeft: '0.5rem'}}>{t('expiration' + (item.expiration === '1 month' ? '1Month' : item.expiration === '1 year' ? '1Year' : 'Unlimited'), language)}</span>
                  </div>
                  {isStaff && (
                    <div style={{display: 'flex', gap: '0.5rem', marginTop: '1rem'}}>
                      <button onClick={() => handleEdit(item)} style={{background: '#bfa100', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', fontWeight: 'bold', cursor: 'pointer'}}>Modify</button>
                      <button onClick={() => handleDelete(item._id)} style={{background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', fontWeight: 'bold', cursor: 'pointer'}}>Delete</button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LostItems; 