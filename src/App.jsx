import { Routes, Route } from "react-router-dom";
import Productos from "./pages/Productos";
import Header from './components/header/Header';
import Login from "./components/login/Login";
import Register from "./components/registroUsuario/Register";
import ProductoDetalle from "./pages/ProductosDetalle";
import Carrito from "./pages/Carrito";
import Direcciones from "./pages/Direcciones";

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
        <Route path="/direcciones-envio" element={<Direcciones />} />
        {/* 🔹 Login */}
        <Route path="/login" element={<Login />} />

        {/* 🔹 Registro */}
        <Route path="/registro" element={<Register />} />  {/* 👈 agregado */}
      </Routes>
    </>
  );  
}

export default App;
