interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;
}

interface ProductCardProps {
  producto: Producto;
  onAgregar: (producto: Producto) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ producto, onAgregar }) => {
  return (
    <div className="card h-100">
      <img src={producto.imagen} className="card-img-top" alt={producto.nombre} />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{producto.nombre}</h5>
        <p className="card-text">{producto.descripcion}</p>
        <div className="mt-auto">
          <p className="card-text"><strong>${producto.precio.toFixed(2)}</strong></p>
          <button className="btn btn-primary" onClick={() => onAgregar(producto)}
            disabled={producto.stock === 0}>
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard