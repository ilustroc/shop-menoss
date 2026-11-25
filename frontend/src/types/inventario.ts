/** Fila de GET /api/inventario. */
export interface ItemInventario {
  productoId: number;
  nombre: string;
  stock: number;
  stockBajo: boolean;
}