// src/pages/Productos.tsx
import React, { useState, useMemo } from 'react';
import ProductGrid from '../components/ProductGrid';
import { agregarAlCarrito } from '../services/carritoService';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;
  categoria: string;
}

// Datos de prueba - reemplazar cuando el backend esté listo
const PRODUCTOS_MOCK: Producto[] = [
  {
    id: 1,
    nombre: 'Arroz Extra 1kg',
    descripcion: 'Arroz de grano largo, calidad extra',
    precio: 5.5,
    stock: 20,
    imagen: 'https://via.placeholder.com/300x200?text=Arroz',
    categoria: 'Abarrotes',
  },
  {
    id: 2,
    nombre: 'Aceite Vegetal 1L',
    descripcion: 'Aceite vegetal para cocina',
    precio: 8.9,
    stock: 0,
    imagen: 'https://via.placeholder.com/300x200?text=Aceite',
    categoria: 'Abarrotes',
  },
  {
    id: 3,
    nombre: 'Leche Evaporada',
    descripcion: 'Lata de leche evaporada 400g',
    precio: 3.2,
    stock: 15,
    imagen: 'https://via.placeholder.com/300x200?text=Leche',
    categoria: 'Lácteos',
  },
  {
    id: 4,
    nombre: 'Detergente 1kg',
    descripcion: 'Detergente en polvo multiusos',
    precio: 12.0,
    stock: 8,
    imagen: 'https://via.placeholder.com/300x200?text=Detergente',
    categoria: 'Limpieza',
  },
];
