import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './Signup'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './Login'
import Home from './Home'
import AddLostItem from './AddLostItem';
import LostItems from './LostItems';
import Landing from './Landing';
import Sidebar from './Sidebar';
import logoHotel from './assets/logoHotel.png';

function App() {
  const [language, setLanguage] = useState('en');
  return (
    <BrowserRouter>
      <Sidebar language={language} setLanguage={setLanguage} />
      <Routes>
        <Route path='/' element={<Landing logo={logoHotel} language={language} setLanguage={setLanguage} key={language} />}></Route>
        <Route path='/register' element={<Signup logo={logoHotel} language={language} setLanguage={setLanguage} />}></Route>
        <Route path='/login' element={<Login logo={logoHotel} language={language} setLanguage={setLanguage} />}></Route>
        <Route path='/home' element={<Home logo={logoHotel} language={language} setLanguage={setLanguage} />}></Route>
        <Route path='/add-lost-item' element={<AddLostItem logo={logoHotel} language={language} setLanguage={setLanguage} />}></Route>
        <Route path='/lost-items' element={<LostItems logo={logoHotel} language={language} setLanguage={setLanguage} />}></Route>
      </Routes>
    </BrowserRouter>
  )
  
}

export default App
