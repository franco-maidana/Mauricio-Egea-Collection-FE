import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Global from "../helpers/Global";
import "./DetalleProducto.css";

export default function ProductoDetalle() {
  const { id } = useParams();

  const [producto, setProducto] = useState(null);
  const [stock, setStock] = useState([]);
  const [status, setStatus] = useState(null);

  // Estados del formulario
  const [talleId, setTalleId] = useState("");
  const [colorId, setColorId] = useState("");
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setStatus("loading");

        const request = await fetch(`${Global.url}productos/list/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await request.json();

        if (data.ok) {
          setProducto(data.data);
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Error cargando producto:", error);
        setStatus("error");
      }
    };

    const fetchStock = async () => {
      try {
        const request = await fetch(`${Global.url}stock/producto/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await request.json();

        if (data.ok) {
          setStock(data.data);
        }
      } catch (error) {
        console.error("Error cargando stock:", error);
      }
    };

    fetchProducto();
    fetchStock();
  }, [id]);

  if (status === "loading") return <p>Cargando producto...</p>;
  if (status === "error") return <p>No se pudo cargar el producto.</p>;
  if (!producto) return null;

  // Buscar stock del talle+color seleccionado
  const stockSeleccionado = stock.find(
    (s) => s.talle_id == talleId && s.color_id == colorId
  );

  // Enviar al backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!talleId || !colorId) {
      alert("Selecciona talle y color antes de agregar al carrito");
      return;
    }

    try {
      const request = await fetch(`${Global.url}carrito/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 👈 si usás sesiones/cookies
        body: JSON.stringify({
          producto_id: id,
          talle_id: talleId,
          color_id: colorId,
          cantidad,
        }),
      });

      const data = await request.json();
      if (data.ok) {
        alert("✅ Producto agregado al carrito");
      } else {
        alert("❌ No se pudo agregar al carrito");
      }
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
    }
  };

  // 🔹 Talles únicos
  const tallesUnicos = stock
    .map((s) => ({ talle_id: s.talle_id, etiqueta: s.etiqueta }))
    .filter(
      (v, i, arr) => arr.findIndex((x) => x.talle_id === v.talle_id) === i
    );

  // 🔹 Colores disponibles según talle seleccionado
  const coloresFiltrados = stock
    .filter((s) => s.talle_id == talleId)
    .map((s) => ({ color_id: s.color_id, color: s.color }))
    .filter(
      (v, i, arr) => arr.findIndex((x) => x.color_id === v.color_id) === i
    );

  return (
    <div className="detalle-container">
      <div className="detalle-img">
        <img src={producto.imagen_url} alt={producto.nombre} />
      </div>

      <div className="detalle-info">
        {/* Info arriba */}
        <div className="detalle-header">
          <h2>{producto.nombre}</h2>
          <p>
            {producto.descripcion ||
              "Aca podemos Agregar una breve descripcion del producto a vender,"}
          </p>

          {/* Precios */}
          <div className="precios">
            {producto.precio_base !== producto.precio_final && (
              <>
                <span className="precio-base">${producto.precio_base}</span>
                <span className="descuento">
                  {Math.round(
                    ((producto.precio_base - producto.precio_final) /
                      producto.precio_base) *
                      100
                  )}
                  % OFF
                </span>
              </>
            )}
            <span className="precio-final">${producto.precio_final}</span>
          </div>
        </div>

        {/* Formulario abajo */}
        <form onSubmit={handleSubmit} className="detalle-form">
          {/* Selector de talle */}
          <label>TALLE</label>
          <select
            value={talleId}
            onChange={(e) => {
              setTalleId(e.target.value);
              setColorId(""); // reset color
            }}
            required
            className="form-input"
          >
            <option value="">-- Selecciona un talle --</option>
            {tallesUnicos.map((t) => (
              <option key={t.talle_id} value={t.talle_id}>
                {t.etiqueta}
              </option>
            ))}
          </select>

          {/* Selector de color */}
          <label>COLOR</label>
          <select
            value={colorId}
            onChange={(e) => setColorId(e.target.value)}
            required
            className="form-input"
            disabled={!talleId}
          >
            <option value="">-- Selecciona un color --</option>
            {coloresFiltrados.map((c) => (
              <option key={c.color_id} value={c.color_id}>
                {c.color}
              </option>
            ))}
          </select>

          {/* Cantidad */}
          <label>CANTIDAD</label>
          <input
            type="number"
            min="1"
            max={stockSeleccionado ? stockSeleccionado.stock : 1}
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
            className="form-input"
          />

          <button type="submit" className="btn-black">
            AGREGAR AL CARRITO
          </button>
        </form>
      </div>
    </div>
  );
}
