import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableRow({
  producto,
  categorias,
  onEdit,
  onDelete,
  onVerStock,
  onAgregarStock,
  onSubirImagenes
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: String(producto.id_producto),
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: "table-row", // 👈 asegura que respete transform
  };

  return (
    <tr ref={setNodeRef} style={style} {...attributes}>
      {/* ✅ La manija sola tiene los listeners */}
      <td
        {...listeners}
        style={{
          cursor: "grab",
          width: "30px",
          textAlign: "center",
          userSelect: "none",
        }}
      >
        ↕
      </td>

      <td>{producto.id_producto}</td>
      <td>
        <img
          src={producto.imagen_url}
          alt={producto.nombre}
          className="producto-img"
          style={{ cursor: "pointer" }}
          onClick={() => onSubirImagenes(producto)} // 👈 nuevo callback
        />
      </td>
      <td>{producto.nombre}</td>
      <td>${Number(producto.precio_base).toLocaleString()}</td>
      <td>{producto.descuento > 0 ? `${producto.descuento}%` : "-"}</td>
      <td>
        <strong>${Number(producto.precio_final).toLocaleString()}</strong>
      </td>
      <td>{categorias[producto.categoria_id] || "Sin categoría"}</td>
      <td>
        {/* ✅ Botones sin listeners de drag, funcionan bien */}
        <button className="btn-edit" onClick={() => onEdit(producto)}>
          Editar
        </button>
        <button className="btn-delete" onClick={() => onDelete(producto)}>
          Eliminar
        </button>
        <button className="btn-stock" onClick={() => onVerStock(producto)}>
          Ver stock
        </button>
        <button className="btn-stock" onClick={() => onAgregarStock(producto)}>
          Agregar stock
        </button>
      </td>
    </tr>
  );
}
