// Módulo: control de stock desde el panel de administración.
// Consume los endpoints de feature/inventory:
//   GET /api/inventario
//   PUT /api/productos/{id}/stock   { "stock": 20 }

import api from './api';
import type { ItemInventario } from '../types/inventario';

export async function listarInventario(): Promise<ItemInventario[]> {
  const { data } = await api.get<ItemInventario[]>('/inventario');
  return data;
}

/** Fija el stock de un producto (no puede ser negativo). */
export async function actualizarStock(productoId: number, stock: number): Promise<ItemInventario> {
  const { data } = await api.put<ItemInventario>(`/productos/${productoId}/stock`, {
    stock: Math.max(0, stock),
  });
  return data;
}