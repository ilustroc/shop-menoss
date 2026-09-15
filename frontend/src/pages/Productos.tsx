// src/pages/Productos.tsx
import React, { useState, useMemo } from "react";
import ProductGrid from "../components/ProductGrid";
import { agregarAlCarrito } from "../services/carritoService";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;
  categoria: string;
}

// Datos de prueba - reemplazar cuando el backend esté listo
const PRODUCTOS_MOCK: Producto[] = [
  {
    id: 1,
    nombre: "Arroz Extra 1kg",
    descripcion: "Arroz de grano largo, calidad extra",
    precio: 5.5,
    stock: 20,
    imagen: "/images/products/arroz.jpg",
    categoria: "Abarrotes",
  },
  {
    id: 2,
    nombre: "Aceite Vegetal 1L",
    descripcion: "Aceite vegetal para cocina",
    precio: 8.9,
    stock: 0,
    imagen: "/images/products/aceite.jpg",
    categoria: "Abarrotes",
  },
  {
    id: 3,
    nombre: "Leche Evaporada",
    descripcion: "Lata de leche evaporada 400g",
    precio: 3.2,
    stock: 15,
    imagen: "/images/products/leche.jpg",
    categoria: "Lácteos",
  },
  {
    id: 4,
    nombre: "Detergente 1kg",
    descripcion: "Detergente en polvo multiusos",
    precio: 12.0,
    stock: 8,
    imagen: "/images/products/detergente.jpg",
    categoria: "Limpieza",
  },
];

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
