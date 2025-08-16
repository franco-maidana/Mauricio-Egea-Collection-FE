import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Global from "../helpers/Global";
import "./Productos.css";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });

export default function Productos() {
  const { id_categoria } = useParams();
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    async function fetchProductos() {
      try {
        let url = id_categoria
          ? `${Global.url}productos/categoria/${id_categoria}`
          : `${Global.url}productos/list`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.ok) {
          const lista = data.data?.productos || data.data;
          setProductos(lista);
        }
      } catch (error) {
        console.error("❌ Error cargando productos:", error);
      }
    }

    fetchProductos();
  }, [id_categoria]);

  return (
    <div className="home-wrap">
      {!productos.length ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <ul className="products-grid">
          {productos.map((p, idx) => {
            const id = p.id_producto ?? idx;
            const nombre = p.nombre || "Producto";
            const img = p.imagen_url || "/no-image.png";

            const precioBase = Number(p.precio_base ?? 0);
            const precioFinal = Number(p.precio_final ?? precioBase);
            const tieneDesc = precioBase > 0 && precioFinal < precioBase;
            const pct = tieneDesc ? Math.round((1 - precioFinal / precioBase) * 100) : p.descuento || 0;

            return (
              <li key={id} className="card">
                <div className="card-img">
                  <img src={img} alt={nombre} loading="lazy" />
                  {pct > 0 && <span className="img-badge">-{pct}%</span>}
                </div>

                <div className="card-body">
                  <h3 className="card-title">{nombre}</h3>

                  <div className="price-row">
                    {tieneDesc && (
                      <span className="price-old">{money.format(precioBase)}</span>
                    )}
                    <span className="price-now">{money.format(precioFinal)}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
