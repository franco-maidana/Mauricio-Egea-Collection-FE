import React from "react";

export default function MensajeModal({ message, onClose }) {
  if (!message) return null; // por seguridad, no renderiza si no hay mensaje

  return (
    <div className="modal">
      <div className="modal-content">
        <p>{message}</p>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}
