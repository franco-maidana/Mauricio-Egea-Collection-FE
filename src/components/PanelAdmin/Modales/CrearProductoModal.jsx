import React from "react";

export default function CrearProductoModal({
  newProduct,
  setNewProduct,
  categorias,
  onClose,
  onSubmit,
}) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Crear nuevo producto</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(); // acá decides en ProductoAdmin si abres confirmación
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
            <button type="button" className="btn-delete" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
