import { Routes, Route } from "react-router-dom";
import Productos from "./pages/Productos";
import Header from './components/header/Header';

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
      </Routes>
    </>
  );  
}

export default App;
