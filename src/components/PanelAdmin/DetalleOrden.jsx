import React, { useEffect, useState } from "react";
import Global from "../../helpers/Global";
import "./css/DetalleOrden.css";

const DetalleOrden = ({ ordenId }) => {
  const [detalle, setDetalle] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const res = await fetch(`${Global.url}detalle-orden/list/${ordenId}`, {
          credentials: "include",
        });
        const data = await res.json();

        if (data.ok) {
          setDetalle(data.detalle || []);
        } else {
          setError(data.message || "Error cargando detalle");
        }
      } catch (error) {
        console.error("Error cargando detalle:", error);
        setError("Error de conexión con el servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchDetalle();
  }, [ordenId]);

  if (loading) return <p>Cargando detalle...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!detalle.length) return <p>No hay productos en esta orden.</p>;

  return (
    <table className="detalle-table">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Imagen</th>
          <th>Cantidad</th>
          <th>Precio Unit.</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        {detalle.map((item) => (
          <tr key={item.id}>
            <td>{item.nombre_producto || "—"}</td>
            <td>
              {item.imagen_url ? (
                <img className="img-mobil" src={item.imagen_url} alt={item.nombre_producto} />
              ) : (
                "Sin imagen"
              )}
            </td>
            <td>{item.cantidad ?? 0}</td>
            <td>
              $
              {item.precio_unitario
                ? Number(item.precio_unitario).toFixed(2)
                : "0.00"}
            </td>
            <td>
              $
              {item.subtotal ? Number(item.subtotal).toFixed(2) : "0.00"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DetalleOrden;
