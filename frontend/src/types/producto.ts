export interface Producto {
  activo?: boolean;
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;
  categoria: string;
}

export interface CartItem {
  stock?: number;
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}
