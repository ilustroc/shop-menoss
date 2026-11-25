import api from './api';
import type { Producto } from '../types/producto';
import {
  aCuerpoApi,
  aProducto,
  type ProductoAdmin,
  type ProductoAPI,
  type ProductoInput,
} from './productoMapper';

export type { ProductoAdmin, ProductoInput } from './productoMapper';
export { aInput } from './productoMapper';

const IMAGEN_POR_DEFECTO = '/images/products/placeholder.png';

function mapearProductoCatalogo(
  producto: ProductoAPI
): Producto {
  return {
    id: producto.id,
    nombre: producto.nombre,
    descripcion: producto.descripcion ?? '',
    precio: producto.precio,
    stock: producto.stock,
    imagen: producto.imagenUrl || IMAGEN_POR_DEFECTO,
    categoria: producto.categoriaNombre,
  };
}

// GET /api/productos es público. El parámetro incluirInactivos
// solo debe usarlo la administración.
export async function listarProductos(
  incluirInactivos = true
): Promise<ProductoAdmin[]> {
  const { data } = await api.get<ProductoAPI[]>('/productos', {
    params: { incluirInactivos },
  });

  return data.map(aProducto);
}

export async function listarProductosCatalogo(): Promise<Producto[]> {
  const { data } = await api.get<ProductoAPI[]>('/productos', {
    params: { incluirInactivos: false },
  });

  return data.map(mapearProductoCatalogo);
}

export async function crearProducto(
  producto: ProductoInput
): Promise<ProductoAdmin> {
  const { data } = await api.post<ProductoAPI>(
    '/productos',
    aCuerpoApi(producto)
  );

  return aProducto(data);
}

export async function actualizarProducto(
  id: number,
  producto: ProductoInput
): Promise<ProductoAdmin> {
  const { data } = await api.put<ProductoAPI>(
    `/productos/${id}`,
    aCuerpoApi(producto)
  );

  return aProducto(data);
}

// Baja lógica: el backend marca el producto como inactivo
// y conserva el historial.
export async function eliminarProducto(id: number): Promise<void> {
  await api.delete(`/productos/${id}`);
}

export async function ajustarStock(
  id: number,
  delta: number
): Promise<void> {
  const { data } = await api.get<ProductoAPI>(`/productos/${id}`);

  await api.put(`/productos/${id}/stock`, {
    stock: Math.max(0, data.stock + delta),
  });
}