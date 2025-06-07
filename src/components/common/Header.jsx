import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Header.css'

const Header = () => {
  const { currentUser, logout, isAuthenticated, isTailor } = useAuth()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location])

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="header-logo">
          <Link to="/" className="logo-link">
            <h1>Naap-Jhok</h1>
          </Link>
        </div>

        <button 
          className="mobile-menu-button" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`header-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            <li>
              <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                Home
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link 
                    to={isTailor ? '/tailor-dashboard' : '/dashboard'} 
                    className={location.pathname.includes('dashboard') ? 'active' : ''}
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="dropdown">
                  <button className="dropdown-toggle">
                    {currentUser?.name || 'Account'}
                  </button>
                  <div className="dropdown-menu">
                    <Link to="/profile">Profile</Link>
                    {isTailor && <Link to="/tailor-profile">Shop Settings</Link>}
                    <button onClick={logout} className="dropdown-item">Logout</button>
                  </div>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link 
                    to="/login" 
                    className={location.pathname === '/login' ? 'active' : ''}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/signup" 
                    className="btn btn-primary btn-sm"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header