import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Direcciones.css";

const Direcciones = () => {
  const [direcciones, setDirecciones] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  console.log(direcciones)
  useEffect(() => {
    // Traemos las direcciones del usuario
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

    // Traemos las provincias
    fetch("http://localhost:8080/api/provincias/listar")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setProvincias(data.data);
        }
      })
      .catch((err) => console.error("Error cargando provincias:", err));
  }, []);

  if (loading) return <p>Cargando direcciones...</p>;

  // 🔹 Función para obtener nombre y costo de la provincia por ID
  const getProvinciaInfo = (id) => {
    const provincia = provincias.find((p) => p.id === id);
    return provincia
      ? `${provincia.nombre}`
      : `ID: ${id}`;
  };

  return (
    <div className="direcciones-container">
      <h2>Mis direcciones de envío</h2>

      {direcciones.length > 0 ? (
        <div className="direcciones-grid">
          {direcciones.map((d) => (
            <div key={d.id} className="direccion-card">
              <div className="direccion-header">
                <p><strong>Calle:</strong> {d.calle}</p>
                <p><strong>Número:</strong> {d.numero}</p>  

                {d.es_predeterminada ? (
                  <span className="badge">Predeterminada</span>
                ) : null}
              </div>

              <p><strong>Calle 1:</strong> {d.entre_calle_1 || "—"}</p>
              <p><strong>Calle 2:</strong> {d.entre_calle_2 || "—"}</p>
              <p><strong>Barrio:</strong> {d.barrio || "—"}</p>
              <p><strong>Ciudad:</strong> {d.ciudad}</p>
              <p><strong>Provincia:</strong> {getProvinciaInfo(d.provincia_id)}</p>
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
                  onClick={() => navigate(`/datos/editar-direccion/${d.id}`)}
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
