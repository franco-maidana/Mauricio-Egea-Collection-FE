import React, { useEffect, useState } from "react";
import Global from "../../helpers/Global";
import { UseAuth } from "../../context/AuthContext";
import "./css/Categoria.css";

const Categoria = () => {
  const { user, loading } = UseAuth();
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editando, setEditando] = useState(null);

  // Estado para modal
  const [showModal, setShowModal] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const res = await fetch(Global.url + "categorias/list", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.data) setCategorias(data.data);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  const guardarCategoria = async (e) => {
    e.preventDefault();
    try {
      let url = Global.url + "categorias/create";
      let method = "POST";
      let body = new URLSearchParams({ nombre });

      if (editando) {
        url = Global.url + "categorias/update/" + editando;
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
        fetchCategorias();
      } else {
        const data = await res.json();
        alert(data.message || "Error guardando categoría");
      }
    } catch (error) {
      console.error("Error al guardar categoría:", error);
    }
  };

  // 👉 Guardamos id + nombre en el modal
  const confirmarEliminar = (cat) => {
    setCategoriaSeleccionada({
      id: cat.categoria_id,
      nombre: cat.nombre,
    });
    setShowModal(true);
  };

  const eliminarCategoria = async () => {
    if (!categoriaSeleccionada) return;

    try {
      const res = await fetch(
        Global.url + "categorias/destroi/" + categoriaSeleccionada.id,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (res.ok) {
        fetchCategorias();
      }
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
    } finally {
      setShowModal(false);
      setCategoriaSeleccionada(null);
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="categoria-container">
      <h2>Gestión de Categorías</h2>

      {user && user.role === "admin" && (
        <form onSubmit={guardarCategoria} className="categoria-form">
          <input
            type="text"
            placeholder="Nombre de categoría"
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
        {categorias.length > 0 ? (
          categorias.map((cat) => (
            <li key={cat.categoria_id} className="categoria-item">
              <span>{cat.nombre}</span>
              {user && user.role === "admin" && (
                <div className="categoria-actions">
                  <button
                    className="editar"
                    onClick={() => {
                      setEditando(cat.categoria_id);
                      setNombre(cat.nombre);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="eliminar"
                    onClick={() => confirmarEliminar(cat)}
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </li>
          ))
        ) : (
          <p>No hay categorías</p>
        )}
      </ul>

      {/* 🔹 Modal exclusivo de categorías */}
      {showModal && (
        <div className="modal-categoria-overlay">
          <div className="modal-categoria-box">
            <h3>Confirmar eliminación</h3>
            <p>
              ¿Seguro que deseas eliminar la categoría{" "}
              <strong>{categoriaSeleccionada?.nombre}</strong>?
            </p>
            <div className="modal-categoria-actions">
              <button onClick={eliminarCategoria} className="btn-confirmar">
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

export default Categoria;
