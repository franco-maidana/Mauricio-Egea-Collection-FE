import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Parte superior */}
      <div className="footer-contenido">
        {/* Logo y descripción */}
        <div className="footer-logo">
          <img src="/LogoTienda.png" alt="Mauricio Egea Collection" />
          <p className="footer-desc">
            Moda urbana y deportiva con estilo único. Calidad premium diseñada
            para vos.
          </p>
        </div>

        {/* Links rápidos */}
        <div className="footer-links">
          <h4>Secciones</h4>
          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/productos">Productos</Link>
            </li>
            <li>
              <Link to="/productos/descuentos">Ofertas</Link>
            </li>
            <li>
              <Link to="/contacto">Contacto</Link>
            </li>
          </ul>
        </div>

        {/* Ayuda */}
        <div className="footer-ayuda">
          <h4>Ayuda</h4>
          <ul>
            <li>
              <Link to="/faq">Preguntas Frecuentes</Link>
            </li>
            <li>
              <Link to="/politicas/envios">Política de Envíos</Link>
            </li>
            <li>
              <Link to="/politicas/devoluciones">Devoluciones</Link>
            </li>
            <li>
              <Link to="/politicas/privacidad">Privacidad</Link>
            </li>
          </ul>
        </div>

        {/* Redes sociales */}
        <div className="footer-redes">
          <h4>Seguinos</h4>
          <div className="redes-iconos">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noreferrer"
            >
              <img src="/instagram.jpeg" alt="Instagram" /> Instagram
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
              <img src="/Facebook.png" alt="Facebook" /> Facebook
            </a>
            <a
              href="https://wa.me/5491122334455"
              target="_blank"
              rel="noreferrer"
            >
              <img src="/Wsp.png" alt="WhatsApp" /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Línea final */}
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Mauricio Egea Collection - Todos los
          derechos reservados
        </p>
      </div>
    </footer>
  );
};

export default Footer;
