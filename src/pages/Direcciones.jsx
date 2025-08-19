import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Direcciones.css";

const Direcciones = () => {
  const [direcciones, setDirecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/direccion-envio/usuario/mias", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setDirecciones(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando direcciones...</p>;

  return (
    <div className="direcciones-container">
      <h2>Mis direcciones de envío</h2>

      {direcciones.length > 0 ? (
        <div className="direcciones-grid">
          {direcciones.map((d) => (
            <div key={d.id} className="direccion-card">
              <div className="direccion-header">
                <h3>
                  {d.calle} {d.numero}
                </h3>
                {d.es_predeterminada ? (
                  <span className="badge">Predeterminada</span>
                ) : null}
              </div>

              <p><strong>Barrio:</strong> {d.barrio || "—"}</p>
              <p><strong>Ciudad:</strong> {d.ciudad}</p>
              <p><strong>Provincia ID:</strong> {d.provincia_id}</p>
              <p><strong>CP:</strong> {d.cp || "—"}</p>
              <p><strong>Teléfono:</strong> {d.telefono || "—"}</p>
              <p><strong>Referencia:</strong> {d.referencia || "—"}</p>
              <p className="meta">
                <small>
                  Creado: {new Date(d.created_at).toLocaleString()} <br />
                  Actualizado: {new Date(d.updated_at).toLocaleString()}
                </small>
              </p>

              <div className="acciones">
                <button
                  className="btn-primario"
                  onClick={() =>
                    navigate("/checkout/resumen", { state: { direccionId: d.id } })
                  }
                >
                  Usar esta dirección
                </button>
                <button
                  className="btn-secundario"
                  onClick={() => navigate(`/checkout/editar-direccion/${d.id}`)}
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="sin-direcciones">
          <p>No tenés direcciones cargadas.</p>
          <button
            className="btn-primario"
            onClick={() => navigate("/checkout/nueva-direccion")}
          >
            ➕ Agregar dirección
          </button>
        </div>
      )}
    </div>
  );
};

export default Direcciones;
