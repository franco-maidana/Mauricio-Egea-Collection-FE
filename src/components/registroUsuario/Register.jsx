import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 importar el hook
import Global from "../../helpers/Global";
import "./../login/css/Login.css"; 

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [status, setStatus] = useState(null);
  const navigate = useNavigate(); // 👈 inicializar navigate

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const request = await fetch(`${Global.url}users/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await request.json();

      if (data.ok) {
        setStatus("success");
        // 👇 redirigir después de 1 segundo para mostrar el mensaje
        setTimeout(() => {
          navigate("/login"); 
        }, 1000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      setStatus("error");
    }
  };

  return (
    <div className="login-container">
      <h2>Registro de usuario</h2>

      <form onSubmit={handleSubmit} className="login-form">
        <label>Nombre</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label>Apellido</label>
        <input
          type="text"
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>Contraseña</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn-black">
          Registrarse
        </button>
      </form>

      {status === "success" && <p className="login-msg">✅ Usuario registrado correctamente, redirigiendo...</p>}
      {status === "error" && <p className="login-msg">❌ Error al registrar el usuario</p>}
    </div>
  );
};

export default Register;
