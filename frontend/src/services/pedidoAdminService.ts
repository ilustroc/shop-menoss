// Módulo: gestión administrativa de pedidos (feature/admin-pedidos)
// Consume los endpoints del backend:
//   GET /api/admin/pedidos            (filtro opcional ?estado=PENDIENTE)
//   GET /api/admin/pedidos/{id}
//   PUT /api/admin/pedidos/{id}/estado { "estado": "CONFIRMADO" }
// Estos endpoints solo responden a un usuario con rol ADMINISTRADOR.

import axios from 'axios';
import api from './api';
import { mapearPedidoBackend } from './pedidosService';
import type { EstadoPedido, MetodoPago } from '../types/pedido';
import type { AdminPedidoDetalle, AdminPedidoResumen } from '../types/adminPedido';

// Clave donde feature/authentication guarda la sesión tras el login.
// Si cambia, actualizarla aquí (coordinar con el responsable de autenticación).
const SESSION_KEY = 'menoss_session';

interface ResumenBackend {
  id: number;
  fechaCreacion?: string | null;
  estado?: string | null;
  metodoPago?: string | null;
  direccion?: string | null;
  cantidadProductos?: number | null;
  total?: number | null;
}

type DetalleBackend = Parameters<typeof mapearPedidoBackend>[0] & {
  estadosPermitidos?: string[] | null;
};

/** Agrega el token JWT de la sesión, si existe. */
function cabecerasAutenticacion(): Record<string, string> {
  try {
    const sesion = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null') as { token?: string } | null;
    return sesion?.token ? { Authorization: `Bearer ${sesion.token}` } : {};
  } catch {
    return {};
  }
}

function aEstado(estado?: string | null): EstadoPedido {
  return (estado ?? 'PENDIENTE').toLowerCase() as EstadoPedido;
}

function aResumen(p: ResumenBackend): AdminPedidoResumen {
  return {
    id: String(p.id),
    fecha: p.fechaCreacion ?? '',
    estado: aEstado(p.estado),
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
    headers: cabecerasAutenticacion(),
  });
  return data.map(aResumen);
}

export async function obtenerPedido(id: string): Promise<AdminPedidoDetalle> {
  const { data } = await api.get<DetalleBackend>(`/admin/pedidos/${id}`, {
    headers: cabecerasAutenticacion(),
  });
  return aDetalle(data);
}

/** Cambia el estado. Si es CANCELADO, el backend devuelve el stock. */
export async function cambiarEstadoPedido(id: string, estado: EstadoPedido): Promise<AdminPedidoDetalle> {
  const { data } = await api.put<DetalleBackend>(
    `/admin/pedidos/${id}/estado`,
    { estado: estado.toUpperCase() },
    { headers: cabecerasAutenticacion() },
  );
  return aDetalle(data);
}

/** Convierte un error de la API en un mensaje para el administrador. */
export function mensajeError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as { error?: string } | undefined;

    if (status === 401) return 'Inicia sesión como administrador para continuar.';
    if (status === 403) return 'Tu usuario no tiene permisos de administrador.';
    if (data?.error) return data.error;
    if (!error.response) return 'No se pudo conectar con el servidor.';
  }
  return 'Ocurrió un error inesperado. Inténtalo nuevamente.';
}