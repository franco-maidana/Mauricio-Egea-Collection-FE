import React from "react";

export default function EliminarDescuentoCategoriaModal({
  categorias,
  selectedCategoria,
  setSelectedCategoria,
  onConfirm,
  onCancel,
}) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>❌ Eliminar descuento por categoría</h3>

        <label>Categoría</label>
        <select
          value={selectedCategoria}
          onChange={(e) => setSelectedCategoria(e.target.value)}
        >
          <option value="">-- Seleccionar --</option>
          {Object.entries(categorias).map(([id, nombre]) => (
            <option key={id} value={id}>
              {nombre}
            </option>
          ))}
        </select>

        <div className="modal-actions">
          <button className="btn-delete" onClick={onConfirm}>
            Eliminar
          </button>
          <button className="btn-edit" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
