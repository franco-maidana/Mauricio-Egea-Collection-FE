import React, { useEffect, useState } from "react";
import Global from "../../helpers/Global";
import { UseAuth } from "../../context/AuthContext";
import "./css/Talles.css";

const Talles = () => {
  const { user, loading } = UseAuth();
  const [talles, setTalles] = useState([]);
  const [etiqueta, setEtiqueta] = useState("");
  const [editando, setEditando] = useState(null);

  // Estado para modal eliminar
  const [showModal, setShowModal] = useState(false);
  const [talleSeleccionado, setTalleSeleccionado] = useState(null);

  // Estado para modificar
  const [showModalEditar, setShowModalEditar] = useState(false);

  // Estado para modal de error
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchTalles();
  }, []);

  const fetchTalles = async () => {
    try {
      const res = await fetch(Global.url + "talles/list-all", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.ok) setTalles(data.data);
    } catch (error) {
      console.error("❌ Error al obtener talles:", error);
    }
  };

  const guardarTalle = async (e) => {
    e.preventDefault();
    try {
      let url = Global.url + "talles/create";
      let method = "POST";
      let body = new URLSearchParams({ etiqueta });

      if (editando) {
        url = Global.url + "talles/update/" + editando;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
        credentials: "include",
      });

      if (res.ok) {
        setEtiqueta("");
        setEditando(null);
        fetchTalles();
      } else {
        if (res.ok) {
          setEtiqueta("");
          setEditando(null);
          fetchTalles();
        } else {
          const data = await res.json();
          setErrorMessage(data.message || "Error guardando talle");
          setShowErrorModal(true);
        }
      }
    } catch (error) {
      console.error("❌ Error al guardar talle:", error);
    }
  };

  const confirmarEliminar = (talle) => {
    setTalleSeleccionado({
      id: talle.talle_id,
      etiqueta: talle.etiqueta,
    });
    setShowModal(true);
  };

  const eliminarTalle = async () => {
    if (!talleSeleccionado) return;

    try {
      const res = await fetch(
        Global.url + "talles/destroi/" + talleSeleccionado.id,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (res.ok) {
        fetchTalles();
      }
    } catch (error) {
      console.error("❌ Error al eliminar talle:", error);
    } finally {
      setShowModal(false);
      setTalleSeleccionado(null);
    }
  };

  const abrirModalEditar = (talle) => {
    setEditando(talle.talle_id);
    setEtiqueta(talle.etiqueta);
    setShowModalEditar(true);
  };

  const guardarEdicion = async () => {
    try {
      const url = Global.url + "talles/update/" + editando;
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ etiqueta }),
        credentials: "include",
      });

      if (res.ok) {
        fetchTalles();
        setShowModalEditar(false);
        setEditando(null);
        setEtiqueta("");
      } else {
        const data = await res.json();
        alert(data.message || "Error editando talle");
      }
    } catch (error) {
      console.error("❌ Error al editar talle:", error);
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="talle-container">
      <h2>Gestión de Talles</h2>

      {user && user.role === "admin" && (
        <form onSubmit={guardarTalle} className="talle-form">
          <input
            type="text"
            placeholder="Etiqueta del talle (ej: S, M, L, 40)"
            value={etiqueta}
            onChange={(e) => setEtiqueta(e.target.value)}
          />
          <button type="submit">{editando ? "Actualizar" : "Agregar"}</button>
          {editando && (
            <button
              type="button"
              className="cancelar"
              onClick={() => {
                setEditando(null);
                setEtiqueta("");
              }}
            >
              Cancelar
            </button>
          )}
        </form>
      )}

      <table className="tabla-talles">
        <thead>
          <tr>
            <th>ID</th>
            <th>Talle</th>
          </tr>
        </thead>
        <tbody>
          {talles.map((talle) => (
            <tr key={talle.talle_id}>
              <td data-label="Talle">{talle.etiqueta}</td>
              <td data-label="Acciones">
                <div className="acciones-talles">
                  <button
                    className="btn-editar"
                    onClick={() => abrirModalEditar(talle)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-eliminar"
                    onClick={() => confirmarEliminar(talle)}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal eliminar */}
      {showModal && (
        <div className="modal-talle-overlay">
          <div className="modal-talle-box">
            <h3>Confirmar eliminación</h3>
            <p>
              ¿Seguro que deseas eliminar el talle{" "}
              <strong>{talleSeleccionado?.etiqueta}</strong>?
            </p>
            <div className="modal-talle-actions">
              <button onClick={eliminarTalle} className="btn-confirmar">
                Sí, eliminar
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="btn-cancelar"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showModalEditar && (
        <div className="modal-talle-overlay">
          <div className="modal-talle-box">
            <h3>Editar talle</h3>
            <input
              type="text"
              value={etiqueta}
              onChange={(e) => setEtiqueta(e.target.value)}
              placeholder="Etiqueta del talle"
            />
            <div className="modal-talle-actions">
              <button onClick={guardarEdicion} className="btn-confirmar">
                Guardar
              </button>
              <button
                onClick={() => {
                  setShowModalEditar(false);
                  setEditando(null);
                  setEtiqueta("");
                }}
                className="btn-cancelar"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de error */}
      {showErrorModal && (
        <div className="modal-talle-overlay">
          <div className="modal-talle-box">
            <h3>Error</h3>
            <p>{errorMessage}</p>
            <div className="modal-talle-actions">
              <button
                onClick={() => setShowErrorModal(false)}
                className="btn-cancelar"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Talles;
