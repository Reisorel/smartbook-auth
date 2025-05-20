import { Link } from 'react-router-dom';
import './Header.scss';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import { Button } from '../IndexComponents';

const Header = () => {
  const { user, logout } = useAuth();
  const { openAuthModal } = useModal();

  return (
    <header className="header">
      <div className="container">
        <div className="header__content">
          <div className="header__logo">
            <Link to="/">
              <h1>SmartBookShop</h1>
            </Link>
          </div>

          <nav className="header__nav">
            <ul className="header__nav-list">
              <li className="header__nav-item">
                <Link to="/books" className="header__nav-link">Catalogue</Link>
              </li>
            </ul>
          </nav>

          <div className="header__auth">
            {user ? (
              <div className="header__user">
                <span>Bonjour, {user.name}</span>
                <Button onClick={logout} variant="text">Déconnexion</Button>
              </div>
            ) : (
              <div className="header__auth-actions">
                <Button
                  onClick={() => openAuthModal('login')}
                  variant="text"
                >
                  Connexion
                </Button>
                <Button
                  onClick={() => openAuthModal('register')}
                  variant="primary"
                >
                  S'inscrire
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
