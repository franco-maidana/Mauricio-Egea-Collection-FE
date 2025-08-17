import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // 👈 importamos navigate
import Global from "../../helpers/Global";
import { UseAuth } from "../../context/AuthContext";
import './css/Login.css';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const { login } = UseAuth();
  const navigate = useNavigate(); // 👈 hook para redirigir

  async function handleSubmit(e) {
  e.preventDefault();
  try {
    const res = await fetch(`${Global.url}auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log("Respuesta backend login:", data);
    if (res.ok && data.ok) {
      login(data);
      setMensaje(`Bienvenido, ${data.user.name} ${data.user.last_name}`);


      // 👇 El mensaje desaparece a los 3 segundos
      setTimeout(() => {
        setMensaje("");
      }, 3000);

      navigate("/"); // redirige al home
    } else {
      setMensaje(data.message || "❌ Error en inicio de sesión");

      setTimeout(() => {
        setMensaje("");
      }, 3000); // opcional: borrar error también
    }
  } catch {
    setMensaje("❌ No se pudo conectar con el servidor");

    setTimeout(() => {
      setMensaje("");
    }, 3000); // también lo limpiamos
  }
  }


  return (
    <div className="login-container">
      <h2>Inicia sesión</h2>

      <form onSubmit={handleSubmit} className="login-form">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="btn-black">
          Iniciar sesión
        </button>
      </form>

      <button
        type="button"
        className="btn-google"
        onClick={() => {
          window.location.href = `${Global.url}auth/google`;
        }}
      >
        <img src="/Google.png" alt="Google" />
        Iniciar sesión con Google
      </button>

      {mensaje && <p className="login-msg">{mensaje}</p>}
      <div className="opt-usuario">
        <Link to="/recuperar" className="help-link">
          ¿Has olvidado tu contraseña?
        </Link>
        <Link to="/registro" className="help-link">
          Registrate
        </Link>
      </div>
    </div>
  );
}
