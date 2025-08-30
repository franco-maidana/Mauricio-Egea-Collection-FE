// context/CarritoContext.jsx
import { createContext, useContext, useState } from "react";

const CarritoContext = createContext();

export const UseCarrito = () => useContext(CarritoContext);

export const CarritoProvider = ({ children }) => {
  const [carritoCount, setCarritoCount] = useState(0);

  return (
    <CarritoContext.Provider value={{ carritoCount, setCarritoCount }}>
      {children}
    </CarritoContext.Provider>
  );
};
