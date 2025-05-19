import { Link } from 'react-router-dom';
import { Container } from '../IndexComponents';
import './Footer.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <Container>
        <div className="footer__content">
          <div className="footer__section">
            <h3 className="footer__title">SmartBookShop</h3>
            <p className="footer__description">
              Votre librairie en ligne pour découvrir de nouveaux horizons à travers les livres.
            </p>
          </div>

          <div className="footer__section">
            <h4 className="footer__subtitle">Navigation</h4>
            <ul className="footer__links">
              <li><Link to="/" className="footer__link">Accueil</Link></li>
              <li><Link to="/books" className="footer__link">Livres</Link></li>
              <li><Link to="/categories" className="footer__link">Catégories</Link></li>
              <li><Link to="/cart" className="footer__link">Panier</Link></li>
            </ul>
          </div>

          <div className="footer__section">
            <h4 className="footer__subtitle">Informations</h4>
            <ul className="footer__links">
              <li><Link to="/about" className="footer__link">À propos</Link></li>
              <li><Link to="/contact" className="footer__link">Contact</Link></li>
              <li><Link to="/terms" className="footer__link">Conditions d'utilisation</Link></li>
              <li><Link to="/privacy" className="footer__link">Politique de confidentialité</Link></li>
            </ul>
          </div>

          <div className="footer__section">
            <h4 className="footer__subtitle">Contact</h4>
            <address className="footer__address">
              <p>123 Rue de l'Example</p>
              <p>75000 Paris, France</p>
              <p>Email: contact@smartbookshop.com</p>
              <p>Tél: +33 1 23 45 67 89</p>
            </address>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            &copy; {currentYear} SmartBookShop. Tous droits réservés.
          </p>
          <div className="footer__social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer__social-link">
              Facebook
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer__social-link">
              Twitter
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer__social-link">
              Instagram
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
