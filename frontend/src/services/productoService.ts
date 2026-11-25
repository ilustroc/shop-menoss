  import api from './api';
import type { Producto } from '../types/producto';
import { listarCategorias } from './categoriaService';

interface ProductoAPI {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenUrl: string | null;
  categoriaId: number;
  categoriaNombre: string;
  activo: boolean;
}

function mapearProducto(producto: ProductoAPI): Producto {
  return {
    ...producto,
    imagen: producto.imagenUrl || '/images/products/placeholder.png',
    categoria: producto.categoriaNombre,
  };
}

export async function listarProductos(
  incluirInactivos = true
): Promise<Producto[]> {
  const { data } = await api.get<ProductoAPI[]>('/productos', {
    params: { incluirInactivos },
  });

  return data.map(mapearProducto);
}

export async function listarProductosCatalogo(): Promise<Producto[]> {
  return listarProductos(false);
}

async function construirBody(producto: Omit<Producto, 'id'>) {
  const categorias = await listarCategorias();
  const categoria = categorias.find(
    (item) => item.nombre === producto.categoria
  );

  if (!categoria) {
    throw new Error('Selecciona una categoría válida');
  }

  return {
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    precio: producto.precio,
    stock: producto.stock,
    imagenUrl: producto.imagen,
    activo: producto.activo,
    categoriaId: categoria.id,
  };
}

export async function crearProducto(
  producto: Omit<Producto, 'id'>
): Promise<Producto> {
  const body = await construirBody(producto);
  const { data } = await api.post<ProductoAPI>('/productos', body);

  return mapearProducto(data);
}

export async function actualizarProducto(
  id: number,
  producto: Omit<Producto, 'id'>
): Promise<void> {
  const body = await construirBody(producto);
  await api.put(`/productos/${id}`, body);
}

export async function eliminarProducto(id: number): Promise<void> {
  await api.delete(`/productos/${id}`);
}

export async function ajustarStock(
  id: number,
  delta: number
): Promise<void> {
  const { data: producto } = await api.get<ProductoAPI>(
    `/productos/${id}`
  );

  await api.put(`/productos/${id}/stock`, {
    stock: Math.max(0, producto.stock + delta),
  });
}