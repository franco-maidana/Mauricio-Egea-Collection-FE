import React from "react";

export default function DescuentoGlobalModal({
  globalDiscount,
  setGlobalDiscount,
  onConfirm,
  onCancel,
}) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Aplicar descuento global</h3>

        <label>Porcentaje (%)</label>
        <input
          type="number"
          min="0"
          max="100"
          value={globalDiscount}
          onChange={(e) => setGlobalDiscount(e.target.value)}
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
