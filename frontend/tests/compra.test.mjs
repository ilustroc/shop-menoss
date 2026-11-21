import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { calcularTotales } from '../src/services/totales.ts';
import { agregarAlCarrito, aumentarCantidad, disminuirCantidad, eliminarDelCarrito, leerCarrito } from '../src/services/carritoService.ts';

const storage = new Map();
globalThis.localStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) };
beforeEach(() => storage.clear());

test('Importes en soles con IGV incluido y un solo envío', () => {
  assert.deepEqual(calcularTotales([{ precio: 9.9, cantidad: 2 }]), { subtotal: 19.8, igv: 0, envio: 10, total: 29.8 });
  assert.equal(calcularTotales([{ precio: 0.1, cantidad: 3 }, { precio: 0.2, cantidad: 1 }]).total, 10.5);
  assert.equal(calcularTotales([]).total, 0);
});

test('El carrito conserva IDs y cantidades, rechaza agotados y exceso de stock', () => {
  const producto = { id: 429, nombre: 'Producto', precio: 9.9, stock: 2 };
  agregarAlCarrito(producto);
  aumentarCantidad(producto.id);
  assert.equal(leerCarrito()[0].cantidad, 2);
  assert.throws(() => aumentarCantidad(producto.id));
  assert.throws(() => agregarAlCarrito(producto));
  assert.throws(() => agregarAlCarrito({ ...producto, id: 430, stock: 0 }));
  disminuirCantidad(producto.id);
  assert.equal(leerCarrito()[0].cantidad, 1);
  assert.equal(leerCarrito()[0].id, 429);
  eliminarDelCarrito(producto.id);
  assert.deepEqual(leerCarrito(), []);
});

test('Actualizar un producto en carrito refresca el precio y el stock del catálogo', () => {
  agregarAlCarrito({ id: 429, nombre: 'Producto', precio: 9.9, stock: 3 });
  agregarAlCarrito({ id: 429, nombre: 'Producto', precio: 12.5, stock: 2 });
  assert.equal(leerCarrito()[0].precio, 12.5);
  assert.equal(leerCarrito()[0].stock, 2);
  assert.throws(() => aumentarCantidad(429));
});
