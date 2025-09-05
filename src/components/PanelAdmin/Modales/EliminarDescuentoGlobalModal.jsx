import React from "react";

export default function EliminarDescuentoGlobalModal({ onConfirm, onCancel }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Eliminar descuento global</h3>
        <p>¿Seguro que deseas quitar el descuento global de todos los productos?</p>
        <div className="modal-actions">
          <button className="btn-delete" onClick={onConfirm}>
            Sí, eliminar
          </button>
          <button className="btn-edit" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
