import React, { useState } from "react";

export default function VerStockModal({
  productoSeleccionado,
  stockProducto,
  onClose,
  onUpdateStock, // 🔹 callback para llamar al backend
}) {
  const [editIndex, setEditIndex] = useState(null);
  const [nuevoStock, setNuevoStock] = useState("");

  // Función auxiliar para definir la alerta
  function getAlerta(stock) {
    if (stock <= 3) return "CRITICO";
    if (stock <= 5) return "BAJO";
    return null;
  }

  const handleSave = async (s) => {
    if (nuevoStock === "") return;

    await onUpdateStock(
      productoSeleccionado.id_producto,
      s.color_id,
      s.talle_id,
      Number(nuevoStock)
    );

    setEditIndex(null);
    setNuevoStock("");
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Stock de {productoSeleccionado?.nombre}</h3>

        {!stockProducto.length ? (
          <p>No hay stock cargado para este producto.</p>
        ) : (
          <table className="stock-table">
            <thead>
              <tr>
                <th>Talle</th>
                <th>Color</th>
                <th>Cantidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {stockProducto.map((s, i) => {
                const alerta = getAlerta(s.stock);
                const enEdicion = editIndex === i;

                return (
                  <tr key={i}>
                    <td>{s.etiqueta}</td>
                    <td>{s.color}</td>
                    <td>
                      {enEdicion ? (
                        <input
                          type="number"
                          value={nuevoStock}
                          onChange={(e) => setNuevoStock(e.target.value)}
                          style={{ width: "60px" }}
                        />
                      ) : (
                        <>
                          {s.stock}
                          {alerta === "BAJO" && (
                            <span
                              style={{ color: "orange", marginLeft: "8px" }}
                            >
                              ⚠️ Pocas unidades
                            </span>
                          )}
                          {alerta === "CRITICO" && (
                            <span style={{ color: "red", marginLeft: "8px" }}>
                              🚨 Últimas unidades
                            </span>
                          )}
                        </>
                      )}
                    </td>
                    <td>
                      {enEdicion ? (
                        <>
                          <button
                            className="btn-save"
                            onClick={() => handleSave(s, i)}
                          >
                            Guardar
                          </button>
                          <button
                            className="btn-cancel"
                            onClick={() => setEditIndex(null)}
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn-edit"
                          onClick={() => {
                            setEditIndex(i);
                            setNuevoStock(s.stock);
                          }}
                        >
                          Modificar stock
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <div className="modal-actions">
          <button className="btn-delete" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
