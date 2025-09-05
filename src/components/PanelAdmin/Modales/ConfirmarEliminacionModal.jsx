import React from "react";

export default function ConfirmarEliminacionModal({ producto, onConfirm, onCancel }) {
  if (!producto) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Confirmar eliminación</h3>
        <p>
          ¿Seguro que deseas eliminar el producto{" "}
          <strong>{producto.nombre}</strong>?
        </p>
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
