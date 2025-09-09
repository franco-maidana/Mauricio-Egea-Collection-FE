import { Routes, Route } from "react-router-dom";
import Productos from "./pages/Productos";
import Header from './components/header/Header';
import Login from "./components/login/Login";
import Register from "./components/registroUsuario/Register";
import ProductoDetalle from "./pages/ProductosDetalle";
import Carrito from "./pages/Carrito";
import Direcciones from "./pages/Direcciones";
import NuevaDireccion from "./pages/NuevaDireccion";
import EditarDireccion from "./pages/EditarDireccion";
import Checkout from "./pages/Checkout";
import Footer from "./components/footer/Footer";
import AdminPanel from "./components/PanelAdmin/AdminPanel";
import Usuarios from "./components/PanelAdmin/Usuarios";
import ProductoAdmin from "./components/PanelAdmin/ProductoAdmin";
import Categoria from "./components/PanelAdmin/Categoria";

function App() {
  return (
    <>
      <Header />
      <Routes>
        {/* 🔹 Home apuntando a Productos */}
        <Route path="/" element={<Productos />} />

        <Route path="/productos" element={<Productos />} />
        <Route path="/productos/categoria/:id_categoria" element={<Productos />} />
        <Route path="/productos/buscar/:termino" element={<Productos />} /> {/* 👈 buscador */}
        <Route path="/productos/:tipo" element={<Productos />} /> {/* 👈 descuentos */}
        <Route path="/producto/:id" element={<ProductoDetalle />} />
        <Route path="/carrito" element={<Carrito />} />

        {/* 🔹 Direcciones */}
        <Route path="/direcciones-envio" element={<Direcciones />} />
        <Route path="/checkout/direcciones" element={<Direcciones />} /> {/* 👈 alias corregido */}
        <Route path="/checkout/nueva-direccion" element={<NuevaDireccion />} />
        <Route path="/datos/editar-direccion/:id" element={<EditarDireccion />} />

        {/* 🔹 Checkout */}
        <Route path="/checkout/resumen" element={<Checkout />} />

        {/* panel administrativo */}
        <Route path="/configuracion" element={<AdminPanel />} />
        <Route path="/admin/usuario" element={<Usuarios />} />
        <Route path="/admin/producto" element={<ProductoAdmin />} />
        <Route path="/admin/categoria" element={<Categoria />} />

        {/* 🔹 Login */}
        <Route path="/login" element={<Login />} />

        {/* 🔹 Registro */}
        <Route path="/registro" element={<Register />} />  
      </Routes>
      <Footer/>
    </>
  );  
}

export default App;
