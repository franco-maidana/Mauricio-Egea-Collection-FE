import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // ✅ quitamos "data"
import "./css/Header.css";
import Global from "../../helpers/Global";

const Header = () => {
  const [buscarActivo, setBuscarActivo] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const endpoint = `${Global.url}categorias/list`;

    fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        
        if (data && data.data) {
          setCategorias(data.data);
        } else {
          console.warn("⚠ La respuesta no tiene el formato esperado");
        }
      })
      .catch((err) => {
        console.error("❌ Error al obtener categorías:", err);
      });
  }, []);

  return (
    <>
      <header className="header-container">
        {/* Sección izquierda */}
        <div className="menu-principal">
          <img className="menu-hamburguesa" src="/MenuHamburguesa.svg" alt="Menú" onClick={() => setModalAbierto(true)} />
          <p className="titulo-menu-principal">Menu</p>
          {/* Seccion izquierda buscador */}
          <div className="buscador">
            <img className="img-buscador" src="/search.png" alt="Buscar" onClick={() => setBuscarActivo(!buscarActivo)}/>
            <input type="text" placeholder="Que producto estas buscando" className={`input-busqueda ${buscarActivo ? "activo" : ""}`} />
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
            <li> <Link to="/login">Iniciar sesión</Link> </li>
            <li> <Link to="/carrito"> <img className="img-carrito" src="/shoppingCart.png" alt="Carrito" /> </Link> </li>
          </ul>
        </div>
      </header>

      {/* Modal */}
      {modalAbierto && (
        <div className="modal-overlay" onClick={() => setModalAbierto(false)}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <div className="dentro-modal-titulo-cerrar">
              <h2 className="titulo-modal-adentro">Menú</h2>
              <button className="boton-cerrar-modal" onClick={() => setModalAbierto(false)} > X </button>
            </div>
            <ul className="menu-lista"> 
              <li className="menu-item">
                Productos
                <ul className="submenu-categorias">
                  {/* Todos los productos */}
                  <li key="all-products" className="all-products">
                    <Link to="/productos">Ver Todos</Link>
                  </li>
                  {/* Categorías dinámicas */}
                  {categorias.map((cat) => (
                    <li key={cat.categoria_id}>
                      <Link to={`/productos/categoria/${cat.categoria_id}`}>
                        {cat.nombre}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
