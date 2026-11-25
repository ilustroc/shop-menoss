import type { Producto } from "../types/producto";

export const IMAGEN_POR_DEFECTO = "/images/products/placeholder.png";

// Respuesta de GET/POST/PUT /api/productos (ProductoResponse del backend).
export interface ProductoAPI {
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

// Producto tal como lo usa la administración: el tipo del catálogo más el id de categoría.
export type ProductoAdmin = Producto & { categoriaId: number; activo: boolean };

// Datos que el formulario envía al backend (ProductoRequest).
// `stock` solo se envía al crear: al editar, el stock se ajusta desde Inventario
// para no pisar cambios hechos por pedidos u otros administradores.
export interface ProductoInput {
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoriaId: number;
  activo: boolean;
  stock?: number;
}

export function aProducto(p: ProductoAPI): ProductoAdmin {
  return {
    id: p.id,
    nombre: p.nombre,
    descripcion: p.descripcion ?? "",
    precio: p.precio,
    stock: p.stock,
    activo: p.activo,
    imagen: p.imagenUrl || IMAGEN_POR_DEFECTO,
    categoria: p.categoriaNombre,
    categoriaId: p.categoriaId,
  };
}

export function aCuerpoApi(p: ProductoInput) {
  return {
    nombre: p.nombre,
    descripcion: p.descripcion,
    precio: p.precio,
    imagenUrl: p.imagen,
    categoriaId: p.categoriaId,
    activo: p.activo,
    ...(p.stock === undefined ? {} : { stock: p.stock }),
  };
}

// Datos editables de un producto existente, sin stock (para reactivar o desactivar sin pisarlo).
export function aInput(p: ProductoAdmin): ProductoInput {
  return {
    nombre: p.nombre,
    descripcion: p.descripcion,
    precio: p.precio,
    imagen: p.imagen === IMAGEN_POR_DEFECTO ? "" : p.imagen,
    categoriaId: p.categoriaId,
    activo: p.activo,
  };
}
