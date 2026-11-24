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

// --- Contratos del backend (ProductoRequest / ProductoResponse) ---
export interface ProductoResponse {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  imagenUrl: string | null;
  activo: boolean;
  categoriaId: number;
  categoriaNombre: string;
}

export interface ProductoRequest {
  nombre: string;
  descripcion?: string | null;
  precio: number;
  stock?: number | null;
  imagenUrl?: string | null;
  activo?: boolean | null;
  categoriaId: number;
}
