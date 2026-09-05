import { Link } from 'react-router-dom';
import { Sun, Moon, Cart3, PersonCircle, Translate } from 'react-bootstrap-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { items } = useCart();
  const { language, setLanguage, t } = useLanguage();

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar navbar-expand-lg sticky-top bg-body-tertiary border-bottom">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          Basics Brazil
        </Link>

        <div className="d-flex align-items-center gap-3 ms-auto">
          <Link className="nav-link" to="/about">
            {t('about')}
          </Link>

          <div className="language-toggle" role="group" aria-label={t('language')}>
            <Translate size={16} aria-hidden="true" />
            <button
              type="button"
              className={language === 'pt' ? 'active' : ''}
              onClick={() => setLanguage('pt')}
              aria-pressed={language === 'pt'}
              aria-label="Português"
            >
              PT
            </button>
            <button
              type="button"
              className={language === 'en' ? 'active' : ''}
              onClick={() => setLanguage('en')}
              aria-pressed={language === 'en'}
              aria-label="English"
            >
              EN
            </button>
          </div>

          <button
            className="btn btn-sm btn-outline-secondary theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? t('themeDark') : t('themeLight')}
            title={theme === 'light' ? t('themeDark') : t('themeLight')}
          >
            {theme === 'light' ? <Moon /> : <Sun />}
          </button>

          <Link className="nav-link position-relative" to="/cart">
            <Cart3 size={20} />
            {itemCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="d-flex align-items-center gap-2">
              {user.role === 'admin' && (
                <Link className="btn btn-sm btn-outline-secondary" to="/admin/products">
                  {t('admin')}
                </Link>
              )}
              <Link to="/profile" className="profile-nav-link" title={t('myProfile')} aria-label={t('myProfile')}>
                {user.avatar_url ? (
                  <img src={`http://localhost:3001${user.avatar_url}`} alt="" className="profile-nav-avatar" />
                ) : (
                  <PersonCircle size={20} />
                )}
                <span className="small">{user.name}</span>
              </Link>
              <button className="btn btn-sm btn-outline-danger" onClick={logout}>
                {t('logout')}
              </button>
            </div>
          ) : (
            <Link className="btn btn-sm btn-primary" to="/login">
              {t('enter')}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;