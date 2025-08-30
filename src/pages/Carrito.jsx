import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UseAuth } from "../context/AuthContext";
import Global from "../helpers/Global";
import "./Carrito.css";

const Carrito = () => {
  const { user } = UseAuth();
  const [carrito, setCarrito] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("loading");

  const navigate = useNavigate();

  // 🔹 Cargar carrito al montar
  useEffect(() => {
    if (!user) {
      setStatus("no-user");
      return;
    }

    const fetchCarrito = async () => {
      try {
        const res = await fetch(`${Global.url}carrito/list/${user.id}`, {
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok && data.ok) {
          setCarrito(data.carrito || []);
          setSubtotal(data.subtotal || 0);
          setTotal(data.total || 0);
          setStatus("success");
        } else {
          setCarrito([]);
          setSubtotal(0);
          setTotal(0);
          setStatus("empty");
        }
      } catch (error) {
        console.error("❌ Error obteniendo carrito:", error);
        setStatus("error");
      }
    };

    fetchCarrito();
  }, [user]);

  // 🔹 Actualizar cantidad de un producto
  const handleCantidadChange = async (
    productoId,
    talleId,
    colorId,
    nuevaCantidad
  ) => {
    if (nuevaCantidad < 1) return;

    try {
      const res = await fetch(`${Global.url}carrito/update/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          producto_id: productoId,
          talle_id: talleId,
          color_id: colorId,
          cantidad: nuevaCantidad,
        }),
      });

      if (res.ok) {
        // 🔄 Recargar carrito desde backend para tener subtotal y total correctos
        const updated = await fetch(`${Global.url}carrito/list/${user.id}`, {
          credentials: "include",
        });
        const data = await updated.json();
        if (updated.ok && data.ok) {
          setCarrito(data.carrito);
          setSubtotal(data.subtotal);
          setTotal(data.total);
        }
      } else {
        console.error("❌ Error actualizando cantidad:", await res.json());
      }
    } catch (err) {
      console.error("❌ Error en handleCantidadChange:", err);
    }
  };

  // 🔹 Eliminar producto individual
  const handleRemove = async (carritoItemId) => {
    try {
      const res = await fetch(
        `${Global.url}carrito/destroi/${user.id}/${carritoItemId}`,
        { method: "DELETE", credentials: "include" }
      );

      if (res.ok) {
        // 🔄 Recargar carrito para actualizar totales
        const updated = await fetch(`${Global.url}carrito/list/${user.id}`, {
          credentials: "include",
        });
        const data = await updated.json();
        if (updated.ok && data.ok) {
          setCarrito(data.carrito);
          setSubtotal(data.subtotal);
          setTotal(data.total);
        }
      } else {
        console.error("❌ Error eliminando producto:", await res.json());
      }
    } catch (err) {
      console.error("❌ Error en handleRemove:", err);
    }
  };

  // 🔹 Vaciar carrito completo
  const handleVaciarCarrito = async () => {
    try {
      const res = await fetch(`${Global.url}carrito/vaciar/${user.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setCarrito([]);
        setSubtotal(0);
        setTotal(0);
      } else {
        console.error("❌ Error vaciando carrito:", await res.json());
      }
    } catch (err) {
      console.error("❌ Error en handleVaciarCarrito:", err);
    }
  };

  // 🔹 Manejo de estados
  if (status === "loading") return <p>Cargando carrito...</p>;
  if (status === "no-user")
    return <p>⚠️ Debes iniciar sesión para ver tu carrito.</p>;
  if (status === "error") return <p>❌ Error al cargar el carrito.</p>;
  if (!carrito.length) return <p>🛒 Tu carrito está vacío.</p>;

  const handleIniciarCompra = () => {
    navigate("/direcciones-envio");
  };

  return (
    <div className="carrito-page">
      <h2 className="h2">🛒 Resumen de Compra ({carrito.length} productos)</h2>

      {/* Lista de productos */}
      <ul className="carrito-lista">
        {carrito.map((item) => (
          <li key={item.id} className="carrito-item">
            <img src={item.imagen} alt={item.nombre} className="carrito-img" />
            <div className="carrito-info">
              <h3>{item.nombre}</h3>
              <p>
                <strong>Talle:</strong> {item.talle_id} |{" "}
                <strong>Color:</strong> {item.color_id}
              </p>
              <div className="carrito-cantidad-precio">
                <span>
                  Cantidad:{" "}
                  <input
                    type="number"
                    value={item.cantidad}
                    min="1"
                    className="input-cantidad"
                    onChange={(e) =>
                      handleCantidadChange(
                        item.producto_id,
                        item.talle_id,
                        item.color_id,
                        parseInt(e.target.value)
                      )
                    }
                  />
                </span>
                <span className="precio">
                  ${item.precio_unitario.toLocaleString()} c/u →{" "}
                  <strong>${item.subtotal.toLocaleString()}</strong>
                </span>
              </div>
            </div>
            <button
              className="btn-remove"
              onClick={() => handleRemove(item.id)}
            >
              ✖
            </button>
          </li>
        ))}
      </ul>

      {/* Resumen al final */}
      <div className="carrito-resumen ancho">
        <h2>Resumen de compra</h2>
        <div className="resumen-linea">
          <span>Subtotal</span>
          <span>${subtotal.toLocaleString()}</span>
        </div>
        <div className="resumen-linea total">
          <span>TOTAL</span>
          <span>${total.toLocaleString()}</span>
        </div>

        {/* 🔹 Cuotas */}
        <div className="resumen-cuotas">
          <small>
            6 cuotas sin interés de $
            {(total / 6).toLocaleString("es-AR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </small>
        </div>

        <div className="acciones-carrito">
          <button className="btn-comprar" onClick={handleIniciarCompra}>
            Iniciar Compra
          </button>
          <button className="btn-vaciar" onClick={handleVaciarCarrito}>
            Vaciar carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carrito;
