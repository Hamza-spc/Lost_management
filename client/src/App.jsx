import React, { useState } from 'react'
// Temporarily commenting out Bootstrap to fix PostCSS issue
// import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './Signup'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './Login'
import Home from './Home'
import AddLostItem from './AddLostItem';
import LostItems from './LostItems';
import AdminDashboard from './AdminDashboard';
import Landing from './Landing';
import Sidebar from './Sidebar';
import ClientLogin from './ClientLogin';
import ClientDashboard from './ClientDashboard';
import ClientItems from './ClientItems';
import DeliveryForm from './DeliveryForm';
import PaymentOptions from './PaymentOptions';
import logoHotel from './assets/logoHotel.png';

function App() {
  const [language, setLanguage] = useState('en');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className={sidebarOpen ? 'sidebar-open' : ''}>
      <BrowserRouter>
        <Sidebar language={language} setLanguage={setLanguage} onToggle={setSidebarOpen} />
        <Routes>
        <Route path='/' element={<Landing logo={logoHotel} language={language} setLanguage={setLanguage} key={language} />}></Route>
        <Route path='/register' element={<Signup logo={logoHotel} language={language} setLanguage={setLanguage} />}></Route>
        <Route path='/login' element={<Login logo={logoHotel} language={language} setLanguage={setLanguage} />}></Route>
        <Route path='/home' element={<Home logo={logoHotel} language={language} setLanguage={setLanguage} />}></Route>
        <Route path='/add-lost-item' element={<AddLostItem logo={logoHotel} language={language} setLanguage={setLanguage} />}></Route>
        <Route path='/lost-items' element={<LostItems logo={logoHotel} language={language} setLanguage={setLanguage} />}></Route>
        <Route path='/admin-dashboard' element={<AdminDashboard logo={logoHotel} language={language} setLanguage={setLanguage} />}></Route>
        <Route path='/client-login' element={<ClientLogin language={language} />}></Route>
        <Route path='/client-dashboard' element={<ClientDashboard language={language} />}></Route>
        <Route path='/client-items' element={<ClientItems language={language} />}></Route>
        <Route path='/delivery-form' element={<DeliveryForm language={language} />}></Route>
        <Route path='/payment-options' element={<PaymentOptions language={language} />}></Route>
      </Routes>
    </BrowserRouter>
    </div>
  )
  
}

export default App
