import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Navbar.css';

export default function Navbar() {
  const { lang, setLang, darkMode, setDarkMode, t } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🎀</span>
          <span className="logo-text">{t('BreastGuard', 'برست جارد')}</span>
        </Link>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="menu">
          <span /><span /><span />
        </button>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            {t('Home', 'الرئيسية')}
          </Link>
          <Link to="/assessment" className={location.pathname === '/assessment' ? 'active' : ''}>
            {t('Assessment', 'التقييم')}
          </Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
            {t('About', 'معلومات')}
          </Link>
          <Link to="/self-exam" className={location.pathname === '/self-exam' ? 'active' : ''}>
            {t('Self-Exam', 'الفحص الذاتي')}
          </Link>
          <Link to="/lab" className={location.pathname === '/lab' ? 'active' : ''}>
            {t('Lab Analysis', 'تحليل التحاليل')}
          </Link>
        </div>

        <div className="nav-controls">
          <button
            className="lang-btn"
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            title="Switch language"
          >
            {lang === 'ar' ? 'EN' : 'عر'}
          </button>

          <button
            className="theme-btn"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle theme"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
}
