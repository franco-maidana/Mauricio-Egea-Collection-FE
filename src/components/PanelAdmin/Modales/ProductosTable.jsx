import React from "react";
import { DndContext, closestCenter,} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove,} from "@dnd-kit/sortable";
import SortableRow from "../SortableRow";
import Global from "../../../helpers/Global";

export default function ProductosTable({
  productos,
  setProductos,
  categorias,
  sensors,
  onEdit,
  onDelete,
  onVerStock,
  onAgregarStock,
  onSubirImagenes
}) {
  // Manejo de drag & drop
  const handleDragEnd = async ({ active, over }) => {
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = productos.findIndex(
        (p) => String(p.id_producto) === active.id
      );
      const newIndex = productos.findIndex(
        (p) => String(p.id_producto) === over.id
      );

      const nuevosProductos = arrayMove(productos, oldIndex, newIndex);
      setProductos(nuevosProductos);

      // Guardar en backend
      await fetch(`${Global.url}productos/reordenar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(
          nuevosProductos.map((p, index) => ({
            id_producto: p.id_producto,
            orden: index + 1,
          }))
        ),
      });
    }
  };

  if (!productos.length) {
    return <p>No hay productos disponibles.</p>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={productos.map((p) => String(p.id_producto))}
        strategy={verticalListSortingStrategy}
      >
        <table className="productos-table">
          <thead>
            <tr>
              <th>↕</th>
              <th>ID</th>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio base</th>
              <th>Descuento</th>
              <th>Precio final</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {productos.map((p) => (
              <SortableRow
                key={p.id_producto}
                producto={p}
                categorias={categorias}
                onEdit={onEdit}
                onDelete={onDelete}
                onVerStock={onVerStock}
                onAgregarStock={onAgregarStock}
                onSubirImagenes={onSubirImagenes}
              />
            ))}
          </tbody>
        </table>
      </SortableContext>
    </DndContext>
  );
}
