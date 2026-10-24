import type { Producto } from '../types/producto';

// TODO backend: reemplazar por llamadas a api.get('/productos'), etc.
let productos: Producto[] = [
  { id: 1, nombre: 'Arroz Costeño 5kg', descripcion: 'Arroz extra superior', precio: 24.9, stock: 40, imagen: '', categoria: 'Abarrotes' },
  { id: 2, nombre: 'Aceite Primor 1L', descripcion: 'Aceite vegetal', precio: 11.5, stock: 8, imagen: '', categoria: 'Abarrotes' },
  { id: 3, nombre: 'Inca Kola 1.5L', descripcion: 'Gaseosa sabor original', precio: 7.5, stock: 60, imagen: '', categoria: 'Bebidas' },
  { id: 4, nombre: 'Leche Gloria 400g', descripcion: 'Leche evaporada entera', precio: 4.2, stock: 5, imagen: '', categoria: 'Lácteos' },
];
let siguienteId = 5;

export async function listarProductos(): Promise<Producto[]> {
  return [...productos];
}

export async function crearProducto(data: Omit<Producto, 'id'>): Promise<Producto> {
  const nuevo: Producto = { id: siguienteId++, ...data };
  productos = [...productos, nuevo];
  return nuevo;
}

export async function actualizarProducto(id: number, data: Omit<Producto, 'id'>): Promise<void> {
  productos = productos.map((p) => (p.id === id ? { id, ...data } : p));
}

export async function eliminarProducto(id: number): Promise<void> {
  productos = productos.filter((p) => p.id !== id);
}

export async function ajustarStock(id: number, delta: number): Promise<void> {
  productos = productos.map((p) =>
    p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p
  );
}