import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditarDireccion.css";

const EditarDireccion = () => {
  const { id } = useParams(); // capturamos la dirección a editar
  const navigate = useNavigate();

  const [form, setForm] = useState({
    calle: "",
    numero: "",
    barrio: "",
    ciudad: "",
    provincia_id: "",
    cp: "",
    telefono: "",
    referencia: "",
    entre_calle_1: "",
    entre_calle_2: "",
  });

  const [provincias, setProvincias] = useState([]);

  // 🔹 Traer provincias
  useEffect(() => {
    fetch("http://localhost:8080/api/provincias/listar")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setProvincias(data.data);
      })
      .catch((err) => console.error("Error cargando provincias:", err));
  }, []);

  // 🔹 Cargar dirección actual
  useEffect(() => {
    fetch(`http://localhost:8080/api/direccion-envio/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setForm(data.data);
        }
      })
      .catch((err) => console.error("Error cargando dirección:", err));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:8080/api/direccion-envio/update/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (data.ok) {
        alert("Dirección actualizada con éxito ✅");
        navigate("/checkout/resumen");
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error("Error al actualizar:", err);
      alert("Hubo un problema al actualizar la dirección ❌");
    }
  };

  return (
    <div className="form-container">
      <h2>Editar dirección</h2>
      <form onSubmit={handleSubmit} className="form-elegante">
        <label>
          CALLE
          <input
            name="calle"
            value={form.calle}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          NÚMERO
          <input
            name="numero"
            value={form.numero}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          CIUDAD
          <input
            name="ciudad"
            value={form.ciudad}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          PROVINCIA
          <select
            name="provincia_id"
            value={form.provincia_id}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione provincia</option>
            {provincias.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </label>
        <label>
          CÓDIGO POSTAL
          <input name="cp" value={form.cp || ""} onChange={handleChange} />
        </label>
        <label>
          TELÉFONO
          <input
            name="telefono"
            value={form.telefono || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          BARRIO
          <input
            name="barrio"
            value={form.barrio || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          ENTRE CALLE 1
          <input
            name="entre_calle_1"
            value={form.entre_calle_1 || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          ENTRE CALLE 2
          <input
            name="entre_calle_2"
            value={form.entre_calle_2 || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          REFERENCIA
          <textarea
            name="referencia"
            value={form.referencia || ""}
            onChange={handleChange}
          />
        </label>

        <div className="acciones">
          <button type="submit" className="btn-primario">
            Guardar cambios
          </button>
          <button
            type="button"
            className="btn-secundario"
            onClick={() => navigate("/checkout/resumen")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarDireccion;
