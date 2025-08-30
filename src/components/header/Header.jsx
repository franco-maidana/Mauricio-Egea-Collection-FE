import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/Header.css";
import Global from "../../helpers/Global";
import { UseAuth } from "../../context/AuthContext";
import { UseCarrito } from "../../context/CarritoContext"; // 👈 Contexto del carrito

const Header = () => {
  const [buscarActivo, setBuscarActivo] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [scrollActivo, setScrollActivo] = useState(false);
  const [termino, setTermino] = useState("");
  const [mostrarSaludo, setMostrarSaludo] = useState(false);

  const { carritoCount, setCarritoCount } = UseCarrito(); // 👈 ahora usamos el contexto
  const { user, logout } = UseAuth();
  const navigate = useNavigate();

  // 🔹 Cargar categorías
  useEffect(() => {
    const endpoint = `${Global.url}categorias/list`;
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) setCategorias(data.data);
      })
      .catch((err) => console.error("❌ Error al obtener categorías:", err));
  }, []);

  // 🔹 Detectar scroll
  useEffect(() => {
    const manejarScroll = () => setScrollActivo(window.scrollY > 50);
    window.addEventListener("scroll", manejarScroll);
    return () => window.removeEventListener("scroll", manejarScroll);
  }, []);

  // 🔹 Buscar
  const manejarBusqueda = (e) => {
    if (e.key === "Enter" && termino.trim() !== "") {
      navigate(`/productos/buscar/${termino}`);
      setBuscarActivo(false);
      setTermino("");
    }
  };

  // 🔹 Saludo temporal (3s)
  useEffect(() => {
    if (user) {
      setMostrarSaludo(true);
      const timer = setTimeout(() => setMostrarSaludo(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // 🔹 Cargar carrito al inicio
  useEffect(() => {
    if (!user) return;

    const fetchCarritoCount = async () => {
      try {
        const res = await fetch(`${Global.url}carrito/list/${user.id}`, {
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok && data.ok) {
          setCarritoCount(data.carrito.length); // ✅ se guarda en el contexto
        } else {
          setCarritoCount(0);
        }
      } catch (error) {
        console.error("❌ Error obteniendo carrito:", error);
        setCarritoCount(0);
      }
    };

    fetchCarritoCount();
  }, [user, setCarritoCount]);

  return (
    <>
      <header
        className={`header-container ${scrollActivo ? "scroll-activo" : ""} ${
          buscarActivo ? "buscar-activo" : ""
        }`}
      >
        {/* 🔹 Izquierda */}
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
              onKeyDown={manejarBusqueda}
            />
          </div>
        </div>

        {/* 🔹 Centro → Logo */}
        <div className="logo-principal">
          <Link to="/">
            <img
              className="Logo"
              src={scrollActivo ? "/LogosinME.png" : "/LogoTienda.png"}
              alt="Logo tienda"
            />
          </Link>
        </div>

        {/* 🔹 Derecha */}
        <div className="seccion-derecha">
          <ul>
            {user && user.role === "admin" && (
              <li>
                <Link to="/configuracion">
                  <img
                    className="img-settings"
                    src="/settings.png"
                    alt="Configuracion"
                    title="Configuracion"
                  />
                </Link>
              </li>
            )}

            <li>
              {user ? (
                <>
                  {mostrarSaludo && (
                    <span className="header-user">Hola, {user.name}</span>
                  )}
                  <button className="btn-logout" onClick={handleLogout}>
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <Link to="/login">Iniciar sesión</Link>
              )}
            </li>

            {/* 🛒 Carrito con contador */}
            <li className="carrito-icono">
              <Link to="/carrito">
                <img
                  className="img-carrito"
                  src="/shoppingCart.png"
                  alt="Carrito"
                  title="Carrito"
                />
                {carritoCount > 0 && (
                  <span className="contador-carrito">{carritoCount}</span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </header>

      {/* 🔹 Modal menú */}
      {modalAbierto && (
        <div className="modal-overlay" onClick={() => setModalAbierto(false)}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <div className="dentro-modal-titulo-cerrar">
              <h2 className="titulo-modal-adentro">Menú</h2>
              <button
                className="boton-cerrar-modal"
                onClick={() => setModalAbierto(false)}
              >
                X
              </button>
            </div>

            <div className="menu-wrapper">
              <ul className="menu-lista">
                <li className="menu-item">
                  Productos
                  <ul className="submenu-categorias">
                    <li key="all-products" className="all-products">
                      <Link
                        to="/productos"
                        onClick={() => setModalAbierto(false)}
                      >
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

                <li className="menu-item">
                  <Link
                    to="/productos/descuentos"
                    onClick={() => setModalAbierto(false)}
                  >
                    Descuentos
                  </Link>
                </li>
              </ul>

              {/* 🔽 Parte fija abajo */}
              <ul className="menu-bottom">
                <li className="carrito-icono">
                  <Link to="/carrito">
                    <img
                      className="img-carrito"
                      src="/shoppingCart.png"
                      alt="Carrito"
                      title="Carrito"
                    />
                    {carritoCount > 0 && (
                      <span className="contador-carrito">{carritoCount}</span>
                    )}
                  </Link>
                  Carrito de compras
                </li>
                <li className="menu-item">
                  {user ? (
                    <>
                      {mostrarSaludo && (
                        <span className="header-user">Hola, {user.name}</span>
                      )}
                      <button className="btn-logout" onClick={handleLogout}>
                        Cerrar sesión
                      </button>
                    </>
                  ) : (
                    <Link to="/login" onClick={() => setModalAbierto(false)}>
                      Iniciar sesión
                    </Link>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
