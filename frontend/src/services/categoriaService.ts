import type { Categoria } from '../types/categoria';

// TODO backend: reemplazar por llamadas a api.get('/categorias'), etc.
let categorias: Categoria[] = [
  { id: 1, nombre: 'Abarrotes', descripcion: 'Arroz, azúcar, fideos y menestras' },
  { id: 2, nombre: 'Bebidas', descripcion: 'Gaseosas, jugos y agua' },
  { id: 3, nombre: 'Lácteos', descripcion: 'Leche, yogurt y quesos' },
];
let siguienteId = 4;

export async function listarCategorias(): Promise<Categoria[]> {
  return [...categorias];
}

export async function crearCategoria(data: Omit<Categoria, 'id'>): Promise<Categoria> {
  const nueva: Categoria = { id: siguienteId++, ...data };
  categorias = [...categorias, nueva];
  return nueva;
}

export async function actualizarCategoria(id: number, data: Omit<Categoria, 'id'>): Promise<void> {
  categorias = categorias.map((c) => (c.id === id ? { id, ...data } : c));
}

export async function eliminarCategoria(id: number): Promise<void> {
  categorias = categorias.filter((c) => c.id !== id);
}