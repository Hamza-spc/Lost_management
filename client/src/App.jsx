import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './Signup'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './Login'
import Home from './Home'
import AddLostItem from './AddLostItem';
import LostItems from './LostItems';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Signup />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/home' element={<Home />}></Route>
        <Route path='/add-lost-item' element={<AddLostItem />}></Route>
        <Route path='/lost-items' element={<LostItems />}></Route>
      </Routes>
    </BrowserRouter>
  )
  
}

export default App
