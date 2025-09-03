import { useEffect, useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import SortableRow from "../SortableRow";
import Global from "../../helpers/Global";
import "./css/ProductoAdmin.css";

export default function ProductoAdmin() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState({});
  const [talles, setTalles] = useState([]);
  const [colores, setColores] = useState([]);

  // ================= ESTADOS DE EDICIÓN =================
  const [editProducto, setEditProducto] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio_base: "",
    descuento: "",
    categoria_id: "",
    imagen: null,
  });
  const [confirmSave, setConfirmSave] = useState(false);

  // ================= ESTADOS DE CREACIÓN =================
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [confirmCreate, setConfirmCreate] = useState(false);
  const [newProduct, setNewProduct] = useState({
    nombre: "",
    descripcion: "",
    precio_base: "",
    descuento: "",
    categoria_id: "",
    imagen: null,
  });

  // ================= ESTADOS DE STOCK =================
  const [showVerStockModal, setShowVerStockModal] = useState(false);
  const [showAgregarStockModal, setShowAgregarStockModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [stockProducto, setStockProducto] = useState([]);
  const [stockForm, setStockForm] = useState({
    id_producto: "",
    talle_id: "",
    color_id: "",
    stock: "",
  });
  const [confirmStock, setConfirmStock] = useState(false);

  // ================= MENSAJES =================
  const [successMessage, setSuccessMessage] = useState("");

  // 🔹 Traer productos
  const fetchProductos = useCallback(async () => {
    try {
      const res = await fetch(`${Global.url}productos/list`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.ok) setProductos(data.data || []);
    } catch (err) {
      console.error("❌ Error cargando productos:", err);
    }
  }, []);

  // 🔹 Traer categorías
  const fetchCategorias = useCallback(async () => {
    try {
      const res = await fetch(`${Global.url}categorias/list`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        const map = {};
        data.data.forEach((c) => (map[c.categoria_id] = c.nombre));
        setCategorias(map);
      }
    } catch (err) {
      console.error("❌ Error cargando categorías:", err);
    }
  }, []);

  // 🔹 Traer talles
  const fetchTalles = useCallback(async () => {
    try {
      const res = await fetch(`${Global.url}talles/list`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.ok) setTalles(data.data || []);
    } catch (err) {
      console.error("❌ Error cargando talles:", err);
    }
  }, []);

  // 🔹 Traer colores
  const fetchColores = useCallback(async () => {
    try {
      const res = await fetch(`${Global.url}color/list`, {
        credentials: "include",
      });
      const data = await res.json();
      console.log("🎨 Colores recibidos:", data);

      if (res.ok && data.ok) {
        setColores(data.colores || []); // 👈 CORREGIDO
      }
    } catch (err) {
      console.error("❌ Error cargando colores:", err);
    }
  }, []);

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
    fetchTalles();
    fetchColores();
  }, [fetchProductos, fetchCategorias, fetchTalles, fetchColores]);

  // ================= EDITAR PRODUCTO =================
  const handleEditClick = (p) => {
    setEditProducto(p);
    setFormData({
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio_base: p.precio_base,
      descuento: p.descuento,
      categoria_id: p.categoria_id,
      imagen: null,
    });
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    setConfirmSave(true);
  };

  const doSave = async () => {
    try {
      const fd = new FormData();
      fd.append("nombre", formData.nombre);
      fd.append("descripcion", formData.descripcion);
      fd.append("precio_base", formData.precio_base);
      fd.append("descuento", formData.descuento);
      fd.append("categoria_id", formData.categoria_id);
      if (formData.imagen) fd.append("imagen", formData.imagen);

      const res = await fetch(
        `${Global.url}productos/update/${editProducto.id_producto}`,
        {
          method: "PUT",
          body: fd,
          credentials: "include",
        }
      );
      const data = await res.json();

      if (res.ok && data.ok) {
        setSuccessMessage("✅ Producto actualizado con éxito");
        setEditProducto(null);
        setConfirmSave(false);
        fetchProductos();
      } else {
        setSuccessMessage("❌ Error actualizando: " + data.message);
      }
    } catch (err) {
      console.error("❌ Error actualizando producto:", err);
    }
  };

  // ================= CREAR PRODUCTO =================
  const doCreate = async () => {
    const fd = new FormData();
    fd.append("nombre", newProduct.nombre);
    fd.append("descripcion", newProduct.descripcion);
    fd.append("precio_base", newProduct.precio_base);
    fd.append("descuento", newProduct.descuento);
    fd.append("categoria_id", newProduct.categoria_id);
    if (newProduct.imagen) fd.append("imagen", newProduct.imagen);

    try {
      const res = await fetch(`${Global.url}productos/create`, {
        method: "POST",
        credentials: "include",
        body: fd,
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setSuccessMessage("✅ Producto creado con éxito");
        fetchProductos();
        setShowCreateModal(false);
        setConfirmCreate(false);
        setNewProduct({
          nombre: "",
          descripcion: "",
          precio_base: "",
          descuento: "",
          categoria_id: "",
          imagen: null,
        });
      } else {
        setSuccessMessage("❌ Error creando producto: " + data.message);
      }
    } catch (err) {
      console.error("❌ Error creando producto:", err);
    }
  };

  // ================= STOCK =================
  const handleVerStock = async (producto) => {
    setProductoSeleccionado(producto);
    setShowVerStockModal(true);

    try {
      const res = await fetch(
        `${Global.url}stock/producto/${producto.id_producto}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (res.ok && data.ok) setStockProducto(data.data || []);
    } catch (err) {
      console.error("❌ Error cargando stock:", err);
    }
  };

  const handleAgregarStock = (producto) => {
    setProductoSeleccionado(producto);
    setStockForm({
      id_producto: producto.id_producto,
      talle_id: "",
      color_id: "",
      stock: "",
    });
    setShowAgregarStockModal(true);
  };

  const doCreateStock = async () => {
    try {
      const res = await fetch(`${Global.url}stock/set`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(stockForm),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        setSuccessMessage("✅ Stock agregado con éxito");
        setShowAgregarStockModal(false);
        setConfirmStock(false);
        setStockForm({
          id_producto: "",
          talle_id: "",
          color_id: "",
          stock: "",
        });
      } else {
        setSuccessMessage("❌ Error creando stock: " + data.message);
      }
    } catch (err) {
      console.error("❌ Error creando stock:", err);
    }
  };

  // ================= ESTADOS DE ELIMINACIÓN =================
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Función eliminar producto en backend
  const doDelete = async () => {
    try {
      const res = await fetch(
        `${Global.url}productos/destroi/${confirmDelete.id_producto}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok && data.ok) {
        setSuccessMessage("🗑️ Producto eliminado con éxito");
        setConfirmDelete(null);
        fetchProductos(); // refrescamos lista
      } else {
        setSuccessMessage("❌ Error eliminando: " + data.message);
      }
    } catch (err) {
      console.error("❌ Error eliminando producto:", err);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // arrastra recién después de mover 5px
      },
    })
  );

  // ================= RENDER =================
  return (
    <div className="productos-admin">
      <div className="productos-header">
        <h2>📦 Gestión de Productos</h2>
        <button className="btn-create" onClick={() => setShowCreateModal(true)}>
          ➕ Nuevo producto
        </button>
      </div>

      {!productos.length ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <DndContext
          sensors={sensors} // 👈 agregado
          collisionDetection={closestCenter}
          onDragEnd={async ({ active, over }) => {
            if (!over) return;
            if (active.id !== over.id) {
              const oldIndex = productos.findIndex(
                (p) => String(p.id_producto) === active.id
              );
              const newIndex = productos.findIndex(
                (p) => String(p.id_producto) === over.id
              );

              const nuevosProductos = arrayMove(productos, oldIndex, newIndex);
              setProductos(nuevosProductos);

              // Guardar en backend
              await fetch(`${Global.url}productos/reordenar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(
                  nuevosProductos.map((p, index) => ({
                    id_producto: p.id_producto,
                    orden: index + 1,
                  }))
                ),
              });
            }
          }}
        >
          <SortableContext
            items={productos.map((p) => String(p.id_producto))}
            strategy={verticalListSortingStrategy}
          >
            <table className="productos-table">
              <thead>
                <tr>
                  <th>↕</th>
                  <th>ID</th>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Precio base</th>
                  <th>Descuento</th>
                  <th>Precio final</th>
                  <th>Categoría</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {productos.map((p) => (
                  <SortableRow
                    key={p.id_producto}
                    producto={p}
                    categorias={categorias}
                    onEdit={handleEditClick}
                    onDelete={setConfirmDelete}
                    onVerStock={handleVerStock}
                    onAgregarStock={handleAgregarStock}
                  />
                ))}
              </tbody>
            </table>
          </SortableContext>
        </DndContext>
      )}

      {/* ================== MODALES ================== */}
      {/* Editar Producto */}
      {editProducto && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar producto</h3>
            <form onSubmit={handleSaveClick}>
              <label>Nombre</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
              />

              <label>Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
              />

              <label>Precio base</label>
              <input
                type="number"
                value={formData.precio_base}
                onChange={(e) =>
                  setFormData({ ...formData, precio_base: e.target.value })
                }
              />

              <label>Descuento (%)</label>
              <input
                type="number"
                value={formData.descuento}
                onChange={(e) =>
                  setFormData({ ...formData, descuento: e.target.value })
                }
              />

              <label>Precio final</label>
              <input
                type="text"
                value={(
                  Number(formData.precio_base || 0) -
                  Number(formData.precio_base || 0) *
                    (Number(formData.descuento || 0) / 100)
                ).toLocaleString()}
                readOnly
              />

              <label>Categoría</label>
              <select
                value={formData.categoria_id}
                onChange={(e) =>
                  setFormData({ ...formData, categoria_id: e.target.value })
                }
              >
                {Object.entries(categorias).map(([id, nombre]) => (
                  <option key={id} value={id}>
                    {nombre}
                  </option>
                ))}
              </select>

              <label>Imagen</label>
              <input
                type="file"
                onChange={(e) =>
                  setFormData({ ...formData, imagen: e.target.files[0] })
                }
              />

              <div className="modal-actions">
                <button type="submit" className="btn-edit">
                  Guardar
                </button>
                <button
                  type="button"
                  className="btn-delete"
                  onClick={() => setEditProducto(null)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmación Editar */}
      {confirmSave && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirmar cambios</h3>
            <p>
              ¿Seguro que deseas guardar los cambios en{" "}
              <strong>{formData.nombre}</strong>?
            </p>
            <div className="modal-actions">
              <button className="btn-edit" onClick={doSave}>
                Sí, guardar
              </button>
              <button
                className="btn-delete"
                onClick={() => setConfirmSave(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Crear Producto */}
      {showCreateModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Crear nuevo producto</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setConfirmCreate(true);
              }}
            >
              <label>Nombre</label>
              <input
                type="text"
                value={newProduct.nombre}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, nombre: e.target.value })
                }
              />

              <label>Descripción</label>
              <textarea
                value={newProduct.descripcion}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, descripcion: e.target.value })
                }
              />

              <label>Precio base</label>
              <input
                type="number"
                value={newProduct.precio_base}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, precio_base: e.target.value })
                }
              />

              <label>Descuento (%)</label>
              <input
                type="number"
                value={newProduct.descuento}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, descuento: e.target.value })
                }
              />

              <label>Precio final</label>
              <input
                type="text"
                value={(
                  Number(newProduct.precio_base || 0) -
                  Number(newProduct.precio_base || 0) *
                    (Number(newProduct.descuento || 0) / 100)
                ).toLocaleString()}
                readOnly
              />

              <label>Categoría</label>
              <select
                value={newProduct.categoria_id}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    categoria_id: e.target.value,
                  })
                }
              >
                <option value="">-- Seleccionar --</option>
                {Object.entries(categorias).map(([id, nombre]) => (
                  <option key={id} value={id}>
                    {nombre}
                  </option>
                ))}
              </select>

              <label>Imagen</label>
              <input
                type="file"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, imagen: e.target.files[0] })
                }
              />

              <div className="modal-actions">
                <button type="submit" className="btn-edit">
                  Crear
                </button>
                <button
                  type="button"
                  className="btn-delete"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmación Crear */}
      {confirmCreate && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirmar creación</h3>
            <p>
              ¿Seguro que deseas crear el producto{" "}
              <strong>{newProduct.nombre}</strong>?
            </p>
            <div className="modal-actions">
              <button className="btn-edit" onClick={doCreate}>
                Sí, crear
              </button>
              <button
                className="btn-delete"
                onClick={() => setConfirmCreate(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ver Stock */}
      {showVerStockModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Stock de {productoSeleccionado?.nombre}</h3>
            {!stockProducto.length ? (
              <p>No hay stock cargado para este producto.</p>
            ) : (
              <table className="stock-table">
                <thead>
                  <tr>
                    <th>Talle</th>
                    <th>Color</th>
                    <th>Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {stockProducto.map((s, i) => (
                    <tr key={i}>
                      <td>{s.etiqueta}</td>
                      <td>{s.color}</td>
                      <td>{s.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="modal-actions">
              <button
                className="btn-delete"
                onClick={() => setShowVerStockModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Agregar Stock */}
      {showAgregarStockModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Agregar stock al producto</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setConfirmStock(true);
              }}
            >
              <label>Talle</label>
              <select
                value={stockForm.talle_id}
                onChange={(e) =>
                  setStockForm({ ...stockForm, talle_id: e.target.value })
                }
              >
                <option value="">-- Seleccionar --</option>
                {talles.map((t) => (
                  <option key={t.talle_id} value={t.talle_id}>
                    {t.etiqueta}
                  </option>
                ))}
              </select>

              <label>Color</label>
              <select
                value={stockForm.color_id}
                onChange={(e) =>
                  setStockForm({ ...stockForm, color_id: e.target.value })
                }
              >
                <option value="">-- Seleccionar --</option>
                {colores.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>

              <label>Cantidad</label>
              <input
                type="number"
                value={stockForm.stock}
                onChange={(e) =>
                  setStockForm({ ...stockForm, stock: e.target.value })
                }
              />

              <div className="modal-actions">
                <button type="submit" className="btn-edit">
                  Guardar
                </button>
                <button
                  type="button"
                  className="btn-delete"
                  onClick={() => setShowAgregarStockModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmación Stock */}
      {confirmStock && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirmar creación de stock</h3>
            <p>
              ¿Seguro que deseas agregar <strong>{stockForm.stock}</strong>{" "}
              unidades (Color ID: {stockForm.color_id}, Talle ID:{" "}
              {stockForm.talle_id}) al producto{" "}
              <strong>ID {stockForm.id_producto}</strong>?
            </p>
            <div className="modal-actions">
              <button className="btn-edit" onClick={doCreateStock}>
                Sí, agregar
              </button>
              <button
                className="btn-delete"
                onClick={() => setConfirmStock(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback */}
      {successMessage && (
        <div className="modal">
          <div className="modal-content">
            <p>{successMessage}</p>
            <button onClick={() => setSuccessMessage("")}>Cerrar</button>
          </div>
        </div>
      )}

      {/* ================= CONFIRMACIÓN ELIMINAR ================= */}
      {confirmDelete && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirmar eliminación</h3>
            <p>
              ¿Seguro que deseas eliminar el producto{" "}
              <strong>{confirmDelete.nombre}</strong>?
            </p>
            <div className="modal-actions">
              <button className="btn-delete" onClick={doDelete}>
                Sí, eliminar
              </button>
              <button
                className="btn-edit"
                onClick={() => setConfirmDelete(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
