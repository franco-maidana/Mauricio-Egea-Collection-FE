import { Routes, Route } from "react-router-dom";
import Productos from "./pages/Productos";
import Header from './components/header/Header';
import Login from "./components/login/Login";

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

        {/* 🔹 Nueva ruta de login */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );  
}

export default App;
