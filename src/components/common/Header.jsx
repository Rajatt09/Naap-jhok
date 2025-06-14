import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import "./Header.css";

const Header = () => {
  const { currentUser, logout, isAuthenticated, isTailor } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const profileImage = currentUser?.photoURL;

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div className="header-container">
        <div className="header-logo">
          <Link to="/" className="logo-link">
            <h1>Naap-Jhok</h1>
          </Link>
        </div>

        <div className="mobile-header-icons">
          {isAuthenticated && (
            <div className="mobile-profile-icon">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="profile-pic" />
              ) : (
                <FaUserCircle size={28} />
              )}
            </div>
          )}
          <button
            className={`mobile-menu-button ${mobileMenuOpen ? "open" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <nav className={`header-nav ${mobileMenuOpen ? "open" : ""}`}>
          <ul className="nav-links">
            {isAuthenticated && (
              <li className="mobile-only-profile">
                <Link to="/profile" className="profile-link">
                  Profile
                </Link>
                {/* {isTailor && <Link to="/tailor-profile">Shop Settings</Link>} */}
              </li>
            )}
            <li>
              <Link
                to="/"
                className={location.pathname === "/" ? "active" : ""}
              >
                Home
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link
                    to={isTailor ? "/tailor-dashboard" : "/dashboard"}
                    className={
                      location.pathname.includes("dashboard") ? "active" : ""
                    }
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="dropdown desktop-only">
                  <button className="dropdown-toggle">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="profile-pic"
                      />
                    ) : (
                      <FaUserCircle size={24} />
                    )}
                  </button>
                  <div className="dropdown-menu">
                    <Link to="/profile">Profile</Link>
                    {isTailor && (
                      <Link to="/tailor-profile">Shop Settings</Link>
                    )}
                    <button
                      onClick={logout}
                      className="logout-btn dropdown-item"
                    >
                      Logout
                    </button>
                  </div>
                </li>

                <li
                  style={{ textAlign: "center" }}
                  className="mobile-only-profile"
                >
                  <button onClick={logout} className="logout-btn">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className={location.pathname === "/login" ? "active" : ""}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="btn btn-primary btn-sm">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
