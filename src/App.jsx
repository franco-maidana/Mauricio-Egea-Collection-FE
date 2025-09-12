import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
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
import Colores from "./components/PanelAdmin/Colores";
import Provincias from "./components/PanelAdmin/Provincias";
import Ordenes from "./components/PanelAdmin/Ordenes";
import Talles from "./components/PanelAdmin/Talles";


function App() {
  return (
    <>
      <Header />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Productos />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/productos/categoria/:id_categoria" element={<Productos />} />
        <Route path="/productos/buscar/:termino" element={<Productos />} />
        <Route path="/productos/:tipo" element={<Productos />} />
        <Route path="/producto/:id" element={<ProductoDetalle />} />
        <Route path="/carrito" element={<Carrito />} />

        {/* Direcciones */}
        <Route path="/direcciones-envio" element={<Direcciones />} />
        <Route path="/checkout/direcciones" element={<Direcciones />} />
        <Route path="/checkout/nueva-direccion" element={<NuevaDireccion />} />
        <Route path="/datos/editar-direccion/:id" element={<EditarDireccion />} />
        <Route path="/checkout/resumen" element={<Checkout />} />

        {/* Panel administrativo (solo admin) */}
        <Route
          path="/configuracion"
          element={
            <ProtectedRoute roles={["admin", "manager"]}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/usuario"
          element={
            <ProtectedRoute roles={["admin", "manager"]}>
              <Usuarios />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/producto"
          element={
            <ProtectedRoute roles={["admin", "manager"]}>
              <ProductoAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categoria"
          element={
            <ProtectedRoute roles={["admin", "manager"]}>
              <Categoria />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/colores"
          element={
            <ProtectedRoute roles={["admin", "manager"]}>
              <Colores />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/provincias"
          element={
            <ProtectedRoute roles={["admin", "manager"]}>
              <Provincias />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/ordenes"
          element={
            <ProtectedRoute roles={["admin", "manager"]}>
              <Ordenes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/talles"
          element={
            <ProtectedRoute roles={["admin", "manager"]}>
              <Talles />
            </ProtectedRoute>
          }
        />

        {/* Login y registro */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
