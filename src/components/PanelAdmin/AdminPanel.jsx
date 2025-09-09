import { Link } from "react-router-dom";
import "./css/AdminPanel.css";

const AdminPanel = () => {
  return (
    <div className="panel-admin">
      <h2>Panel Administrador</h2>
      <Link to="/admin/usuario" className="btn-admin">
        Usuarios
      </Link>
      <Link to="/admin/producto" className="btn-admin">
        Productos
      </Link>
      <Link to="/admin/categoria" className="btn-admin">
        Categoria
      </Link>
    </div>
  );
};

export default AdminPanel;
