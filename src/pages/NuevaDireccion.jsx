import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./NuevaDireccion.css";

const NuevaDireccion = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    calle: "",
    numero: "",
    ciudad: "",
    provincia_id: "",
    cp: "",
    telefono: "",
    referencia: "",
    barrio: "",
    entre_calle_1: "",
    entre_calle_2: ""
  });

  const [provincias, setProvincias] = useState([]);

  // 🔹 Traemos las provincias desde tu backend
  useEffect(() => {
    fetch("http://localhost:8080/api/provincias/listar")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setProvincias(data.data);
      })
      .catch((err) => console.error("Error cargando provincias:", err));
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/direccion-envio/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.ok) {
        alert("Dirección guardada con éxito ✅");
        navigate("/checkout/direcciones");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error guardando dirección:", error);
      alert("Hubo un problema al guardar la dirección");
    }
  };

  return (
    <div className="form-container">
      <h2>Registro de dirección</h2>
      <form onSubmit={handleSubmit} className="form-elegante">
        <label>
          CALLE
          <input name="calle" value={form.calle} onChange={handleChange} required />
        </label>
        <label>
          NÚMERO
          <input name="numero" value={form.numero} onChange={handleChange} required />
        </label>
        <label>
          CIUDAD
          <input name="ciudad" value={form.ciudad} onChange={handleChange} required />
        </label>
        
        {/* 🔹 SELECT DE PROVINCIAS */}
        <label>
          PROVINCIA
          <select name="provincia_id" value={form.provincia_id} onChange={handleChange} required>
            <option value="">Seleccionar provincia</option>
            {provincias.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </label>

        <label>
          CÓDIGO POSTAL
          <input name="cp" value={form.cp} onChange={handleChange} />
        </label>
        <label>
          TELÉFONO
          <input name="telefono" value={form.telefono} onChange={handleChange} />
        </label>
        <label>
          BARRIO
          <input name="barrio" value={form.barrio} onChange={handleChange} />
        </label>
        <label>
          ENTRE CALLE 1
          <input name="entre_calle_1" value={form.entre_calle_1} onChange={handleChange} />
        </label>
        <label>
          ENTRE CALLE 2
          <input name="entre_calle_2" value={form.entre_calle_2} onChange={handleChange} />
        </label>
        <label>
          REFERENCIA
          <textarea name="referencia" value={form.referencia} onChange={handleChange} />
        </label>

        <div className="acciones">
          <button type="submit" className="btn-primario">Guardar dirección</button>
          <button type="button" className="btn-secundario" onClick={() => navigate("/direcciones-envio")}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default NuevaDireccion;
