import { Link } from 'react-router-dom';
import { Sun, Moon, Cart3, PersonCircle } from 'react-bootstrap-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { items } = useCart();

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar navbar-expand-lg sticky-top bg-body-tertiary border-bottom">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          Basics Brazil
        </Link>

        <div className="d-flex align-items-center gap-3 ms-auto">
          <Link className="nav-link" to="/about">
            Sobre Nós
          </Link>

          <button
            className="btn btn-sm btn-outline-secondary theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
            title={theme === 'light' ? 'Modo escuro' : 'Modo claro'}
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
                  Admin
                </Link>
              )}
              <PersonCircle size={20} />
              <span className="small">{user.name}</span>
              <button className="btn btn-sm btn-outline-danger" onClick={logout}>
                Sair
              </button>
            </div>
          ) : (
            <Link className="btn btn-sm btn-primary" to="/login">
              Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;