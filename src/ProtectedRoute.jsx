import { Navigate } from "react-router-dom";
import { UseAuth } from "./context/AuthContext";

export default function ProtectedRoute({ children, roles = [] }) {
  const { user, loading } = UseAuth();
  console.log(user)
  if (loading) {
    return <p>Cargando sesión...</p>; // Spinner si querés
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
