import api from "./api";
import type {
  Categoria,
  CategoriaRequest,
  CategoriaResponse,
} from "../types/categoria";

function aCategoria(r: CategoriaResponse): Categoria {
  return { id: r.id, nombre: r.nombre, descripcion: r.descripcion ?? "" };
}

export async function listarCategorias(): Promise<Categoria[]> {
  const { data } = await api.get<CategoriaResponse[]>("/categorias");
  return data.map(aCategoria);
}

export async function crearCategoria(
  categoria: CategoriaRequest,
): Promise<Categoria> {
  const { data } = await api.post<CategoriaResponse>("/categorias", categoria);
  return aCategoria(data);
}

export async function actualizarCategoria(
  id: number,
  categoria: CategoriaRequest,
): Promise<Categoria> {
  const { data } = await api.put<CategoriaResponse>(
    `/categorias/${id}`,
    categoria,
  );
  return aCategoria(data);
}

export async function eliminarCategoria(id: number): Promise<void> {
  await api.delete(`/categorias/${id}`);
}
