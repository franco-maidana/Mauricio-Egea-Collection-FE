import React, { useEffect, useState } from "react";
import Global from "../../helpers/Global";
import { UseAuth } from "../../context/AuthContext";
import "./css/Provincias.css";

const Provincias = () => {
  const { user, loading } = UseAuth();
  const [provincias, setProvincias] = useState([]);

  // Estados para modal editar
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState(null);
  const [nuevoCosto, setNuevoCosto] = useState("");

  // Estados para modal crear
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [costoEnvio, setCostoEnvio] = useState("");

  // Estados para modal eliminar
  const [showModalDelete, setShowModalDelete] = useState(false);

  useEffect(() => {
    fetchProvincias();
  }, []);

  const fetchProvincias = async () => {
    try {
      const res = await fetch(Global.url + "provincias/listar", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.ok) setProvincias(data.data);
    } catch (error) {
      console.error("❌ Error al obtener provincias:", error);
    }
  };

  const abrirModalEditar = (prov) => {
    setProvinciaSeleccionada(prov);
    setNuevoCosto(prov.costo_envio);
    setShowModalEdit(true);
  };

  const guardarCambio = async () => {
    if (!provinciaSeleccionada) return;

    try {
      const res = await fetch(
        Global.url + "provincias/update/" + provinciaSeleccionada.id,
        {
          method: "PUT",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          credentials: "include",
          body: new URLSearchParams({ costo_envio: nuevoCosto }),
        }
      );

      const data = await res.json();

      if (res.ok && data.ok) {
        setShowModalEdit(false);
        setProvinciaSeleccionada(null);
        setNuevoCosto("");
        fetchProvincias();
      } else {
        alert(data.message || "Error al actualizar provincia");
      }
    } catch (error) {
      console.error("❌ Error al actualizar provincia:", error);
    }
  };

  const guardarNuevaProvincia = async () => {
    try {
      const res = await fetch(Global.url + "provincias/create", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: "include",
        body: new URLSearchParams({
          nombre: nuevoNombre,
          costo_envio: costoEnvio,
        }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        setShowModalCreate(false);
        setNuevoNombre("");
        setCostoEnvio("");
        fetchProvincias();
      } else {
        alert(data.message || "Error al crear provincia");
      }
    } catch (error) {
      console.error("❌ Error al crear provincia:", error);
    }
  };

  const eliminarProvincia = async () => {
    if (!provinciaSeleccionada) return;

    try {
      const res = await fetch(
        Global.url + "provincias/destroi/" + provinciaSeleccionada.id,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok && data.ok) {
        setShowModalDelete(false);
        setProvinciaSeleccionada(null);
        fetchProvincias();
      } else {
        alert(data.message || "Error al eliminar provincia");
      }
    } catch (error) {
      console.error("❌ Error al eliminar provincia:", error);
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="provincias-container">
      <h2>Gestión de Provincias</h2>

      {user?.role === "admin" && (
        <button
          className="btn-agregar-provincia"
          onClick={() => setShowModalCreate(true)}
        >
          ➕ Agregar Provincia
        </button>
      )}

      <table className="tabla-provincias">
        <thead>
          <tr>
            <th>ID</th>
            <th>Provincia</th>
            <th>Costo de envío</th>
            {user?.role === "admin" && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {provincias.map((prov) => (
            <tr key={prov.id}>
              <td data-label="ID">{prov.id}</td>
              <td data-label="Provincia">{prov.nombre}</td>
              <td data-label="Costo de envío">
                ${Number(prov.costo_envio).toLocaleString("es-AR")}
              </td>
              {user?.role === "admin" && (
                <td data-label="Acciones">
                  <button
                    className="btn-editar"
                    onClick={() => abrirModalEditar(prov)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-eliminar"
                    onClick={() => {
                      setProvinciaSeleccionada(prov);
                      setShowModalDelete(true);
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Editar */}
      {showModalEdit && (
        <div className="modal-provincia-overlay">
          <div className="modal-provincia-box">
            <h3>Modificar costo de envío</h3>
            <p>
              Provincia: <strong>{provinciaSeleccionada?.nombre}</strong>
            </p>
            <input
              type="number"
              value={nuevoCosto}
              onChange={(e) => setNuevoCosto(e.target.value)}
            />
            <div className="modal-provincia-actions">
              <button className="btn-guardar" onClick={guardarCambio}>
                Guardar
              </button>
              <button
                className="btn-cancelar"
                onClick={() => setShowModalEdit(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear */}
      {showModalCreate && (
        <div className="modal-provincia-overlay">
          <div className="modal-provincia-box">
            <h3>Agregar nueva provincia</h3>
            <input
              type="text"
              placeholder="Nombre de la provincia"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
            />
            <input
              type="number"
              placeholder="Costo de envío"
              value={costoEnvio}
              onChange={(e) => setCostoEnvio(e.target.value)}
            />
            <div className="modal-provincia-actions">
              <button className="btn-guardar" onClick={guardarNuevaProvincia}>
                Guardar
              </button>
              <button
                className="btn-cancelar"
                onClick={() => setShowModalCreate(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {showModalDelete && (
        <div className="modal-provincia-overlay">
          <div className="modal-provincia-box">
            <h3>Confirmar eliminación</h3>
            <p>
              ¿Seguro que deseas eliminar la provincia{" "}
              <strong>{provinciaSeleccionada?.nombre}</strong>?
            </p>
            <div className="modal-provincia-actions">
              <button className="btn-guardar" onClick={eliminarProvincia}>
                Sí, eliminar
              </button>
              <button
                className="btn-cancelar"
                onClick={() => setShowModalDelete(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Provincias;
