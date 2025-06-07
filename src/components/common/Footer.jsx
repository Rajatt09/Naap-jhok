import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Naap-Jhok</h3>
          <p>Connecting tailors and customers for a perfect fit.</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>For Customers</h4>
          <ul>
            <li><Link to="/find-tailors">Find Tailors</Link></li>
            <li><Link to="/how-it-works">How It Works</Link></li>
            <li><Link to="/dashboard">My Orders</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>For Tailors</h4>
          <ul>
            <li><Link to="/tailor-signup">Join as Tailor</Link></li>
            <li><Link to="/tailor-dashboard">Tailor Dashboard</Link></li>
            <li><Link to="/tailor-faq">Tailor FAQ</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© {currentYear} Naap-Jhok. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer