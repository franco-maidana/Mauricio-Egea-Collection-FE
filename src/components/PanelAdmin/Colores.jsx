import React, { useEffect, useState } from "react";
import Global from "../../helpers/Global";
import { UseAuth } from "../../context/AuthContext";
import "./css/Categoria.css"; // 👉 reutilizamos los estilos de categorías

const Colores = () => {
  const { user, loading } = UseAuth();
  const [colores, setColores] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editando, setEditando] = useState(null);

  // Estado para modal
  const [showModal, setShowModal] = useState(false);
  const [colorSeleccionado, setColorSeleccionado] = useState(null);

  useEffect(() => {
    fetchColores();
  }, []);

  const fetchColores = async () => {
  try {
    const res = await fetch(Global.url + "color/list", {
      credentials: "include",
    });
    const data = await res.json();
    if (data.ok && data.colores) setColores(data.colores);
  } catch (error) {
    console.error("❌ Error al obtener colores:", error);
  }
};


  const guardarColor = async (e) => {
    e.preventDefault();
    try {
      let url = Global.url + "color/create";
      let method = "POST";
      let body = new URLSearchParams({ nombre });

      if (editando) {
        url = Global.url + "color/update/" + editando;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
        credentials: "include",
      });

      if (res.ok) {
        setNombre("");
        setEditando(null);
        fetchColores();
      } else {
        const data = await res.json();
        alert(data.message || "Error guardando color");
      }
    } catch (error) {
      console.error("❌ Error al guardar color:", error);
    }
  };

  // 👉 Guardamos id + nombre en el modal
  const confirmarEliminar = (color) => {
    setColorSeleccionado({
      id: color.id,
      nombre: color.nombre,
    });
    setShowModal(true);
  };

  const eliminarColor = async () => {
    if (!colorSeleccionado) return;

    try {
      const res = await fetch(
        Global.url + "color/destroi/" + colorSeleccionado.id,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (res.ok) {
        fetchColores();
      }
    } catch (error) {
      console.error("❌ Error al eliminar color:", error);
    } finally {
      setShowModal(false);
      setColorSeleccionado(null);
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="categoria-container">
      <h2>Gestión de Colores</h2>

      {user && user.role === "admin" && (
        <form onSubmit={guardarColor} className="categoria-form">
          <input
            type="text"
            placeholder="Nombre del color"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <button type="submit">{editando ? "Actualizar" : "Agregar"}</button>
          {editando && (
            <button
              type="button"
              className="cancelar"
              onClick={() => {
                setEditando(null);
                setNombre("");
              }}
            >
              Cancelar
            </button>
          )}
        </form>
      )}

      <ul className="categoria-list">
        {colores.length > 0 ? (
          colores.map((color) => (
            <li key={color.id} className="categoria-item">
              <span>{color.nombre}</span>
              {user && user.role === "admin" && (
                <div className="categoria-actions">
                  <button
                    className="editar"
                    onClick={() => {
                      setEditando(color.id);
                      setNombre(color.nombre);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="eliminar"
                    onClick={() => confirmarEliminar(color)}
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </li>
          ))
        ) : (
          <p>No hay colores</p>
        )}
      </ul>

      {/* 🔹 Modal exclusivo de colores */}
      {showModal && (
        <div className="modal-categoria-overlay">
          <div className="modal-categoria-box">
            <h3>Confirmar eliminación</h3>
            <p>
              ¿Seguro que deseas eliminar el color{" "}
              <strong>{colorSeleccionado?.nombre}</strong>?
            </p>
            <div className="modal-categoria-actions">
              <button onClick={eliminarColor} className="btn-confirmar">
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
    </div>
  );
};

export default Colores;
