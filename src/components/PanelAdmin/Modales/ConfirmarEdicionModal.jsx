import React from "react";

export default function ConfirmarEdicionModal({ formData, onConfirm, onCancel }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Confirmar cambios</h3>
        <p>
          ¿Seguro que deseas guardar los cambios en{" "}
          <strong>{formData.nombre}</strong>?
        </p>
        <div className="modal-actions">
          <button className="btn-edit" onClick={onConfirm}>
            Sí, guardar
          </button>
          <button className="btn-delete" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
