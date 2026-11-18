import type { EstadoPedido, Pedido } from '../types/pedido';

// TODO backend: reemplazar por api.get('/admin/pedidos') y api.patch(...)
let pedidos: Pedido[] = [
  {
    id: 'PED-001',
    fecha: '2026-10-20',
    estado: 'pendiente',
    direccion: 'Av. Arequipa 1234, Lima',
    referencia: 'Frente al parque',
    metodoPago: 'efectivo',
    detalles: [
      { productoId: 1, nombre: 'Arroz Costeño 5kg', precioUnitario: 24.9, cantidad: 1 },
      { productoId: 3, nombre: 'Inca Kola 1.5L', precioUnitario: 7.5, cantidad: 2 },
    ],
    subtotal: 33.05,
    igv: 5.95,
    total: 39.9,
  },
  {
    id: 'PED-002',
    fecha: '2026-10-21',
    estado: 'preparando',
    direccion: 'Jr. de la Unión 500, Lima',
    metodoPago: 'tarjeta',
    tarjetaUltimos4: '4242',
    detalles: [{ productoId: 4, nombre: 'Leche Gloria 400g', precioUnitario: 4.2, cantidad: 6 }],
    subtotal: 21.36,
    igv: 3.84,
    total: 25.2,
  },
];

export async function listarPedidos(): Promise<Pedido[]> {
  return [...pedidos];
}

export async function cambiarEstadoPedido(id: string, estado: EstadoPedido): Promise<void> {
  pedidos = pedidos.map((p) => (p.id === id ? { ...p, estado } : p));
}