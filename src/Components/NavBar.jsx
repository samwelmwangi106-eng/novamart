import React from 'react'
import { Link } from 'react-router-dom'

function NavBar() {
  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
      <div className='container'>
        <Link className='navbar-brand' to="/">
        NovaMart
        </Link>

        <div className='navbar-nav ms-auto'>
          <Link className='nav-link' to="/">Home</Link>

          <Link className='nav-link' to="/products">Products</Link>

          <Link className='nav-link' to="/cart">Cart</Link>

          <Link className='nav-link' to="/contact">Contact</Link>
        </div>

      </div>

    </nav>
  );
}

export default NavBar
