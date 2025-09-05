import React from "react";

export default function ConfirmarCreacionModal({ newProduct, onConfirm, onCancel }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Confirmar creación</h3>
        <p>
          ¿Seguro que deseas crear el producto{" "}
          <strong>{newProduct.nombre}</strong>?
        </p>
        <div className="modal-actions">
          <button className="btn-edit" onClick={onConfirm}>
            Sí, crear
          </button>
          <button className="btn-delete" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
