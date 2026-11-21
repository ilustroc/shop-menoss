import api from './api';
import type { Producto } from '../types/producto';
import { listarCategorias } from './categoriaService';
interface ProductoAPI { id: number; nombre: string; descripcion: string; precio: number; stock: number; imagenUrl: string; categoriaId: number; categoriaNombre: string; activo: boolean }
function map(p: ProductoAPI): Producto { return {...p, imagen: p.imagenUrl || '/images/products/placeholder.png', categoria: p.categoriaNombre}; }
export async function listarProductos(incluirInactivos = true): Promise<Producto[]> {
  return (await api.get<ProductoAPI[]>('/productos', {params:{incluirInactivos}})).data.map(map);
}
async function body(p: Omit<Producto, 'id'>) {
  const categoria = (await listarCategorias()).find(c=>c.nombre === p.categoria);
  if (!categoria) throw new Error('Selecciona una categoría válida');
  return {nombre:p.nombre,descripcion:p.descripcion,precio:p.precio,stock:p.stock,imagenUrl:p.imagen,activo:p.activo,categoriaId:categoria.id};
}
export async function crearProducto(p: Omit<Producto, 'id'>): Promise<Producto> { return map((await api.post('/productos', await body(p))).data); }
export async function actualizarProducto(id:number,p:Omit<Producto,'id'>):Promise<void>{await api.put('/productos/'+id, await body(p));}
export async function eliminarProducto(id:number):Promise<void>{await api.delete('/productos/'+id);}
export async function ajustarStock(id:number,delta:number):Promise<void>{
  const p=(await api.get<ProductoAPI>('/productos/'+id)).data;
  await api.put('/productos/'+id+'/stock',{stock:Math.max(0,p.stock+delta)});
}
