// src/pages/Productos.tsx
import React, { useState, useMemo, useEffect } from "react";
import ProductGrid from "../components/ProductGrid";
import { agregarAlCarrito } from "../services/carritoService";
import type { Producto } from "../types/producto";
import { listarProductos } from "../services/productoService";

const Productos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);
  useEffect(() => { listarProductos(false).then(setProductos).catch(e=>setError(e.message)).finally(()=>setCargando(false)); }, []);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");

  // Categorías únicas sacadas de los productos, más la opción "Todas"
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
  }, [busqueda, categoriaSeleccionada, productos]);

  const handleAgregar = (producto: Producto) => {
    setError(''); setMensaje('');
    try { agregarAlCarrito(producto); setMensaje(`${producto.nombre} agregado al carrito.`); }
    catch(e) {setError(e instanceof Error ? e.message : 'Stock insuficiente');}
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Productos</h1>
      {cargando && <p>Cargando productos…</p>}
      {mensaje && <p role="status" className="alert alert-success">{mensaje}</p>}
      {error && <div role="alert" className="alert alert-danger">{error} <button onClick={()=>window.location.reload()}>Reintentar</button></div>}
      {!cargando && !error && productos.length===0 && <p>No hay productos disponibles.</p>}

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
