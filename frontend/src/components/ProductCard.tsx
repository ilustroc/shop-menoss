import React from "react";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;
  categoria: string;
}

interface ProductCardProps {
  producto: Producto;
  onAgregar: (producto: Producto) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ producto, onAgregar }) => {
  const sinStock = producto.stock === 0;

  return (
    <div className="card h-100 shadow-sm">
      <img
        src={producto.imagen}
        className="card-img-top"
        alt={producto.nombre}
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            "/images/products/placeholder.png";
        }}
      />
      <div className="card-body d-flex flex-column">
        <span className="badge bg-secondary align-self-start mb-2">
          {producto.categoria}
        </span>
        <h5 className="card-title">{producto.nombre}</h5>
        <p className="card-text text-muted small">{producto.descripcion}</p>

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <strong>S/ {producto.precio.toFixed(2)}</strong>
            <small className={sinStock ? "text-danger" : "text-success"}>
              {sinStock ? "Sin stock" : `Stock: ${producto.stock}`}
            </small>
          </div>
          <button
            className="btn btn-primary w-100"
            onClick={() => onAgregar(producto)}
            disabled={sinStock}
          >
            {sinStock ? "Sin stock" : "Agregar al carrito"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);
