import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Language } from "../../types";
import { getUIText } from "../../utils/language";
import "./Header.css";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

interface HeaderProps {
  language: Language;
  toggleLanguage: () => void;
}

const Header: React.FC<HeaderProps> = ({ language, toggleLanguage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { cartCount } = useCart();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
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

        <div className="search-bar">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder={getUIText("search", language)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" aria-label={getUIText("search", language)}>
              🔍
            </button>
          </form>
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
              >
                {getUIText("cart", language)}
                {cartCount > 0 && (
                  <span className="cart-count">{cartCount}</span>
                )}
              </Link>
            </li>
            <li className="auth-links">
              {isAuthenticated ? (
                <>
                  <Link to={`/profile`} onClick={() => setIsMenuOpen(false)}>
                    {currentUser?.name}
                  </Link>
                  <button onClick={handleLogout} className="logout-btn">
                    {getUIText("logout", language)}
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
