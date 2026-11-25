// Módulo: gestión administrativa de pedidos (feature/admin-pedidos)
// Consume los endpoints del backend (solo rol ADMINISTRADOR; el token JWT
// lo agrega el interceptor de api.ts):
//   GET /api/admin/pedidos            (filtro opcional ?estado=PENDIENTE)
//   GET /api/admin/pedidos/{id}
//   PUT /api/admin/pedidos/{id}/estado { "estado": "CONFIRMADO" }

import api from './api';
import { mapearPedidoBackend } from './pedidosService';
import type { EstadoPedido, MetodoPago } from '../types/pedido';
import type { AdminPedidoDetalle, AdminPedidoResumen } from '../types/adminPedido';

interface ResumenBackend {
  id: number;
  fechaCreacion?: string | null;
  estado?: string | null;
  estadosPermitidos?: string[] | null;
  metodoPago?: string | null;
  direccion?: string | null;
  cantidadProductos?: number | null;
  total?: number | null;
}

type DetalleBackend = Parameters<typeof mapearPedidoBackend>[0] & {
  estadosPermitidos?: string[] | null;
};

function aEstado(estado?: string | null): EstadoPedido {
  return (estado ?? 'PENDIENTE').toLowerCase() as EstadoPedido;
}

function aResumen(p: ResumenBackend): AdminPedidoResumen {
  return {
    id: String(p.id),
    fecha: p.fechaCreacion ?? '',
    estado: aEstado(p.estado),
    estadosPermitidos: (p.estadosPermitidos ?? []).map(aEstado),
    metodoPago: (p.metodoPago ?? 'EFECTIVO').toLowerCase() as MetodoPago,
    direccion: p.direccion ?? '',
    cantidadProductos: p.cantidadProductos ?? 0,
    total: p.total ?? 0,
  };
}

function aDetalle(p: DetalleBackend): AdminPedidoDetalle {
  return {
    ...mapearPedidoBackend(p),
    estadosPermitidos: (p.estadosPermitidos ?? []).map(aEstado),
  };
}

/** Lista los pedidos, del más reciente al más antiguo. */
export async function listarPedidos(estado?: EstadoPedido): Promise<AdminPedidoResumen[]> {
  const { data } = await api.get<ResumenBackend[]>('/admin/pedidos', {
    params: estado ? { estado: estado.toUpperCase() } : undefined,
  });
  return data.map(aResumen);
}

export async function obtenerPedido(id: string): Promise<AdminPedidoDetalle> {
  const { data } = await api.get<DetalleBackend>(`/admin/pedidos/${id}`);
  return aDetalle(data);
}

/** Cambia el estado. Si es CANCELADO, el backend devuelve el stock (una sola vez). */
export async function cambiarEstadoPedido(id: string, estado: EstadoPedido): Promise<AdminPedidoDetalle> {
  const { data } = await api.put<DetalleBackend>(`/admin/pedidos/${id}/estado`, {
    estado: estado.toUpperCase(),
  });
  return aDetalle(data);
}

/** El interceptor de api.ts ya traduce 401, 403 y los errores del backend. */
export function mensajeError(error: unknown): string {
  return error instanceof Error && error.message
    ? error.message
    : 'Ocurrió un error inesperado. Inténtalo nuevamente.';
}