import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Language } from "../../types";
import { getUIText } from "../../utils/language";
import "./Header.css";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { FaShoppingCart, FaUser, FaSignOutAlt } from "react-icons/fa";
import { IconWrapper } from "../ui/IconWrapper";

interface HeaderProps {
  language: Language;
  toggleLanguage: () => void;
}

const Header: React.FC<HeaderProps> = ({ language, toggleLanguage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { cartCount } = useCart();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };



  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <Link to="/" className="logo">
            <span className="logo-text">Law7a</span>
          </Link>
        </div>



        <div className="mobile-controls">
          <button
            className="language-toggle mobile-only"
            onClick={toggleLanguage}
            aria-label={
              language === "en" ? "Switch to Arabic" : "Switch to English"
            }
          >
            {language === "en" ? "عربي" : "EN"}
          </button>
          <button
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        <nav className={`nav-menu ${isMenuOpen ? "open" : ""}`}>
          <ul>
            <li>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                {getUIText("home", language)}
              </Link>
            </li>
            <li>
              <Link to="/search" onClick={() => setIsMenuOpen(false)}>
                {getUIText("explore", language)}
              </Link>
            </li>
            {isAuthenticated && currentUser?.isArtist && (
              <li>
                <Link to="/upload" onClick={() => setIsMenuOpen(false)}>
                  {getUIText("upload", language)}
                </Link>
              </li>
            )}
            <li>
              <Link
                to="/cart"
                className="cart-link"
                onClick={() => setIsMenuOpen(false)}
                aria-label={getUIText("cart", language)}
                title={getUIText("cart", language)}
              >
                <IconWrapper icon={FaShoppingCart} size={24} />
                {cartCount > 0 && (
                  <span className="cart-count">{cartCount}</span>
                )}
              </Link>
            </li>
            <li className="auth-links">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/profile" 
                    onClick={() => setIsMenuOpen(false)}
                    className="profile-link"
                    aria-label={getUIText("profile", language)}
                    title={currentUser?.name ?? getUIText("profile", language)}
                  >
                    <IconWrapper icon={FaUser} size={24} />
                    <span className="user-name">{currentUser?.name ?? getUIText("profile", language)}</span>
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="logout-btn"
                    aria-label={getUIText("logout", language)}
                    title={getUIText("logout", language)}
                  >
                    <IconWrapper icon={FaSignOutAlt} size={24} />
                    <span className="logout-text">{getUIText("logout", language)}</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    {getUIText("login", language)}
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    {getUIText("signup", language)}
                  </Link>
                </>
              )}
            </li>
            <li className="desktop-only">
              <button
                className="language-toggle"
                onClick={toggleLanguage}
                aria-label={
                  language === "en" ? "Switch to Arabic" : "Switch to English"
                }
              >
                {language === "en" ? "عربي" : "EN"}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
