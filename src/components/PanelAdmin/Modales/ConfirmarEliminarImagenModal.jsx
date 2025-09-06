import React from "react";

export default function ConfirmarEliminarImagenModal({ imagen, onConfirm, onCancel }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>¿Eliminar esta imagen?</h3>
        <div className="preview">
          <img
            src={imagen.imagen_url}
            alt="Preview"
            style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "8px" }}
          />
        </div>
        <div className="modal-actions">
          <button className="btn-delete" onClick={() => onConfirm(imagen.id)}>
            🗑️ Eliminar
          </button>
          <button className="btn-cancel" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
