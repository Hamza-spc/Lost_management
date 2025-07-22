import React from 'react'
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{maxWidth: '800px', margin: '2rem auto', padding: '2rem', background: '#fffde4', borderRadius: '16px', boxShadow: '0 4px 24px rgba(255, 230, 128, 0.10)'}}>
      <h2 style={{color: '#e6c200', textAlign: 'center', marginBottom: '2rem'}}>Home</h2>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between'}}>
        {/* Section 1: Check Lost Items */}
        <section style={{flex: '1 1 300px', background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(255, 230, 128, 0.08)'}}>
          <h3 style={{color: '#e6c200'}}>Check Lost Items</h3>
          <p>View a list of reported lost items here.</p>
          <Link to='/lost-items' style={{display: 'inline-block', marginTop: '1rem', background: 'linear-gradient(90deg, #ffe680 0%, #fffde4 100%)', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '8px', padding: '0.75rem 1.5rem', textDecoration: 'none', boxShadow: '0 2px 8px rgba(255, 230, 128, 0.10)'}}>View Lost Items</Link>
        </section>
        {/* Section 2: Add a Lost Item */}
        <section style={{flex: '1 1 300px', background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(255, 230, 128, 0.08)'}}>
          <h3 style={{color: '#e6c200'}}>Add a Lost Item</h3>
          <p>Submit a new lost item report here.</p>
          <Link to='/add-lost-item' style={{display: 'inline-block', marginTop: '1rem', background: 'linear-gradient(90deg, #ffe680 0%, #fffde4 100%)', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '8px', padding: '0.75rem 1.5rem', textDecoration: 'none', boxShadow: '0 2px 8px rgba(255, 230, 128, 0.10)'}}>Go to Form</Link>
        </section>
      </div>
    </div>
  )
}

export default Home