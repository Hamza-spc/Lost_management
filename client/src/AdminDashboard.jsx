import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { t } from './i18n';

function AdminDashboard({ logo, language }) {
  const [stats, setStats] = useState({
    totalItems: 0,
    foundItems: 0,
    deliveredItems: 0,
    pendingItems: 0,
    monthlyData: [],
    statusBreakdown: [],
    recentActivity: [],
    topCategories: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/lostitems');
      const items = response.data;
      
      // Calculate statistics
      const totalItems = items.length;
      const foundItems = items.filter(item => item.status === 'Found by staff').length;
      const deliveredItems = items.filter(item => item.status === 'Delivered').length;
      const pendingItems = items.filter(item => 
        item.status === 'Declared by client' || item.status === 'Found by staff'
      ).length;

      // Monthly trends (last 6 months)
      const monthlyData = calculateMonthlyTrends(items);
      
      // Status breakdown
      const statusBreakdown = calculateStatusBreakdown(items);
      
      // Recent activity (last 10 items)
      const recentActivity = items
        .sort((a, b) => new Date(b.dateLastSeen) - new Date(a.dateLastSeen))
        .slice(0, 10);
      
      // Top categories
      const topCategories = calculateTopCategories(items);

      setStats({
        totalItems,
        foundItems,
        deliveredItems,
        pendingItems,
        monthlyData,
        statusBreakdown,
        recentActivity,
        topCategories
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const calculateMonthlyTrends = (items) => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { month: 'short' });
      const monthItems = items.filter(item => {
        const itemDate = new Date(item.dateLastSeen);
        return itemDate.getMonth() === date.getMonth() && itemDate.getFullYear() === date.getFullYear();
      }).length;
      
      months.push({ month: monthName, count: monthItems });
    }
    
    return months;
  };

  const calculateStatusBreakdown = (items) => {
    const statuses = ['Declared by client', 'Found by staff', 'Delivered'];
    return statuses.map(status => ({
      status,
      count: items.filter(item => item.status === status).length,
      percentage: Math.round((items.filter(item => item.status === status).length / items.length) * 100) || 0
    }));
  };

  const calculateTopCategories = (items) => {
    const categories = {};
    items.forEach(item => {
      const category = getItemCategory(item.title);
      categories[category] = (categories[category] || 0) + 1;
    });
    
    return Object.entries(categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));
  };

  const getItemCategory = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('phone') || titleLower.includes('mobile')) return 'Electronics';
    if (titleLower.includes('bag') || titleLower.includes('purse') || titleLower.includes('wallet')) return 'Bags/Wallets';
    if (titleLower.includes('key') || titleLower.includes('card')) return 'Keys/Cards';
    if (titleLower.includes('clothing') || titleLower.includes('shirt') || titleLower.includes('dress')) return 'Clothing';
    if (titleLower.includes('jewelry') || titleLower.includes('watch') || titleLower.includes('ring')) return 'Jewelry';
    if (titleLower.includes('book') || titleLower.includes('document')) return 'Documents';
    return 'Other';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Declared by client': return '#ff6b6b';
      case 'Found by staff': return '#4ecdc4';
      case 'Delivered': return '#96ceb4';
      default: return '#ddd';
    }
  };

  if (loading) {
    return (
      <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #fffbe6 0%, #bfa100 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif', fontSize: '1.2rem'}}>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #fffbe6 0%, #bfa100 100%)', padding: '2rem 1rem'}}>
      <img src={logo} alt='Hotel Logo' style={{width: '120px', marginBottom: '1.5rem'}} />
      
      {/* Header */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem'}}>
        <h1 style={{color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif', fontSize: '2.5rem', margin: 0}}>
          {t('adminDashboard', language)}
        </h1>
        <button
          onClick={() => navigate('/home')}
          style={{
            background: 'rgb(145, 111, 65)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem 1.5rem',
            fontFamily: 'romie, sans-serif',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {t('backToHome', language)}
        </button>
      </div>

      <div style={{maxWidth: '1200px', margin: '0 auto'}}>
        {/* Statistics Cards */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem'}}>
          <div style={{background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(191, 161, 0, 0.10)'}}>
            <h3 style={{color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif', marginBottom: '0.5rem'}}>{t('totalItems', language)}</h3>
            <div style={{fontSize: '2.5rem', fontWeight: 'bold', color: 'rgb(145, 111, 65)'}}>{stats.totalItems}</div>
          </div>
          
          <div style={{background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(191, 161, 0, 0.10)'}}>
            <h3 style={{color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif', marginBottom: '0.5rem'}}>{t('foundItems', language)}</h3>
            <div style={{fontSize: '2.5rem', fontWeight: 'bold', color: '#45b7d1'}}>{stats.foundItems}</div>
          </div>
          
          <div style={{background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(191, 161, 0, 0.10)'}}>
            <h3 style={{color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif', marginBottom: '0.5rem'}}>{t('deliveredItems', language)}</h3>
            <div style={{fontSize: '2.5rem', fontWeight: 'bold', color: '#96ceb4'}}>{stats.deliveredItems}</div>
          </div>
          
          <div style={{background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(191, 161, 0, 0.10)'}}>
            <h3 style={{color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif', marginBottom: '0.5rem'}}>{t('pendingItems', language)}</h3>
            <div style={{fontSize: '2.5rem', fontWeight: 'bold', color: '#ff6b6b'}}>{stats.pendingItems}</div>
          </div>
        </div>

        {/* Charts and Analytics */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem'}}>
          {/* Monthly Trends */}
          <div style={{background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(191, 161, 0, 0.10)'}}>
            <h3 style={{color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif', marginBottom: '1rem'}}>{t('monthlyTrends', language)}</h3>
            <div style={{height: '200px', display: 'flex', alignItems: 'end', gap: '1rem', padding: '1rem 0'}}>
              {stats.monthlyData.map((data, index) => (
                <div key={index} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                  <div 
                    style={{
                      width: '100%',
                      height: `${Math.max(data.count * 10, 20)}px`,
                      background: 'rgb(145, 111, 65)',
                      borderRadius: '4px 4px 0 0',
                      marginBottom: '0.5rem'
                    }}
                  />
                  <div style={{fontSize: '0.8rem', color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif'}}>{data.month}</div>
                  <div style={{fontSize: '0.8rem', color: '#666'}}>{data.count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Breakdown */}
          <div style={{background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(191, 161, 0, 0.10)'}}>
            <h3 style={{color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif', marginBottom: '1rem'}}>{t('statusBreakdown', language)}</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
              {stats.statusBreakdown.map((item, index) => (
                <div key={index} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <div style={{width: '12px', height: '12px', borderRadius: '50%', background: getStatusColor(item.status)}} />
                    <span style={{color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif'}}>
                      {t(item.status === 'Found by staff' ? 'foundByStaff' : item.status === 'Declared by client' ? 'declaredByClient' : item.status.toLowerCase(), language)}
                    </span>
                  </div>
                  <div style={{fontWeight: 'bold', color: 'rgb(145, 111, 65)'}}>
                    {item.count} ({item.percentage}%)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Categories and Recent Activity */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem'}}>
          {/* Top Categories */}
          <div style={{background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(191, 161, 0, 0.10)'}}>
            <h3 style={{color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif', marginBottom: '1rem'}}>{t('topCategories', language)}</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
              {stats.topCategories.map((category, index) => (
                <div key={index} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif'}}>{category.category}</span>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <div style={{width: '60px', height: '8px', background: '#eee', borderRadius: '4px', overflow: 'hidden'}}>
                      <div 
                        style={{
                          width: `${(category.count / Math.max(...stats.topCategories.map(c => c.count))) * 100}%`,
                          height: '100%',
                          background: 'rgb(145, 111, 65)'
                        }}
                      />
                    </div>
                    <span style={{fontWeight: 'bold', color: 'rgb(145, 111, 65)'}}>{category.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(191, 161, 0, 0.10)'}}>
            <h3 style={{color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif', marginBottom: '1rem'}}>{t('recentActivity', language)}</h3>
            <div style={{maxHeight: '300px', overflowY: 'auto'}}>
              {stats.recentActivity.map((item, index) => (
                <div key={index} style={{padding: '0.75rem 0', borderBottom: index < stats.recentActivity.length - 1 ? '1px solid #eee' : 'none'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem'}}>
                    <span style={{fontWeight: 'bold', color: 'rgb(145, 111, 65)', fontFamily: 'romie, sans-serif'}}>{item.title}</span>
                    <span style={{fontSize: '0.8rem', color: '#666'}}>
                      {new Date(item.dateLastSeen).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{fontSize: '0.9rem', color: '#666', marginBottom: '0.25rem'}}>ID: {item.id}</div>
                  <div style={{fontSize: '0.8rem', color: getStatusColor(item.status)}}>
                    {t(item.status === 'Found by staff' ? 'foundByStaff' : item.status === 'Declared by client' ? 'declaredByClient' : item.status.toLowerCase(), language)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard; 