import api from './api';
import type { Categoria } from '../types/categoria';
export async function listarCategorias():Promise<Categoria[]>{return (await api.get('/categorias')).data;}
export async function crearCategoria(data:Omit<Categoria,'id'>):Promise<Categoria>{return (await api.post('/categorias',data)).data;}
export async function actualizarCategoria(id:number,data:Omit<Categoria,'id'>):Promise<void>{await api.put('/categorias/'+id,data);}
export async function eliminarCategoria(id:number):Promise<void>{await api.delete('/categorias/'+id);}
