import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import LoginModal from './LoginModal'
import { useAuth } from '../context/AuthProvider'
import axios from 'axios'

function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [auth, setAuth] = useAuth()

  // ✅ Login
  const handleLoginClick = () => {
    setIsLoginOpen(true)
  }

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:5000/api/user/logout', {
        headers: {
          Authorization: `Bearer ${auth?.token}`
        }
      })

      setAuth({
        user: null,
        token: ''
      })

      localStorage.removeItem('auth')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <>
      <nav className='navbar'>
        <div className='nav-container'>
          <div className='logo'>
            <Link to='/'>
              <div className='logo-visual'>
                <div className='book-spine'></div>
                <div className='book-page'></div>
              </div>
              <span className='logo-text'>BookAI</span>
            </Link>
          </div>

          <div className='nav-links'>
            <Link to='/' className='nav-item'>Home</Link>
            <Link to='/about' className='nav-item'>About</Link>
            <Link to='/contact' className='nav-item'>Contact</Link>

            {auth?.user ? (
              <button className='login-btn' onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <button className='login-btn' onClick={handleLoginClick}>
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
    </>
  )
}

export default Navbar