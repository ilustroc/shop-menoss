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
