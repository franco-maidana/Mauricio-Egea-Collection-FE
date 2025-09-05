import React from "react";

export default function ConfirmarStockModal({ stockForm, onConfirm, onCancel }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Confirmar creación de stock</h3>
        <p>
          ¿Seguro que deseas agregar <strong>{stockForm.stock}</strong>{" "}
          unidades (Color ID: {stockForm.color_id}, Talle ID:{" "}
          {stockForm.talle_id}) al producto{" "}
          <strong>ID {stockForm.id_producto}</strong>?
        </p>
        <div className="modal-actions">
          <button className="btn-edit" onClick={onConfirm}>
            Sí, agregar
          </button>
          <button className="btn-delete" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
