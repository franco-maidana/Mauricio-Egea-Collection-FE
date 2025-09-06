import React, { useEffect, useState, useRef } from "react";
import Global from "../../../helpers/Global";
import ConfirmarEliminarImagenModal from "./ConfirmarEliminarImagenModal";
import "./css/SubirImagenesModal.css";

export default function SubirImagenesModal({
  producto,
  colores,
  onClose,
  onUploaded,
}) {
  const [imagenes, setImagenes] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [colorId, setColorId] = useState("");
  const [imagenAEliminar, setImagenAEliminar] = useState(null);

  const fileInputRef = useRef(null);

  // 🔹 Traer imágenes ya existentes
  useEffect(() => {
    const fetchImagenes = async () => {
      try {
        const res = await fetch(
          `${Global.url}img-galeria/${producto.id_producto}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (res.ok && data.ok) setImagenes(data.data || []);
      } catch (err) {
        console.error("❌ Error cargando imágenes:", err);
      }
    };
    fetchImagenes();
  }, [producto.id_producto]);

  // 🔹 Manejar selección de archivo
  const handleFileChange = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      setFile(archivo);
      setPreview(URL.createObjectURL(archivo)); // preview temporal
    }
  };

  // 🔹 Subir imagen
  const handleUpload = async () => {
    if (!file) {
      console.warn("⚠️ No seleccionaste ninguna imagen");
      return;
    }

    const formData = new FormData();
    formData.append("producto_id", producto.id_producto);

    if (colorId && colorId !== "") {
      formData.append("color_id", parseInt(colorId, 10)); // 👈 aseguramos INT
    }

    formData.append("imagen", file);

    console.log("📤 Enviando al backend:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const res = await fetch(`${Global.url}img-galeria/subir`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      console.log("📥 Respuesta backend:", data);

      if (res.ok && data.ok) {
        setImagenes((prev) => [...prev, data.data]); // 👈 usamos data.data
        setFile(null);
        setPreview(null);
        setColorId("");
        if (onUploaded) onUploaded();
      } else {
        console.error("❌ Error subiendo:", data.msg || "Respuesta inválida");
      }
    } catch (err) {
      console.error("❌ Error en la request:", err);
    }
  };

  // 🔹 Eliminar imagen
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${Global.url}img-galeria/destroi/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setImagenes((prev) => prev.filter((img) => img.id !== id));
        setImagenAEliminar(null);
      } else {
        console.error("❌ Error eliminando:", data.message);
      }
    } catch (err) {
      console.error("❌ Error eliminando imagen:", err);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Subir imágenes a {producto.nombre}</h3>

        <div className="galeria-grid">
          {/* Imágenes existentes */}
          {imagenes.map((img) => (
            <div key={img.id} className="galeria-item">
              <img src={img.url || img.imagen_url} alt={producto.nombre} />
              <button
                className="btn-delete-img"
                onClick={() => setImagenAEliminar(img)}
              >
                🗑️
              </button>
            </div>
          ))}

          {/* Slots vacíos hasta 4 */}
          {Array.from({ length: Math.max(0, 4 - imagenes.length) }).map(
            (_, i) => (
              <div
                key={i}
                className="galeria-item placeholder"
                onClick={() => fileInputRef.current.click()}
                style={{ cursor: "pointer" }}
              >
                {preview && i === 0 ? <img src={preview} alt="preview" /> : "+"}
              </div>
            )
          )}
        </div>

        {/* Input oculto */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {/* Select de colores */}
        <select
          value={colorId}
          onChange={(e) => setColorId(e.target.value)}
          className="form-input"
        >
          <option value="">-- Selecciona un color --</option>
          {colores.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>

        <div className="modal-actions">
          <button className="btn-create" onClick={handleUpload}>
            Subir
          </button>
          <button className="btn-delete" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>

      {imagenAEliminar && (
        <ConfirmarEliminarImagenModal
          imagen={imagenAEliminar}
          onConfirm={handleDelete}
          onCancel={() => setImagenAEliminar(null)}
        />
      )}
    </div>
  );
}
