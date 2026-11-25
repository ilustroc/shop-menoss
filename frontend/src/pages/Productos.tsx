// src/pages/Productos.tsx
import React, { useState, useMemo, useEffect } from "react";
import ProductGrid from "../components/ProductGrid";
import { agregarAlCarrito } from "../services/carritoService";
import type { Producto } from "../types/producto";
import { listarProductosCatalogo } from "../services/productoService";

const Productos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");

  useEffect(() => {
    let activo = true;

    listarProductosCatalogo()
      .then((productosCargados) => {
        if (activo) setProductos(productosCargados);
      })
      .catch(() => {
        if (activo) setError(true);
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  const categorias = useMemo(() => {
    const unicas = Array.from(new Set(productos.map((p) => p.categoria)));
    return ["Todas", ...unicas];
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    return productos.filter((producto) => {
      const coincideBusqueda = producto.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase());

      const coincideCategoria =
        categoriaSeleccionada === "Todas" ||
        producto.categoria === categoriaSeleccionada;

      return coincideBusqueda && coincideCategoria;
    });
  }, [productos, busqueda, categoriaSeleccionada]);

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

      {cargando ? (
        <div className="alert alert-info" role="status">
          Cargando productos...
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          No se pudo cargar el catálogo. Inténtalo nuevamente más tarde.
        </div>
      ) : (
        <ProductGrid productos={productosFiltrados} onAgregar={handleAgregar} />
      )}
    </div>
  );
};

export default Productos;
