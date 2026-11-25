// src/pages/Productos.tsx
import React, { useState, useMemo, useEffect } from "react";
import ProductGrid from "../components/ProductGrid";
import { agregarAlCarrito } from "../services/carritoService";
import { listarProductosCatalogo } from "../services/productoService";
import type { Producto } from "../types/producto";

const Productos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorCatalogo, setErrorCatalogo] = useState("");
  const [errorCarrito, setErrorCarrito] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState("Todas");

  useEffect(() => {
    let activo = true;

    listarProductosCatalogo()
      .then((productosCargados) => {
        if (activo) {
          setProductos(productosCargados);
        }
      })
      .catch(() => {
        if (activo) {
          setErrorCatalogo(
            "No se pudo cargar el catálogo. Inténtalo nuevamente."
          );
        }
      })
      .finally(() => {
        if (activo) {
          setCargando(false);
        }
      });

    return () => {
      activo = false;
    };
  }, []);

  const categorias = useMemo(() => {
    const unicas = Array.from(
      new Set(productos.map((producto) => producto.categoria))
    );

    return ["Todas", ...unicas];
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    const textoBusqueda = busqueda.trim().toLowerCase();

    return productos.filter((producto) => {
      const coincideBusqueda = producto.nombre
        .toLowerCase()
        .includes(textoBusqueda);

      const coincideCategoria =
        categoriaSeleccionada === "Todas" ||
        producto.categoria === categoriaSeleccionada;

      return coincideBusqueda && coincideCategoria;
    });
  }, [productos, busqueda, categoriaSeleccionada]);

  const handleAgregar = (producto: Producto) => {
    setErrorCarrito("");
    setMensaje("");

    try {
      agregarAlCarrito(producto);
      setMensaje(`${producto.nombre} agregado al carrito.`);
    } catch (error) {
      setErrorCarrito(
        error instanceof Error
          ? error.message
          : "No se pudo agregar el producto al carrito."
      );
    }
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Productos</h1>

      {mensaje && (
        <div role="status" className="alert alert-success">
          {mensaje}
        </div>
      )}

      {errorCarrito && (
        <div role="alert" className="alert alert-warning">
          {errorCarrito}
        </div>
      )}

      <div className="row mb-4 g-3">
        <div className="col-12 col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar producto..."
            aria-label="Buscar producto"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            disabled={cargando || Boolean(errorCatalogo)}
          />
        </div>

        <div className="col-12 col-md-6">
          <select
            className="form-select"
            aria-label="Filtrar por categoría"
            value={categoriaSeleccionada}
            onChange={(event) =>
              setCategoriaSeleccionada(event.target.value)
            }
            disabled={cargando || Boolean(errorCatalogo)}
          >
            {categorias.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>
      </div>

      {cargando ? (
        <div className="alert alert-info" role="status">
          Cargando productos...
        </div>
      ) : errorCatalogo ? (
        <div className="alert alert-danger" role="alert">
          <p className="mb-2">{errorCatalogo}</p>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      ) : productos.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : productosFiltrados.length === 0 ? (
        <p>No se encontraron productos con esos filtros.</p>
      ) : (
        <ProductGrid
          productos={productosFiltrados}
          onAgregar={handleAgregar}
        />
      )}
    </div>
  );
};

export default Productos;