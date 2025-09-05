import { useEffect, useState, useCallback } from "react";
import { useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import Global from "../../helpers/Global";
import EditarProductoModal from "./Modales/EditarProductoModal";
import ConfirmarEdicionModal from "./Modales/ConfirmarEdicionModal";
import CrearProductoModal from "./Modales/CrearProductoModal";
import ConfirmarCreacionModal from "./Modales/ConfirmarCreacionModal";
import VerStockModal from "./Modales/VerStockModal";
import AgregarStockModal from "./Modales/AgregarStockModal";
import ConfirmarStockModal from "./Modales/ConfirmarStockModal";
import MensajeModal from "./Modales/MensajeModal";
import ConfirmarEliminacionModal from "./Modales/ConfirmarEliminacionModal";
import ProductosTable from "./Modales/ProductosTable";
import DescuentoGlobalModal from "./Modales/DescuentoGlobalModal";
import EliminarDescuentoGlobalModal from "./Modales/EliminarDescuentoGlobalModal";
import DescuentoCategoriaModal from "./Modales/DescuentoCategoriaModal";
import EliminarDescuentoCategoriaModal from "./Modales/EliminarDescuentoCategoriaModal";
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

  // ================= DESCUENTO GLOBAL =================
  const [showGlobalDiscountModal, setShowGlobalDiscountModal] = useState(false);
  const [showRemoveGlobalDiscountModal, setShowRemoveGlobalDiscountModal] = useState(false);
  const [globalDiscount, setGlobalDiscount] = useState("");

  const doApplyGlobalDiscount = async () => {
    try {
      const res = await fetch(`${Global.url}productos/descuento/global`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: "include",
        body: new URLSearchParams({ porcentaje: globalDiscount }),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        setSuccessMessage(`✅ Descuento global del ${globalDiscount}% aplicado`);
        fetchProductos();
        setShowGlobalDiscountModal(false);
        setGlobalDiscount("");
      } else {
        setSuccessMessage("❌ Error aplicando descuento: " + data.message);
      }
    } catch (err) {
      console.error("❌ Error aplicando descuento global:", err);
    }
  };


  const doRemoveGlobalDiscount = async () => {
    try {
      const res = await fetch(`${Global.url}productos/descuento/quitar`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        setSuccessMessage("✅ Descuento global eliminado");
        fetchProductos();
        setShowRemoveGlobalDiscountModal(false);
      } else {
        setSuccessMessage("❌ Error eliminando descuento: " + data.message);
      }
    } catch (err) {
      console.error("❌ Error eliminando descuento global:", err);
    }
};

  // ================= DESCUENTO POR CATEGORÍA =================
  const [showCategoriaDiscountModal, setShowCategoriaDiscountModal] = useState(false);
  const [showRemoveCategoriaDiscountModal, setShowRemoveCategoriaDiscountModal] = useState(false);
  const [categoriaDiscount, setCategoriaDiscount] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState("");


  // Aplicar descuento por categoría
  const doApplyCategoriaDiscount = async () => {
    try {
      const res = await fetch(`${Global.url}productos/descuento/categoria/${categoriaId}`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: "include",
        body: new URLSearchParams({ porcentaje: categoriaDiscount }),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        setSuccessMessage(`✅ Descuento del ${categoriaDiscount}% aplicado a la categoría ${categoriaId}`);
        fetchProductos();
        setShowCategoriaDiscountModal(false);
        setCategoriaDiscount("");
        setCategoriaId("");
      } else {
        setSuccessMessage("❌ Error aplicando descuento: " + data.message);
      }
    } catch (err) {
      console.error("❌ Error aplicando descuento por categoría:", err);
    }
  };

  // Quitar descuento por categoría
  const doRemoveCategoriaDiscount = async () => {
    try {
      if (!selectedCategoria) {
        setSuccessMessage("❌ Tenés que seleccionar una categoría");
        return;
      }

      const res = await fetch(`${Global.url}productos/descuento/categoria/quitar/${selectedCategoria}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        setSuccessMessage(`✅ ${data.message}`);
        fetchProductos();
        setShowRemoveCategoriaDiscountModal(false);
        setSelectedCategoria(""); // limpiar selección
      } else {
        setSuccessMessage("❌ Error eliminando descuento: " + data.message);
      }
    } catch (err) {
      console.error("❌ Error eliminando descuento por categoría:", err);
    }
  };


  // ================= MODIFICAR STOCK =================
  const doUpdateStock = async (id_producto, color_id, talle_id, nuevoStock) => {
    try {
      const res = await fetch(
        `${Global.url}stock/producto/${id_producto}/color/${color_id}/talle/${talle_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ stock: nuevoStock }),
        }
      );
      const data = await res.json();

      if (res.ok && data.ok) {
        setSuccessMessage("✅ Stock actualizado con éxito");

        // refrescamos la tabla de stock sin cerrar modal
        const resStock = await fetch(`${Global.url}stock/producto/${id_producto}`, {
          credentials: "include",
        });
        const stockData = await resStock.json();
        if (resStock.ok && stockData.ok) setStockProducto(stockData.data || []);
      } else {
        setSuccessMessage("❌ Error actualizando stock: " + data.message);
      }
    } catch (err) {
      console.error("❌ Error actualizando stock:", err);
    }
  };


  // ================= RENDER =================
  return (
    <div className="productos-admin">
      <div className="productos-header">
        {/* <h2>📦 Gestión de Productos</h2> */}
        <div className="acciones-header">
          <button className="btn-create" onClick={() => setShowCreateModal(true)}>
            ➕ Nuevo producto
          </button>
          <button className="btn-discount" onClick={() => setShowGlobalDiscountModal(true)}>
            💸 Agregar descuento global
          </button>
          <button className="btn-discount-remove" onClick={() => setShowRemoveGlobalDiscountModal(true)}>
            ❌ Eliminar descuento global
          </button>
          <button className="btn-discount" onClick={() => setShowCategoriaDiscountModal(true)}>
            🏷️ Descuento por categoría
          </button>
          <button className="btn-discount-remove" onClick={() => setShowRemoveCategoriaDiscountModal(true)}>
            ❌ Quitar descuento categoría
          </button>
        </div>
      </div>


      <ProductosTable
        productos={productos}
        setProductos={setProductos}
        categorias={categorias}
        sensors={sensors}
        onEdit={handleEditClick}
        onDelete={setConfirmDelete}
        onVerStock={handleVerStock}
        onAgregarStock={handleAgregarStock}
      />

      {showGlobalDiscountModal && (
        <DescuentoGlobalModal
          globalDiscount={globalDiscount}
          setGlobalDiscount={setGlobalDiscount}
          onConfirm={doApplyGlobalDiscount}
          onCancel={() => setShowGlobalDiscountModal(false)}
        />
      )}

      {showRemoveGlobalDiscountModal && (
        <EliminarDescuentoGlobalModal
          onConfirm={doRemoveGlobalDiscount}
          onCancel={() => setShowRemoveGlobalDiscountModal(false)}
        />
      )}

      {showCategoriaDiscountModal && (
        <DescuentoCategoriaModal
          categorias={categorias}
          categoriaId={categoriaId}
          setCategoriaId={setCategoriaId}
          categoriaDiscount={categoriaDiscount}
          setCategoriaDiscount={setCategoriaDiscount}
          onConfirm={doApplyCategoriaDiscount}
          onCancel={() => setShowCategoriaDiscountModal(false)}
        />
      )}
      
      {showRemoveCategoriaDiscountModal && (
        <EliminarDescuentoCategoriaModal
          categorias={categorias}
          selectedCategoria={selectedCategoria}
          setSelectedCategoria={setSelectedCategoria}
          onConfirm={doRemoveCategoriaDiscount}
          onCancel={() => setShowRemoveCategoriaDiscountModal(false)}
        />
      )}




      {/* ================== MODALES ================== */}
      {/* Editar Producto */}
      {editProducto && (
        <EditarProductoModal
          formData={formData}
          setFormData={setFormData}
          categorias={categorias}
          onClose={() => setEditProducto(null)}
          onSaveClick={handleSaveClick}
        />
      )}

      {/* Confirmación Editar */}
      {confirmSave && (
        <ConfirmarEdicionModal
          formData={formData}
          onConfirm={doSave}
          onCancel={() => setConfirmSave(false)}
        />
      )}

      {/* Crear Producto */}
      {showCreateModal && (
        <CrearProductoModal
          newProduct={newProduct}
          setNewProduct={setNewProduct}
          categorias={categorias}
          onClose={() => setShowCreateModal(false)}
          onSubmit={() => setConfirmCreate(true)}
        />
      )}

      {/* Confirmación Crear */}
      {confirmCreate && (
        <ConfirmarCreacionModal
          newProduct={newProduct}
          onConfirm={doCreate}
          onCancel={() => setConfirmCreate(false)}
        />
      )}

      {/* Ver Stock */}
      {showVerStockModal && (
        <VerStockModal
          productoSeleccionado={productoSeleccionado}
          stockProducto={stockProducto}
          onClose={() => setShowVerStockModal(false)}
          onUpdateStock={doUpdateStock} 
        />
      )}


      {/* Agregar Stock */}
      {showAgregarStockModal && (
        <AgregarStockModal
          stockForm={stockForm}
          setStockForm={setStockForm}
          talles={talles}
          colores={colores}
          onClose={() => setShowAgregarStockModal(false)}
          onSubmit={() => setConfirmStock(true)}
        />
      )}

      {/* Confirmación Stock */}
      {confirmStock && (
        <ConfirmarStockModal
          stockForm={stockForm}
          onConfirm={doCreateStock}
          onCancel={() => setConfirmStock(false)}
        />
      )}

      {/* Feedback */}
      {successMessage && (
        <MensajeModal
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />
      )}

      {/* ================= CONFIRMACIÓN ELIMINAR ================= */}
      {confirmDelete && (
        <ConfirmarEliminacionModal
          producto={confirmDelete}
          onConfirm={doDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
