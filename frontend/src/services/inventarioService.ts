// Módulo: control de stock desde el panel de administración.
// Consume los endpoints de feature/inventory (requieren rol ADMINISTRADOR;
// el token lo agrega el interceptor de api.ts):
//   GET /api/inventario
//   PUT /api/productos/{id}/stock   { "stock": 20, "stockAnterior": 18 }

import axios from 'axios';
import api from './api';
import type { ItemInventario } from '../types/inventario';

export async function listarInventario(): Promise<ItemInventario[]> {
  const { data } = await api.get<ItemInventario[]>('/inventario');
  return data;
}

/**
 * Fija el stock de un producto. Envía el stock que se estaba viendo (stockAnterior):
 * si una compra lo cambió mientras tanto, el backend responde 409 y no lo sobrescribe.
 */
export async function actualizarStock(
  productoId: number,
  stock: number,
  stockAnterior: number,
): Promise<ItemInventario> {
  const { data } = await api.put<ItemInventario>(`/productos/${productoId}/stock`, {
    stock: Math.max(0, stock),
    stockAnterior,
  });
  return data;
}

/** true si el backend rechazó el ajuste porque el stock cambió (409). */
export function esConflictoDeStock(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 409;
}