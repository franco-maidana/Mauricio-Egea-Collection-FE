import React from "react";

export default function EditarProductoModal({
  formData,
  setFormData,
  categorias,
  onClose,
  onSaveClick,
}) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Editar producto</h3>
        <form onSubmit={onSaveClick}>
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
            <button type="button" className="btn-delete" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
