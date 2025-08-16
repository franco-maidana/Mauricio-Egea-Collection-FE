import { Routes, Route } from "react-router-dom";
import Productos from "./pages/Productos";
import Header from './components/header/Header'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/productos" element={<Productos />} />
        <Route path="/productos/categoria/:id_categoria" element={<Productos />} />
      </Routes>
    </>
  );  
}

export default App;
