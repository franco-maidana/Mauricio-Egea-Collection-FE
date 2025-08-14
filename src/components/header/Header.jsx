import { useState } from 'react'
import { Link } from 'react-router-dom'
import './css/Header.css'

const Header = () => {
  const [buscarActivo, setBuscarActivo] = useState(false)

  return (
    <header className="header-container">
      {/* Sección izquierda */}
      <div className="menu-principal"> 
        <img className="menu-hamburguesa" src="/MenuHamburguesa.svg" alt="Menú" />
        <p className="titulo-menu-principal">Menu</p>
        
        <div className='buscador'>
          <img
            className='img-buscador'
            src="/search.png"
            alt="Buscar"
            onClick={() => setBuscarActivo(!buscarActivo)}
          />
          <input
            type="text"
            placeholder='Que producto estas buscando'
            className={`input-busqueda ${buscarActivo ? 'activo' : ''}`}
          />
        </div>
      </div>

      {/* Centro */}
      <div className="logo-principal">
        <Link to="/">
          <img className="Logo" src="/LogoTienda.png" alt="Logo tienda" />
        </Link>
      </div>

      {/* Derecha */}
      <div className="seccion-derecha">
        <ul>
          <li>
            <Link to="/login">Iniciar sesión</Link>
          </li>
          <li>
            <Link to="/carrito">
              <img className="img-carrito" src="/shoppingCart.png" alt="Carrito" />
            </Link>
          </li>
        </ul>
      </div>
    </header>
  )
}

export default Header
