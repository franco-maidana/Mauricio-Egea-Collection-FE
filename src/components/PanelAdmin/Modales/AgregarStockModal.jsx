import React from "react";

export default function AgregarStockModal({
  stockForm,
  setStockForm,
  talles,
  colores,
  onClose,
  onSubmit,
}) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Agregar stock al producto</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(); // desde ProductoAdmin manejás el setConfirmStock
          }}
        >
          <label>Talle</label>
          <select
            value={stockForm.talle_id}
            onChange={(e) =>
              setStockForm({ ...stockForm, talle_id: e.target.value })
            }
          >
            <option value="">-- Seleccionar --</option>
            {talles.map((t) => (
              <option key={t.talle_id} value={t.talle_id}>
                {t.etiqueta}
              </option>
            ))}
          </select>

          <label>Color</label>
          <select
            value={stockForm.color_id}
            onChange={(e) =>
              setStockForm({ ...stockForm, color_id: e.target.value })
            }
          >
            <option value="">-- Seleccionar --</option>
            {colores.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>

          <label>Cantidad</label>
          <input
            type="number"
            value={stockForm.stock}
            onChange={(e) =>
              setStockForm({ ...stockForm, stock: e.target.value })
            }
          />

          <div className="modal-actions">
            <button type="submit" className="btn-edit">
              Guardar
            </button>
            <button type="button" className="btn-delete" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
