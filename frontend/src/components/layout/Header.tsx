import { Link } from 'react-router-dom';
import './Header.scss';

const Header = () => {
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
            <div className="header__auth-buttons">
              <span className="header__username">Bienvenue sur notre librairie</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
