// src/pages/Productos.tsx
import React, { useState, useMemo } from "react";
import ProductGrid from "../components/ProductGrid";
import { agregarAlCarrito } from "../services/carritoService";
import type { Producto } from "../types/producto";
import { PRODUCTOS_MOCK } from "../data/productosMock";

const Productos: React.FC = () => {
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");

  // Categorías únicas sacadas de los productos, más la opción "Todas"
  const categorias = useMemo(() => {
    const unicas = Array.from(new Set(PRODUCTOS_MOCK.map((p) => p.categoria)));
    return ["Todas", ...unicas];
  }, []);

  const productosFiltrados = useMemo(() => {
    return PRODUCTOS_MOCK.filter((producto) => {
      const coincideBusqueda = producto.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase());

      const coincideCategoria =
        categoriaSeleccionada === "Todas" ||
        producto.categoria === categoriaSeleccionada;

      return coincideBusqueda && coincideCategoria;
    });
  }, [busqueda, categoriaSeleccionada]);

  const handleAgregar = (producto: Producto) => {
    agregarAlCarrito(producto);
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Productos</h1>

      <div className="row mb-4 g-3">
        <div className="col-12 col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-6">
          <select
            className="form-select"
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
          >
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ProductGrid productos={productosFiltrados} onAgregar={handleAgregar} />
    </div>
  );
};

export default Productos;
