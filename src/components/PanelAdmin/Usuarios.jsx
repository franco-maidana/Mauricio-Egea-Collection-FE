import { useEffect, useState, useCallback } from "react";
import { UseAuth } from "../../context/AuthContext";
import Global from "../../helpers/Global";
import "./css/Usuarios.css";

export default function Usuarios() {
  const { user, loading } = UseAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [perPage] = useState(5);
  const [searchEmail, setSearchEmail] = useState("");

  // ✅ estados
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    email: "",
    role: "",
  });
  const [confirmSave, setConfirmSave] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null); // 👈 para eliminar
  const [successMessage, setSuccessMessage] = useState("");

  // 🔹 Obtener lista de usuarios con paginación
  const fetchUsuarios = useCallback(
    async (page = 1) => {
      try {
        const res = await fetch(
          `${Global.url}users/list?page=${page}&perPage=${perPage}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (res.ok && data.ok) {
          setUsuarios(data.data || []);
          setPagination({
            page: data.pagination.page,
            totalPages: data.pagination.totalPages,
          });
        }
      } catch (err) {
        console.error("❌ Error cargando usuarios:", err);
      }
    },
    [perPage]
  );

  // 🔹 Buscar usuario por email
  const buscarUsuarioPorEmail = async (e) => {
    e.preventDefault();
    if (!searchEmail.trim()) {
      fetchUsuarios(1);
      return;
    }

    try {
      const res = await fetch(`${Global.url}users/email/${searchEmail}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.ok && data.data) {
        setUsuarios([data.data]);
        setPagination({ page: 1, totalPages: 1 });
      } else {
        setUsuarios([]);
      }
    } catch (err) {
      console.error("❌ Error buscando usuario:", err);
    }
  };

  // 🔹 Abrir modal de edición
  const handleEditClick = (u) => {
    setEditUser(u);
    setFormData({
      name: u.name,
      last_name: u.last_name,
      email: u.email,
      role: u.role,
    });
  };

  // 🔹 Guardar cambios
  const handleSaveClick = (e) => {
    e.preventDefault();
    setConfirmSave(true);
  };

  const doSave = async () => {
    try {
      const res = await fetch(`${Global.url}users/update/${editUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        setSuccessMessage("✅ Usuario actualizado con éxito");
        setEditUser(null);
        setConfirmSave(false);
        fetchUsuarios(pagination.page);
      } else {
        setSuccessMessage("❌ Error actualizando: " + data.message);
      }
    } catch (err) {
      console.error("Error actualizando usuario:", err);
    }
  };

  // 🔹 Eliminar usuario (confirmación propia)
  const handleDeleteClick = (u) => {
    setConfirmDelete(u); // abrir modal con datos del usuario
  };

  const doDelete = async (id) => {
    try {
      const res = await fetch(`${Global.url}users/destroi/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        setSuccessMessage("✅ Usuario eliminado");
        fetchUsuarios(pagination.page);
      } else {
        setSuccessMessage("❌ Error eliminando: " + data.message);
      }
    } catch (err) {
      console.error("Error eliminando usuario:", err);
    } finally {
      setConfirmDelete(null);
    }
  };

  useEffect(() => {
    if (user) fetchUsuarios(1);
  }, [user, fetchUsuarios]);

  if (loading) return <p>Cargando sesión...</p>;
  if (!user) return <p>No autorizado. Iniciá sesión como admin.</p>;

  return (
    <div className="usuarios-wrap">
      {/* 📌 Buscador */}
      <form className="buscador" onSubmit={buscarUsuarioPorEmail}>
        <input
          type="text"
          placeholder="Buscar por email..."
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
        <button type="submit">Buscar</button>
        <button
          type="button"
          onClick={() => {
            setSearchEmail("");
            fetchUsuarios(1);
          }}
        >
          Reset
        </button>
      </form>

      {!usuarios.length ? (
        <p>No hay usuarios disponibles.</p>
      ) : (
        <>
          {/* 📌 Tabla */}
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name} {u.last_name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`role-badge ${u.role}`}>{u.role}</span>
                  </td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEditClick(u)}>Editar</button>
                    <button className="btn-delete" onClick={() => handleDeleteClick(u)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 📌 Paginación */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => fetchUsuarios(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                ⬅ Anterior
              </button>
              <span>Página {pagination.page} de {pagination.totalPages}</span>
              <button
                onClick={() => fetchUsuarios(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                Siguiente ➡
              </button>
            </div>
          )}
        </>
      )}

      {/* 🔹 Modal edición */}
      {editUser && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar usuario</h3>
            <form onSubmit={handleSaveClick}>
              <label>Nombre</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <label>Apellido</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              />
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <label>Rol</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="admin">Admin</option>
                <option value="cliente">Cliente</option>
              </select>
              <div className="modal-actions">
                <button type="submit" className="btn-edit">Guardar</button>
                <button type="button" className="btn-delete" onClick={() => setEditUser(null)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🔹 Modal confirmación edición */}
      {confirmSave && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirmar cambios</h3>
            <p>
              ¿Seguro que deseas guardar los cambios en{" "}
              <strong>{formData.name} {formData.last_name}</strong>?
            </p>
            <div className="modal-actions">
              <button className="btn-edit" onClick={doSave}>Sí, guardar</button>
              <button className="btn-delete" onClick={() => setConfirmSave(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Modal confirmación eliminación */}
      {confirmDelete && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirmar eliminación</h3>
            <p>
              ¿Seguro que deseas eliminar al usuario{" "}
              <strong>{confirmDelete.name} {confirmDelete.last_name}</strong>?
            </p>
            <div className="modal-actions">
              <button className="btn-delete" onClick={() => doDelete(confirmDelete.id)}>Sí, eliminar</button>
              <button className="btn-edit" onClick={() => setConfirmDelete(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Modal notificación */}
      {successMessage && (
        <div className="modal">
          <div className="modal-content">
            <p>{successMessage}</p>
            <div className="modal-actions">
              <button className="btn-edit" onClick={() => setSuccessMessage("")}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
