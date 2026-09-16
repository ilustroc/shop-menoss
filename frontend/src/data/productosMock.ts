import type { Producto } from '../types/producto';

export const PRODUCTOS_MOCK: Producto[] = [
  {
    id: 1,
    nombre: 'Arroz Extra 1kg',
    descripcion: 'Arroz de grano largo, calidad extra',
    precio: 5.5,
    stock: 20,
    imagen: '/images/products/arroz.jpg',
    categoria: 'Abarrotes',
  },
  {
    id: 2,
    nombre: 'Aceite Vegetal 1L',
    descripcion: 'Aceite vegetal para cocina',
    precio: 8.9,
    stock: 0,
    imagen: '/images/products/aceite.jpg',
    categoria: 'Abarrotes',
  },
  {
    id: 3,
    nombre: 'Leche Evaporada',
    descripcion: 'Lata de leche evaporada 400g',
    precio: 3.2,
    stock: 15,
    imagen: '/images/products/leche.jpg',
    categoria: 'Lácteos',
  },
  {
    id: 4,
    nombre: 'Detergente 1kg',
    descripcion: 'Detergente en polvo multiusos',
    precio: 12.0,
    stock: 8,
    imagen: '/images/products/detergente.jpg',
    categoria: 'Limpieza',
  },
];