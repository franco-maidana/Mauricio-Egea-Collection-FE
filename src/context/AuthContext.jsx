import { createContext, useContext, useState, useEffect } from "react";
import Global from "../helpers/Global";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Verificar sesión al cargar la app (si ya hay cookie válida en backend)
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(`${Global.url}auth/me`, {
          credentials: "include", // 👈 para enviar cookies al backend
        });
        const data = await res.json();

        if (res.ok && data.ok) {
          setUser(data.user); // ✅ el backend devuelve { user: { ... } }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error verificando sesión:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  // 🔹 login: guardar usuario en contexto
  const login = (userData) => {
    console.log("Guardando en contexto:", userData); // 👀 debug
    setUser(userData.user); // ✅ Ojo: el login recibe { ok, message, user }
  };

  // 🔹 logout: borra sesión en backend y frontend
  const logout = async () => {
    try {
      await fetch(`${Global.url}auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error("Error en logout:", e);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function UseAuth() {
  return useContext(AuthContext);
}
