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
  const [aiEmailModal, setAiEmailModal] = useState(false);
  const [aiEmailItemId, setAiEmailItemId] = useState('');
  const [aiEmailContent, setAiEmailContent] = useState('');
  const [aiEmailLoading, setAiEmailLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('reports'); // 'reports' or 'items'
  const fileInputRef = useRef();
  const location = useLocation();
  const onlyDeclaredByClient = location.state && location.state.onlyDeclaredByClient;
  const isStaff = !onlyDeclaredByClient;

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    let filteredItems = items;
    
    // Filter by section
    if (isStaff) {
      if (activeSection === 'reports') {
        // Check Reports: Show only "Declared by client" items
        filteredItems = filteredItems.filter(item => item.status === 'Declared by client');
      } else {
        // View Lost Items: Show "Found by staff" and other statuses (but not "Declared by client")
        filteredItems = filteredItems.filter(item => item.status !== 'Declared by client');
      }
    } else if (onlyDeclaredByClient) {
      filteredItems = filteredItems.filter(item => item.status === 'Declared by client');
    }
    
    // Apply search filter
    if (search.trim() !== '') {
      filteredItems = filteredItems.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.placeLastSeen.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply date filter
    if (dateFilter) {
      filteredItems = filteredItems.filter(item => {
        if (!item.dateLastSeen) return false;
        const itemDate = new Date(item.dateLastSeen).toISOString().split('T')[0];
        return itemDate === dateFilter;
      });
    }
    
    setFiltered(filteredItems);
  }, [search, dateFilter, items, onlyDeclaredByClient, isStaff, activeSection]);

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
    setEditItem(item.id);
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
      console.log('Updating status for item:', itemId, 'to:', newStatus);
      const response = await axios.patch(`http://localhost:3001/lostitems/${itemId}/status`, { status: newStatus });
      console.log('Status update response:', response.data);
      fetchItems();
    } catch (err) {
      console.error('Status update error:', err);
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

  // AI Email Generation
  const handleAIEmailGeneration = () => {
    setAiEmailModal(true);
    setAiEmailItemId('');
    setAiEmailContent('');
  };

  const handleAIEmailSubmit = async () => {
    if (!aiEmailItemId.trim()) {
      alert('Please enter an item ID');
      return;
    }

    setAiEmailLoading(true);
    try {
      // Find the item by ID
      const item = items.find(item => item.id === aiEmailItemId.trim());
      if (!item) {
        alert('Item not found. Please check the ID and try again.');
        setAiEmailLoading(false);
        return;
      }

      // Generate professional email content
      const emailContent = generateProfessionalEmail(item);
      setAiEmailContent(emailContent);
    } catch (error) {
      console.error('Error generating email:', error);
      alert('Error generating email. Please try again.');
    } finally {
      setAiEmailLoading(false);
    }
  };

  const generateProfessionalEmail = (item) => {
    const currentDate = new Date().toLocaleDateString();
    const hotelName = 'Hotel Management System'; // You can customize this
    
    return `Subject: Lost Item Found - ${item.title}

Dear ${item.clientEmail ? item.clientEmail.split('@')[0] : 'Valued Guest'},

We are pleased to inform you that your lost item has been successfully located and is now in our possession.

Item Details:
• Item: ${item.title}
• Description: ${item.description}
• Date Last Seen: ${item.dateLastSeen ? new Date(item.dateLastSeen).toLocaleDateString() : 'Not specified'}
• Location: ${item.placeLastSeen}
• Item ID: ${item.id}

Current Status: ${item.status}

Please respond to this email with your preference for receiving your item:

OPTION 1 - Pickup at Hotel:
• You can collect your item directly from our front desk
• Please bring a valid ID for verification
• No additional charges apply

OPTION 2 - Delivery to Your Address:
• We can deliver your item to your specified address
• Please include your complete delivery address in your response
• A delivery fee of $15.00 will apply
• After confirming your delivery preference, please proceed to the "Pay Delivery Fee" section in our app to complete the payment

Please reply to this email with:
1. Your choice (Pickup or Delivery)
2. If choosing delivery, please provide your complete address
3. Any additional instructions or special requirements

We look forward to hearing from you and will process your request accordingly.

Best regards,
${hotelName} Staff
Lost and Found Department
Date: ${currentDate}

---
This is an automated email generated by our Lost and Found Management System.`;
  };

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(aiEmailContent);
    alert('Email content copied to clipboard!');
  };

  return (
    <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #fffbe6 0%, #bfa100 100%)', padding: '3rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <img src={logo} alt='Hotel Logo' style={{width: '160px', marginBottom: '2rem'}} />
      <div style={{maxWidth: '900px', margin: '0 auto', width: '100%'}}>
        <h2 style={{color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif', textAlign: 'center', marginBottom: '2rem'}}>
          {isStaff ? (activeSection === 'reports' ? t('checkReports', language) : t('viewLostItems', language)) : t('viewLostItems', language)}
        </h2>
        
        {/* Section Tabs for Staff */}
        {isStaff && (
          <div style={{display: 'flex', justifyContent: 'center', marginBottom: '2rem'}}>
            <div style={{display: 'flex', background: '#f0f0f0', borderRadius: '8px', padding: '4px'}}>
              <button
                onClick={() => setActiveSection('reports')}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: activeSection === 'reports' ? '#bfa100' : 'transparent',
                  color: activeSection === 'reports' ? '#fff' : '#666',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {t('checkReports', language)}
              </button>
              <button
                onClick={() => setActiveSection('items')}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: activeSection === 'items' ? '#bfa100' : 'transparent',
                  color: activeSection === 'items' ? '#fff' : '#666',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {t('viewLostItems', language)}
              </button>
            </div>
          </div>
        )}
        
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
              {activeSection === 'items' && (
                <button
                  onClick={handleAIEmailGeneration}
                  style={{background: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'}}
                  title='Generate professional email for item'
                >
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                    <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'/>
                    <polyline points='22,6 12,13 2,6'/>
                  </svg>
                  AI Email
                </button>
              )}
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
            <div key={item.id} style={{background: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(191, 161, 0, 0.10)', padding: '1.5rem', width: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative'}}>
              <img
                src={item.image ? item.image : NO_IMAGE_URL}
                alt={item.title}
                style={{width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem', background: '#f8f8f8'}}
                onError={e => { e.target.onerror = null; e.target.src = NO_IMAGE_URL; }}
              />
              {editItem === item.id ? (
                <div style={{
                  background: '#f8f9fa',
                  padding: '1.5rem',
                  borderRadius: '16px',
                  border: '2px solid #bfa100',
                  marginTop: '1rem'
                }}>
                  <h5 style={{color: '#bfa100', marginBottom: '1.5rem', fontWeight: '600', textAlign: 'center'}}>
                    ✏️ {t('modifyItem', language) || 'Modify Item'}
                  </h5>
                  
                  <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                    {/* Title Field */}
                    <div style={{marginBottom: '0.5rem'}}>
                      <label style={{display: 'block', color: '#495057', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem'}}>
                        {t('title', language)}<span style={{color: '#dc3545', marginLeft: '2px'}}>*</span>
                      </label>
                      <input 
                        name='title' 
                        value={editFields.title} 
                        onChange={handleEditChange} 
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #e9ecef',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          transition: 'all 0.2s ease',
                          background: '#fff',
                          boxSizing: 'border-box'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#bfa100';
                          e.target.style.boxShadow = '0 0 0 3px rgba(191, 161, 0, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e9ecef';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>

                    {/* Description Field */}
                    <div style={{marginBottom: '0.5rem'}}>
                      <label style={{display: 'block', color: '#495057', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem'}}>
                        {t('description', language)}<span style={{color: '#dc3545', marginLeft: '2px'}}>*</span>
                      </label>
                      <textarea 
                        name='description' 
                        value={editFields.description} 
                        onChange={handleEditChange} 
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #e9ecef',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          minHeight: '80px',
                          resize: 'vertical',
                          transition: 'all 0.2s ease',
                          background: '#fff',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#bfa100';
                          e.target.style.boxShadow = '0 0 0 3px rgba(191, 161, 0, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e9ecef';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>

                    {/* Date and Place Row */}
                    <div style={{display: 'flex', gap: '2rem', marginBottom: '0.5rem'}}>
                      <div style={{flex: 1}}>
                        <label style={{display: 'block', color: '#495057', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem'}}>
                          {t('dateLastSeen', language)}<span style={{color: '#dc3545', marginLeft: '2px'}}>*</span>
                        </label>
                        <input 
                          name='dateLastSeen' 
                          type='date' 
                          value={editFields.dateLastSeen} 
                          onChange={handleEditChange} 
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            transition: 'all 0.2s ease',
                            background: '#fff',
                            boxSizing: 'border-box'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#bfa100';
                            e.target.style.boxShadow = '0 0 0 3px rgba(191, 161, 0, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#e9ecef';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>
                      <div style={{flex: 1}}>
                        <label style={{display: 'block', color: '#495057', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem'}}>
                          {t('placeLastSeen', language)}<span style={{color: '#dc3545', marginLeft: '2px'}}>*</span>
                        </label>
                        <input 
                          name='placeLastSeen' 
                          value={editFields.placeLastSeen} 
                          onChange={handleEditChange} 
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            transition: 'all 0.2s ease',
                            background: '#fff',
                            boxSizing: 'border-box'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#bfa100';
                            e.target.style.boxShadow = '0 0 0 3px rgba(191, 161, 0, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#e9ecef';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div style={{marginBottom: '0.5rem'}}>
                      <label style={{display: 'block', color: '#495057', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem'}}>
                        {t('emailLabel', language)}
                      </label>
                      <input 
                        name='email' 
                        type='email' 
                        value={editFields.email || ''} 
                        onChange={handleEditChange} 
                        placeholder={t('emailLabel', language)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #e9ecef',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          transition: 'all 0.2s ease',
                          background: '#fff',
                          boxSizing: 'border-box'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#bfa100';
                          e.target.style.boxShadow = '0 0 0 3px rgba(191, 161, 0, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e9ecef';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>

                    {/* Status and Expiration Row */}
                    <div style={{display: 'flex', gap: '2rem', marginBottom: '0.5rem'}}>
                      <div style={{flex: 1}}>
                        <label style={{display: 'block', color: '#495057', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem'}}>
                          {t('status', language)}
                        </label>
                        <select 
                          name='status' 
                          value={editFields.status} 
                          onChange={handleEditChange} 
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            transition: 'all 0.2s ease',
                            background: '#fff',
                            cursor: 'pointer',
                            boxSizing: 'border-box'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#bfa100';
                            e.target.style.boxShadow = '0 0 0 3px rgba(191, 161, 0, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#e9ecef';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          <option value='Found by staff'>{t('foundByStaff', language)}</option>
                          <option value='Declared by client'>{t('declaredByClient', language)}</option>
                          <option value='Delivered'>{t('delivered', language)}</option>
                        </select>
                      </div>
                      <div style={{flex: 1}}>
                        <label style={{display: 'block', color: '#495057', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem'}}>
                          {t('expiration', language)}
                        </label>
                        <select 
                          name='expiration' 
                          value={editFields.expiration} 
                          onChange={handleEditChange} 
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            transition: 'all 0.2s ease',
                            background: '#fff',
                            cursor: 'pointer',
                            boxSizing: 'border-box'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#bfa100';
                            e.target.style.boxShadow = '0 0 0 3px rgba(191, 161, 0, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#e9ecef';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          <option value='1 month'>{t('expiration1Month', language)}</option>
                          <option value='1 year'>{t('expiration1Year', language)}</option>
                          <option value='unlimited'>{t('expirationUnlimited', language)}</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'center'}}>
                    <button 
                      onClick={() => handleEditSave(item.id)} 
                      style={{
                        background: 'linear-gradient(135deg, #bfa100 0%, #d4b800 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '0.75rem 2rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(191, 161, 0, 0.25)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, #a88a00 0%, #bfa100 100%)';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 16px rgba(191, 161, 0, 0.35)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, #bfa100 0%, #d4b800 100%)';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 12px rgba(191, 161, 0, 0.25)';
                      }}
                    >
                      💾 {t('submit', language)}
                    </button>
                    <button 
                      onClick={() => setEditItem(null)} 
                      style={{
                        background: 'linear-gradient(135deg, #6c757d 0%, #868e96 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '0.75rem 2rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(108, 117, 125, 0.25)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, #5a6268 0%, #6c757d 100%)';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 16px rgba(108, 117, 125, 0.35)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, #6c757d 0%, #868e96 100%)';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 12px rgba(108, 117, 125, 0.25)';
                      }}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
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
                      onChange={e => handleStatusChange(item.id, e.target.value)}
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
                      <button onClick={() => handleDelete(item.id)} style={{background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', fontWeight: 'bold', cursor: 'pointer'}}>Delete</button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* AI Email Generation Modal */}
      {aiEmailModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif', margin: 0}}>
                🤖 AI Email Generator
              </h3>
              <button
                onClick={() => setAiEmailModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>

            {!aiEmailContent ? (
              <div>
                <p style={{marginBottom: '1rem', color: '#666'}}>
                  Enter the item ID to generate a professional email for the client.
                </p>
                <div style={{marginBottom: '1.5rem'}}>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'rgb(145, 111, 65)'}}>
                    Item ID (e.g., ITEM-MDRER3D6-VSFUY):
                  </label>
                  <input
                    type='text'
                    value={aiEmailItemId}
                    onChange={(e) => setAiEmailItemId(e.target.value)}
                    placeholder='Enter item ID here...'
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #e6c200',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
                  <button
                    onClick={() => setAiEmailModal(false)}
                    style={{
                      background: '#ccc',
                      color: '#333',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.75rem 1.5rem',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAIEmailSubmit}
                    disabled={aiEmailLoading}
                    style={{
                      background: aiEmailLoading ? '#ccc' : '#28a745',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.75rem 1.5rem',
                      fontWeight: 'bold',
                      cursor: aiEmailLoading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {aiEmailLoading ? 'Generating...' : 'Generate Email'}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{marginBottom: '1.5rem'}}>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'rgb(145, 111, 65)'}}>
                    Generated Email:
                  </label>
                  <textarea
                    value={aiEmailContent}
                    readOnly
                    style={{
                      width: '100%',
                      height: '300px',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: '1px solid #e6c200',
                      fontSize: '0.9rem',
                      fontFamily: 'monospace',
                      resize: 'vertical'
                    }}
                  />
                </div>
                <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
                  <button
                    onClick={() => {
                      setAiEmailContent('');
                      setAiEmailItemId('');
                    }}
                    style={{
                      background: '#bfa100',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.75rem 1.5rem',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Generate Another
                  </button>
                  <button
                    onClick={copyEmailToClipboard}
                    style={{
                      background: '#007bff',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.75rem 1.5rem',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Copy to Clipboard
                  </button>
                  <button
                    onClick={() => setAiEmailModal(false)}
                    style={{
                      background: '#6c757d',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.75rem 1.5rem',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LostItems; 