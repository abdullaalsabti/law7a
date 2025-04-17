import React from 'react';
import { Link } from 'react-router-dom';
import { Language } from '../../types';
import { getUIText } from '../../utils/language';
import './Footer.css';

interface FooterProps {
  language: Language;
}

const Footer: React.FC<FooterProps> = ({ language }) => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">Law7a</h3>
          <p className="footer-description">
            {language === 'en' 
              ? 'Connecting local artists with art lovers in Amman and beyond.'
              : 'ربط الفنانين المحليين بمحبي الفن في عمان وخارجها.'}
          </p>
          <div className="social-links">
            <a href="https://instagram.com/law7a" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <span>📸</span>
            </a>
            <a href="https://facebook.com/law7a" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <span>👤</span>
            </a>
            <a href="https://twitter.com/law7a" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <span>🐦</span>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">{getUIText('explore', language)}</h4>
          <ul className="footer-links">
            <li>
              <Link to="/search?category=painting">{getCategoryName('painting')}</Link>
            </li>
            <li>
              <Link to="/search?category=pottery">{getCategoryName('pottery')}</Link>
            </li>
            <li>
              <Link to="/search?category=calligraphy">{getCategoryName('calligraphy')}</Link>
            </li>
            <li>
              <Link to="/search?category=digital">{getCategoryName('digital')}</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">{language === 'en' ? 'Information' : 'معلومات'}</h4>
          <ul className="footer-links">
            <li>
              <Link to="/about">{language === 'en' ? 'About Us' : 'من نحن'}</Link>
            </li>
            <li>
              <Link to="/faq">{language === 'en' ? 'FAQ' : 'الأسئلة الشائعة'}</Link>
            </li>
            <li>
              <Link to="/terms">{language === 'en' ? 'Terms of Service' : 'شروط الخدمة'}</Link>
            </li>
            <li>
              <Link to="/privacy">{language === 'en' ? 'Privacy Policy' : 'سياسة الخصوصية'}</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">{getUIText('contact', language)}</h4>
          <address className="footer-contact">
            <p>{language === 'en' ? 'Amman, Jordan' : 'عمان، الأردن'}</p>
            <p>
              <a href="mailto:info@law7a.com">info@law7a.com</a>
            </p>
            <p>
              <a href="tel:+96277123456">+962 77 123 456</a>
            </p>
          </address>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Law7a. 
          {language === 'en' 
            ? ' All rights reserved.'
            : ' جميع الحقوق محفوظة.'}
        </p>
      </div>
    </footer>
  );

  function getCategoryName(category: string): string {
    const categories: Record<string, { en: string; ar: string }> = {
      painting: { en: 'Paintings', ar: 'لوحات فنية' },
      pottery: { en: 'Pottery', ar: 'فخار' },
      calligraphy: { en: 'Calligraphy', ar: 'خط عربي' },
      digital: { en: 'Digital Art', ar: 'فن رقمي' },
    };

    return categories[category] ? categories[category][language] : category;
  }
};

export default Footer; 