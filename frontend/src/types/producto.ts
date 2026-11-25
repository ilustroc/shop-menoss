export interface ProductoResponse {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenUrl: string | null;
  activo: boolean;
  categoriaId: number | null;
  categoriaNombre: string | null;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;
  categoria: string;
}

export interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}