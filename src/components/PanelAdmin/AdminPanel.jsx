import { Link } from "react-router-dom"; // 👈 necesario
import './css/AdminPanel.css'

const AdminPanel = () => {
  

  return (
    <div className="panel-admin">
      <ul className="Usuarios"> 
        <Link to="/admin/usuario" className="btn-nombre" >Usuarios</Link>
        <Link to="/admin/producto" className="btn-nombre" >Producto</Link>
      </ul>
    </div>
  );
};

export default AdminPanel;
