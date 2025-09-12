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
      <Link to="/admin/colores" className="btn-admin">
        Colores
      </Link>
      <Link to="/admin/provincias" className="btn-admin">
        Provincias
      </Link>
      <Link to="/admin/ordenes" className="btn-admin">
        Ordenes
      </Link>
            <Link to="/admin/talles" className="btn-admin">
        Talles
      </Link>
    </div>
  );
};

export default AdminPanel;
