import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Global from "../helpers/Global";
import "./Productos.css";

const money = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

export default function Productos() {
  const { id_categoria, tipo, termino } = useParams();
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        let url;
        if (tipo === "descuentos") {
          url = `${Global.url}productos/descuentos`;
        } else if (id_categoria) {
          url = `${Global.url}productos/categoria/${id_categoria}`;
        } else if (termino) {
          url = `${Global.url}productos/buscar/${termino}`;
        } else {
          url = `${Global.url}productos/list`;
        }

        // 1️⃣ Traer productos
        const resProd = await fetch(url);
        const dataProd = await resProd.json();
        const lista = dataProd.ok
          ? dataProd.data?.productos || dataProd.data
          : [];

        // 2️⃣ Traer stock
        const resStock = await fetch(`${Global.url}stock/list`);
        const dataStock = await resStock.json();
        const stockList = dataStock.ok ? dataStock.data : [];

        // 3️⃣ Unir productos con su stock
        const listaConStock = lista.map((p) => {
          const stockProducto = stockList.filter(
            (s) => s.id_producto === p.id_producto
          );
          return { ...p, stock: stockProducto };
        });

        setProductos(listaConStock);
      } catch (error) {
        console.error("❌ Error cargando productos + stock:", error);
      }
    }

    fetchData();
  }, [id_categoria, tipo, termino]);

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
            const pct = tieneDesc
              ? Math.round((1 - precioFinal / precioBase) * 100)
              : p.descuento || 0;

            // calcular stock total
            const totalStock = p.stock?.reduce(
              (acc, s) => acc + (s.stock || 0),
              0
            );

            return (
              <li
                key={id}
                className={`card ${totalStock === 0 ? "sin-stock-card" : ""}`}
              >
                <Link to={`/producto/${id}`} className="card-link">
                  <div className="card-img">
                    <img src={img} alt={nombre} loading="lazy" />
                    {pct > 0 && <span className="img-badge">-{pct}%</span>}
                  </div>

                  <div className="card-body">
                    <h3 className="card-title">{nombre}</h3>

                    <div className="price-row">
                      {tieneDesc && (
                        <span className="price-old">
                          {money.format(precioBase)}
                        </span>
                      )}
                      <span className="price-now">
                        {money.format(precioFinal)}
                      </span>
                    </div>

                    {/* 🔹 Aviso de sin stock */}
                    {totalStock === 0 && (
                      <div className="stock-info sin-stock">
                        <span>Sin stock</span>
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
