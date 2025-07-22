import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NO_IMAGE_URL = 'https://img.freepik.com/icon/no-image-available-vector_53876-51002.jpg'; // Use your pasted image URL or a local asset if available

function LostItems() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    let filteredItems = items;
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
  }, [search, dateFilter, items]);

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

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      await axios.patch(`http://localhost:3001/lostitems/${itemId}`, { status: newStatus });
      fetchItems();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #fffde4 0%, #ffe680 100%)', padding: '2rem'}}>
      <div style={{maxWidth: '900px', margin: '0 auto'}}>
        <h2 style={{color: '#e6c200', textAlign: 'center', marginBottom: '2rem'}}>Lost Items</h2>
        <div style={{display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap'}}>
          <input
            type='text'
            placeholder='Search lost items...'
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
        </div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center'}}>
          {filtered.length === 0 && <p>No lost items found.</p>}
          {filtered.map(item => (
            <div key={item._id || item.id} style={{background: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(255, 230, 128, 0.10)', padding: '1.5rem', width: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <img
                src={item.image ? item.image : NO_IMAGE_URL}
                alt={item.title}
                style={{width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem', background: '#f8f8f8'}}
                onError={e => { e.target.onerror = null; e.target.src = NO_IMAGE_URL; }}
              />
              <h4 style={{color: '#e6c200', marginBottom: '0.5rem'}}>{item.title}</h4>
              <p style={{marginBottom: '0.5rem'}}><strong>ID:</strong> {item.id}</p>
              <p style={{marginBottom: '0.5rem'}}><strong>Description:</strong> {item.description}</p>
              <p style={{marginBottom: '0.5rem'}}><strong>Date Last Seen:</strong> {item.dateLastSeen ? new Date(item.dateLastSeen).toLocaleDateString() : ''}</p>
              <p style={{marginBottom: '0.5rem'}}><strong>Place Last Seen:</strong> {item.placeLastSeen}</p>
              <div style={{marginTop: '0.5rem', width: '100%'}}>
                <label style={{color: '#e6c200', fontWeight: 500}}>Status: </label>
                <select
                  value={item.status || 'Lost'}
                  onChange={e => handleStatusChange(item._id, e.target.value)}
                  style={{marginLeft: '0.5rem', borderRadius: '6px', border: '1px solid #e6c200', padding: '0.25rem 0.5rem'}}
                >
                  <option value='Lost'>Lost</option>
                  <option value='Found'>Found</option>
                  <option value='Returned'>Returned</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LostItems; 