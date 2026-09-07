import React from 'react';
import ProductCard from './ProductCard';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;
  categoria: string;
}

interface ProductGridProps {
  productos: Producto[];
  onAgregar: (producto: Producto) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ productos, onAgregar }) => {
  if (productos.length === 0) {
    return (
      <div className="text-center text-muted py-5">
        <p className="fs-5">No se encontraron productos.</p>
      </div>
    );
  }

  return (
    <div className="row g-4">
      {productos.map((producto) => (
        <div key={producto.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
          <ProductCard producto={producto} onAgregar={onAgregar} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;