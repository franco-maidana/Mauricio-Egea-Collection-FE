import React from "react";

export default function DescuentoCategoriaModal({
  categorias,
  categoriaId,
  setCategoriaId,
  categoriaDiscount,
  setCategoriaDiscount,
  onConfirm,
  onCancel,
}) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Aplicar descuento por categoría</h3>

        <label>Categoría</label>
        <select
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
        >
          <option value="">-- Seleccionar categoría --</option>
          {Object.entries(categorias).map(([id, nombre]) => (
            <option key={id} value={id}>
              {nombre}
            </option>
          ))}
        </select>

        <label>Porcentaje (%)</label>
        <input
          type="number"
          value={categoriaDiscount}
          onChange={(e) => setCategoriaDiscount(e.target.value)}
        />

        <div className="modal-actions">
          <button className="btn-edit" onClick={onConfirm}>
            Aplicar
          </button>
          <button className="btn-delete" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
