import React, { useEffect, useState } from "react";
import Global from "../../helpers/Global";
import { UseAuth } from "../../context/AuthContext";
import DetalleOrden from "./DetalleOrden";
import "./css/Ordenes.css";

const Ordenes = () => {
  const { user, loading: authLoading } = UseAuth();
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para modales
  const [direccionSeleccionada, setDireccionSeleccionada] = useState(null);
  const [detalleSeleccionado, setDetalleSeleccionado] = useState(null);

  // 🔹 Estado del buscador
  const [busqueda, setBusqueda] = useState("");
  const [ordenEncontrada, setOrdenEncontrada] = useState(null);
  const [errorBusqueda, setErrorBusqueda] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    const fetchOrdenes = async () => {
      try {
        let url = `${Global.url}ordenes/todas`;
        if (user && user.role !== "admin") {
          url = `${Global.url}ordenes/mias`;
        }

        const res = await fetch(url, { credentials: "include" });
        const data = await res.json();
        if (data.ok) {
          setOrdenes(data.ordenes);
        }
      } catch (error) {
        console.error("Error cargando órdenes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdenes();
  }, [authLoading, user]);

  // 🔹 Buscar orden por número
  const buscarOrden = async (e) => {
    e.preventDefault();
    setErrorBusqueda(null);
    setOrdenEncontrada(null);

    try {
      const res = await fetch(`${Global.url}ordenes/buscar/numero`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ numero_orden: busqueda }),
      });

      const data = await res.json();

      if (!data.ok) {
        setErrorBusqueda(data.message || "No se encontró la orden");
        return;
      }

      setOrdenEncontrada(data.orden);
    } catch (err) {
      console.error("Error buscando orden:", err);
      setErrorBusqueda("Error al buscar la orden");
    }
  };

  // 🔹 Reset buscador
  const resetBusqueda = () => {
    setBusqueda("");
    setOrdenEncontrada(null);
    setErrorBusqueda(null);
  };

  if (loading || authLoading) {
    return <p>Cargando órdenes...</p>;
  }

  return (
    <div className="ordenes-container">
      <h2>📦 {user?.role === "admin" ? "Todas las Órdenes" : "Mis Órdenes"}</h2>

      {/* 🔹 Buscador */}
      <form className="buscador-orden" onSubmit={buscarOrden}>
        <input
          type="text"
          placeholder="Buscar por número de orden (ej: ORD-20250810-38)"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button type="submit">Buscar</button>
        <button type="button" className="btn-reset" onClick={resetBusqueda}>
          Reset
        </button>
      </form>

      {errorBusqueda && <p className="error">{errorBusqueda}</p>}

      {/* 🔹 Si hay búsqueda → muestro solo la orden encontrada */}
      {ordenEncontrada ? (
        <table className="ordenes-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Número de Orden</th>
              <th>Cliente</th>
              <th>Email</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>ID Pago MP</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{ordenEncontrada.id}</td>
              <td>{ordenEncontrada.numero_orden}</td>
              <td>{ordenEncontrada.name} {ordenEncontrada.last_name}</td>
              <td>{ordenEncontrada.email}</td>
              <td>${ordenEncontrada.total}</td>
              <td>
                <span className={`estado ${ordenEncontrada.estado}`}>
                  {ordenEncontrada.estado}
                </span>
              </td>
              <td>{new Date(ordenEncontrada.created_at).toLocaleString()}</td>
              <td>
                <span className="badge-pago">{ordenEncontrada.payment_id_mp}</span>
              </td>
              <td>
                <button
                  className="btn-ver-direccion"
                  onClick={() => setDireccionSeleccionada(ordenEncontrada)}
                >
                  Ver dirección
                </button>
              </td>
              <td>
                <button
                  className="btn-ver-detalle"
                  onClick={() => setDetalleSeleccionado(ordenEncontrada.id)}
                >
                  Ver detalle
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        // 🔹 Si no hay búsqueda → muestro todas las órdenes
        <>
          {ordenes.length === 0 ? (
            <p>No hay órdenes registradas.</p>
          ) : (
            <table className="ordenes-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Número de Orden</th>
                  <th>Cliente</th>
                  <th>Email</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>ID Pago MP</th>
                  <th>Dirección</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ordenes.map((orden) => (
                  <tr key={orden.id}>
                    <td>{orden.id}</td>
                    <td>{orden.numero_orden || "—"}</td>
                    <td>{orden.name}</td>
                    <td>{orden.email}</td>
                    <td>${orden.total}</td>
                    <td>
                      <span className={`estado ${orden.estado}`}>
                        {orden.estado}
                      </span>
                    </td>
                    <td>{new Date(orden.created_at).toLocaleString()}</td>
                    <td>
                      <span className="badge-pago">{orden.payment_id_mp}</span>
                    </td>
                    <td>
                      <button
                        className="btn-ver-direccion"
                        onClick={() => setDireccionSeleccionada(orden)}
                      >
                        Ver dirección
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn-ver-detalle"
                        onClick={() => setDetalleSeleccionado(orden.id)}
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* Modal Dirección */}
      {direccionSeleccionada && (
        <div
          className="modal-overlay-direcciones"
          onClick={() => setDireccionSeleccionada(null)}
        >
          <div
            className="modal-content modal-direccion"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>📍 Dirección de Envío</h3>
            <p>
              <strong>Calle:</strong> {direccionSeleccionada.calle}{" "}
              {direccionSeleccionada.numero}
            </p>
            <p>
              <strong>Ciudad:</strong> {direccionSeleccionada.ciudad},{" "}
              {direccionSeleccionada.provincia}
            </p>
            <p>
              <strong>CP:</strong> {direccionSeleccionada.cp}
            </p>
            {direccionSeleccionada.barrio && (
              <p><strong>Barrio:</strong> {direccionSeleccionada.barrio}</p>
            )}
            {direccionSeleccionada.entre_calle_1 && (
              <p>
                <strong>Entre calles:</strong>{" "}
                {direccionSeleccionada.entre_calle_1} y{" "}
                {direccionSeleccionada.entre_calle_2 || "—"}
              </p>
            )}
            {direccionSeleccionada.referencia && (
              <p><strong>Referencia:</strong> {direccionSeleccionada.referencia}</p>
            )}
            {direccionSeleccionada.telefono && (
              <p><strong>Teléfono:</strong> {direccionSeleccionada.telefono}</p>
            )}
            <button className="btn-cerrar" onClick={() => setDireccionSeleccionada(null)}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal Detalle */}
      {detalleSeleccionado && (
        <div
          className="modal-overlay-Detalle"
          onClick={() => setDetalleSeleccionado(null)}
        >
          <div
            className="modal-content-detalle modal-detalle"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>🛒 Detalle de la Orden #{detalleSeleccionado}</h3>
            <DetalleOrden ordenId={detalleSeleccionado} />
            <button className="btn-cerrar" onClick={() => setDetalleSeleccionado(null)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ordenes;
