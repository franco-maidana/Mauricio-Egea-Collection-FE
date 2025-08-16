import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // 👈 agregado useNavigate
import "./css/Header.css";
import Global from "../../helpers/Global";

const Header = () => {
  const [buscarActivo, setBuscarActivo] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [scrollActivo, setScrollActivo] = useState(false);
  const [termino, setTermino] = useState(""); // 👈 estado para input
  const navigate = useNavigate(); // 👈 para redirigir

  useEffect(() => {
    const endpoint = `${Global.url}categorias/list`;
    fetch(endpoint, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          setCategorias(data.data);
        }
      })
      .catch((err) => console.error("❌ Error al obtener categorías:", err));
  }, []);

  // 👇 detectamos el scroll
  useEffect(() => {
    const manejarScroll = () => {
      if (window.scrollY > 50) {
        setScrollActivo(true);
      } else {
        setScrollActivo(false);
      }
    };

    window.addEventListener("scroll", manejarScroll);
    return () => window.removeEventListener("scroll", manejarScroll);
  }, []);

  const manejarBusqueda = (e) => {
    if (e.key === "Enter" && termino.trim() !== "") {
      navigate(`/productos/buscar/${termino}`); // 👈 lo mandamos a la ruta
      setBuscarActivo(false);
      setTermino("");
    }
  };

  return (
    <>
      <header className={`header-container ${scrollActivo ? "scroll-activo" : ""}`}>
        {/* Sección izquierda */}
        <div className="menu-principal">
          <img
            className="menu-hamburguesa"
            src="/MenuHamburguesa.svg"
            alt="Menú"
            onClick={() => setModalAbierto(true)}
          />
          <p className="titulo-menu-principal">Menu</p>

          {/* 🔎 Buscador */}
          <div className="buscador">
            <img
              className="img-buscador"
              src="/search.png"
              alt="Buscar"
              onClick={() => setBuscarActivo(!buscarActivo)}
            />
            <input
              type="text"
              placeholder="¿Qué producto estás buscando?"
              className={`input-busqueda ${buscarActivo ? "activo" : ""}`}
              value={termino}
              onChange={(e) => setTermino(e.target.value)}
              onKeyDown={manejarBusqueda} // 👈 captura Enter
            />
          </div>
        </div>

        {/* Centro */}
        <div className="logo-principal">
          <Link to="/">
            <img
              className="Logo"
              src={scrollActivo ? "/LogosinME.png" : "/LogoTienda.png"}
              alt="Logo tienda"
            />
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

      {/* Modal */}
      {modalAbierto && (
        <div className="modal-overlay" onClick={() => setModalAbierto(false)}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <div className="dentro-modal-titulo-cerrar">
              <h2 className="titulo-modal-adentro">Menú</h2>
              <button className="boton-cerrar-modal" onClick={() => setModalAbierto(false)}>
                X
              </button>
            </div>
            <ul className="menu-lista">
              <li className="menu-item">
                Productos
                <ul className="submenu-categorias">
                  <li key="all-products" className="all-products">
                    <Link to="/productos" onClick={() => setModalAbierto(false)}>
                      Ver Todos
                    </Link>
                  </li>
                  {categorias.map((cat) => (
                    <li key={cat.categoria_id}>
                      <Link
                        to={`/productos/categoria/${cat.categoria_id}`}
                        onClick={() => setModalAbierto(false)}
                      >
                        {cat.nombre}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* 🔥 Nuevo link a descuentos */}
              <li className="menu-item">
                <Link
                  to="/productos/descuentos"
                  onClick={() => setModalAbierto(false)}
                >
                  Descuentos
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
