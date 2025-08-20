import React, { useEffect, useState } from "react";
import { UseAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import Global from "../helpers/Global";
import "./Checkout.css";

const Checkout = () => {
  const { user } = UseAuth();
  const location = useLocation();
  const [resumen, setResumen] = useState(null);
  const [error, setError] = useState(null);
  const [loadingPago, setLoadingPago] = useState(false);

  // 👇 tomamos direccionId del navigate
  const direccionId = location.state?.direccionId || 1;

  useEffect(() => {
    const fetchResumen = async () => {
      try {
        if (!user) return;

        const res = await fetch(
          `${Global.url}checkout/${user.id}/${direccionId}`,
          { credentials: "include" }
        );

        const data = await res.json();

        if (res.ok && data.ok) {
          setResumen(data);
        } else {
          setError("No se pudo cargar el resumen.");
        }
      } catch (err) {
        console.error("Error cargando resumen:", err);
        setError("Hubo un problema cargando el resumen.");
      }
    };

    fetchResumen();
  }, [user, direccionId]);

  const handlePagar = async () => {
    if (!resumen) return;
    setLoadingPago(true);

    try {
      const res = await fetch(`${Global.url}mercado-pago/crear-preferencia`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // para enviar cookies si las usás
        body: JSON.stringify({
          userId: user.id,
          direccionId: direccionId,
          productos: resumen.productos,
        }),
      });

      const data = await res.json();

      if (res.ok && data.init_point) {
        // Redirige a Mercado Pago
        window.location.href = data.init_point;
      } else {
        setError("No se pudo iniciar el pago.");
      }
    } catch (err) {
      console.error("Error en el pago:", err);
      setError("Hubo un problema al iniciar el pago.");
    } finally {
      setLoadingPago(false);
    }
  };

  if (!user) return <p>Tenés que iniciar sesión para ver el checkout.</p>;
  if (error) return <p>{error}</p>;
  if (!resumen) return <p>Cargando resumen...</p>;

  return (
    <div className="checkout-container">
      <h2>Resumen del Pedido</h2>

      <h3>Productos</h3>
      <div className="productos-lista">
        {resumen.productos.map((p, idx) => (
          <div key={idx} className="producto-item">
            <img src={p.imagen} alt={p.nombre} />
            <div>
              <p>
                <strong>{p.nombre}</strong> - Color: {p.color} - Talle: {p.talle}
              </p>
              <p>Cantidad: {p.cantidad}</p>
              <p>Precio Unitario: ${p.precio_unitario}</p>
            </div>
          </div>
        ))}
      </div>

      <h3>Totales</h3>
      <p>Subtotal: ${resumen.subtotal}</p>
      <p>Envío: ${resumen.costoEnvio}</p>
      <p>
        <strong>Total: ${resumen.total}</strong>
      </p>

      <button
        className="btn-pago"
        onClick={handlePagar}
        disabled={loadingPago}
      >
        {loadingPago ? "Redirigiendo..." : "Pagar con Mercado Pago"}
      </button>
    </div>
  );
};

export default Checkout;
