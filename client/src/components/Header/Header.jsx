import React from 'react'
import './Header.css';
import {Link} from 'react-router-dom';
import { useCart } from '../../hooks/usecart.js';
import { useAuth } from '../../hooks/useAuth.js';

const Header = () => {
  const {user, logout} = useAuth()

  const {cart} = useCart();

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          DigiMenu
        </Link>
        <nav>
          <ul>
            {user ? (
              <li className="menu_container">
                <Link to="/">{user.name}</Link>
                <div className="menu">
                  <a onClick={logout}>Logout</a>
                </div>
              </li>
            ) : (
              <Link to="/login">Login</Link>
            )}

            
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
