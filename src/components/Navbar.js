import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Menu, X, MessageCircle, FileText } from 'lucide-react';
import './Navbar.css';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            Fixora
          </Link>
        </div>

        {user && (
          <>
            <div className="navbar-menu">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/book-service" className="nav-link">Book Service</Link>
              <Link to="/professionals" className="nav-link">Find Professionals</Link>
              <Link to="/bookings" className="nav-link">My Bookings</Link>
              <Link to="/report-problem" className="nav-link">
                <FileText size={16} />
                Report Problem
              </Link>
              <div className="user-menu">
                <User size={20} />
                <span>{user.name}</span>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </div>
            </div>

            <button 
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {mobileMenuOpen && (
              <div className="mobile-menu">
                <Link to="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
                <Link to="/book-service" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                  Book Service
                </Link>
                <Link to="/professionals" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                  Find Professionals
                </Link>
                <Link to="/bookings" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                  My Bookings
                </Link>
                <Link to="/report-problem" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                  <FileText size={16} />
                  Report Problem
                </Link>
                <div className="mobile-user-info">
                  <span>Welcome, {user.name}</span>
                  <button onClick={handleLogout} className="btn btn-secondary">
                    Logout
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;