import React from 'react'
import { Routes, Route } from 'react-router-dom'
import NavBar from './Components/NavBar'
import Products from './Pages/Products'
import Cart from './Pages/Cart'
import Contact from './Pages/Contact'
import Home from './Pages/Home'
import Dashboard from './Pages/Dashboard'
import Orders from "./Pages/Orders"

function App() {
  return (
    <>
    
      <NavBar />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<Products />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/orders' element={<Orders/>}></Route>


      </Routes>



    </>
  )
}

export default App
